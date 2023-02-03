import { app, BrowserWindow, shell, ipcMain, MessageChannelMain, MessagePortMain } from 'electron';
import { release } from 'os';
import { join, parse } from 'path';
import fs from 'fs-extra';
import { cargar } from './Photoshop';
import bd from './bd';
import { Archivo } from '../../src/tipos';
// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.js    > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
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

let win: BrowserWindow | null = null;
// Here, you can also use other preload
const preload = join(__dirname, '../preload/index.js');
const url = process.env.VITE_DEV_SERVER_URL;

async function crearAplicacion() {
  win = new BrowserWindow({
    title: 'Main window',
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
}

function inicio(archivos: Archivo[]) {
  if (process.env.VITE_DEV_SERVER_URL) {
    // electron-vite-vue#298
    win.loadURL(url);
  } else {
    win.loadFile(join(process.env.DIST, 'index.html'));
    win.webContents.openDevTools({ mode: 'detach' });
  }

  // Hacer que los enlaces los abra el explorador y no la aplicación
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url);
    return { action: 'deny' };
  });

  /**
   * Crear canales de comunicación entre servidor y aplicación
   */
  const { port1: canalPagina, port2: canalServidor } = new MessageChannelMain();

  win.webContents.postMessage('canalComunicacion', null, [canalPagina]);
  canalServidor.start();

  canalServidor.postMessage({ llave: 'listaArchivos', datos: archivos });

  canalServidor.on('message', async ({ data }) => {
    switch (data.llave) {
      case 'nuevoPSD':
        const { name, path: ruta, type } = data.datos;
        const nombreSinExtension = parse(name).name;
        procesarPsd(ruta, nombreSinExtension, type, canalServidor);
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
            procesarPsd(data.ruta, data.nombre, '', canalServidor);
          }
        }
      case 'pedirLista':
        const lista = bd.listaArchivos();

        if (lista.length) {
          canalServidor.postMessage({ llave: 'listaArchivos', datos: bd.listaArchivos() });
        }
        break;
      default:
        break;
    }
  });
}

async function procesarPsd(ruta: string, nombre: string, tipo: string, canalServidor: MessagePortMain) {
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
  win = null;
  if (process.platform !== 'darwin') app.quit();
});

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore();
    win.focus();
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
