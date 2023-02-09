<script setup lang="ts">
import { watch, onMounted } from 'vue';
import { usarCerebroGeneral } from '../cerebros/general';
const cerebro = usarCerebroGeneral();

onMounted(() => {
  actualizar();
});

watch(() => cerebro.archivoActual, actualizar);

function actualizar() {
  if (!cerebro.archivoActual) return;

  const { ancho, alto, cuadricula } = cerebro.archivoActual;
  if (cuadricula && ancho && alto) {
    const [filas, columnas] = cuadricula.forma;
    cerebro.columnas = columnas;
    cerebro.filas = filas;
    cerebro.ancho = ancho * columnas;
    cerebro.alto = alto * filas;
  }
}
</script>

<template>
  <div id="referencia" v-if="cerebro.archivoActual && cerebro.archivoActual.cuadricula">
    <p>
      Forma:
      <span>{{ cerebro.columnas }} x {{ cerebro.filas }}</span>
    </p>
    <p>
      Dimensiones: <span>{{ cerebro.ancho }}</span> px x <span>{{ cerebro.alto }}</span> px
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
