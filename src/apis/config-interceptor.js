import axios from "axios";
import emitter from "tiny-emitter/instance";
import { errorApi } from "@/helper/common";
import { useStore } from "vuex";
import resource from "@/helper/resource";
import route from "@/router/router";

const instance = axios.create({
    headers: {
        "Content-Type": "application/json",
        "Accept-Language": "vi-VN,en-US;q=0.9",
    },
});

/**
 * Xử lý request gửi lên
 * Author: TTNham (10/09/2023)
 */
instance.interceptors.request.use(
    function (config) {
        const token = localStorage.getItem("qlts_token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        } else {
            route.push(resource.Link.Login);
        }

        return config;
    },
    function (error) {
        errorApi(error);
        throw error;
        return {
            isSuccess: false,
            data: error,
        };
    }
);

/**
 * Xử lý response trả về
 * Author: TTNham (10/09/2023)
 */
instance.interceptors.response.use(
    function (response) {
        return {
            isSuccess: true,
            data: response.data,
        };
    },
    (error) => {
        throw error;
        return {
            isSuccess: false,
            data: error,
        };
    }
);

export default instance;
