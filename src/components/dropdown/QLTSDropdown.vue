<template>
    <div
        @click="onToggleDropdown"
        v-on-click-outside="closeDropDown"
        :class="
            type.includes('form') == true ? 'dropdown-container' : 'dropdown'
        "
    >
        <template v-if="type === 'dropdown-form'">
            <QLTSInput
                ref="input"
                v-bind="$attrs"
                type="text"
                :isDropdown="true"
                :modelValue="modelValue"
                :isDisabled="isReadonly"
            />

            <div v-if="isShow" class="dropdown__list">
                <div
                    v-for="(item, index) in listItem"
                    :key="index"
                    :class="[
                        'dropdown__list-item',
                        {
                            'dropdown__list-item--selected':
                                item === selectedItem,
                        },
                    ]"
                    @click="onSelectedItem(item)"
                >
                    <div
                        v-if="props.isIconCheck"
                        style="color: #000"
                        class="dropdown__list-item-icon icon-box"
                    >
                        <QLTSIcon
                            v-if="item === selectedItem"
                            icon="check"
                            type="full"
                        />
                    </div>
                    <div class="dropdown__list-item-content">{{ item }}</div>
                </div>
            </div>
        </template>

        <template v-else>
            <QLTSInput
                ref="input"
                v-bind="$attrs"
                :isDropdown="true"
                :isReadonly="true"
                typeIcon="box"
                :modelValue="modelValue"
                :placeholder="placeholder"
            />
            <div v-if="isShow" class="dropdown__list">
                <div
                    v-for="(item, index) in listItem"
                    :key="index"
                    :class="[
                        'dropdown__list-item',
                        {
                            'dropdown__list-item--selected':
                                item === selectedItem,
                        },
                    ]"
                    @click="onSelectedItem(item)"
                >
                    <div
                        v-if="props.isIconCheck"
                        style="color: #000"
                        class="dropdown__list-item-icon icon-box"
                    >
                        <QLTSIcon
                            v-if="item === selectedItem"
                            icon="check"
                            type="full"
                        />
                    </div>
                    <div class="dropdown__list-item-content">{{ item }}</div>
                </div>
            </div>
        </template>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { vOnClickOutside } from "@vueuse/components";

import QLTSInput from "../input/QLTSInput.vue";
import QLTSIcon from "../icon/QLTSIcon.vue";

const props = defineProps({
    isIconCheck: {
        default: true,
    },
    placeholder: {
        default: "",
    },
    type: {
        default: "",
        validator(value) {
            return ["dropdown-form", ""].includes(value);
        },
    },
    value: {},
    modelValue: {},
    listItem: {
        default: [],
    },
    isReadonly: {
        default: false,
    },
});

const emit = defineEmits("");

// Ngăn chặn kế thừa thuộc tính của phần tử root
defineOptions({
    inheritAttrs: false,
});

let selectedItem = "";
const isShow = ref(false);

const defaultValue = ref();
onMounted(() => {
    defaultValue.value = props.modelValue;
    selectedItem = props.modelValue;
});

/**
 * Hiển thị dropdown
 * Author: TTNham (30/7/2023)
 */
const onToggleDropdown = () => {
    isShow.value = !isShow.value;
};
/**
 * Ẩn dropdown list
 * Author: TTNham (31/7/2023)
 */
const closeDropDown = () => {
    isShow.value = false;
};

/**
 * Seleted item
 * Author: TTNham (1/8/2023)
 * @param {*} itemSelected
 */
function onSelectedItem(itemSelected) {
    if (selectedItem === itemSelected) {
        selectedItem = defaultValue.value;
    } else {
        selectedItem = itemSelected;
    }
    emit("update:modelValue", selectedItem);
}
</script>

<style scoped>
@import url("./dropdown.css");
</style>
