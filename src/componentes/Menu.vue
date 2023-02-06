<template>
  <nav id="menu">
    <router-link to="/" class="boton">Inicio</router-link>
    <router-link to="/previsualizar" class="boton">Previsualizar</router-link>
    <router-link to="/exportar" class="boton">Exportar</router-link>
  </nav>
</template>

<style lang="scss" scoped>
#menu {
  margin: 0;
  padding: 0;
  width: 100%;
  position: absolute;
  z-index: 999;
  text-align: left;
}

a,
a:link {
  text-decoration: none;
}

.boton {
  margin: 0 0.5em;
  padding: 1em;
  display: inline-block;
  background-color: darken(white, 10%);
  transition: 0.2s all ease-in-out;
  color: black;

  &:hover {
    background-color: darken(white, 5%);
  }

  &.router-link-active {
    background-color: lighten(black, 20%);
    color: white;
    cursor: default;
  }
}
</style>
