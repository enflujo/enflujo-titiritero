import Loki, { Collection } from 'lokijs';
import { Archivo } from '../../src/tipos';
let archivos: Collection<Archivo>;
let bd: Loki | null;
let archivoActual: Archivo;

export default {
  iniciar() {
    return new Promise<Archivo[]>((resolver, rechazar) => {
      bd = new Loki('./bd/archivos.json', {
        autoload: true,
        autoloadCallback: inicio,
      });

      function inicio() {
        archivos = bd.getCollection('archivosPSD');

        if (archivos === null) {
          archivos = bd.addCollection('archivosPSD');
          bd.save();
        }

        resolver(archivos.data);
      }
    });
  },

  listaArchivos() {
    return bd.getCollection('archivosPSD').data;
  },

  agregarArchivo(nombre: string, ruta: string) {
    if (!nombre) return;

    archivoActual = this.existeArchivo(nombre);

    if (archivoActual === null) {
      archivoActual = archivos.insert({ nombre, ruta });
      bd.save();
    }

    return archivoActual;
  },

  actualizarArchivoActual(nuevosDatos: Archivo) {
    archivoActual = { ...archivoActual, ...nuevosDatos };
    archivos.update(archivoActual);
    bd.save();
    return archivoActual;
  },

  cambiarArchivoActual(datos: Archivo) {
    archivoActual = datos;
  },

  datosArchivoActual() {
    return archivoActual;
  },

  existeArchivo(nombre: string) {
    return archivos.findOneUnindexed('nombre', nombre);
  },

  borrarArchivo(nombre: string) {
    const archivo = archivos.findOneUnindexed('nombre', nombre);

    if (archivo !== null) {
      archivos.remove(archivo);
      bd.save();
    } else {
      console.log(`Archivo ${nombre} no existe en la base de datos.`);
    }
  },
};
