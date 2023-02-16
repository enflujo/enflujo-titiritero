<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import Navegacion from './componentes/Navegacion.vue';
import Referencia from './componentes/Referencia.vue';
import Archivos from './componentes/Archivos.vue';
import { usarCerebroGeneral } from './cerebros/general';
import { FileWithPath } from './tipos';

const cerebro = usarCerebroGeneral();
const entrada = ref();
const zonaActiva = ref(false);

onMounted(() => {
  if (!cerebro.mensajero) {
    window.psttServidor.pedirMensajero();
  }

  window.onmessage = (evento) => {
    if (evento.source === window && evento.data === 'canalComunicacion') {
      const [canalPagina] = evento.ports;

      cerebro.mensajero = canalPagina;

      canalPagina.onmessage = ({ data }) => {
        if (data.error) {
          console.error(data.error);
        } else {
          switch (data.llave) {
            case 'listaArchivos':
              cerebro.lista = data.datos;
              break;
            case 'archivoActual':
              cerebro.archivoActual = data.datos;
              break;

            default:
              break;
          }
        }
      };
    }
  };

  const contenedor = document.getElementById('aplicacion');

  if (contenedor) {
    contenedor.ondragenter = (evento: DragEvent) => {
      evento.preventDefault();
      evento.stopPropagation();

      zonaActiva.value = true;
    };
  }
});

const arrastreInicio = () => {
  zonaActiva.value = true;
};

const arrastreFueraDeZona = () => {
  zonaActiva.value = false;
};

const arrastreAccion = (evento: DragEvent) => {
  evento.preventDefault();

  if (evento.dataTransfer) {
    cerebro.mensajero?.postMessage({ llave: 'nuevoPSD', datos: evento.dataTransfer.files[0] });
  }
};

const buscarArchivo = () => {
  if (entrada.value) {
    entrada.value.click();
  }
};

const evitarEventosPredeterminados = (evento: DragEvent) => {
  evento.preventDefault();
  evento.stopPropagation();
};

const entradaArchivo = (evento: Event) => {
  const entrada = evento.target as HTMLInputElement;
  if (entrada && entrada.files) {
    const { lastModified, name, path, size, type } = entrada.files[0] as FileWithPath;
    cerebro.mensajero?.postMessage({ llave: 'nuevoPSD', datos: { lastModified, name, path, size, type } });
  }
};
</script>

<template>
  <nav id="menu">
    <input type="file" class="entrada" ref="entrada" @change="entradaArchivo" hidden="true" />

    <div
      id="zona"
      :class="zonaActiva ? 'activa' : ''"
      @drag="evitarEventosPredeterminados"
      @dragstart="evitarEventosPredeterminados"
      @dragend="evitarEventosPredeterminados"
      @dragover="evitarEventosPredeterminados"
      @dragenter="evitarEventosPredeterminados"
      @dragleave="arrastreFueraDeZona"
      @drop="arrastreAccion"
    >
      <span><img src="/icono-photoshop.svg" alt="psd" /></span>
      <span>Soltar archivo para procesarlo</span>
    </div>

    <div id="buscarArchivo" @click="buscarArchivo"></div>

    <Archivos></Archivos>
  </nav>

  <main>
    <Navegacion></Navegacion>
    <Referencia></Referencia>
    <router-view></router-view>
  </main>
</template>

<style lang="scss">
html {
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: inherit;
}

html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
}

::selection {
  background: rgba(235, 80, 80, 0.8);
  color: #ffe6f9;
}

ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

#aplicacion {
  display: flex;
  flex-direction: row;
  background-color: white;
}

#menu {
  width: 300px;
  min-height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
  background-color: #e6e6e6;
  text-align: left;
  margin: 0;
  padding: 0;
}

main {
  overflow: hidden;
}

body {
  line-height: 1.6;
}

input {
  border: 1px dotted #ccc;
  padding: 0.5em;
  line-height: 1.5;
  min-width: 100px;

  &:focus {
    outline: 0;
    border-color: black;
  }
}

.entradaNombre {
  margin-left: 1em;
}

.contenedorPagina {
  padding-top: 1em;
  overflow: auto;
  width: calc(100vw - 300px);
}

h3 {
  padding-left: 0.5em;
}

canvas {
  margin: 0 auto;
  display: block;
  background-color: #ffffff;
  background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSc4JyBoZWlnaHQ9JzgnPgogIDxyZWN0IHdpZHRoPSc4JyBoZWlnaHQ9JzgnIGZpbGw9JyNmZmYnLz4KICA8cGF0aCBkPSdNMCAwTDggOFpNOCAwTDAgOFonIHN0cm9rZS13aWR0aD0nMC41JyBzdHJva2U9JyNhYWEnLz4KPC9zdmc+Cg==);
}
canvas::selection {
  background-color: transparent;
}

#zona {
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  position: fixed;
  background-color: rgba($color: #4862b7, $alpha: 0.85);
  color: #e5dddd;
  overflow: hidden;
  display: none;
  font-size: 2.3em;
  margin: 0;
  text-align: center;
  pointer-events: none;

  &.activa {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  img {
    height: 60px;
    margin-right: 0.3em;
  }
}

#buscarArchivo {
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

  &:hover {
    background-color: lighten(black, 20%);
    color: white;
  }
}
</style>
