<template>
    <div>
        <div class="overlay overlay--dialog"></div>
        <div class="dialog-container">
            <div class="dialog">
                <div class="dialog__body">
                    <div class="dialog__body-icon">
                        <QLTSIcon type="full" icon="warning" />
                    </div>
                    <div class="dialog__body-des">
                        <div v-html="content"></div>
                        <slot></slot>
                    </div>
                </div>
                <div class="dialog__btn">
                    <template v-if="props.type === 'error'">
                        <QLTSButton
                            type="primary"
                            @click="$emit('hideDialogError')"
                            @keydown.enter="$emit('hideDialogError')"
                            ref="refButtonFocus"
                            tabindex="0"
                        >
                            {{ resource.Button.Close }}</QLTSButton
                        >
                    </template>

                    <template v-if="props.type === 'edit'">
                        <QLTSButton
                            type="cancel"
                            @click="$emit('hideDialogError')"
                            tabindex="0"
                            @keydown.enter="$emit('hideDialogError')"
                            ref="refButton"
                        >
                            {{ resource.Button.Cancel }}</QLTSButton
                        >
                        <QLTSButton
                            type="secondary"
                            @click="$emit('hideForm')"
                            tabindex="0"
                            @keydown.enter="$emit('hideForm')"
                            ref="refButton"
                        >
                            {{ resource.Button.DontSave }}</QLTSButton
                        >
                        <QLTSButton
                            type="primary"
                            @click="$emit('submitForm')"
                            ref="refButtonFocus"
                            tabindex="0"
                            @keydown.enter="$emit('submitForm')"
                        >
                            {{ resource.Button.Save }}</QLTSButton
                        >
                    </template>

                    <template v-if="props.type === 'delete'">
                        <QLTSButton
                            type="cancel"
                            @click="$emit('hideDialogError')"
                            @keydown.enter="$emit('hideDialogError')"
                            ref="refButton"
                            tabindex="0"
                        >
                            {{ resource.Button.No }}</QLTSButton
                        >
                        <QLTSButton
                            type="primary"
                            @click="$emit('deleteRecords')"
                            ref="refButtonFocus"
                            @keydown.enter="$emit('deleteRecords')"
                            tabindex="0"
                        >
                            {{ resource.Button.Delete }}</QLTSButton
                        >
                    </template>

                    <template
                        v-if="
                            props.type === 'add' || props.type === 'duplicate'
                        "
                    >
                        <QLTSButton
                            type="cancel"
                            @click="$emit('hideDialogError')"
                            ref="refButtonFocus"
                            @keydown.enter="$emit('hideDialogError')"
                            tabindex="0"
                        >
                            {{ resource.Button.No }}</QLTSButton
                        >
                        <QLTSButton
                            type="primary"
                            @click="$emit('hideForm')"
                            @keydown.enter="$emit('hideForm')"
                            ref="refButton"
                            tabindex="0"
                        >
                            {{ resource.Button.Cancel }}</QLTSButton
                        >
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import QLTSButton from "../button/QLTSButton.vue";
import QLTSIcon from "../icon/QLTSIcon.vue";

import resource from "@/helper/resource";

const props = defineProps({
    type: {
        typeDialog(type) {
            return ["add", "edit", "delete", "error", "duplicate"].includes(
                type
            );
        },
    },
    content: {
        type: String,
        default: "",
    },
});
</script>

<style scoped>
@import url("./dialog.css");
</style>
