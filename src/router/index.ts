import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'
import Games from '../views/Games.vue'
import SkillTree from '../views/Upgrades.vue'
import Scoreboard from '../views/Scoreboard.vue'
import Register from '../views/Register.vue'
import Landing from '../views/Landing.vue'
import Fleet from '../views/Fleet.vue'
import { getAuth, User } from '@firebase/auth'
import { onAuthStateChanged } from 'firebase/auth'
import { ref } from 'vue'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Landing',
        component: Landing,
    },
    {
        path: '/home',
        name: 'Home',
        component: Home,
        meta: { requiresAuth: true },
    },
    {
        path: '/guide',
        name: 'Guide',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/Guide.vue'),
    },
    {
        path: '/games',
        name: 'Games',
        component: Games,
    },
    {
        path: '/skillTree',
        name: 'SkillTree',
        component: SkillTree,
        meta: { requiresAuth: true },
    },
    {
        path: '/fleet',
        name: 'Fleet',
        component: Fleet,
        meta: { requiresAuth: true },
    },
    {
        path: '/scoreboard',
        name: 'Scoreboard',
        component: Scoreboard,
        meta: { requiresAuth: true },
    },
    {
        path: '/register',
        name: 'Register',
        component: Register,
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})
export const currentUser = ref<User | null>(null)
const getCurrentUser = () => {
    const auth = getAuth()
    return new Promise((resolve, reject) => {
        const unsubscribe = onAuthStateChanged(
            auth,
            user => {
                currentUser.value = user
                unsubscribe()
                resolve(user)
            },
            reject
        )
    })
}
router.beforeEach(async (to, from, next) => {
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
    if (!(await getCurrentUser()) && requiresAuth) {
        next('/')
    } else {
        next()
    }
})
export default router
