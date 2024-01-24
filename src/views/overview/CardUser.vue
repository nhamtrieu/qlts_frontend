<template>
    <div>
        <span>Ho va ten: </span>
        <span>{{ props.info.FullName }}</span>
    </div>
    <div>
        <span>Email: </span>
        <span>{{ props.info.Email }}</span>
    </div>
    <div>
        <span>So dien thoai: </span>
        <span>{{ props.info.PhoneNumber }}</span>
    </div>
    <div>
        <span>Vai tro: </span>
        <span>{{ role.RoleName || "User" }}</span>
    </div>
</template>

<script setup>
import { getUserRole } from "@/apis/userApis";
import { onMounted, reactive, ref } from "vue";
import emitter from "tiny-emitter/instance";

const props = defineProps({
    info: {
        type: Object,
        required: true,
    },
});
const role = reactive({
    RoleName: "",
});
const getRole = async () => {
    role.RoleName = (await getUserRole(props.info.UserId)).RoleName;
};
onMounted(async () => {
    getRole();
    emitter.on("editUser", () => {
        getRole();
    });
});
</script>

<style scoped></style>
