/// <reference types="vite-plugin-electron/electron-env" />

import { InformacionBasica } from '../src/tipos';

declare namespace NodeJS {
  interface ProcessEnv {
    VSCODE_DEBUG?: 'true';
    DIST_ELECTRON: string;
    DIST: string;
    /** /dist/ or /public/ */
    PUBLIC: string;
  }
}
