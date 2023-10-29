<template>
    <div class="login-container">
        <div class="login-main" @keydown="loginWithEnter($event)">
            <div class="page-title">
                <img :src="PageTitle" alt="" />
            </div>
            <div class="login-form">
                <div class="left">
                    <img :src="LoginImage" alt="" />
                </div>
                <div class="right">
                    <div class="main-login">
                        <div class="logo-login"></div>
                        <div class="logo-text">
                            Đăng nhập để làm việc với
                            <span class="medium">MISA QLTS</span>
                        </div>

                        <div class="login-normal">
                            <div class="username-login login-input">
                                <QLTSInput
                                    placeholder="Tên đăng nhập"
                                    v-model="data.UserName.value"
                                    type="text"
                                    ref="username"
                                    :isRequired="true"
                                    :error-msg="data.UserName.errorMsg"
                                    @update:errorMsg="
                                        updateErrorMsg(
                                            data.UserName,
                                            'Tên đăng nhập'
                                        )
                                    "
                                />
                            </div>
                            <div class="username-login login-input">
                                <QLTSInput
                                    placeholder="Mật khẩu"
                                    :type="type"
                                    :hasPassword="true"
                                    :isShowPassword="isShowPassword"
                                    :is-required="true"
                                    v-model="data.Password.value"
                                    @togglePassword="togglePassword"
                                    :error-msg="data.Password.errorMsg"
                                    ref="password"
                                    @update:errorMsg="
                                        updateErrorMsg(
                                            data.Password,
                                            'Mật khẩu'
                                        )
                                    "
                                />
                            </div>
                        </div>
                        <div class="login-action">
                            <QLTSButton type="primary" @click="handleLogin"
                                >Đăng nhập</QLTSButton
                            >
                            <div class="forgot-password">Quên mật khẩu</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div v-if="isLoading" class="loading">
        <div class="loading-icon"></div>
    </div>
    <QLTSDialog v-if="isShowWarning" :type="typeDialog">
        <div v-html="messageDialog"></div>
    </QLTSDialog>
    <div class="toast-message-wrapper">
        <transition-group name="toast">
            <div
                v-for="(toastMessage, index) in listToastMsg"
                :key="toastMessage.content"
            >
                <QLTSToastmsg
                    v-if="toastMessage.isShow"
                    :type="toastMessage.type"
                    :content="toastMessage.content"
                    @closeToastMessage="closeToastMessage(index)"
                    >{{ toastMessage.content }}</QLTSToastmsg
                >
            </div>
        </transition-group>
    </div>
</template>
<script setup>
import { onMounted, reactive, ref } from "vue";
import emitter from "tiny-emitter/instance";
import route from "@/router/router";
import { useStore } from "vuex";

import PageTitle from "../assets/image/page-title.webp";
import LoginImage from "../assets/image/Login-minhhoa.webp";
import QLTSInput from "@/components/input/QLTSInput.vue";
import QLTSButton from "@/components/button/QLTSButton.vue";
import QLTSDialog from "@/components/dialog/QLTSDialog.vue";
import QLTSEnum from "@/helper/enum";
import QLTSToastmsg from "@/components/toast/QLTSToastmsg.vue";

import resource from "@/helper/resource";
import { loginAsync } from "../apis/loginApi.js";

const data = reactive({
    UserName: { value: "", errorMsg: "" },
    Password: { value: "", errorMsg: "" },
});
const store = useStore();
const isLoading = ref(false);
const isShowPassword = ref(true);
const type = ref("password");
const username = ref(null);
const password = ref(null);
const isShowWarning = ref(false);
const typeDialog = ref("error");
const messageDialog = ref("");
const listToastMsg = ref([]);
onMounted(() => {
    username.value.onFocus();
    emitter.on("hideDialogError", hideDialogError);
});

/**
 * Hàm đăng nhập khi click nút enter
 * Author: TTNham (25/09/2023)
 */
const loginWithEnter = async (event) => {
    try {
        if (event.key === "Enter") {
            const dataLogin = {
                UserName: data.UserName.value,
                Password: data.Password.value,
            };
            isLoading.value = true;
            const response = await loginAsync(dataLogin);
            store.dispatch("login", response.data);
            localStorage.setItem("qlts_token", response.data.token);
            isLoading.value = false;
            route.push(resource.Link.Asset);
        }
    } catch (error) {
        isLoading.value = false;

        showToastMsg(QLTSEnum.ToastMsg.Error, "hello");
    }
};

/**
 * Hàm xử lý đăng nhập
 * Author: TTNham (25/09/2023)
 */
const handleLogin = async () => {
    try {
        const dataLogin = {
            UserName: data.UserName.value,
            Password: data.Password.value,
        };
        isLoading.value = true;
        const response = await loginAsync(dataLogin);
        isLoading.value = false;
        store.dispatch("login", response.data);
        localStorage.setItem("qlts_token", response.data.token);
        route.push(resource.Link.Asset);
    } catch (error) {
        // console.log(error.response.data.UserMessage);
        messageDialog.value = error.response.data.UserMessage;
        isLoading.value = false;
        messageDialog.value = "<b>" + error.response.data?.UserMessage + "</b>";
        // isShowWarning.value = true;
        showToastMsg(QLTSEnum.ToastMsg.Error, error.response.data?.UserMessage);
    }
};

const hideDialogError = () => {
    isShowWarning.value = false;
};

/**
 *
 * @param {String} type
 * @param {String} content
 */
function showToastMsg(type, content) {
    listToastMsg.value.push({
        type: type,
        content: content,
        isShow: true,
    });
    // setTimeout(() => {
    //     if (listToastMsg.value.length > 0) {
    //         listToastMsg.value.shift();
    //     }
    // }, 3000);
}

/**
 * Cập nhật giá trị errorMsg khi blur
 * Author: TTNham(4/8/2023)
 */
const updateErrorMsg = (inputElement, inputName) => {
    inputElement.errorMsg = inputName + resource.Message.NotEmpty;
};

/**
 * hàm ẩn hiện password
 */
const togglePassword = () => {
    isShowPassword.value = !isShowPassword.value;
    if (type.value === "password") {
        type.value = "text";
    } else type.value = "password";
};
/**
 * Ẩn toast message
 * Author: TTNham (01/08/2023)
 */
function closeToastMessage(index) {
    listToastMsg.value.splice(index, 1);
}
</script>
<style scoped>
@import url("./LoginForm.css");
.loading {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
}

.loading-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 6px solid #000;
    animation: spin 0.8s linear infinite;
    border-top-color: transparent;
}

@keyframes spin {
    0% {
        transform: rotate(0);
    }
    100% {
        transform: rotate(360deg);
    }
}
.toast-message-wrapper {
    position: absolute;
    top: 44px;
    left: 50%;
    transform: translateX(-50%);
    min-height: 56px;
    display: flex;
    flex-direction: column;
    column-gap: 20px;
    z-index: 2;
    max-height: 740px;
    overflow-y: hidden;
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
}

.toast-enter-active {
    transition: opacity 0.4s, transform 0.4s;
}

.toast-enter-from {
    opacity: 0;
    transform: translateY(-100%);
}
.toast-msg--error {
    display: block;
}
</style>
