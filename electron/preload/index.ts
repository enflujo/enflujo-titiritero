const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('photoshop', {
  nuevo: (archivo: File) => {
    ipcRenderer.invoke('nuevo-psd', archivo);
  },
});
