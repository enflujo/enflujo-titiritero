/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

export interface Psst {
  pedirMensajero: () => Promise<void>;
}
declare global {
  interface Window {
    psttServidor: Psst;
  }
}
