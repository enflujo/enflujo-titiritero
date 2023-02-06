<script setup lang="ts">
import { ref, Ref, onMounted, watch, reactive } from 'vue';
import { usarCerebroGeneral } from '../cerebros/general';
import { pixelesDePorcentaje, porcentaje } from '../utilidades/ayudas';

const cerebro = usarCerebroGeneral();
const entradaAncho: Ref<HTMLInputElement | null> = ref(null);
const entradaAlto: Ref<HTMLInputElement | null> = ref(null);
const lienzo: Ref<HTMLCanvasElement | null> = ref(null);
const contexto: Ref<CanvasRenderingContext2D | null> = ref(null);
const ancho = ref(0);
const alto = ref(0);
const maximo = reactive({ ancho: 0, alto: 0 });

onMounted(() => {
  if (lienzo.value) {
    contexto.value = lienzo.value.getContext('2d');
  }

  cargar();
});

watch(
  () => cerebro.archivoActual,
  (datos) => {
    if (!datos) return;
    maximo.ancho = datos.total * datos.ancho;
    maximo.alto = datos.total * datos.alto;
    cargar();
  }
);

function cargar() {
  if (cerebro.archivoActual) {
    ancho.value = cerebro.columnas * cerebro.archivoActual.ancho;
    alto.value = cerebro.filas * cerebro.archivoActual.alto;
  }
}

function actualizarDimensiones() {
  if (cerebro.archivoActual && entradaAncho.value) {
    const escala = porcentaje(entradaAncho.value.valueAsNumber / cerebro.columnas, cerebro.archivoActual.ancho);
    console.log(escala);
    ancho.value = pixelesDePorcentaje(escala, cerebro.archivoActual.ancho);
    alto.value = pixelesDePorcentaje(escala, cerebro.archivoActual.alto);
  }
}
</script>

<template>
  <div class="entrada">
    <span class="entradaNombre">Ancho: </span>
    <input
      ref="entradaAncho"
      class="opcionEntrada"
      type="number"
      min="1"
      :max="maximo.ancho"
      placeholder="Ancho"
      :value="ancho"
      @change="actualizarDimensiones"
    />px<br />

    <span class="entradaNombre">Alto: </span>
    <input
      ref="entradaAlto"
      class="opcionEntrada"
      type="number"
      min="1"
      :max="maximo.alto"
      placeholder="Alto"
      :value="alto"
    />px
  </div>

  <canvas ref="lienzo"></canvas>
</template>
