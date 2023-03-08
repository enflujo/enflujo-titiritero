import psd from 'psd';
import { parse, join } from 'path';
import fs from 'fs-extra';
import { formatoNumeros } from './ayudas';
import { MessagePortMain } from 'electron';
import bd from './bd';
import { Archivo, InformacionBasica } from '../../src/tipos';

export function cargar(ruta: string, canalServidor: MessagePortMain) {
  return new Promise<Archivo>(async (resolver) => {
    const nombre = parse(ruta).name;
    const yaExiste = bd.existeArchivo(nombre);

    if (yaExiste && yaExiste.imagenes) {
      resolver(yaExiste);
    } else {
      const rutaImgs = join('./public/animaciones/', nombre, '/fotogramas/');
      console.log('abriendo photoshop');
      const archivo = await psd.open(ruta);
      const arbol = archivo.tree();
      const capas = arbol.descendants();
      const total = capas.length;
      console.log('cargando info basica');
      const informacion: InformacionBasica = {
        total,
        cuadricula: { parejo: false, forma: [] },
        imagenes: [],
        ancho: arbol.width,
        alto: arbol.height,
      };

      fs.ensureDir(rutaImgs, (error) => {
        if (error) {
          console.error(error);
        } else {
          const formaCuadricula = [];

          informacion.total = total;

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

        const archivoActual = bd.actualizarArchivoActual(informacion);

        canalServidor.postMessage({ llave: 'archivoActual', datos: archivoActual });
        canalServidor.postMessage({ llave: 'procesandoCapas', total, procesados: 0 });

        let procesados = 0;
        console.log('inicio de procesar photoshop');
        capas.forEach((capa: any, i: number) => {
          const nombreCapa = capa.get('name');
          console.log(nombreCapa);
          const rutaFotograma = join(rutaImgs, `${nombre}_${formatoNumeros(i, 6)}.png`);
          const archivoExiste = fs.existsSync(rutaFotograma);

          console.log('creando fotograma', rutaFotograma);
          if (!archivoExiste) {
            capas[i].saveAsPng(rutaFotograma);
          }

          informacion.imagenes.push({
            nombre: nombreCapa,
            ruta: rutaFotograma.replace('public', ''),
            x: capa.left,
            y: capa.top,
            ancho: capa.width,
            alto: capa.height,
          });
          console.log(informacion);
          procesados++;
          canalServidor.postMessage({ llave: 'procesandoCapas', total, procesados });
        });

        const datosArchivo = bd.actualizarArchivoActual(informacion);

        resolver(datosArchivo);
      });
    }
  });
}
