import test from 'node:test';
import assert from 'node:assert/strict';
import { crearClienteOpenAI } from '../../src/asistente/openai.js';

const completada = (texto = 'La variable está libre.') => Response.json({
  model: 'gpt-6-luna',
  choices: [{ finish_reason: 'stop', message: { content: texto, reasoning: 'Esto no debe salir.' } }],
  usage: { prompt_tokens: 800, completion_tokens: 100, total_tokens: 900,
    prompt_tokens_details: { cached_tokens: 200 }, completion_tokens_details: { reasoning_tokens: 0 } },
});

test('OpenAI recibe una sola petición, la clave solo en cabecera y un presupuesto de salida', async () => {
  const llamadas = [];
  const generar = crearClienteOpenAI({ clave: 'clave-de-prueba', fetchImpl: async (...args) => {
    llamadas.push(args);
    return completada();
  } });
  assert.deepEqual(await generar([{ role: 'user', content: '¿Qué es una variable libre?' }]), {
    texto: 'La variable está libre.', modelo: 'gpt-6-luna',
    consumo: { entrada: 800, salida: 100, total: 900, entradaCache: 200, razonamiento: 0 },
  });
  assert.equal(llamadas.length, 1);
  const [url, opciones] = llamadas[0];
  assert.equal(url, 'https://api.openai.com/v1/chat/completions');
  assert.equal(opciones.headers.Authorization, 'Bearer clave-de-prueba');
  const cuerpo = JSON.parse(opciones.body);
  assert.equal(cuerpo.model, 'gpt-6-luna');
  assert.equal(cuerpo.max_completion_tokens, 1200);
  assert.equal(cuerpo.reasoning_effort, 'none');
  assert.equal(cuerpo.store, false);
  assert.ok(!('include_reasoning' in cuerpo));
  assert.ok(!('temperature' in cuerpo));
  assert.equal(cuerpo.stream, false);
  assert.ok(opciones.signal instanceof AbortSignal);
  assert.ok(!opciones.body.includes('clave-de-prueba'));
});

test('el modelo es configurable sin forzar razonamiento a modelos de otra familia', async () => {
  const generar = crearClienteOpenAI({ clave: 'prueba', modelo: 'otro-modelo', fetchImpl: async (_url, opciones) => {
    const cuerpo = JSON.parse(opciones.body);
    assert.equal(cuerpo.model, 'otro-modelo');
    assert.ok(!('reasoning_effort' in cuerpo));
    assert.ok(!('include_reasoning' in cuerpo));
    return completada();
  } });
  await generar([]);
});

for (const clave of [undefined, '', '  ', 'tu_clave']) {
  test('una clave ausente o de ejemplo se rechaza sin llamar a la API', () => {
    assert.throws(() => crearClienteOpenAI({ clave }), { codigo: 'configuracion', estado: 503 });
  });
}

for (const [estado, codigo, esperado] of [[401, 'configuracion_openai', 503], [403, 'configuracion_openai', 503],
  [404, 'configuracion_openai', 503], [400, 'servicio_openai', 502], [500, 'servicio_openai', 502]]) {
  test(`el error ${estado} no expone el cuerpo del proveedor ni provoca reintentos`, async () => {
    let llamadas = 0;
    const generar = crearClienteOpenAI({ clave: 'prueba', fetchImpl: async () => {
      llamadas++;
      return new Response('dato-privado-del-proveedor', { status: estado });
    } });
    await assert.rejects(generar([]), (error) => {
      assert.equal(error.codigo, codigo);
      assert.equal(error.estado, esperado);
      assert.ok(!error.message.includes('dato-privado'));
      return true;
    });
    assert.equal(llamadas, 1);
  });
}

test('un límite temporal conserva un tiempo seguro de reintento', async () => {
  for (const [cabecera, esperado] of [['12.4', 13], ['-1', 60], ['texto privado', 60], ['999999', 86400]]) {
    const generar = crearClienteOpenAI({ clave: 'prueba', fetchImpl: async () =>
      new Response('', { status: 429, headers: { 'Retry-After': cabecera } }) });
    await assert.rejects(generar([]), { codigo: 'limite_openai', estado: 429, reintentarEn: esperado });
  }
});

test('el saldo agotado se distingue del límite temporal y no se reintenta automáticamente', async () => {
  for (const code of ['insufficient_quota', 'billing_hard_limit_reached']) {
    let llamadas = 0;
    const generar = crearClienteOpenAI({ clave: 'prueba', fetchImpl: async () => {
      llamadas++;
      return Response.json({ error: { code, message: 'dato privado de facturación' } }, { status: 429 });
    } });
    await assert.rejects(generar([]), (error) => {
      assert.equal(error.codigo, 'saldo_openai');
      assert.equal(error.estado, 503);
      assert.equal(error.reintentarEn, undefined);
      assert.ok(!error.message.includes('dato privado'));
      return true;
    });
    assert.equal(llamadas, 1);
  }
});

test('no inventa un consumo si el proveedor no lo informa o envía contadores inválidos', async () => {
  for (const usage of [undefined, {}, { prompt_tokens: -1, completion_tokens: 1, total_tokens: 0 },
    { prompt_tokens: 10, completion_tokens: 1, total_tokens: 99 },
    { prompt_tokens: '10', completion_tokens: 1, total_tokens: 11 }]) {
    const generar = crearClienteOpenAI({ clave: 'prueba', fetchImpl: async () => Response.json({
      choices: [{ finish_reason: 'stop', message: { content: 'Explicación.' } }], usage,
    }) });
    const datos = await generar([]);
    assert.equal(datos.consumo, null);
    assert.equal(datos.modelo, 'gpt-6-luna');
  }
});

test('los detalles de caché y razonamiento no pueden superar los totales informados', async () => {
  const generar = crearClienteOpenAI({ clave: 'prueba', fetchImpl: async () => Response.json({
    choices: [{ finish_reason: 'stop', message: { content: 'Explicación.' } }],
    usage: { prompt_tokens: 10, completion_tokens: 5, total_tokens: 15,
      prompt_tokens_details: { cached_tokens: 11 }, completion_tokens_details: { reasoning_tokens: -1 } },
  }) });
  assert.deepEqual((await generar([])).consumo, { entrada: 10, salida: 5, total: 15, entradaCache: null, razonamiento: null });
});

test('maneja desconexión y tiempo agotado sin filtrar detalles', async () => {
  for (const [error, codigo, estado] of [[new TypeError('dato-privado'), 'conexion_openai', 502],
    [new DOMException('demora', 'TimeoutError'), 'tiempo_agotado', 504]]) {
    const generar = crearClienteOpenAI({ clave: 'prueba', fetchImpl: async () => { throw error; } });
    await assert.rejects(generar([]), { codigo, estado });
  }
});

test('no entrega texto parcial, vacío o una respuesta mal formada como explicación válida', async () => {
  for (const datos of [
    { choices: [{ finish_reason: 'length', message: { content: '∀x(' } }] },
    { choices: [{ finish_reason: 'stop', message: { content: '' } }] },
    { choices: [{ finish_reason: 'tool_calls', message: {} }] },
    { choices: [] }, {}, null,
  ]) {
    const generar = crearClienteOpenAI({ clave: 'prueba', fetchImpl: async () => Response.json(datos) });
    await assert.rejects(generar([]));
  }
});
