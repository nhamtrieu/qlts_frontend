<template>
    <div class="manage-container">
        <div class="manage-org">
            <div class="user-info">
                <Info :dataDecode="{ ...dataDecode }" />
            </div>
            <div class="org-info">
                <OrgInfo />
            </div>
        </div>
        <div v-if="isShowFormInfo" class="form-edit-user">
            <FormInfo
                :user="user"
                @closeFormInfo="closeFormInfo"
                :role="role"
            />
        </div>
    </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import { useStore } from "vuex";
import emmiter from "tiny-emitter/instance";
import { jwtDecode } from "jwt-decode";

import Info from "./Info.vue";
import OrgInfo from "./OrgInfo.vue";
import FormInfo from "./FormInfo.vue";
import { getUserRole } from "@/apis/userApis";

const store = useStore();
const dataDecode = jwtDecode(store.getters.token);
console.log(dataDecode);
const role = ref("");
const isManage = ref(window.location.pathname.includes("quan-ly"));
const user = ref({});
const isShowFormInfo = ref(false);

onMounted(async () => {
    emmiter.emit("isManage", isManage.value);
    role.value = (await getUserRole(dataDecode.userId)).RoleName;
    emmiter.on("editUser", (data) => {
        user.value = data;
        isShowFormInfo.value = true;
        console.log("user", user.value);
    });
});

onUnmounted(() => {
    emmiter.off("isManage");
    emmiter.off("editUser");
});

const closeFormInfo = () => {
    isShowFormInfo.value = false;
};
</script>

<style scoped>
@import url("./Manage.scss");
</style>
