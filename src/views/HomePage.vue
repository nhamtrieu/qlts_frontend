<template>
    <TheHeader :isCollapsed="store.getters.isCollapsed" />
    <TheSideBar @collapsed="onToggleCollapse" />
    <TheMain @showForm="onToggleForm" />
    <QLTSDialog
        v-if="isShowWarning"
        :type="typeDialog"
        @hideDialogError="hideDialogError"
        @hideForm="onToggleForm(false)"
        @deleteRecords="deleteRecords"
    >
        <div v-html="messageDialog"></div>
    </QLTSDialog>
    <AssetForm
        @closeForm="onToggleForm"
        v-if="isShowForm"
        @showWarning="showDialogError"
        @cancel="showWarningConfirm"
        @showToastMsg="showToastMsg"
        :typeForm="typeForm"
        :assetDuplicate="assetDuplicate"
        :assetEdit="assetEdit"
        ref="assetForm"
        :isEditedForm="isEditedForm"
    />
    <div class="toast-message-wrapper">
        <transition-group name="toast">
            <div
                v-for="(toastMessage, index) in listToastMsg"
                :key="toastMessage.content"
            >
                <QLTSToastmsg
                    v-if="toastMessage.isShow"
                    :type="toastMessage.type"
                    :content="toastMessage.content"
                    @closeToastMessage="closeToastMessage(index)"
                />
            </div>
        </transition-group>
    </div>
    <QLTSLoading v-if="store.getters.loading" />
</template>

<script setup>
import { ref, reactive, provide, onMounted, onUnmounted } from "vue";
import emitter from "tiny-emitter/instance";
import { useStore } from "vuex";
import route from "@/router/router";

import TheHeader from "@/components/layout/TheHeader.vue";
import TheSideBar from "@/components/layout/TheSidebar.vue";
import TheMain from "@/components/layout/TheMain.vue";
import QLTSDialog from "@/components/dialog/QLTSDialog.vue";
import AssetForm from "@/views/AssetForm.vue";
import QLTSToastmsg from "@/components/toast/QLTSToastmsg.vue";
import QLTSLoading from "@/components/loading/QLTSLoading.vue";
import QLTSEnum from "@/helper/enum";

import resource from "@/helper/resource";
import { refreshToken } from "@/apis/refreshTokenApi";

const isCollapsed = ref(false);
const typeDialog = ref();
const typeForm = ref("post");
const messageDialog = ref("");

const isShowForm = ref(false);
const assetEdit = ref(null);
const assetDuplicate = ref(null);
const assetForm = ref(null);
const isShowWarning = ref(false);
const toastMsg = reactive({
    message: "",
    type: "",
});
const listToastMsg = ref([]);
const isEditedForm = ref(true);

const store = useStore();

onMounted(async () => {
    const data = {
        token: store.getters.token,
        tokenExpiration: store.getters.tokenExpiration,
    };
    if (data.token) store.dispatch("login", data);

    if (store.getters.isLogin) {
        if (store.getters.isTokenValid) {
            route.push(resource.Link.Asset);
        } else {
            const response = await refreshToken();
            localStorage.setItem("qlts_token", response.data.accessToken);
            store.dispatch("refreshToken", response.data);
            route.push(resource.Link.Asset);
        }
    } else {
        route.push(resource.Link.Login);
    }
    emitter.on("showToastMsg", showToastMsg);
});

emitter.on("showDialogError", showDialogError);
emitter.on("showDialogConfirmDelete", showDialogConfirmDelete);
emitter.on("hideDialogError", hideDialogError);
emitter.on("hideForm", onToggleForm);
emitter.on("showFormEdit", (item, isEdited) => {
    console.log(isEdited);
    isShowForm.value = true;
    typeForm.value = QLTSEnum.Form.Edit;
    assetEdit.value = item;
    isEditedForm.value = isEdited === undefined ? true : false;
});

emitter.on("showFormDuplicate", (item) => {
    isShowForm.value = true;
    typeForm.value = QLTSEnum.Form.Duplicate;
    assetDuplicate.value = item;
});

onUnmounted(() => {
    emitter.off("showToastMsg");
    emitter.off("showDialogError");
    emitter.off("showDialogConfirmDelete");
    emitter.off("hideDialogError");
    emitter.off("hideForm");
    emitter.off("showFormEdit");
    emitter.off("showFormDuplicate");
});

/**
 * Toggle sidebar collapse để ẩn header
 * Author: TTNham (29/07/2023)
 */
const onToggleCollapse = (isSidebarCollapsed) => {
    isCollapsed.value = isSidebarCollapsed;
    store.dispatch("setCollapsed", isCollapsed.value);
};

/**
 * Ẩn hiện form thêm tài sản
 * Author: TTNham (29/07/2023)
 */
function onToggleForm(isShowAssetForm, type) {
    isShowForm.value = isShowAssetForm;
    typeForm.value = type;
    isShowWarning.value = false;
    typeDialog.value = QLTSEnum.Dialog.Add;
    assetEdit.value = null;
    assetDuplicate.value = null;
    isEditedForm.value = true;
}

/**
 * Ẩn cảnh báo
 * Author: TTNham (01/08/2023)
 */
function hideDialogError() {
    isShowWarning.value = false;

    if (assetForm.value) {
        assetForm.value.focusInputError();
    }
}

/**
 * Hiển thị cảnh báo
 * Author: TTNham (01/08/2023)
 * @param {*} errorMsg
 */
function showDialogError(errorMsg) {
    isShowWarning.value = true;
    typeDialog.value = QLTSEnum.Dialog.Error;
    messageDialog.value = errorMsg;
}

/**
 * Hiển dialog cảnh báo huỷ lưu hoặc huỷ sửa
 * Author: TTNham (01/08/2023)
 */
const showWarningConfirm = () => {
    isShowWarning.value = true;
    if (typeForm.value === QLTSEnum.Form.Add) {
        typeDialog.value = QLTSEnum.Dialog.Add;
        messageDialog.value = resource.Message.ConfirmCancelAddAsset;
    } else if (typeForm.value === QLTSEnum.Form.Edit) {
        messageDialog.value = resource.Message.ConfirmCancelEditAsset;
        typeDialog.value = QLTSEnum.Dialog.Edit;
    } else if (typeForm.value === QLTSEnum.Form.Duplicate) {
        typeDialog.value = QLTSEnum.Dialog.Duplicate;
        messageDialog.value = resource.Message.ConfirmCancelAddAsset;
    }
};

/**
 * Hiển thị toast message
 * Author: TTNham (01/08/2023)
 */
function showToastMsg(type, content) {
    console.log(type, content);
    toastMsg.isShow = true;
    toastMsg.type = type;
    toastMsg.content = content;
    listToastMsg.value.push({
        type: type,
        content: content,
        isShow: true,
    });
    setTimeout(() => {
        if (listToastMsg.value.length > 0) {
            listToastMsg.value.shift();
        }
    }, 3000);
}

/**
 * Ẩn toast message
 * Author: TTNham (01/08/2023)
 */
function closeToastMessage(index) {
    listToastMsg.value.splice(index, 1);
}

/**
 * Hiện dialog xác nhận xóa
 * @param {*} msg
 */
function showDialogConfirmDelete(msg) {
    isShowWarning.value = true;
    typeDialog.value = QLTSEnum.Dialog.Delete;
    messageDialog.value = msg;
}

const deleteRecords = () => {
    emitter.emit("deleteRecords");
};

provide("showForm", onToggleForm);
</script>

<style>
.toast-message-wrapper {
    position: absolute;
    top: 44px;
    left: 50%;
    transform: translateX(-50%);
    min-height: 56px;
    display: flex;
    flex-direction: column;
    column-gap: 20px;
    z-index: 2;
    max-height: 740px;
    overflow-y: hidden;
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
}

.toast-enter-active {
    transition: opacity 0.4s, transform 0.4s;
}

.toast-enter-from {
    opacity: 0;
    transform: translateY(-100%);
}
</style>
