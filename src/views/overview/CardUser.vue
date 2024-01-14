<template>
    <div>
        <span>Ho va ten: </span>
        <span>{{ info.FullName }}</span>
    </div>
    <div>
        <span>Email: </span>
        <span>{{ info.Email }}</span>
    </div>
    <div>
        <span>So dien thoai: </span>
        <span>{{ info.PhoneNumber || "Trong" }}</span>
    </div>
    <div>
        <span>Vai tro: </span>
        <span>{{ info.RoleName || "User" }}</span>
    </div>
</template>

<script setup>
const props = defineProps({
    info: {
        type: Object,
        required: true,
    },
});
</script>

<style scoped></style>
