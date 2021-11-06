import Vue from 'vue'
import VueRouter from 'vue-router'
import mainPage from "@/pages/mainPage/mainPage";
import AppLayout from "../layouts/app/AppLayout";

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        component: AppLayout,
        children: [
            {
                path: '',
                component: mainPage
            }
        ]
    },
]

const router = new VueRouter({
    routes
})

export default router
