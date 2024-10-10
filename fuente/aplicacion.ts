import { createApp } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import { createPinia } from 'pinia';
import Cuadricula from './paginas/Cuadricula.vue';
import Aplicacion from './Aplicacion.vue';

const rutas = [
  { path: '/', component: Cuadricula },
  { path: '/imagen', component: () => import('./paginas/Imagen.vue') },
  { path: '/previsualizar', component: () => import('./paginas/Previsualizar.vue') },
  { path: '/exportar', component: () => import('./paginas/Exportar.vue') },
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
