<script setup lang="ts">
import Menu from './componentes/Menu.vue';
import Referencia from './componentes/Referencia.vue';

const arrastreInicio = (evento: DragEvent) => {
  (evento.target as HTMLDivElement).classList.add('enZona');
};

const arrastreFueraDeZona = (evento: DragEvent) => {
  (evento.target as HTMLDivElement).classList.remove('enZona');
};

const arrastreAccion = (evento: DragEvent) => {
  evento.preventDefault();
  if (evento.dataTransfer) {
    window.photoshop.nuevo(evento.dataTransfer.files[0]);
  }
};

const arrastreClic = (evento: DragEvent) => {
  // fileInput.click();
};
</script>

<template>
  <aside id="contenedor">
    <input type="file" id="entrada" hidden="true" />

    <div id="zona" @dragenter="arrastreInicio" @dragleave="arrastreFueraDeZona" @drop="arrastreAccion" @click=""></div>

    <h3>Archivos</h3>
    <ul id="files"></ul>
  </aside>

  <main>
    <Menu></Menu>
    <Referencia></Referencia>
    <router-view></router-view>
  </main>
</template>

<style lang="scss" scoped>
#contenedor {
  width: 20%;
  position: fixed;
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
  background-color: #e6e6e6;
}

h3 {
  padding-left: 0.5em;
}

#zona {
  width: 100%;
  height: 80px;
  display: table;
  margin: 0 auto;
  transition: 0.23s all ease-in-out;
  text-align: center;
  background-color: #d9d9d9;
  cursor: pointer;

  &::after {
    content: '+';
    font-size: 30px;
    display: table-cell;
    text-align: center;
    vertical-align: middle;
  }

  &.enZona,
  &:hover {
    background-color: lighten(black, 20%);
    color: white;
  }
}
</style>
