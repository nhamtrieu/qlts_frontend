import { createRouter, createWebHistory } from "vue-router";
import { useStore } from "vuex";
import TheMain from "@/components/layout/TheMain";
import LoginForm from "@/auth/LoginForm.vue";
import resource from "@/helper/resource";
import HomePage from "@/views/HomePage.vue";
import Manage from "@/views/overview/Manage.vue";
import AssetList from "@/views/AssetList.vue";
import RecordIncrease from "@/views/record-increase/RecordIncrease.vue";
import Register from "@/auth/register/Register.vue";

const routes = [
    {
        path: resource.Link.Login,
        name: "LoginForm",
        component: LoginForm,
        beforeEnter: (to, from, next) => {
            const isValidToken = localStorage.getItem("qlts")?.isValidToken;
            const token = localStorage.getItem("qlts_token");
            if (isValidToken) {
                console.log("isValidToken", isValidToken);
                next({ name: "HomePage" });
            } else {
                if (token) {
                    next();
                } else {
                    next({ name: "Register" });
                }
            }
        },
    },
    {
        path: "/dang-ky",
        component: Register,
        name: "Register",
    },
    {
        path: "/quen-mat-khau",
        component: import("@/auth/forgot-password/ForgotPassword.vue"),
    },
    {
        path: "/",
        name: "HomePage",
        component: HomePage,
        children: [
            {
                path: "/quan-ly",
                name: "Overview",
                component: Manage,
            },
            {
                path: resource.Link.Asset,
                name: "Asset",
                component: AssetList,
                children: [{ path: "/", component: AssetList }],
            },
            {
                path: "/ghi-tang",
                name: "Increase",
                component: RecordIncrease,
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
