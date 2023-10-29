<template>
    <div
        :class="[
            'icon-' + type,
            'icon--' + icon,
            { 'disabled-icon': isDisabled },
        ]"
    ></div>
</template>

<script setup>
defineProps({
    type: {
        type: String,
        required: true,
        validator(value) {
            return ["box", "box-8", "full"].includes(value);
        },
    },
    icon: {
        type: String,
        required: true,
    },
    isDisabled: {
        type: Boolean,
        default: false,
    },
});
</script>

<style scoped>
@import url("./icon.css");
</style>
