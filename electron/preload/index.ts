const { contextBridge, ipcRenderer } = require('electron');

const aplicacionCargada = new Promise((resolver) => {
  window.onload = resolver;
});

// https://www.electronjs.org/docs/latest/tutorial/message-ports#communicating-directly-between-the-main-process-and-the-main-world-of-a-context-isolated-page
ipcRenderer.on('canalComunicacion', async (evento) => {
  await aplicacionCargada;
  window.postMessage('canalComunicacion', '*', evento.ports);
});
