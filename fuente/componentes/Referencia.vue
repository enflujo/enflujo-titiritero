<script setup lang="ts">
import { watch, onMounted } from 'vue';
import { usarCerebroGeneral } from '../cerebros/general';
import { storeToRefs } from 'pinia';
const cerebro = usarCerebroGeneral();
const { cuadricula, ancho, alto, columnas, filas } = storeToRefs(cerebro);

watch(cuadricula, (datosCuadricula) => {
  if (ancho.value && alto.value) {
    const [filas, columnas] = datosCuadricula.forma;
    cerebro.columnas = columnas;
    cerebro.filas = filas;
    cerebro.anchoImg = ancho.value * columnas;
    cerebro.altoImg = alto.value * filas;
  }
});
</script>

<template>
  <div id="referencia" v-if="cuadricula && ancho && alto">
    <p>
      Forma:
      <span>{{ columnas }} x {{ filas }}</span>
    </p>
    <p>
      Dimensiones: <span>{{ ancho }}</span> px x <span>{{ alto }}</span> px
    </p>
  </div>
</template>

<style lang="scss" scoped>
p {
  line-height: 0;
}
#referencia {
  position: fixed;
  top: 0;
  right: 30px;
  padding: 0.5em 1em;
  line-height: 1.9;
  z-index: 9999;
  background-color: #262626;
  color: white;
  font-size: 0.7em;
  text-align: right;
}
</style>
