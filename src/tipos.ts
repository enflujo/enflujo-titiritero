export interface InformacionBasica {
  total?: number;
  cuadricula?: { parejo: boolean; forma: number[] };
  imagenes?: Imagen[];
  ancho?: number;
  alto?: number;
}

export interface Imagen {
  nombre: string;
  ruta: string;
  x: number;
  y: number;
}

export interface Archivo extends InformacionBasica {
  nombre?: string;
  ruta?: string;
  meta?: Meta;
  $loki?: number;
}

interface Meta {
  revisions: number;
  created: number;
  version: number;
}

export interface FileWithPath extends File {
  path: string;
}
