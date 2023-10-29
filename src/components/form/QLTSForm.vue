<template>
    <form
        ref="form"
        id="form-asset"
        :style="{ width: props.width, 'z-index': props.overlayIndex + 1 }"
        @keydown="onKeydownForm($event)"
    >
        <div class="form-container">
            <div class="form-header">
                <div class="form-header__left">
                    <div class="form-title">
                        {{ props.label }}
                    </div>
                </div>

                <div class="form-header__right">
                    <QLTSIcon
                        tabindex="99"
                        @click="$emit('closeForm')"
                        @keydown="onKeydownClose($event)"
                        type="box"
                        :title="QLTSResource.Tooltips.CloseHotKey"
                        icon="close"
                    >
                    </QLTSIcon>
                </div>
            </div>

            <div
                :class="[
                    'form-main',
                    { 'form-main--increase': type == 'increase' },
                ]"
            >
                <slot> </slot>
            </div>
        </div>
        <div class="form-action">
            <div class="form-action__right">
                <QLTSButton
                    tabindex="1"
                    typeBtn="cancel"
                    @click="$emit('cancel')"
                    @keydown.enter.prevent="$emit('cancel')"
                >
                    {{ $_resource.Button.Cancel }}
                </QLTSButton>
                <QLTSButton
                    tabindex="1"
                    typeBtn="primary"
                    @click="submitForm"
                    @keydown.enter.prevent="submitForm"
                    :title="QLTSResource.Tooltips.SaveHotKey"
                >
                    {{ $_resource.Button.Save }}
                </QLTSButton>
            </div>
        </div>
    </form>
</template>

<script setup>
import { ref, onMounted } from "vue";

const props = defineProps({
    label: {
        type: String,
        default: "",
    },
    type: {
        type: String,
        default: "",
        validator(value) {
            return ["increase", ""].includes(value);
        },
    },
    width: {
        type: String,
        default: "900px",
    },
    overlayIndex: {
        type: Number,
        default: 2,
    },
});
</script>
<style scoped></style>
