<script setup lang="ts">
import { ref, Ref, onMounted, watch, onUnmounted } from 'vue';
import { usarCerebroGeneral } from '../cerebros/general';

const cerebro = usarCerebroGeneral();
const velocidad = ref(3);
const lienzo: Ref<HTMLCanvasElement | null> = ref(null);
const contexto: Ref<CanvasRenderingContext2D | null> = ref(null);
const reproduciendo = ref(false);
const totalImg = ref(0);
const fotogramas: Ref<HTMLImageElement[]> = ref([]);
let animador = 0;
let indiceFotograma = ref(0);

onMounted(() => {
  if (lienzo.value) {
    contexto.value = lienzo.value.getContext('2d');
  }

  cargar();
});

onUnmounted(() => {
  window.cancelAnimationFrame(animador);
});

watch(
  () => cerebro.archivoActual,
  (datos) => {
    if (!datos) return;
    cargar();
  }
);

function cargar() {
  if (cerebro.archivoActual && lienzo.value) {
    const { escala } = cerebro;
    lienzo.value.width = (cerebro.archivoActual.ancho * escala) | 0;
    lienzo.value.height = (cerebro.archivoActual.alto * escala) | 0;

    if (cerebro.archivoActual.imagenes && cerebro.archivoActual.imagenes.length) {
      const { imagenes, total } = cerebro.archivoActual;
      totalImg.value = total;
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
  const { escala } = cerebro;
  const { imagenes } = cerebro.archivoActual;

  if (!imagenes || !imagenes.length) return;

  const ctx = contexto.value;
  const fotograma = fotogramas.value[indiceFotograma.value];
  const { ancho: anchoDibujo, alto: altoDibujo, x: x1, y: y1 } = imagenes[indiceFotograma.value];
  const x = x1 * escala;
  const y = y1 * escala;
  ctx.clearRect(0, 0, lienzo.value.width, lienzo.value.height);
  ctx.drawImage(fotograma, 0, 0, anchoDibujo, altoDibujo, x, y, (anchoDibujo * escala) | 0, (altoDibujo * escala) | 0);
}

function animar() {
  if (!cerebro.archivoActual) return;
  let contador = 0;

  const { total } = cerebro.archivoActual;

  function bucle() {
    if (contador >= velocidad.value) {
      pintar();
      contador = 0;
      indiceFotograma.value = (indiceFotograma.value + 1) % total;
    } else {
      contador++;
    }

    animador = requestAnimationFrame(bucle);
  }

  animador = requestAnimationFrame(bucle);
}

function accionReproductor() {
  reproduciendo.value = !reproduciendo.value;

  if (reproduciendo.value) {
    animar();
  } else {
    window.cancelAnimationFrame(animador);
  }
}

function buscarFotograma(atras: boolean = false) {
  if (reproduciendo.value || !cerebro.archivoActual) return;
  const { total } = cerebro.archivoActual;

  if (atras) {
    if (indiceFotograma.value > 0) {
      indiceFotograma.value -= 1;
    } else {
      indiceFotograma.value = total - 1;
    }
  } else {
    if (indiceFotograma.value < total - 1) {
      indiceFotograma.value += 1;
    } else {
      indiceFotograma.value = 0;
    }
  }

  pintar();
}
</script>

<template>
  <div class="contenedorPagina">
    <div class="entradas">
      <span class="entradaNombre">Velocidad: </span>
      <input class="entrada" type="number" min="1" v-model="velocidad" name="vel" placeholder="a" />
      <button @click="accionReproductor">{{ reproduciendo ? '||' : `&#9658;` }}</button>
      <button @click="buscarFotograma(true)">&larr;</button>
      <button @click="buscarFotograma(false)">&rarr;</button>
    </div>

    <canvas ref="lienzo"></canvas>
    <p class="fotograma">{{ indiceFotograma + 1 }}</p>
  </div>
</template>

<style lang="scss" scoped>
.entrada {
  width: 3em;
}

.fotograma {
  text-align: center;
  font-weight: bold;
}
</style>
