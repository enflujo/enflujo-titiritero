import psd from 'psd';
import { parse, join } from 'path';
import fs from 'fs-extra';
import { formatoNumeros } from './ayudas';
import { MessagePortMain } from 'electron';

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

export function cargar(ruta: string, canalServidor: MessagePortMain) {
  return new Promise<void>(async (resolver) => {
    const nombre = parse(ruta).name;
    const rutaImgs = join('./animaciones/', nombre, '/fotogramas/');
    const archivo = await psd.open(ruta);
    const capas = archivo.tree().descendants();
    const informacion: InformacionBasica = {
      total: 0,
      cuadricula: { parejo: false, forma: [] },
      imagenes: [],
    };

    fs.ensureDir(rutaImgs, (error) => {
      if (error) {
        console.error(error);
      } else {
        capas.forEach((capa: any, i: number) => {
          const nombreCapa = capa.get('name');
          const rutaFotograma = join(rutaImgs, `${nombre}_${formatoNumeros(i, 6)}.png`);
          informacion.imagenes.push({ nombre: nombreCapa, ruta: rutaFotograma, x: capa.left, y: capa.top });
          informacion.total++;
        });

        const formaCuadricula = [];
        const { total } = informacion;

        for (let i = 0; i <= total; i++) {
          if (total % i === 0) {
            formaCuadricula.push(i);
          }
        }

        if (formaCuadricula.length > 0) {
          informacion.cuadricula.parejo = true;
          informacion.cuadricula.forma = formaCuadricula;
        }
      }

      canalServidor.postMessage({ llave: 'informacionBasica', datos: informacion });

      informacion.imagenes.forEach((imagen, i) => {
        try {
          fs.statSync(imagen.ruta).isFile();
        } catch (err) {
          capas[i].saveAsPng(imagen.ruta);
        }
      });

      resolver();
    });
  });
}
