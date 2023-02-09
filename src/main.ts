import { createApp } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import { createPinia } from 'pinia';
import Cuadricula from './paginas/Cuadricula.vue';
import Imagen from './paginas/Imagen.vue';
import Previsualizar from './paginas/Previsualizar.vue';
import Exportar from './paginas/Exportar.vue';
import './style.css';
import Aplicacion from './Aplicacion.vue';

const rutas = [
  { path: '/', component: Cuadricula },
  { path: '/imagen', component: Imagen },
  { path: '/previsualizar', component: Previsualizar },
  { path: '/exportar', component: Exportar },
];

const enrutador = createRouter({
  history: createWebHashHistory(),
  routes: rutas,
});

const pinia = createPinia();

const aplicacion = createApp(Aplicacion);
aplicacion.use(pinia);
aplicacion.use(enrutador);
aplicacion.mount('#aplicacion');
