import type { Layer } from 'ag-psd';

export interface FormaCuadricula {
  columnas: number;
  filas: number;
}
export interface ICuadricula {
  parejo: boolean;
  forma: FormaCuadricula[];
}

export interface InformacionBasica {
  ancho: number;
  alto: number;
}

export interface Archivo extends InformacionBasica {
  nombre?: string;
  ruta?: string;
}

export type Datos = {
  fuente: string;
  ancho: number;
  alto: number;
  filas: number;
  columnas: number;
  fotogramas?: Fotogramas[];
};

export type Fotogramas = {
  x: number;
  y: number;
  ancho: number;
  alto: number;
};

export interface ParametrosCompresion {
  compressionLevel?: number;
  quality?: number;
  mozjpeg?: boolean;
}

export interface DatosGenerales {
  archivoActual: Archivo | null;
  /** Columnas de la cuadrícula */
  columnas: number;
  /** Filas de la cuadrícula */
  filas: number;
  /** Ancho del lienzo en Photoshop */
  ancho: number;
  /** Alto del lienzo en Photoshop */
  alto: number;
  /** Ancho de la imagen que se va a exportar */
  anchoImagen: number;
  /** Alto de la imagen que se va a exportar */
  altoImagen: number;
  /** Nombre del archivo en Photoshop */
  nombre: string;
  /** Lienzo principal que genera la librería de PSD. */
  lienzoPsd: HTMLCanvasElement | null;
  /** Datos que describen cuadrículas ideales según el número de capas /fotogramas que tiene el archivo de Photoshop. */
  cuadricula: ICuadricula;
  /** Las capas en Photoshop, cada una es un fotograma. */
  capas: Layer[];
}
