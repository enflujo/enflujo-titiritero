import { defineStore } from 'pinia';
import { Archivo } from '../tipos';

export const usarCerebroGeneral = defineStore('general', {
  state: (): DatosGenerales => ({
    fotogramasCargados: false,
    lista: [],
    columnas: 0,
    filas: 0,
  }),
});

export interface DatosGenerales {
  fotogramasCargados: boolean;
  archivoActual?: Archivo;
  lista?: Archivo[];
  mensajero?: MessagePort;
  columnas: number;
  filas: number;
}
