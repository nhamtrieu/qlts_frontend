<template>
    <div class="register-container">
        <div class="register-main">
            <div class="page-title">
                <img :src="PageTitle" alt="" />
            </div>
            <div class="register-form">
                <div class="left">
                    <img :src="LoginImage" alt="" />
                </div>
                <div class="right">
                    <div class="register">
                        <div class="logo-register"></div>
                        <div class="logo-text">
                            Đăng ký để làm việc với
                            <span class="medium">MISA QLTS</span>
                        </div>
                        <div class="register-normal">
                            <div class="username-register register-input">
                                <QLTSInput
                                    placeholder="Tên đăng nhập"
                                    type="text"
                                    v-model="data.UserName"
                                />
                            </div>
                            <div class="username-register register-input">
                                <QLTSInput
                                    placeholder="Email"
                                    type="text"
                                    v-model="data.Email"
                                />
                            </div>
                            <div class="username-register register-input">
                                <QLTSDropdown
                                    :list-item="orgs"
                                    typeField="with-icon"
                                    v-model="orgChoose"
                                    placeholder="Chọn tổ chức"
                                />
                            </div>
                            <div class="username-login login-input">
                                <QLTSInput
                                    placeholder="Mật khẩu"
                                    :type="typePassword"
                                    :hasPassword="true"
                                    :is-required="true"
                                    v-model="data.Password"
                                />
                            </div>
                            <div class="username-login login-input">
                                <QLTSInput
                                    placeholder="Nhập lại mật khẩu"
                                    :type="typeConfirmPassword"
                                    :hasPassword="true"
                                    :is-required="true"
                                    v-model="data.ConfirmPassword"
                                />
                            </div>
                        </div>
                        <div class="register-action">
                            <QLTSButton type="primary" @click="handleRegister"
                                >Đăng ký</QLTSButton
                            >
                            <div>
                                Bạn đã có tài khoản?
                                <a
                                    class="button-login"
                                    @click="() => route.push('dang-nhap')"
                                >
                                    Đăng nhập
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="loading">
        <div class="loading-icon"></div>
    </div>
    <QLTSDialog v-if="isShowWarning">
        <div v-html="messageDialog"></div>
    </QLTSDialog>
    <div class="toast-message-wrapper">
        <TransitionGroup name="toast">
            <div
                v-for="(toastMessage, index) in listToastMsg"
                :key="toastMessage.content"
            >
                <QLTSToastmsg
                    v-if="toastMessage.isShow"
                    :type="toastMessage.type"
                    :content="toastMessage.content"
                    @closeToastMessage="closeToastMessage(index)"
                />
            </div>
        </TransitionGroup>
    </div>
</template>

<script setup>
import { reactive, ref, onMounted, onBeforeMount, computed } from "vue";
import QLTSDialog from "@/components/dialog/QLTSDialog.vue";
import QLTSToastmsg from "@/components/toast/QLTSToastmsg.vue";
import PageTitle from "@/assets/image/page-title.webp";
import LoginImage from "@/assets/image/Login-minhhoa.webp";
import QLTSInput from "@/components/input/QLTSInput.vue";
import QLTSButton from "@/components/button/QLTSButton.vue";
import route from "@/router/router";
import { register } from "@/apis/registerApis";
import { getAllOrgs } from "@/apis/orgApis";
import QLTSDropdown from "@/components/dropdown/QLTSDropdown.vue";

const messageDialog = ref("");
const listToastMsg = ref([]);
const isShowWarning = ref(false);
const typePassword = ref("password");
const typeConfirmPassword = ref("password");
const orgs = ref([]);
const listOrgs = ref([]);
const orgChooseItem = ref("");
const orgChoose = computed({
    get: () => orgChooseItem.value,
    set: (value) => {
        console.log("set", value);
        orgChooseItem.value = value;
    },
});
const data = reactive({
    UserName: "",
    Password: "",
    ConfirmPassword: "",
    Email: "",
    OrgId: "",
});

onBeforeMount(async () => {
    try {
        console.log("register");
        await getOrgs();
        console.log(orgs.value);
    } catch (error) {}
});

/**
 * Ẩn toast message
 * Author: TTNham (01/08/2023)
 */
function closeToastMessage(index) {
    listToastMsg.value.splice(index, 1);
}

async function handleRegister() {
    try {
        data.OrgId = listOrgs.value.find(
            (item) => item.OrgCode === orgChooseItem.value.split(" - ")[0]
        ).OrgId;
        console.log(data);
        const res = await register(data);
        route.push("/dang-nhap");
        console.log(res);
    } catch (error) {
        console.error("Lỗi khi đăng ký:", error);
    }
}

const getOrgs = async () => {
    const res = await getAllOrgs();
    listOrgs.value = res;
    orgs.value = res.map((item) => {
        return `${item.OrgCode} - ${item.OrgName}`;
    });
};
</script>

<style scoped>
@import url("./Register.scss");
</style>
