import { app, BrowserWindow, shell, MessageChannelMain, MessagePortMain, ipcMain, dialog } from 'electron';
import { release } from 'os';
import { join, parse } from 'path';
import fs from 'fs-extra';
import { cargar } from './Photoshop';
import bd from './bd';
import sharp from 'sharp';
import { ParametrosCompresion } from '../../src/tipos';

process.env.DIST_ELECTRON = join(__dirname, '..');
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist');
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL ? join(process.env.DIST_ELECTRON, '../public') : process.env.DIST;

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

const preload = join(__dirname, '../preload/index.js');
const url = process.env.VITE_DEV_SERVER_URL;
let aplicacion: BrowserWindow | null = null;
let canalPagina: MessagePortMain;
let canalServidor: MessagePortMain;

async function crearAplicacion() {
  aplicacion = new BrowserWindow({
    title: 'Titiritero',
    icon: join(process.env.PUBLIC, 'favicon.ico'),
    width: 1500,
    height: 1000,
    backgroundColor: '#39352B',
    webPreferences: {
      preload,
      contextIsolation: true,
    },
  });

  bd.iniciar().then(inicio).catch(console.error);

  ipcMain.handle('pedirMensajero', crearMensajero);
}

function crearMensajero() {
  if (canalPagina && canalServidor) {
    aplicacion.webContents.postMessage('canalComunicacion', null, [canalPagina]);
  } else {
    /**
     * Crear canales de comunicación entre servidor y aplicación
     */
    const { port1, port2 } = new MessageChannelMain();
    canalPagina = port1;
    canalServidor = port2;
    canalServidor.start();

    canalServidor.on('close', (mensaje) => {
      console.log('puerto en pagina se cerro', mensaje);
      canalServidor = null;
      canalPagina = null;
    });

    aplicacion.webContents.postMessage('canalComunicacion', null, [canalPagina]);

    canalServidor.on('message', async ({ data }) => {
      switch (data.llave) {
        case 'nuevoPSD':
          const { name, path: ruta, type } = data.datos;
          const nombreSinExtension = parse(name).name;
          procesarPsd(ruta, nombreSinExtension, type);
          break;

        case 'borrarArchivo':
          const { nombre } = data;
          await fs.rm(`./public/animaciones/${nombre}`, { force: true, recursive: true });

          bd.borrarArchivo(nombre);
          canalServidor.postMessage({ llave: 'listaArchivos', datos: bd.listaArchivos() });
          break;

        case 'cambiarArchivoActual':
          const existeArchivo = bd.existeArchivo(data.nombre);

          if (existeArchivo) {
            bd.cambiarArchivoActual(existeArchivo);

            if (existeArchivo.imagenes) {
              canalServidor.postMessage({ llave: 'archivoActual', datos: existeArchivo });
            } else {
              procesarPsd(data.ruta, data.nombre, '');
            }
          }
        case 'pedirLista':
          const lista = bd.listaArchivos();

          if (lista.length) {
            canalServidor.postMessage({ llave: 'listaArchivos', datos: bd.listaArchivos() });
          }
          break;
        case 'exportar':
          if (data.imagen.length) {
            const imagen = Buffer.from(data.imagen, 'base64');

            dialog
              .showSaveDialog(aplicacion, {
                title: 'Titereando ando',
                buttonLabel: 'Guardar',
                filters: [{ name: 'Imagenes', extensions: ['jpeg', 'png', 'webp'] }],
                defaultPath: data.nombre,
                properties: [],
              })
              .then((archivo) => {
                if (archivo.canceled) {
                  console.log(':(');
                } else {
                  console.log(archivo.filePath);
                  const opciones: ParametrosCompresion = {};

                  if (data.formato === 'png') {
                    opciones.compressionLevel = data.calidad;
                  } else if (data.formato === 'jpeg') {
                    opciones.quality = data.calidad * 100;
                    opciones.mozjpeg = true;
                  } else {
                    opciones.quality = data.calidad * 100;
                  }
                  try {
                    sharp(imagen)[data.formato](opciones).toFile(`${archivo.filePath}`);
                  } catch (error) {
                    console.log(error);
                  }
                }
              })
              .catch(console.error);
          }

          break;
        default:
          break;
      }
    });
  }

  canalServidor.postMessage({ llave: 'listaArchivos', datos: bd.listaArchivos() });
}

function inicio() {
  if (process.env.VITE_DEV_SERVER_URL) {
    // electron-vite-vue#298
    aplicacion.loadURL(url);
    aplicacion.webContents.openDevTools();
  } else {
    aplicacion.loadFile(join(process.env.DIST, 'index.html'));
  }

  // Hacer que los enlaces los abra el explorador y no la aplicación
  aplicacion.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url);
    return { action: 'deny' };
  });
}

async function procesarPsd(ruta: string, nombre: string, tipo: string) {
  const extension = parse(ruta).ext;

  if (extension === '.psd' || tipo === 'image/vnd.adobe.photoshop') {
    bd.agregarArchivo(nombre, ruta);
    // Enviar lista de archivos con nuevo archivo.
    canalServidor.postMessage({ llave: 'listaArchivos', datos: bd.listaArchivos() });

    try {
      const datosArchivo = await cargar(ruta, canalServidor);
      // Volver a mandar datos, en este punto las rutas a las imágenes individuales esta disponible.
      canalServidor.postMessage({ llave: 'archivoActual', datos: datosArchivo });
    } catch (error) {
      console.error(error);
    }
  } else {
    canalServidor.postMessage({
      error: `${nombre} no es un archivo de Photoshop, es de tipo: ${tipo} con extensión: ${extension}`,
    });

    return;
  }
}

app.whenReady().then(crearAplicacion);

app.on('window-all-closed', () => {
  aplicacion = null;
  if (process.platform !== 'darwin') app.quit();
});

app.on('second-instance', () => {
  if (aplicacion) {
    // Focus on the main window if the user tried to open another
    if (aplicacion.isMinimized()) aplicacion.restore();
    aplicacion.focus();
  }
});

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows();

  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    crearAplicacion();
  }
});
