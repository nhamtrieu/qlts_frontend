<template>
    <div :class="['header', props.isCollapsed ? 'collapse' : '']">
        <div class="main-header">
            <div v-if="isManage" class="header__title">Quản lý tổ chức</div>
            <div v-else class="header__title">Danh sách tài sản</div>

            <div class="header__action">
                <div class="heder__action-org">Sở tài chính</div>

                <QLTSInput
                    v-model="year"
                    type="number"
                    :isNumber="true"
                    :isRightText="true"
                    modelValue="2023"
                    label="Năm"
                    class="textfield--number-year"
                    classInput="input--number-year"
                />

                <div class="header__notify">
                    <QLTSIcon title="Thông báo" type="box" icon="notice" />
                </div>

                <div class="header__system">
                    <QLTSIcon type="box" icon="system" />
                </div>
                <div class="header__help">
                    <QLTSIcon type="box" icon="help" />
                </div>
                <div class="header__user">
                    <div class="header__user-avatar">
                        <QLTSIcon type="box" icon="user" />
                    </div>

                    <div class="header__user-action" @click="toogleAction">
                        <QLTSIcon type="box-8" icon="caret-down" />
                    </div>
                </div>
            </div>
        </div>
        <template v-if="isShowAction">
            <div class="header-menu-action">
                <QLTSButton
                    type="secondary"
                    title="Đăng xuất"
                    @click="handleLogout"
                    v-on-click-outside="hideAction"
                    style="color: red"
                    >Đăng xuất</QLTSButton
                >
            </div>
        </template>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useStore } from "vuex";
import emmiter from "tiny-emitter/instance";
import route from "@/router/router";
import { vOnClickOutside } from "@vueuse/components";

import QLTSInput from "../input/QLTSInput.vue";
import QLTSIcon from "../icon/QLTSIcon.vue";
import QLTSButton from "../button/QLTSButton.vue";

const store = useStore();
const isShowAction = ref(false);
const year = ref(2023);
const isManage = ref(false);

onMounted(() => {
    emmiter.on("isManage", (data) => {
        console.log(data);
        isManage.value = data;
    });
});

const handleLogout = () => {
    localStorage.setItem("qlts_token", "logout");
    store.dispatch("logout");
    route.push("/dang-nhap");
};

const hideAction = () => {
    isShowAction.value = false;
};

const toogleAction = () => {
    isShowAction.value = !isShowAction.value;
};

const props = defineProps({
    isCollapsed: {
        type: Boolean,
    },
    isManage: {
        type: Boolean,
    },
});
</script>

<style scoped>
@import url("../../css/header.css");
</style>
