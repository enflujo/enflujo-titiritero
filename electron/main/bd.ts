import Loki from 'lokijs';

let archivos;
let archivoActual;

export function iniciarBD() {
  return new Promise<void>((resolver, rechazar) => {
    const bd = new Loki('./bd/archivos.json', {
      autoload: true,
      autoloadCallback: inicio,
    });

    function inicio() {
      archivos = bd.getCollection('archivosPSD');

      if (archivos === null) {
        archivos = bd.addCollection('archivosPSD');
        bd.save();
      }

      resolver();
    }
  });
}

export function agregarArchivo(nombre: string, ruta: string) {
  if (!nombre) return;

  const archivo = archivos.findOneUnindexed('nombre', nombre);

  if (archivo === null) {
    const archivo = archivos.insert({ nombre, ruta });
    console.log(archivo);
  } else {
  }
}
