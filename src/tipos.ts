export interface InformacionBasica {
  total: number;
  cuadricula: { parejo: boolean; forma: number[] };
  imagenes: Imagen[];
}

export interface Imagen {
  nombre: string;
  ruta: string;
  x: number;
  y: number;
}
