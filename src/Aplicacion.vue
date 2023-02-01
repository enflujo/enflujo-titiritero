<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import Menu from './componentes/Menu.vue';
import Referencia from './componentes/Referencia.vue';
import { FileWithPath } from './vite-env';
import { usarCerebroGeneral } from './cerebros/general';

const cerebro = usarCerebroGeneral();
const entrada = ref();
const fotogramasCargados = ref(false);

watch(
  () => cerebro.fotogramasCargados,
  (estado) => {
    console.log(estado);
  }
);

onMounted(() => {
  window.onmessage = (evento) => {
    if (evento.source === window && evento.data === 'canalComunicacion') {
      const [canalPagina] = evento.ports;

      canalPagina.onmessage = ({ data }) => {
        if (data.error) {
          console.error(data.error);
        } else {
          switch (data.llave) {
            case 'informacionBasica':
              cerebro.informacionBasica = data.datos;
              break;

            default:
              break;
          }
        }
        console.log('desde canal del comunicación', data);
      };
    }

    // switch (evento.data) {
    //   case 'fotogramasCargados':
    //     fotogramasCargados.value = true;
    //     break;
    //   case 'informacionBasica':
    //     console.log('info', evento);
    //     break;

    //   default:
    //     break;
    // }

    // if (evento.data === 'fotogramasCargados') {
    // }
  };
});

const arrastreInicio = (evento: DragEvent) => {
  (evento.target as HTMLDivElement).classList.add('enZona');
};

const arrastreFueraDeZona = (evento: DragEvent) => {
  (evento.target as HTMLDivElement).classList.remove('enZona');
};

const arrastreAccion = (evento: DragEvent) => {
  evento.preventDefault();
  if (evento.dataTransfer) {
    window.photoshop.nuevo(JSON.stringify(evento.dataTransfer.files[0]));
  }
};

const arrastreClic = (evento: DragEvent) => {
  // fileInput.click();
};

const buscarArchivo = () => {
  if (entrada.value) {
    entrada.value.click();
  }
};

const entradaArchivo = (evento: Event) => {
  const entrada = evento.target as HTMLInputElement;
  if (entrada && entrada.files) {
    const { lastModified, name, path, size, type } = entrada.files[0] as FileWithPath;
    window.photoshop.nuevo(JSON.stringify({ lastModified, name, path, size, type }));
  }
};

// function loadFrames() {
//   var imagesLoadedCount = 0;

//   for (var i = 0; i < workingFile.images.length; i++) {
//     var img = new Image();
//     imgs.push(img);
//     img.onload = imageLoaded;
//     img.src = '../' + workingFile.images[i].path;
//     img.dataset.offX = workingFile.images[i].offX;
//     img.dataset.offY = workingFile.images[i].offY;
//   }

//   function imageLoaded() {
//     imagesLoadedCount++;

//     if (imagesLoadedCount === workingFile.images.length) {
//       nav.items.forEach(function (item) {
//         item.classList.remove('hidden');
//       });
//       loading.classList.add('hidden');
//     }
//   }
// }
</script>

<template>
  <aside id="contenedor">
    <input type="file" id="entrada" ref="entrada" @change="entradaArchivo" hidden="true" />

    <div
      id="zona"
      @dragenter="arrastreInicio"
      @dragleave="arrastreFueraDeZona"
      @drop="arrastreAccion"
      @click="buscarArchivo"
    ></div>

    <h3>Archivos</h3>
    <ul id="files"></ul>
  </aside>

  <main>
    <Menu></Menu>
    <Referencia></Referencia>
    <router-view></router-view>
  </main>
</template>

<style lang="scss" scoped>
#contenedor {
  width: 20%;
  position: fixed;
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
  background-color: #e6e6e6;
}

h3 {
  padding-left: 0.5em;
}

#zona {
  width: 100%;
  height: 80px;
  display: table;
  margin: 0 auto;
  transition: 0.23s all ease-in-out;
  text-align: center;
  background-color: #d9d9d9;
  cursor: pointer;

  &::after {
    content: '+';
    font-size: 30px;
    display: table-cell;
    text-align: center;
    vertical-align: middle;
  }

  &.enZona,
  &:hover {
    background-color: lighten(black, 20%);
    color: white;
  }
}
</style>
