import { defineStore } from 'pinia';
import type { DatosGenerales } from '../tipos';

export const usarCerebroGeneral = defineStore('general', {
  state: (): DatosGenerales => ({
    columnas: 0,
    filas: 0,
    ancho: 0,
    alto: 0,
    anchoImagen: 0,
    altoImagen: 0,
    archivoActual: null,
    nombre: '',
    lienzoPsd: null,
    cuadricula: { parejo: false, forma: [] },
    capas: [],
  }),
});
