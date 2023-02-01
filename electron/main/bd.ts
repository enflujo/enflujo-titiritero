import Loki from 'lokijs';

export default () => {
  return new Promise<void>((resolver, rechazar) => {
    let archivos;

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
};
