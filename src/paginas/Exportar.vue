<script setup lang="ts"></script>

<template>
  <div id="export-page" class="page-wrapper">
    <div class="options-form">
      <span class="options-form-name">Select: </span>
      <select id="quality-options">
        <option value="1">max</option>
        <option value="0.8">high</option>
        <option value="0.5">medium</option>
        <option value="0.1">low</option>
      </select>

      <span class="options-form-name">Quality: </span>
      <input
        id="custom-quality"
        class="options-input"
        type="number"
        min="0.1"
        max="1"
        step="0.01"
        value="1"
        name="quality"
      />

      <span class="options-form-name">Format: </span>
      <select id="format-options">
        <option value="jpeg">jpeg</option>
        <option value="png">png</option>
      </select>

      <span class="options-form-name">Data Format: </span>
      <select id="data-format-options">
        <option value="js">js</option>
        <option value="json">json</option>
      </select>

      <button id="build">Build</button>
    </div>

    <pre id="sprite-data"><code id="sprite-data-code" class="language-javascript"></code></pre>
    <ul id="downloads-list"></ul>
  </div>
</template>
