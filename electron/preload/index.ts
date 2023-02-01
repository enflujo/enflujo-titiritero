const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('photoshop', {
  nuevo: (archivo: string) => {
    ipcRenderer.invoke('nuevo-psd', archivo);
  },
});

ipcRenderer.on('fotogramasCargados', async () => {
  console.log('fotogramas cargados');
  window.postMessage('fotogramasCargados', '*');
});

ipcRenderer.on('main-process-message', (evento) => {
  console.log(evento);
});
