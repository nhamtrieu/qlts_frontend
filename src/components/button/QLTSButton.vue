<template>
    <template v-if="type === 'icon'">
        <div class="btn--icon" :title="props.title">
            <slot></slot>
        </div>
    </template>

    <template v-else>
        <div
            :class="[
                'btn',
                'btn--' + props.type,
                { 'disable-btn': isDisabled },
            ]"
        >
            <slot> </slot>
            <div v-if="props.isIcon" class="btn--primary-icon">
                <slot name="icon"></slot>
            </div>
        </div>
    </template>
</template>

<script setup>
const props = defineProps({
    type: {
        type: String,
        buttonType(value) {
            ["primary", "icon", "secondary", "cancel"].include(value);
        },
    },
    title: {
        type: String,
    },
    isIcon: {
        default: false,
    },
    isDisabled: {
        type: Boolean,
        default: false,
    },
});
</script>
<style scoped>
@import url("./button.css");
</style>
