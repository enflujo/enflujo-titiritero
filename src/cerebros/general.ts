import { defineStore } from 'pinia';
import { Archivo } from '../tipos';

export const usarCerebroGeneral = defineStore('general', {
  state: (): DatosGenerales => ({
    fotogramasCargados: false,
    lista: [],
  }),
});

export interface DatosGenerales {
  fotogramasCargados: boolean;
  archivoActual?: Archivo;
  lista?: Archivo[];
  mensajero?: MessagePort;
}
