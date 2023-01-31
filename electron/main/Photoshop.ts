import psd from 'psd';
import { parse, join } from 'path';
import fs from 'fs-extra';
import { formatoNumeros } from './ayudas';

export async function cargar(ruta: string) {
  const nombre = parse(ruta).name;
  const rutaImgs = join('./animaciones/', nombre, '/fotogramas/');
  const archivo = await psd.open(ruta);
  const capas = archivo.tree().descendants();

  fs.ensureDir(rutaImgs, (error) => {
    if (error) {
      console.error(error);
    } else {
      capas.forEach((capa: any, i: number) => {
        const rutaFotograma = join(rutaImgs, `${nombre}_${formatoNumeros(i, 6)}.png`);

        try {
          fs.statSync(rutaFotograma).isFile();
        } catch (err) {
          capa.saveAsPng(rutaFotograma);
        }
      });
    }
  });
}
