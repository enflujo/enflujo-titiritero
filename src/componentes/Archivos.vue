<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import type { Ref } from 'vue';
import { usarCerebroGeneral } from '../cerebros/general';
import { Archivo } from '../tipos';

const cerebro = usarCerebroGeneral();
const actual = ref('');
const listaArchivos: Ref<Archivo[] | null> = ref(null);

watch(
  () => cerebro.lista,
  (nuevaLista) => {
    if (nuevaLista) {
      listaArchivos.value = nuevaLista;
    }
  }
);

onMounted(() => {
  if (cerebro.mensajero) {
    cerebro.mensajero?.postMessage({ llave: 'pedirLista' });
  }
});

const abrirArchivo = (nombre: string) => {
  if (actual.value === nombre) return;

  actual.value = nombre;
  cerebro.mensajero?.postMessage({ llave: 'cambiarArchivoActual', nombre });
};

const borrarArchivo = (nombre: string) => {
  cerebro.mensajero?.postMessage({ llave: 'borrarArchivo', nombre });
};
</script>

<template>
  <h3>Archivos</h3>
  <ul id="lista" v-if="listaArchivos && listaArchivos.length">
    <li
      v-for="archivo in listaArchivos"
      :key="archivo.nombre"
      class="archivo"
      :class="actual === archivo.nombre ? 'actual' : ''"
    >
      <span class="nombre" @click="abrirArchivo(archivo.nombre || 'archivo sin nombre')">{{ archivo.nombre }}</span>

      <ul class="submenu">
        <li class="borrar" @click="borrarArchivo(archivo.nombre as string)">Borrar</li>
      </ul>
    </li>
  </ul>
</template>

<style lang="scss" scoped>
#lista {
  margin: 0;
  padding: 0;
}

.archivo.actual .submenu {
  max-height: 1000px;
}

.archivo {
  margin-bottom: 1em;
}

.submenu {
  transition: 0.2s max-height ease-in-out;
  max-height: 0;
  overflow: hidden;
  font-style: italic;
  font-size: 0.9em;

  li {
    cursor: pointer;
    padding: 0.5em;
    border-left: 8px solid #333333;
    background-color: #d9d9d9;

    &:hover {
      background-color: #1a1a1a;
    }
  }

  .borrar:hover {
    background-color: #ff837c;
  }
}

.nombre {
  display: block;
  cursor: pointer;
  padding: 0.5em;
  background-color: #d9d9d9;

  &:hover {
    background-color: #f0d336;
  }

  &.actual {
    background-color: #333333;
    color: white;
    cursor: default;
  }
}
</style>
