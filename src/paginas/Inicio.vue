<script setup lang="ts">
import { onMounted, ref, Ref, watch } from 'vue';
import { usarCerebroGeneral } from '../cerebros/general';
import { Archivo } from '../tipos';
import { pixelesDePorcentaje, porcentaje } from '../utilidades/ayudas';

const cerebro = usarCerebroGeneral();
const lienzoCuadricula: Ref<HTMLCanvasElement | null> = ref(null);
const lienzoFotograma: Ref<HTMLCanvasElement | null> = ref(null);
const ctxCuadricula: Ref<CanvasRenderingContext2D | null> = ref(null);
const ctxFotograma: Ref<CanvasRenderingContext2D | null> = ref(null);
const opciones: Ref<HTMLDivElement | null> = ref(null);

onMounted(() => {
  if (lienzoCuadricula.value) {
    ctxCuadricula.value = lienzoCuadricula.value.getContext('2d');
  }

  if (lienzoFotograma.value) {
    ctxFotograma.value = lienzoFotograma.value.getContext('2d');
  }
});

watch(
  () => cerebro.archivoActual,
  (datos) => {
    console.log('datosActuales', datos);
    if (datos && datos.ancho && datos.alto && datos.total) {
      const { total } = datos;
      const escala = porcentaje(pixelesDePorcentaje(80, window.innerWidth) / total, datos.ancho);
      const ancho = pixelesDePorcentaje(escala, datos.ancho);
      const alto = pixelesDePorcentaje(escala, datos.alto);

      if (datos.cuadricula) {
        const ideales = [];

        datos.cuadricula.forma.forEach((columnas) => {
          const filas = total / columnas;
        });
      }
    }
    // const {tota} = cerebro;
    //
  }
);
</script>

<template>
  <h1>Cargando imágenes...</h1>
  <div id="grid-page" class="contenedorPagina">
    <div class="entrada">
      <span class="entradaNombre">Columnas: </span>

      <input id="columnas" class="options-input" type="number" min="1" value="1" name="cols" placeholder="Columnas" />

      <span class="entradaNombre">Filas: </span>
      <input
        id="custom-rows"
        class="options-input"
        type="number"
        min="1"
        value="1"
        name="rows"
        placeholder="Rows"
      /><br />
    </div>

    <div id="opciones" ref="opciones">
      <span class="informacion">Opciones sin baches (columnas x filas)</span>
      <span></span>
    </div>
    <canvas ref="lienzoCuadricula"></canvas>
    <canvas id="lienzoFotograma" ref="lienzoFotograma"></canvas>
  </div>
</template>

<style lang="scss" scoped>
#opciones {
  padding: 2em 1em;
}

#lienzoFotograma {
  display: none;
}
</style>
