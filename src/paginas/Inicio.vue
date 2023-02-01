<template>
  <h1>Cargando imágenes...</h1>
  <div id="grid-page" class="page-wrapper">
    <div class="options-form">
      <span class="options-form-name">Columns: </span>
      <input id="custom-cols" class="options-input" type="number" min="1" value="1" name="cols" placeholder="Columns" />
      <span class="options-form-name">Rows: </span>
      <input
        id="custom-rows"
        class="options-input"
        type="number"
        min="1"
        value="1"
        name="rows"
        placeholder="Rows"
      /><br />
    </div>

    <div id="ideal-options"></div>
  </div>
</template>
