<template>
  <ul id="nav">
    <router-link to="/">Inicio</router-link>
    <router-link to="/exportar">Exportar</router-link>
    <li id="to-grid" class="nav-item hidden" data-target="grid-page">Grid</li>
    <li id="to-sprite" class="nav-item hidden" data-target="sprite-page">Sprite</li>
    <li id="to-preview" class="nav-item hidden" data-target="preview-page">Preview Animation</li>
    <li id="to-export" class="nav-item hidden" data-target="export-page">Export</li>
    <li id="loading-images" class="hidden">Loading images...</li>
  </ul>
</template>
