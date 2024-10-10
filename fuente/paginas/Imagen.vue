<script setup lang="ts">
import { ref, Ref, onMounted, watch, reactive } from 'vue';
import { usarCerebroGeneral } from '../cerebros/general';
import { pixelesDePorcentaje, porcentaje } from '../utilidades/ayudas';
import Lienzo from '../componentes/Lienzo.vue';

const cerebro = usarCerebroGeneral();
const entradaAncho: Ref<HTMLInputElement | null> = ref(null);
const entradaAlto: Ref<HTMLInputElement | null> = ref(null);
const maximo = reactive({ ancho: 0, alto: 0 });

onMounted(() => {
  cargar();
});

watch(
  () => cerebro.archivoActual,
  (datos) => {
    if (!datos) return;

    cargar();
  }
);

function cargar() {
  if (cerebro.archivoActual) {
    maximo.ancho = cerebro.columnas * cerebro.archivoActual.ancho;
    maximo.alto = cerebro.filas * cerebro.archivoActual.alto;
  }
}

function actualizarDimensiones(lado: string) {
  if (!cerebro.archivoActual) return;

  const anchoActual = entradaAncho.value?.valueAsNumber || 0;
  const altoActual = entradaAlto.value?.valueAsNumber || 0;
  const anchoMax = cerebro.archivoActual.ancho * cerebro.columnas || 0;
  const altoMax = cerebro.archivoActual.alto * cerebro.filas || 0;
  const escala = lado === 'ancho' ? porcentaje(anchoActual, anchoMax) : porcentaje(altoActual, altoMax);
  let anchoNuevo = anchoActual;
  let altoNuevo = altoActual;

  if (lado === 'ancho') {
    altoNuevo = escala < 100 ? pixelesDePorcentaje(escala, altoMax) : altoMax;
    console.log(escala, altoNuevo | 0, altoActual);
  } else if (lado === 'alto') {
    anchoNuevo = escala < 100 ? pixelesDePorcentaje(escala, anchoMax) : anchoMax;
  }
  cerebro.escala = escala / 100;
  cerebro.ancho = anchoNuevo | 0;
  cerebro.alto = altoNuevo | 0;
}
</script>

<template>
  <div class="contenedorPagina">
    <div class="entradas">
      <span class="entradaNombre">Ancho: </span>
      <input
        ref="entradaAncho"
        class="opcionEntrada"
        type="number"
        min="1"
        :max="maximo.ancho"
        placeholder="Ancho"
        :value="cerebro.ancho"
        @change="actualizarDimensiones('ancho')"
      />px<br />

      <span class="entradaNombre">Alto: </span>
      <input
        ref="entradaAlto"
        class="opcionEntrada"
        type="number"
        min="1"
        :max="maximo.alto"
        placeholder="Alto"
        :value="cerebro.alto"
        @change="actualizarDimensiones('alto')"
      />px
    </div>
    <Lienzo />
  </div>
</template>
