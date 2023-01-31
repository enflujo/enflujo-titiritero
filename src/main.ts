import { createApp } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import Inicio from './paginas/Inicio.vue';
import Exportar from './paginas/Exportar.vue';
import './style.css';
import Aplicacion from './Aplicacion.vue';

const rutas = [
  { path: '/', component: Inicio },
  { path: '/exportar', component: Exportar },
];

const enrutador = createRouter({
  history: createWebHashHistory(),
  routes: rutas,
});

const aplicacion = createApp(Aplicacion);
aplicacion.use(enrutador);
aplicacion.mount('#app');
