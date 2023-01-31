/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

export interface Photoshop {
  nuevo: (archivo: File) => Promise<void>;
}

declare global {
  interface Window {
    photoshop: Photoshop;
  }
}
