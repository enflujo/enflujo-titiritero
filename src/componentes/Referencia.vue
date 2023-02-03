<script setup lang="ts">
import { watch, computed } from 'vue';
import { usarCerebroGeneral } from '../cerebros/general';
const cerebro = usarCerebroGeneral();

watch(
  () => cerebro.archivoActual,
  (estado) => {
    console.log(estado);
  }
);

const dimensiones = computed(() => {
  if (!cerebro.archivoActual) return null;
  const { ancho, alto, cuadricula } = cerebro.archivoActual;
  const [filas, columnas] = cuadricula.forma;

  return { filas, columnas, ancho: ancho * columnas, alto: alto * filas };
});
</script>

<template>
  <div id="referencia">
    <p>
      Forma:
      <span>{{ cerebro.archivoActual?.cuadricula.forma[0] }} x {{ cerebro.archivoActual?.cuadricula.forma[1] }}</span>
    </p>
    <p v-if="dimensiones">
      Cuadrícula: <span>{{ dimensiones.ancho }}</span> px x <span>{{ dimensiones.alto }}</span> px
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
