<script setup lang="ts">
import { watch, computed, reactive } from 'vue';
import { usarCerebroGeneral } from '../cerebros/general';
const cerebro = usarCerebroGeneral();
const datos = reactive({ ancho: 0, alto: 0, filas: 0, columnas: 0 });

watch(
  () => cerebro.archivoActual,
  (nuevosDatos) => {
    if (!nuevosDatos) return;
    const { ancho, alto, cuadricula } = nuevosDatos;

    if (cuadricula && ancho && alto) {
      const [filas, columnas] = cuadricula.forma;
      Object.assign(datos, { ancho, alto, filas, columnas });
      cerebro.columnas = columnas;
      cerebro.filas = filas;
    }
  }
);

const dimensiones = computed(() => {
  const { filas, columnas, ancho, alto } = datos;
  return { filas, columnas, ancho: ancho * cerebro.columnas, alto: alto * cerebro.filas };
});
</script>

<template>
  <div id="referencia" v-if="cerebro.archivoActual && cerebro.archivoActual.cuadricula">
    <p>
      Forma:
      <span>{{ cerebro.filas }} x {{ cerebro.columnas }}</span>
    </p>
    <p v-if="dimensiones">
      Dimensiones: <span>{{ dimensiones.ancho }}</span> px x <span>{{ dimensiones.alto }}</span> px
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
