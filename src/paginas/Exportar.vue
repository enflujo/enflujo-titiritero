<script setup lang="ts">
import hljs from 'highlight.js/lib/core';
import 'highlight.js/styles/panda-syntax-dark.css';
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import { onMounted, ref, Ref } from 'vue';
import { Datos } from '../tipos';
import { usarCerebroGeneral } from '../cerebros/general';
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('json', json);

const cerebro = usarCerebroGeneral();
const calidad: Ref<HTMLInputElement | null> = ref(null);
const formatoImagen: Ref<HTMLSelectElement | null> = ref(null);
const formatoDatos: Ref<HTMLSelectElement | null> = ref(null);
const datos: Ref<string | null> = ref(null);
const valorCalidad = ref(1);
const nombreArchivo = ref(cerebro.nombre);

onMounted(() => {
  actualizarDatos();
});

function actualizarDatos() {
  if (!cerebro.archivoActual || !calidad.value || !formatoImagen.value || !formatoDatos.value) return null;

  const { ancho, alto, columnas, filas, archivoActual } = cerebro;
  const { valueAsNumber: valorCalidad } = calidad.value;

  const respuesta: Datos = {
    fuente: `/${nombreArchivo.value}_${columnas}x${filas}-${ancho}x${alto}_${valorCalidad}.${formatoImagen.value.value}`,
    ancho,
    alto,
    columnas,
    filas,
    fotogramas: [],
  };

  if (formatoDatos.value.value === 'json') {
    datos.value = hljs.highlight(JSON.stringify(respuesta, null, 2), { language: 'json' }).value;
    return;
  } else if (formatoDatos.value.value === 'js') {
    const js = `const ${nombreArchivo.value} = {
  fuente: '${respuesta.fuente}',
  ancho: ${respuesta.ancho},
  alto: ${respuesta.alto},
  columnas: ${respuesta.columnas},
  filas: ${respuesta.filas},
  fotogramas: [
    ${archivoActual.imagenes
      ?.map((imagen) => {
        return `{x: ${imagen.x}, y: ${imagen.y}}`;
      })
      .join(`\n    `)}
  ]
};`;

    datos.value = hljs.highlight(js, { language: 'javascript' }).value;
    return;
  }

  return '';
}

function actualizarCalidad({ target }: Event) {
  const { value } = target as HTMLInputElement;

  if (value) {
    valorCalidad.value = +value;
  }

  actualizarDatos();
}

function actualizarNombre({ target }: Event) {
  const { value } = target as HTMLInputElement;

  if (value) {
    nombreArchivo.value = value;
  }

  actualizarDatos();
}
</script>

<template>
  <div class="contenedorPagina">
    <div class="entradas">
      <span class="entradaNombre">Nombre: </span>
      <input type="text" :value="nombreArchivo" @input="actualizarNombre" />

      <span class="entradaNombre">Opciones: </span>
      <select @change="actualizarCalidad">
        <option value="1">Máximo</option>
        <option value="0.8">Alto</option>
        <option value="0.5">Medio</option>
        <option value="0.1">Bajo</option>
      </select>

      <span class="entradaNombre">Calidad: </span>
      <input
        ref="calidad"
        class="opcionEntrada"
        type="number"
        min="0.1"
        max="1"
        step="0.01"
        :value="valorCalidad"
        @change="actualizarCalidad"
      />

      <span class="entradaNombre">Formato Imagen: </span>
      <select ref="formatoImagen" @change="actualizarDatos">
        <option value="webp">webp</option>
        <option value="png">png</option>
        <option value="jpg">jpg</option>
      </select>

      <span class="entradaNombre">Formato Datos: </span>
      <select ref="formatoDatos" @change="actualizarDatos">
        <option value="js">js</option>
        <option value="json">json</option>
      </select>

      <button id="build">Crear</button>
    </div>

    <pre><code dangerousl v-if="datos" v-html="datos"></code></pre>
    <ul id="downloads-list"></ul>
  </div>
</template>

<style lang="scss" scoped>
pre {
  background-color: #1d394a;
  padding: 2em;
  color: white;
}
</style>
