<template>
    <div v-if="isShow" class="contextmenu" ref="contextMenu">
        <div
            class="menu-item"
            @click="showAssetForm"
            ref="refFocus"
            tabindex="0"
            v-if="props.type === QLTSEnum.ContextMenuType.Asset"
        >
            Thêm
        </div>
        <div class="menu-item" @click="showFormEdit">Sửa</div>
        <div class="menu-item" @click="deleteItem">Xoá</div>
        <div
            class="menu-item"
            @click="showFormDuplicate"
            v-if="props.type === QLTSEnum.ContextMenuType.Asset"
        >
            Nhân bản
        </div>
    </div>
</template>

<script setup>
import { ref, inject, nextTick, onMounted } from "vue";
import emitter from "tiny-emitter/instance";

import QLTSEnum from "../../helper/enum";
import QLTSResource from "../../helper/resource";
import { getIncreaseByListAsset } from "@/apis/assetApis";

import { increaseCode } from "@/helper/helper";

const props = defineProps({
    item: {
        type: Object,
        default: null,
    },
    type: {
        type: Number,
        default: 1,
    },
});

const isShow = ref(false);
const contextMenu = ref(null);
const refFocus = ref(null);
const showForm = inject("showForm");
const duplicateAsset = ref(null);

onMounted(() => {
    if (refFocus.value) {
        refFocus.value.focus();
    }
});
/**
 * hiển thị context menu
 * Author: TTNham (01/09/2023)
 */
function showContextMenu(e) {
    isShow.value = true;
    e.preventDefault();
    nextTick(() => {
        contextMenu.value.style.top = `${e.clientY}px`;
        contextMenu.value.style.left = `${e.clientX}px`;
        if (e.clientY + contextMenu.value.offsetHeight > window.innerHeight) {
            contextMenu.value.style.top = `${
                e.clientY - contextMenu.value.offsetHeight
            }px`;
        }
        if (e.clientX + contextMenu.value.offsetWidth > window.innerWidth) {
            contextMenu.value.style.left = `${
                e.clientX - contextMenu.value.offsetWidth
            }px`;
        }
    });
}

/**
 * Hiển thị form thêm tài sản
 * Author: TTNham (01/09/2023)
 */
function showAssetForm() {
    isShow.value = false;
    showForm(true, QLTSEnum.Form.Add);
}

/**
 * Hiển thị dialog xác nhận xoá tài sản
 * Author: TTNham (01/09/2023)
 */
function deleteItem() {
    isShow.value = false;
    let msg = "";
    if (props.type === QLTSEnum.ContextMenuType.Asset) {
        msg +=
            QLTSResource.Message.ConfirmDeleteOne +
            "<b>" +
            props.item.AssetCode +
            " - " +
            props.item.AssetName +
            "</b><span>?</span>";
        emitter.emit("showDialogDelete", msg);
    } else if (props.type === QLTSEnum.ContextMenuType.Increase) {
        msg +=
            QLTSResource.Message.ConfirmDeleteIncrease +
            "<b>" +
            props.item.IncreaseCode +
            "</b><span>?</span>";
        emitter.emit("showDialogDelete", msg);
    }
}

/**
 * Hiển thị form sửa tài sản
 * Author: TTNham (01/09/2023)
 */
async function showFormEdit() {
    if (props.type === QLTSEnum.ContextMenuType.Asset) {
        isShow.value = false;
        const listIncrease = await getIncreaseByListAsset([props.item.AssetId]);
        emitter.emit("showFormEdit", props.item, listIncrease.length < 1);
    } else {
        isShow.value = false;
        emitter.emit("showIncreaseEdit", props.item);
    }
}

function showFormDuplicate() {
    isShow.value = false;
    duplicateAsset.value = {
        ...props.item,
        AssetCode: increaseCode(props.item.AssetCode),
    };
    emitter.emit("showFormDuplicate", duplicateAsset.value);
}
/**
 * Ẩn context menu
 * Author: TTNham (01/09/2023)
 */
function closeContextMenu() {
    isShow.value = false;
}

defineExpose({
    showContextMenu,
    closeContextMenu,
});
</script>
<style scoped>
@import url("./contextmenu.css");
</style>
