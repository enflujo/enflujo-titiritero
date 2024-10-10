<template>
  <nav id="navegacion">
    <router-link to="/" class="boton">Cuadrícula</router-link>
    <router-link to="/imagen" class="boton">Imagen</router-link>
    <router-link to="/previsualizar" class="boton">Previsualizar</router-link>
    <router-link to="/exportar" class="boton">Exportar</router-link>
  </nav>
</template>

<style lang="scss" scoped>
@use 'sass:color';

a,
a:link {
  text-decoration: none;
}

.boton {
  margin: 0 0.5em;
  padding: 1em;
  display: inline-block;
  background-color: color.adjust(white, $lightness: -10%);
  transition: 0.2s all ease-in-out;
  color: black;

  &:hover {
    background-color: color.adjust(white, $lightness: -5%);
  }

  &.router-link-active {
    background-color: color.adjust(black, $lightness: -20%);
    color: white;
    cursor: default;
  }
}
</style>
