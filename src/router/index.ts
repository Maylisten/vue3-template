import {createWebHashHistory, createRouter, RouteRecordRaw} from 'vue-router';
import HomePage from "@/pages/HomePage.vue";

const routes: Readonly<RouteRecordRaw[]> = [
  {path: '/', redirect: "/home"},
  {path: "/home", component: HomePage}
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
