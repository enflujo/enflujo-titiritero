<script setup lang="ts">
import { watch } from 'vue';
import { usarCerebroGeneral } from '../cerebros/general';
const cerebro = usarCerebroGeneral();

watch(
  () => cerebro.informacionBasica,
  (estado) => {
    console.log(estado);
  }
);
</script>

<template>
  <div id="ref-box">
    <div>Grid: <span id="ref-cols"></span> x <span id="ref-rows"></span></div>
    <div>Sprite: <span id="ref-width"></span> px x <span id="ref-height"></span> px</div>
  </div>
</template>
