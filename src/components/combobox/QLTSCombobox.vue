<template>
    <div :class="type.includes('form') ? 'dropdown-container' : 'dropdown'">
        <template v-if="props.type === 'combobox-form'">
            <div
                class="dropdown-container"
                :class="{ 'login-input': isLoginInput }"
            >
                <div
                    class="textfield-container textfield-container--required textfield--dropdown"
                >
                    <label for="" @click="onFocus">{{ label }}</label>
                    <input
                        ref="input"
                        v-bind="$attrs"
                        type="text"
                        name=""
                        :class="[
                            'input',
                            errorMessageValue === '' ? '' : 'input--error',
                        ]"
                        :value="modelValue"
                        @click="onToggleDropdown"
                        v-on-click-outside="closeDropDown"
                        @blur="onBlur"
                        @input="onInput($event.target.value)"
                        @keydown="onKeypress($event)"
                        :disabled="isDisabled"
                    />
                    <div v-if="errorMessageValue !== ''" class="textfield__msg">
                        {{ errorMessageValue }}
                    </div>
                    <div class="textfield--dropdown-icon">
                        <div class="icon-box-8 icon--caret-down"></div>
                    </div>
                </div>
            </div>

            <div v-if="isShow" class="combobox__list">
                <div class="combobox__table">
                    <table>
                        <thead>
                            <tr>
                                <th
                                    :style="'width:' + item.size + '%'"
                                    v-for="(item, index) in fieldList"
                                    :key="index"
                                >
                                    {{ item.value }}
                                </th>
                            </tr>
                        </thead>
                        <tbody @keypress="onKeypress($event)">
                            <tr
                                :class="[
                                    item[0] === selectedItem ? 'selected' : '',
                                    index === selectedIndex ? 'focus' : '',
                                ]"
                                v-for="(item, index) in filterList"
                                :key="index"
                                @click="onSelectedItem(item)"
                                ref="activeItemRef"
                            >
                                <td>{{ item[0] }}</td>
                                <td>{{ item[1] }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </template>
    </div>
</template>

<script setup>
import { ref, onUpdated, onMounted } from "vue";
import { vOnClickOutside } from "@vueuse/components";

const props = defineProps({
    type: {
        default: "",
        typeCombobox(type) {
            return ["combobox-form"].includes(type);
        },
    },
    modelValue: {},
    listItem: {
        default: [],
    },
    fieldList: {},
    label: {},
    errorMsg: {
        default: "",
    },
    isLoginInput: { default: false },
    isDisabled: {
        type: Boolean,
        default: false,
    },
});
const emit = defineEmits("");
let selectedItem = "";
const isShow = ref(false);
const input = ref();
let filterList = ref(props.listItem);
const errorMessageValue = ref("");
const selectedIndex = ref(-1);
const activeItemRef = ref();

// Ngăn chặn kế thừa thuộc tính của phần tử root
defineOptions({
    inheritAttrs: false,
});

onMounted(() => {
    selectedIndex.value = 0;
});

//
onUpdated(() => {
    props.modelValue === ""
        ? (errorMessageValue.value = props.errorMsg)
        : (errorMessageValue.value = "");
    selectedItem = props.modelValue;
});

/**
 * Hiển thị dropdown
 * Author: TTNham (01/08/2023)
 */
const onToggleDropdown = () => {
    isShow.value = !isShow.value;
    filterList.value = props.listItem;
};
/**
 * Ẩn dropdown list
 * Author: TTNham (02/08/2023)
 */
const closeDropDown = () => {
    isShow.value = false;
    selectedIndex.value = -1;
};

/**
 * xử lý chọn item combobox
 * Author: TTNham (02/08/2023)
 * @param {*} itemSelected
 */
const onSelectedItem = (itemSelected) => {
    selectedItem = itemSelected[0];
    emit("selected", itemSelected);
    emit("update:modelValue", selectedItem);
};

/**
 * Lọc ra các trường giống với chữ cái khi người dùng nhập vào
 * Author: TTNham (02/08/2023)
 */
const onInput = (value) => {
    emit("update:modelValue", value);
    isShow.value = true;
    selectedIndex.value = 0;
    if (props.listItem.length <= 0) return;
    filterList.value = props.listItem.filter((item) => {
        return item[0].toLowerCase().startsWith(value.toLowerCase());
    });
};

/**
 * Xử lý khi click vào ô input
 * Author: TTNHAM (02/08/2023)
 */
const onFocus = () => {
    input.value.focus();
};

/**
 * Xử lý khi blur ra ngoài item
 * Author: TTNham (03/08/2023)
 */
const onBlur = () => {
    if (props.modelValue === "" && selectedItem === "") {
        setTimeout(() => {
            emit("update:errorMsg");
        }, 400);
    }
};

/**
 * Xử lỹ khi nhấn bàn phím
 * Author: TTNham (10/08/2023)
 * @param {*} e
 */
const onKeypress = (e) => {
    if (!isShow.value) return;
    switch (e.key) {
        case "ArrowUp":
            e.preventDefault();
            selectedIndex.value =
                (selectedIndex.value - 1 + filterList.value.length) %
                filterList.value.length;
            selectedItem = filterList.value[selectedIndex.value];
            onSelectedItem(selectedItem);
            activeItemRef.value[
                selectedIndex.value > -1 ? selectedIndex.value : 0
            ].scrollIntoView({
                block: "center",
                inline: "nearest",
                behavior: "smooth",
            });

            break;
        case "ArrowDown":
            e.preventDefault();
            selectedIndex.value =
                (selectedIndex.value + 1) % filterList.value.length;
            selectedItem = filterList.value[selectedIndex.value];
            onSelectedItem(selectedItem);
            activeItemRef.value[
                selectedIndex.value > -1 ? selectedIndex.value : 0
            ].scrollIntoView({
                block: "center",
                inline: "nearest",
                behavior: "smooth",
            });

            break;
        case "Enter":
            isShow.value = !isShow.value;
            if (
                filterList.value.length > 0 &&
                selectedIndex.value >= 0 &&
                selectedIndex.value <= filterList.value.length
            ) {
                const selectedItem = filterList.value[selectedIndex.value];
                onSelectedItem(selectedItem);
                selectedIndex.value = -1;
            }
            break;
        default:
            break;
    }
};

/**
 * Kiểm tra có lỗi hay không
 */
function isError() {
    return errorMessageValue.value !== "";
}

defineExpose({ isError });
</script>

<style scoped>
@import url("./combobox.css");
</style>
