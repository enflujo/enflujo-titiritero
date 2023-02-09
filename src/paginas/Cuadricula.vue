<script setup lang="ts">
import { onMounted, ref, Ref, watch, computed } from 'vue';
import { usarCerebroGeneral } from '../cerebros/general';
import { pixelesDePorcentaje, porcentaje } from '../utilidades/ayudas';

const cerebro = usarCerebroGeneral();
const entradaColumnas: Ref<HTMLInputElement | null> = ref(null);
const entradaFilas: Ref<HTMLInputElement | null> = ref(null);

const lienzo: Ref<HTMLCanvasElement | null> = ref(null);
const contexto: Ref<CanvasRenderingContext2D | null> = ref(null);
const opciones: Ref<HTMLDivElement | null> = ref(null);
const opcionesIdeales: Ref<number[][]> = ref([]);

const ancho = ref(0);
const alto = ref(0);
const dimsLienzo = computed((): { ancho: number; alto: number } => {
  return { ancho: ancho.value * cerebro.columnas, alto: alto.value * cerebro.filas };
});

onMounted(() => {
  if (lienzo.value) {
    contexto.value = lienzo.value.getContext('2d');
  }

  cargar();

  document.body.addEventListener('resize', () => {
    console.log('cambio de tamaño');
  });
});

watch(() => cerebro.archivoActual, cargar);
watch(() => cerebro.columnas, recargar);

function cargar() {
  if (cerebro.archivoActual?.cuadricula && !opcionesIdeales.value.length) {
    definirOpcionesIdeales();
  }

  if (cerebro.archivoActual) {
    definirDimensiones();
    pintarCuadricula();
  }
}

function recargar() {
  definirDimensiones();
  pintarCuadricula();
}

function definirDimensiones() {
  const datos = cerebro.archivoActual;

  if (datos && datos.ancho && datos.alto && datos.total) {
    const { total } = datos;
    const escala = porcentaje(pixelesDePorcentaje(75, window.innerWidth) / total, datos.ancho);
    ancho.value = pixelesDePorcentaje(escala, datos.ancho);
    alto.value = pixelesDePorcentaje(escala, datos.alto);
  }
}

function definirOpcionesIdeales() {
  if (cerebro.archivoActual?.cuadricula && cerebro.archivoActual?.cuadricula.parejo) {
    const { cuadricula, total } = cerebro.archivoActual;
    const ideales: number[][] = [];

    cuadricula.forma.forEach((columnas) => {
      const filas = total / columnas;
      ideales.push([columnas, filas]);
    });

    opcionesIdeales.value = ideales;
  }
}

function pintarCuadricula() {
  if (!cerebro.archivoActual || !contexto.value || !lienzo.value) return;
  const { columnas } = cerebro;
  const { total } = cerebro.archivoActual;
  const ctx = contexto.value;
  const tamañoFuente = 11;
  const mitadFuente = tamañoFuente / 2;

  lienzo.value.width = dimsLienzo.value.ancho;
  lienzo.value.height = dimsLienzo.value.alto;
  ctx.fillStyle = 'white';
  ctx.font = `${tamañoFuente}px Tahoma`;
  let fila = 0;
  let columna = 0;

  for (let i = 0; i < total; i++) {
    const x = columna * ancho.value + 0.5;
    const y = fila * alto.value + 0.5;

    ctx.beginPath();
    ctx.rect(x, y, ancho.value - 1, alto.value - 1);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();

    ctx.save();
    ctx.fillStyle = 'black';
    ctx.fillText(`${i + 1}`, x + ancho.value / 2 - mitadFuente, y + alto.value / 2 + mitadFuente / 2);
    ctx.restore();

    if (columna < columnas - 1) {
      columna++;
    } else {
      fila++;
      columna = 0;
    }
  }
}

const esActual = (opcion: number[]): boolean => {
  const { columnas, filas } = cerebro;
  return opcion[0] === filas && opcion[1] === columnas;
};

const cambioDeOpcion = (opcion: number[]) => {
  cerebro.filas = opcion[0];
  cerebro.columnas = opcion[1];
};

const actualizarFormaCuadricula = (lado: string) => {
  let columnas = entradaColumnas.value?.valueAsNumber;
  let filas = entradaFilas.value?.valueAsNumber;
  const total = cerebro.archivoActual?.total;
  const anchoImg = cerebro.archivoActual?.ancho || 0;
  const altoImg = cerebro.archivoActual?.alto || 0;

  if (filas && columnas && total) {
    if (columnas * filas === total) {
      // fields.gridChanged = null;
    } else {
      if (lado === 'columnas') {
        filas = (total / columnas) | 0;

        if ((total / columnas) % 1 !== 0) {
          filas++;
        }
      } else if (lado === 'filas') {
        columnas = (total / filas) | 0;

        if ((total / filas) % 1 !== 0) {
          columnas++;
        }
      }
    }

    cerebro.filas = filas;
    cerebro.columnas = columnas;
    cerebro.ancho = columnas * anchoImg;
    cerebro.alto = filas * altoImg;
  }
};
</script>

<template>
  <div class="contenedorPagina">
    <div class="entrada">
      <span class="entradaNombre">Filas: </span>
      <input
        ref="entradaFilas"
        class="opcionEntrada"
        type="number"
        min="1"
        :max="cerebro.archivoActual?.total"
        :value="cerebro.filas"
        placeholder="Filas"
        @change="actualizarFormaCuadricula('filas')"
      />

      <span class="entradaNombre">Columnas: </span>
      <input
        ref="entradaColumnas"
        class="opcionEntrada"
        type="number"
        min="1"
        :max="cerebro.archivoActual?.total"
        :value="cerebro.columnas"
        placeholder="Columnas"
        @change="actualizarFormaCuadricula('columnas')"
      />
    </div>

    <div id="opciones" ref="opciones" v-if="opcionesIdeales.length">
      <span class="informacion">Opciones sin baches (columnas x filas)</span>
      <span
        v-for="(opcion, i) in opcionesIdeales"
        :key="`opcion${i}`"
        class="opcion"
        :class="esActual(opcion) ? 'actual' : ''"
        @click="cambioDeOpcion(opcion)"
      >
        {{ opcion[0] }} x {{ opcion[1] }}
      </span>
    </div>

    <canvas ref="lienzo"></canvas>
  </div>
</template>

<style lang="scss" scoped>
#opciones {
  padding: 2em 1em;
}

#lienzoFotograma {
  display: none;
}

.opcion {
  cursor: pointer;
  margin-left: 1em;
  padding: 0.5em;
  color: #d23d3d;
  border: 1px solid;

  &:hover {
    color: black;
  }

  &.actual {
    border-color: black;
    background-color: black;
    color: white;
  }
}
</style>
