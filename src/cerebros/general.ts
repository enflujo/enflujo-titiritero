import { defineStore } from 'pinia';

export const usarCerebroGeneral = defineStore('general', {
  state: (): DatosGenerales => ({ fotogramasCargados: false }),
});

export interface DatosGenerales {
  fotogramasCargados: boolean;
}
