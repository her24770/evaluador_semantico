/**
 * Prepara la foto antes de enviarla: la achica y la pasa a JPEG.
 * Una foto de celular pesa varios MB; a 1600 px se lee igual de bien,
 * se envía más rápido y cuesta menos.
 */
const LADO_MAXIMO = 1600;
const PESO_MAXIMO = 20 * 1024 * 1024;
// El servidor acepta hasta 3 MB de data URL (src/asistente/foto.js).
const MAX_DATA_URL = 2_900_000;

/** @returns {Promise<string>} data URL JPEG */
export async function prepararImagen(archivo) {
  if (!archivo) throw new Error('No se eligió ninguna imagen.');
  if (!archivo.type.startsWith('image/')) throw new Error('El archivo no es una imagen. Usa JPG, PNG o WEBP.');
  if (archivo.size > PESO_MAXIMO) throw new Error('La imagen pesa más de 20 MB. Usa una foto más pequeña.');

  let bitmap;
  try {
    bitmap = await createImageBitmap(archivo);
  } catch {
    throw new Error('El navegador no pudo abrir esta imagen. Si es HEIC (iPhone), conviértela a JPG o toma una captura de pantalla.');
  }
  let lado = LADO_MAXIMO;
  let datos;
  // Si una foto con mucho detalle queda pesada, se achica un poco más.
  do {
    datos = codificar(bitmap, lado);
    lado = Math.round(lado * 0.75);
  } while (datos.length > MAX_DATA_URL && lado > 400);
  bitmap.close?.();
  return datos;
}

function codificar(bitmap, lado) {
  const escala = Math.min(1, lado / Math.max(bitmap.width, bitmap.height));
  const lienzo = document.createElement('canvas');
  lienzo.width = Math.round(bitmap.width * escala);
  lienzo.height = Math.round(bitmap.height * escala);
  const contexto = lienzo.getContext('2d');
  // Fondo blanco: un PNG transparente se vería negro en JPEG.
  contexto.fillStyle = '#fff';
  contexto.fillRect(0, 0, lienzo.width, lienzo.height);
  contexto.drawImage(bitmap, 0, 0, lienzo.width, lienzo.height);
  return lienzo.toDataURL('image/jpeg', 0.88);
}
