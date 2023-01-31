/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

export interface Photoshop {
  nuevo: (archivo: string) => Promise<void>;
}

declare global {
  interface Window {
    photoshop: Photoshop;
  }
}

export interface FileWithPath extends File {
  path: string;
}
