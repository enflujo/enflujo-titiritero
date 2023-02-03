<script setup lang="ts">
import { onMounted, ref, Ref, watch } from 'vue';
import { usarCerebroGeneral } from '../cerebros/general';
import { pixelesDePorcentaje, porcentaje } from '../utilidades/ayudas';

const cerebro = usarCerebroGeneral();
const entradaColumnas: Ref<HTMLInputElement | null> = ref(null);
const entradaFilas: Ref<HTMLInputElement | null> = ref(null);

const lienzoCuadricula: Ref<HTMLCanvasElement | null> = ref(null);
const lienzoFotograma: Ref<HTMLCanvasElement | null> = ref(null);
const ctxCuadricula: Ref<CanvasRenderingContext2D | null> = ref(null);
const ctxFotograma: Ref<CanvasRenderingContext2D | null> = ref(null);
const opciones: Ref<HTMLDivElement | null> = ref(null);
const opcionesIdeales: Ref<number[][]> = ref([]);

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

      if (datos.cuadricula && datos.cuadricula.parejo) {
        const ideales: number[][] = [];

        datos.cuadricula.forma.forEach((columnas) => {
          const filas = total / columnas;
          ideales.push([columnas, filas]);
        });

        opcionesIdeales.value = ideales;
      } else {
      }
    }
    // const {tota} = cerebro;
    //
  }
);

const esActual = (opcion: number[]): boolean => {
  const { columnas, filas } = cerebro;
  return opcion[0] === filas && opcion[1] === columnas;
};

const cambioDeOpcion = (opcion: number[]) => {
  cerebro.filas = opcion[0];
  cerebro.columnas = opcion[1];
};

const actualizarCuadricula = (lado: string) => {
  let columnas = entradaColumnas.value?.valueAsNumber;
  let filas = entradaFilas.value?.valueAsNumber;
  const total = cerebro.archivoActual?.total;

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
  }
};
</script>

<template>
  <h1>Cargando imágenes...</h1>
  <div id="grid-page" class="contenedorPagina">
    <div class="entrada">
      <span class="entradaNombre">Filas: </span>
      <input
        ref="entradaFilas"
        class="opcionEntrada"
        type="number"
        min="1"
        :max="cerebro.archivoActual?.total"
        :value="cerebro.filas"
        name="filas"
        placeholder="Filas"
        @change="actualizarCuadricula('filas')"
      />

      <span class="entradaNombre">Columnas: </span>
      <input
        ref="entradaColumnas"
        class="opcionEntrada"
        type="number"
        min="1"
        :max="cerebro.archivoActual?.total"
        :value="cerebro.columnas"
        name="columnas"
        placeholder="Columnas"
        @change="actualizarCuadricula('columnas')"
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
