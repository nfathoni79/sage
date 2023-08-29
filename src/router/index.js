import { createWebHistory, createRouter } from 'vue-router'
import Home from '../views/Home.vue'
import Search from '../views/Search.vue'
import Watchlist from '../views/Watchlist.vue'
import Anime from '../views/Anime.vue'
import NotFound from '../views/NotFound.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/search',
    name: 'search',
    component: Search,
  },
  {
    path: '/watchlist',
    name: 'watchlist',
    component: Watchlist,
  },
  {
    path: '/anime/:id',
    name: 'anime',
    component: Anime,
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFound,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router