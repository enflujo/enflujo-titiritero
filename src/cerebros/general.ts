import { defineStore } from 'pinia';
import { InformacionBasica } from '../tipos';

export const usarCerebroGeneral = defineStore('general', {
  state: (): DatosGenerales => ({ fotogramasCargados: false }),
});

export interface DatosGenerales {
  fotogramasCargados: boolean;
  informacionBasica?: InformacionBasica;
}
