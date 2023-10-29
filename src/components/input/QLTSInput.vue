<template>
    <template v-if="props.typeField === 'with-icon'">
        <div class="textfield--with-icon">
            <input
                ref="input"
                :readonly="isReadonly"
                :class="['input', { 'input--with-icon-left': isIconLeft }]"
                type="text"
                name=""
                :placeholder="placeholder"
                :value="modelValue"
                @input="onInput($event.target.value)"
            />
            <div v-if="isIconLeft" class="textfield__icon">
                <QLTSIcon :type="typeIcon" :icon="icon" />
            </div>
            <div
                v-if="isDropdown"
                class="textfield--dropdown-icon"
                style="margin-left: 4px"
            >
                <QLTSIcon type="box-8" icon="caret-down" />
            </div>
        </div>
    </template>
    <template v-else>
        <div
            :class="[
                'textfield-container',
                { 'textfield--number': isNumber },
                { 'textfield-container--required': isRequired },
                { 'textfield--dropdown': isDropdown },
            ]"
            @keydown="onKeyDown($event)"
        >
            <label for="" @click="onFocus"> {{ label }} </label>

            <input
                v-if="!isDropdown"
                ref="input"
                :tabindex="tabindex"
                :value="props.modelValue"
                @input="onInput($event.target.value)"
                @focus="highlightText"
                :disabled="isDisabled"
                :type="type"
                name=""
                :class="[
                    'input',
                    { 'input--number': isNumber },
                    { 'right-text': isRightText },
                    classInput,
                    errorMsgValue == '' ? '' : 'input--error',
                ]"
                :placeholder="placeholder"
                :readonly="isReadonly"
                :step="step"
                @blur="onBlur"
                @keypress="onKeypress($event)"
            />
            <!-- <div
                v-if="isShowPassword && type === 'password'"
                class="textfield--password-icon"
            >
                <QLTSIcon type="box" icon="password" />
            </div>
            <div v-else-if="isShowPassword && type === 'password'">
                <QLTSIcon type="box" icon="show-password" />
            </div> -->

            <div
                v-if="hasPassword"
                class="textfield--password-icon"
                @click="emit('togglePassword')"
            >
                <QLTSIcon v-if="isShowPassword" type="box" icon="password" />
                <QLTSIcon v-else type="box" icon="show-password" />
            </div>

            <div v-if="errorMsgValue !== ''" class="textfield__msg">
                {{ errorMsgValue }}
            </div>
            <template v-if="isNumber">
                <div class="textfield--number-icon">
                    <QLTSIcon @click="increment" type="box-8" icon="caret-up" />
                    <QLTSIcon
                        @click="decrement"
                        type="box-8"
                        icon="caret-down"
                    />
                </div>
            </template>
            <div v-if="isDropdown" class="textfield--dropdown-icon">
                <QLTSIcon type="box-8" icon="caret-down" />
            </div>
        </div>
    </template>
</template>

<script setup>
import { ref, onUpdated } from "vue";
import format from "@/helper/format";
import QLTSIcon from "../icon/QLTSIcon.vue";

const props = defineProps({
    typeField: {
        type: String,
        validator(val) {
            return ["with-icon"].includes(val);
        },
    },
    // Type của input
    type: {},
    typeIcon: {
        type: String,
        validator(value) {
            return ["box", "box-8", "full"].includes(value);
        },
    },
    icon: {},
    // placeholder của input
    placeholder: {},
    // label của text field
    label: {},
    isReadonly: { default: false },
    isNumber: { default: false },
    isRequired: { default: false },
    isDropdown: { default: false },
    errorMsg: {
        type: String,
        default: "",
    },
    isDisabled: { default: false },
    isRightText: { default: false },
    isIconLeft: { default: false },
    classInput: {},
    modelValue: {},
    tabindex: {},
    step: {
        type: Number,
        default: 1,
    },
    isFormatNumber: { default: false },
    // Độ dài tối đa được nhập vào
    maxLength: {
        default: 255,
    },
    isShowPassword: {
        default: false,
    },
    hasPassword: {
        default: false,
    },
});

const emit = defineEmits([
    "update:modelValue",
    "showDropdown",
    "update:errorMsg",
    "togglePassword",
]);

const input = ref(null);
const value = ref("");
const errorMsgValue = ref("");

onUpdated(() => {
    value.value = props.modelValue;
    if (!props.isDropdown) {
        if (value.value !== "") {
            errorMsgValue.value = "";
        } else {
            emit("update:errorMsg");
            errorMsgValue.value = props.errorMsg;
        }
    }
});

/**
 * Focus vào ô input
 * Author: TTNham (31/07/2023)
 */
const onFocus = () => {
    input.value.focus();
};

/**
 * Xử lý khi input vào ô số
 * Author: TTNham (03/08/2023)
 */
const onInput = (value) => {
    if (value.length <= props.maxLength) {
        // Kiểm tra nếu độ dài không vượt quá maxLength
        if (props.isFormatNumber) {
            if (value.includes(",")) {
                value = format.unFomatMoney(value);
                value = format.formatMoney(value);
            } else {
                value = format.unFomatMoney(value);
                value = format.formatMoney(value);
            }
        }
        emit("update:modelValue", value);
    } else {
        emit("update:modelValue", value.slice(0, props.maxLength));
        errorMsgValue.value = " 123";
    }
};

/**
 * Xử lý khi blur
 * Author: TTNham (04/08/2023)
 */
function onBlur() {
    if (props.isRequired) {
        if (props.modelValue === "") emit("update:errorMsg");
    }
}

/**
 * Xử lý khi người dùng nhập vào ô input
 * Author: TTNham(04/08/2023)
 */
const onKeypress = (event) => {
    if (props.isFormatNumber) {
        const keyCode = event.keyCode;
        if ((keyCode < 48 || keyCode > 57) && keyCode !== 8) {
            event.preventDefault();
        }
    }
};

/**
 * Xử lý khi người dùng ân mũi tên lên, xuống từ bàn phím
 * @param {*} event
 */
const onKeyDown = (event) => {
    if (event.key === "ArrowUp") increment();
    if (event.key === "ArrowDown") decrement();
    if (event.key === "Enter" && props.type == "date") input.value.showPicker();
};

/**
 * Tăng giá trị
 * Author: TTNham (02/08/2023)
 */
function increment() {
    let result = format.unFomatMoney(props.modelValue) + props.step;
    if (Number.isInteger(props.step)) Math.round(result);
    else result = result.toFixed(2);
    emit("update:modelValue", format.formatMoney(result));
}
/**
 * Giảm giá trị
 * Author: TTNham (02/08/2023)
 */
function decrement() {
    let result = format.unFomatMoney(props.modelValue) - props.step;
    if (Number.isInteger(props.step)) Math.round(result);
    else result = result.toFixed(2);
    if (result < 1) return;
    emit("update:modelValue", format.formatMoney(result));
}

/**
 * Bôi đen text khi focus
 * Author: TTNham (03/08/2023)
 */
function highlightText() {
    input.value.select();
}

function isError() {
    return errorMsgValue.value !== "";
}

/**
 * Expose sự kiện
 * Author: TTNham (31/07/2023)
 */
defineExpose({ onFocus, isError });
</script>

<style scoped>
@import url("./input.css");

.pagination__record .textfield--dropdown-icon {
    top: 11px;
}

input:disabled:hover {
    border: 1px solid var(--color-border-default) !important;
}
</style>
