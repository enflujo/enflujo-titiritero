export const PI = Math.PI;
export const DOS_PI = PI * 2;
export const maxDimLienzo = 16384 * 16384;

export const porcentaje = (seccion: number, total: number) => {
  return (seccion / total) * 100;
};

export const pixelesDePorcentaje = (porcentaje: number, total: number) => {
  return (porcentaje / 100) * total;
};
