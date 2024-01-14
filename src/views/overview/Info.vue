<template>
    <div class="user-info-container">
        <h1 class="user-info__title">Thông tin tài khoản</h1>
        <div class="user-info">
            <div class="user-info__detail">
                <div class="left">
                    <div class="name">Họ và tên</div>
                    <div class="email">Email</div>
                    <div class="phone">Số điện thoại</div>
                    <div class="role">Quyền</div>
                </div>
                <div class="right">
                    <div class="name">{{ dataUser.FullName }}</div>
                    <div class="email">{{ dataUser.Email }}</div>
                    <div class="phone">{{ dataUser.PhoneNumber }}</div>
                    <div class="role">{{ userRole.RoleName }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getUserInfo, getUserRole } from "@/apis/userApis";

const dataUser = ref({});
const userRole = ref({});
const props = defineProps({
    dataDecode: {
        type: Object,
        required: true,
    },
});
console.log("props", props);
onMounted(async () => {
    dataUser.value = await getUserInfo(props.dataDecode.userId);
    userRole.value = await getUserRole(props.dataDecode.userId);
    console.log("dataUser", dataUser);
});
</script>
<style scoped>
@import url("./Info.scss");
</style>
