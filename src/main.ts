import { createApp } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import { createPinia } from 'pinia';
import Inicio from './paginas/Inicio.vue';
import Previsualizar from './paginas/Previsualizar.vue';
import Exportar from './paginas/Exportar.vue';
import './style.css';
import Aplicacion from './Aplicacion.vue';

const rutas = [
  { path: '/', component: Inicio },
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
aplicacion.mount('#app');
