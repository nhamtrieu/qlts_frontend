<template>
    <h1>Thông tin tổ chức</h1>
    <h2>Danh sách thành viên</h2>
    <div class="list-card__item">
        <div
            @click="() => handleEditUser(item)"
            class="card__item"
            v-for="(item, index) in orgInfo"
        >
            <CardUser :info="item" :key="index" />
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useStore } from "vuex";
import { jwtDecode } from "jwt-decode";
import emitter from "tiny-emitter/instance";

import { getOrgInfoByUserId } from "@/apis/userApis";
import { getUserInfoByOrgId } from "@/apis/orgApis";
import CardUser from "./CardUser.vue";

const store = useStore();
const dataDecode = jwtDecode(store.getters.token);

const orgInfo = ref([]);
onMounted(async () => {
    const org = await getOrgInfoByUserId(dataDecode.userId);
    const data = await getUserInfoByOrgId(org.OrgId);
    orgInfo.value = data;
});

const handleEditUser = (user) => {
    emitter.emit("editUser", user);
};
</script>
<style scoped>
@import url("./OrgInfo.scss");
</style>
