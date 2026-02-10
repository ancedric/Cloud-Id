import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import Prospects from '../views/Prospects.vue'
import ProspectDetails from '../views/ProspectDetails.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Dashboard },
    { path: '/prospects', component: Prospects },
    { path: '/prospect/:id', component: ProspectDetails, props: true }
  ]
})

export default router
