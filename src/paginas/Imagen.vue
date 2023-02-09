<script setup lang="ts">
import { ref, Ref, onMounted, watch, reactive } from 'vue';
import { usarCerebroGeneral } from '../cerebros/general';
import { pixelesDePorcentaje, porcentaje } from '../utilidades/ayudas';

const cerebro = usarCerebroGeneral();
const entradaAncho: Ref<HTMLInputElement | null> = ref(null);
const entradaAlto: Ref<HTMLInputElement | null> = ref(null);
const lienzo: Ref<HTMLCanvasElement | null> = ref(null);
const contexto: Ref<CanvasRenderingContext2D | null> = ref(null);
const maximo = reactive({ ancho: 0, alto: 0 });
const fotogramas: Ref<HTMLImageElement[]> = ref([]);

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

    cargar();
  }
);

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

    maximo.ancho = cerebro.columnas * cerebro.archivoActual.ancho;
    maximo.alto = cerebro.filas * cerebro.archivoActual.alto;
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
    if (indiceFotograma < total) {
      const fotograma = fotogramas.value[indiceFotograma];
      const { ancho: anchoImg, alto: altoImg, x: x1, y: y1 } = imagenes[indiceFotograma];
      const x2 = columna * anchoFotograma;
      const y2 = fila * altoFotograma;
      const x = x1 * escala + x2;
      const y = y1 * escala + y2;
      const ancho = anchoImg * escala;
      const alto = altoImg * escala;

      ctx.drawImage(fotograma, 0, 0, anchoImg, altoImg, x, y, ancho, alto);

      if (columna < columnas - 1) {
        columna++;
      } else {
        fila++;
        columna = 0;
      }

      indiceFotograma++;
      requestAnimationFrame(pintarProgresivamente);
    }
  };

  requestAnimationFrame(pintarProgresivamente);
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

  pintar();
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

    <canvas ref="lienzo"></canvas>
  </div>
</template>
