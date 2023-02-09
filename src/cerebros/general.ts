import { defineStore } from 'pinia';
import { Archivo } from '../tipos';

export const usarCerebroGeneral = defineStore('general', {
  state: (): DatosGenerales => ({
    lista: [],
    columnas: 0,
    filas: 0,
    ancho: 0,
    alto: 0,
    archivoActual: null,
    escala: 1,
    nombre: '',
  }),
});

export interface DatosGenerales {
  archivoActual: Archivo | null;
  lista?: Archivo[];
  mensajero?: MessagePort;
  columnas: number;
  filas: number;
  ancho: number;
  alto: number;
  escala: number;
  nombre: string;
}
