import { createRouter, createWebHistory } from "vue-router";
import { useStore } from "vuex";
import TheMain from "@/components/layout/TheMain";
import LoginForm from "@/auth/LoginForm.vue";
import resource from "@/helper/resource";
import HomePage from "@/views/HomePage.vue";
import AssetOverview from "@/views/overview/AssetOverview.vue";
import AssetList from "@/views/AssetList.vue";
import RecordIncrease from "@/views/record-increase/RecordIncrease.vue";

const routes = [
    { path: "/", redirect: resource.Link.Login, component: LoginForm },
    {
        path: resource.Link.Login,
        name: "LoginForm",
        component: LoginForm,
        beforeEnter: (to, from, next) => {
            const store = useStore();
            const isValidToken = localStorage.getItem("qlts")?.isValidToken;
            if (isValidToken) {
                next({ name: "HomePage" });
            } else {
                next();
            }
        },
    },
    {
        path: "/",
        name: "HomePage",
        component: HomePage,
        children: [
            {
                path: resource.Link.Overview,
                name: "Overview",
                component: AssetOverview,
            },
            {
                path: resource.Link.Asset,
                name: "Asset",
                component: AssetList,
                children: [
                    { path: "/", component: AssetList },
                    { path: "/tai-san/ghi-tang", component: RecordIncrease },
                    { path: "/tai-san/khac" },
                ],
            },
        ],
        meta: {
            requireAuth: true,
        },
    },
];

const route = createRouter({
    history: createWebHistory(),
    routes: routes,
});

// route.beforeEach((to) => {
//     if (to.meta.requireAuth && !localStorage.getItem("qlts")?.isValidToken)
//         return {
//             path: "/dang-nhap",
//         };
// });

export default route;
