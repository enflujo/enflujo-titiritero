<script setup lang="ts">
import { usarCerebroGeneral } from '../cerebros/general';
import { ref, Ref, onMounted, watch } from 'vue';
const lienzo: Ref<HTMLCanvasElement | null> = ref(null);
const contexto: Ref<CanvasRenderingContext2D | null> = ref(null);
const fotogramas: Ref<HTMLImageElement[]> = ref([]);
const cerebro = usarCerebroGeneral();

onMounted(() => {
  if (lienzo.value) {
    contexto.value = lienzo.value.getContext('2d');
  }

  cargar();
});

watch(() => cerebro.ancho, cargar);

function cargar() {
  if (cerebro.archivoActual) {
    if (cerebro.archivoActual.imagenes && cerebro.archivoActual.imagenes.length) {
      const { imagenes, total } = cerebro.archivoActual;
      fotogramas.value = [];
      let conteo = 0;

      imagenes.forEach((fuente) => {
        const img = new Image();
        img.onload = () => {
          conteo = conteo + 1;
          fotogramas.value.push(img);

          if (conteo === total) {
            pintar();
          }
        };
        img.src = fuente.ruta;
      });
    }
  }
}

function pintar() {
  if (!cerebro.archivoActual || !lienzo.value || !contexto.value) return;
  const { columnas, escala } = cerebro;
  const { total, ancho: ancho1, alto: alto1, imagenes } = cerebro.archivoActual;

  if (!imagenes || !imagenes.length) return;
  lienzo.value.width = cerebro.ancho;
  lienzo.value.height = cerebro.alto;
  const ctx = contexto.value;

  const anchoFotograma = (ancho1 * escala) | 0;
  const altoFotograma = (alto1 * escala) | 0;
  let indiceFotograma = 0;
  let fila = 0;
  let columna = 0;

  const pintarProgresivamente = () => {
    cerebro.imagen = null;

    if (indiceFotograma < total) {
      const fotograma = fotogramas.value[indiceFotograma];
      const { ancho: anchoImg, alto: altoImg, x: x1, y: y1 } = imagenes[indiceFotograma];
      const x2 = columna * anchoFotograma;
      const y2 = fila * altoFotograma;
      const ancho = anchoImg * escala;
      const alto = altoImg * escala;
      ctx.drawImage(fotograma, -x1, -y1, anchoImg, altoImg, x2, y2, ancho, alto);

      if (columna < columnas - 1) {
        columna++;
      } else {
        fila++;
        columna = 0;
      }

      indiceFotograma++;
      requestAnimationFrame(pintarProgresivamente);
    } else {
      if (lienzo.value) {
        const imagenEnTexto = lienzo.value.toDataURL('image/webp', 1);
        cerebro.imagen = imagenEnTexto.split(',')[1];
      }
    }
  };

  requestAnimationFrame(pintarProgresivamente);
}
</script>

<template>
  <canvas ref="lienzo"></canvas>
</template>
