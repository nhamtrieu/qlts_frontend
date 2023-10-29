<template>
    <div class="toast-message">
        <div class="toast-message__pseudo"></div>
        <div :class="['toast-msg', 'toast-msg--' + type]">
            <div class="toast-msg__left">
                <div class="toast-msg__icon">
                    <div :class="['icon-box', 'icon--' + type]"></div>
                </div>
                <div class="toast-mst__content">
                    <span class="toast-msg__bodytext">
                        {{ props.content }}</span
                    >
                </div>
            </div>
        </div>
        <div class="toast-message-icon-close">
            <QLTSIcon
                type="box"
                icon="close"
                @click="emit('closeToastMessage')"
            />
        </div>
    </div>
</template>

<script setup>
import QLTSIcon from "@/components/icon/QLTSIcon.vue";

const props = defineProps({
    type: {
        type: String,
        toastType(type) {
            return ["success", "error", "infor"].includes(type);
        },
    },
    content: {
        type: String,
    },
});

console.log(props.content);

const emit = defineEmits(["closeToastMessage"]);
</script>

<style scoped>
@import url("./toastmsg.css");
</style>
