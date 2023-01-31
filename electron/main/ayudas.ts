export function formatoNumeros(numero: number, ancho: number) {
  return new Array(ancho + 1 - (numero + '').length).join('0') + numero;
}
