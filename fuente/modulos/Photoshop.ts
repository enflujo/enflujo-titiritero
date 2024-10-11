import { readPsd } from 'ag-psd';
import { usarCerebroGeneral } from '../cerebros/general';
import type { ICuadricula } from '../tipos';

export function cargarPsd(archivo: ArrayBuffer) {
  const psd = readPsd(archivo);
  const cerebro = usarCerebroGeneral();

  if (psd.canvas) {
    cerebro.lienzoPsd = psd.canvas;
  }

  const ancho = psd.width;
  const alto = psd.height;

  if (psd.children) {
    const total = psd.children.length;
    const cuadricula: ICuadricula = { parejo: false, forma: [] };

    for (let i = 0; i <= total; i++) {
      if (total % i === 0) {
        const columnas = total / i;
        const filas = i;
        // Si la forma tiene algún valor, ya sabemos que se puede mostrar parejo.
        cuadricula.parejo = true;
        cuadricula.forma.push({ columnas, filas });
      }
    }

    cerebro.capas = psd.children;
    cerebro.cuadricula = cuadricula;
    cerebro.ancho = ancho;
    cerebro.alto = alto;

    if (!cuadricula.parejo) {
      cerebro.columnas = psd.children.length;
      cerebro.filas = 1;
    }
    console.log(cuadricula, psd.children.length);
  }

  // return new Promise<Archivo>(async (resolver) => {
  //   const nombre = parse(ruta).name;
  //   const yaExiste = bd.existeArchivo(nombre);

  //   if (yaExiste && yaExiste.imagenes) {
  //     resolver(yaExiste);
  //   } else {
  //     const rutaImgs = join('./public/animaciones/', nombre, '/fotogramas/');
  //     console.log('abriendo photoshop');
  //     const archivo = await psd.open(ruta);
  //     const arbol = archivo.tree();
  //     const capas = arbol.descendants();
  //     const total = capas.length;
  //     console.log('cargando info basica');
  //     const informacion: InformacionBasica = {
  //       total,
  //       cuadricula: { parejo: false, forma: [] },
  //       imagenes: [],
  //       ancho: arbol.width,
  //       alto: arbol.height,
  //     };

  //     fs.ensureDir(rutaImgs, (error) => {
  //       if (error) {
  //         console.error(error);
  //       } else {
  //         const formaCuadricula = [];

  //         informacion.total = total;

  //         for (let i = 0; i <= total; i++) {
  //           if (total % i === 0) {
  //             formaCuadricula.push(i);
  //           }
  //         }

  //         if (formaCuadricula.length > 0) {
  //           informacion.cuadricula.parejo = true;
  //           informacion.cuadricula.forma = formaCuadricula;
  //         }
  //       }

  //       const archivoActual = bd.actualizarArchivoActual(informacion);

  //       canalServidor.postMessage({ llave: 'archivoActual', datos: archivoActual });
  //       canalServidor.postMessage({ llave: 'procesandoCapas', total, procesados: 0 });

  //       let procesados = 0;
  //       console.log('inicio de procesar photoshop');
  //       capas.forEach((capa: any, i: number) => {
  //         const nombreCapa = capa.get('name');
  //         console.log(nombreCapa);
  //         const rutaFotograma = join(rutaImgs, `${nombre}_${formatoNumeros(i, 6)}.png`);
  //         const archivoExiste = fs.existsSync(rutaFotograma);

  //         console.log('creando fotograma', rutaFotograma);
  //         if (!archivoExiste) {
  //           capas[i].saveAsPng(rutaFotograma);
  //         }

  //         informacion.imagenes.push({
  //           nombre: nombreCapa,
  //           ruta: rutaFotograma.replace('public', ''),
  //           x: capa.left,
  //           y: capa.top,
  //           ancho: capa.width,
  //           alto: capa.height,
  //         });
  //         console.log(informacion);
  //         procesados++;
  //         canalServidor.postMessage({ llave: 'procesandoCapas', total, procesados });
  //       });

  //       const datosArchivo = bd.actualizarArchivoActual(informacion);

  //       resolver(datosArchivo);
  //     });
  //   }
  // });
}
