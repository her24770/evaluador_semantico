import { iniciarInterfaz } from './interfaz/index.js';
import { prepararFuentes } from './interfaz/carga-fuentes.js';

const app = document.getElementById('app');
iniciarInterfaz(app);
prepararFuentes(app);
