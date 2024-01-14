<template>
    <div class="container-record-increase">
        <div class="header">
            <div class="text">Ghi tăng tài sản</div>
            <div class="action" v-show="!store.getters.loading && isData">
                <QLTSButton
                    type="primary"
                    @click="showRecordIncreaseForm"
                    v-show="isIncreaseAction"
                    >Thêm</QLTSButton
                >
                <div class="action-icon" @click="toggleDetailTable">
                    <QLTSIcon
                        v-if="isShowDetailTable"
                        type="box"
                        icon="triangle"
                    />
                    <QLTSIcon v-else type="box" icon="detail" />
                    <QLTSIcon type="box" icon="chevron-down-dark" />
                </div>
            </div>
            <div class="action-icon-table" v-if="isShowActionIconTable">
                <div
                    class="action-icon-item"
                    v-on-click-outside="hideActionIconTable"
                    @click="setDetailTable"
                >
                    <QLTSIcon type="box" icon="triangle" />
                    <QLTSIcon type="box" icon="chevron-down-dark" />
                </div>
                <div
                    class="action-icon-item"
                    v-on-click-outside="hideActionIconTable"
                    @click="unSetDetailTable"
                >
                    <QLTSIcon type="box" icon="detail" />
                    <QLTSIcon type="box" icon="chevron-down-dark" />
                </div>
            </div>
        </div>
        <div class="main">
            <div
                class="header-main"
                v-show="!isFullScreen && !store.getters.loading && isData"
            >
                <QLTSInput
                    style="width: 300px"
                    typeField="with-icon"
                    typeIcon="box"
                    icon="search"
                    placeholder="Tìm kiếm theo số chứng từ, nội dung"
                    :isIconLeft="true"
                    v-model="searchString"
                    @keydown="filterInput($event)"
                />
                <div class="header-main--action" style="cursor: pointer">
                    <div class="action-icon">
                        <QLTSIcon type="box" icon="print" />
                        <QLTSIcon
                            type="box"
                            icon="ellipsis-vertical"
                            @click="toggleAction"
                        />
                    </div>
                </div>
                <template v-if="isShowAction">
                    <div
                        class="record-increase-action"
                        v-on-click-outside="hideAction"
                    >
                        <QLTSIcon
                            type="box"
                            icon="delete"
                            :content="resource.Tooltips.DeleteRecord"
                            v-tippy="{
                                animation: 'fade',
                                placement: 'bottom',
                            }"
                            @click="showDialogDelete"
                        />
                    </div>
                </template>
            </div>
            <div class="increase-main">
                <QLTSTable
                    v-show="!store.getters.loading && isData"
                    ref="masterTblRef"
                    :columns="columns"
                    :data="data"
                    :isCheckbox="true"
                    :isSummary="true"
                    :style="{
                        height: !isShowDetailTable
                            ? '540px'
                            : initialHeight1 + 'px',
                    }"
                    :tbodyMaxHeight="
                        !isShowDetailTable
                            ? '456px'
                            : initialHeight1 - 36 - 39 + 'px'
                    "
                    @deleteItem="deleteItem"
                    @setDataDetailTable="setDataDetailTable"
                    :showEdit="showEdit"
                    :isIncreaseAction="isIncreaseAction"
                    :is-context-menu="true"
                    :context-menu-type="QLTSEnum.ContextMenuType.Increase"
                    :isMasterTable="true"
                    :isContextMenu="isIncreaseAction"
                    v-if="!isFullScreen"
                />
                <QLTSPagination
                    :total-record="totalRecord"
                    :total-page="totalPage"
                    :page-size="pageSize"
                    :current-page="pageNumber"
                    @pageChanged="setPageSizeAndPageNumber"
                    v-if="!isFullScreen && isData"
                />
                <div
                    class="resize"
                    @mousedown="startResize"
                    v-if="
                        isShowDetailTable &&
                        !isFullScreen &&
                        !store.getters.loading &&
                        isData
                    "
                ></div>
                <div
                    class="detail-table"
                    v-if="isShowDetailTable && !store.getters.loading && isData"
                >
                    <div class="header">
                        <div class="detail-header">Thông tin chi tiết</div>
                        <div class="screen-action" @click="toggleFullScreen">
                            <QLTSIcon
                                type="box"
                                icon="full-screen"
                                :content="resource.Tooltips.FullScreen"
                                v-tippy="{
                                    animation: 'fade',
                                    placement: 'bottom',
                                }"
                                v-if="!isFullScreen"
                            />
                            <QLTSIcon
                                type="box"
                                icon="un-full-screen"
                                :content="resource.Tooltips.UnFullScreen"
                                v-tippy="{
                                    animation: 'fade',
                                    placement: 'bottom',
                                }"
                                v-else
                            />
                        </div>
                    </div>
                    <QLTSTable
                        :columns="headerInfo"
                        :data="isData && dataInfo"
                        ref="detailTblRef"
                        :is-increase-action="isIncreaseAction"
                        :style="{
                            maxHeight: isFullScreen
                                ? 540 + 'px'
                                : initialHeight2 + 'px',
                        }"
                        :tbody-max-height="
                            isFullScreen
                                ? 540 + 'px'
                                : initialHeight2 - 42 + 'px'
                        "
                        @showAssetIncreaseForm="showAssetIncreaseForm"
                        :showEdit="showFormEditIncreaseAsset"
                        @deleteItem="deleteIncreaseAsset"
                        :isContextMenu="isIncreaseAction"
                    />
                </div>
            </div>
        </div>
        <RecordIncreaseForm
            ref="recordIncreaseForm"
            v-if="isShowRecordIncreaseForm"
            @hideRecordIncreaseForm="hideRecordIncreaseForm"
            @showAssetListIncrease="showAssetListIncrease"
            @showAssetIncreaseForm="showAssetIncreaseForm"
            @closeRecordIncreaseForm="closeRecordIncreaseForm"
            @addIncrease="addIncrease"
            :item="editItem"
            @editIncreaseItem="editIncreaseItem"
            @reloading="reloading"
            :isShowAssetListIncrease="isShowAssetListIncrease"
            :isShowAssetIncreaseForm="isShowAssetIncreaseForm"
        />
        <AssetListIncrease
            v-if="isShowAssetListIncrease"
            @hideAssetListIncrease="hideAssetListIncrease"
            :dataAssetExist="dataAssetExist"
        />
        <AssetIncreaseForm
            v-if="isShowAssetIncreaseForm"
            @hideAssetIncreaseForm="hideAssetIncreaseForm"
            :departmentName="departmentName"
            :itemEditSource="itemEditSource"
            :isEditIncreaseAsset="isEditIncreaseAsset"
            @setSourcesData="setSourcesData"
        />
        <QLTSDialog
            v-if="dialogIncrease.isShow"
            :type="dialogIncrease.type"
            :content="dialogIncrease.content"
            @hideForm="
                (isShowRecordIncreaseForm = false),
                    (dialogIncrease.isShow = false)
            "
            @hideDialogError="dialogIncrease.isShow = false"
            @deleteRecords="deleteRecords"
            @submitForm="onSubmitForm"
        />
        <div
            v-show="!store.getters.loading && !isData"
            class="loading"
            style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%;'
                "
        >
            <h1 style="font-size: 20px">Không có dữ liệu</h1>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, computed, onUnmounted, reactive } from "vue";
import { vOnClickOutside } from "@vueuse/components";
import { useStore } from "vuex";
import emitter from "tiny-emitter/instance";
import { jwtDecode } from "jwt-decode";

import QLTSButton from "@/components/button/QLTSButton.vue";
import QLTSIcon from "@/components/icon/QLTSIcon.vue";
import QLTSInput from "@/components/input/QLTSInput.vue";
import QLTSPagination from "@/components/pagination/QLTSPagination.vue";
import QLTSTable from "@/components/table/QLTSTable.vue";
import QLTSDialog from "@/components/dialog/QLTSDialog.vue";
import RecordIncreaseForm from "./RecordIncreaseForm.vue";
import AssetIncreaseForm from "./AssetIncreaseForm.vue";
import AssetListIncrease from "./AssetListIncrease.vue";
import resource from "@/helper/resource";
import QLTSEnum from "@/helper/enum";

import {
    filterData,
    addNewIncrease,
    deleteMany,
    editIncrease,
} from "@/apis/increaseApis";

import {
    deleteIncreaseAssetAsync,
    updateIncreaseAssetAsync,
} from "@/apis/increaseAssetApis";
import format from "@/helper/format";
import { deleteSingle } from "@/apis/increaseApis";
import { showDialogError, showToastMsg } from "@/helper/common";
import { getUserRole } from "@/apis/userApis";

const store = useStore();

const columns = ref([
    {
        name: "STT",
        style: "width: 44px;",
        type: "number",
        key: "index",
        title: "",
        isNumber: true,
        isText: false,
    },
    {
        name: "Số chứng từ",
        style: "width: 150px; color: #1aa4c8;",
        type: "text",
        key: "IncreaseCode",
        title: "",
        isNumber: false,
        isText: true,
    },
    {
        name: "Ngày chứng từ",
        style: "width: 150px;",
        type: "date",
        key: "IncreaseDateFormat",
        title: "",
        isNumber: false,
        isText: false,
    },
    {
        name: "Ngày ghi tăng",
        style: "width: 150px;",
        type: "date",
        key: "IncreaseRecordDateFormat",
        title: "",
        isNumber: false,
        isText: false,
    },
    {
        name: "Tổng nguyên giá",
        style: "width: 150px;",
        type: "number",
        key: "TotalCost",
        title: "",
        isNumber: true,
        isText: false,
    },
    {
        name: "Nội dung",
        style: "width: 100%;",
        type: "text",
        key: "Content",
        title: "",
        isNumber: false,
        isText: true,
    },
]);

const headerInfo = ref([
    {
        name: "STT",
        style: "width: 44px;",
        key: "index",
        isNumber: true,
    },
    {
        name: "Mã tài sản",
        style: "width: 100px",
        key: "AssetCode",
        isText: true,
    },
    {
        name: "Tên tài sản",
        style: "width: 330px;",
        key: "AssetName",
        isText: true,
    },
    {
        name: "Bộ phận sử dụng",
        style: "width: 330px;",
        key: "DepartmentName",
        isText: true,
    },
    {
        name: "Nguyên giá",
        style: "width: 150px;",
        key: "IncreaseCost",
        isNumber: true,
    },
    {
        name: "Hao mòn năm",
        style: "width: 150px;",
        key: "AccumulatedDepreciation",
        isNumber: true,
    },
    {
        name: "Giá trị còn lại",
        style: "width: 100%;",
        key: "ResidualValue",
        isNumber: true,
    },
]);

const data = ref([]);
const dataInfo = ref([]);

const isShowRecordIncreaseForm = ref(false);
const isShowAssetIncreaseForm = ref(false);
const isShowAssetListIncrease = ref(false);
const isShowDetailTable = ref(store.getters.isShowDetailTable);
const isShowAction = ref(false);
const isShowActionIconTable = ref(false);
const masterTblRef = ref(null);
const detailTblRef = ref(null);
const resizing = ref(false);
const initialHeight1 = ref(260);
const initialHeight2 = ref(194);
const startY = ref(0);
const departmentName = ref("");
const increaseDelete = ref();
const editItem = ref();
const itemEditSource = ref({});
const dataAssetExist = ref([]);
const isShowDialog = ref(false);
const isFullScreen = ref(false);
const dialogIncrease = reactive({
    isShow: false,
    type: "",
    content: "",
});
const isData = ref(false);
const recordIncreaseForm = ref();
const isEditIncreaseAsset = ref(false);
const userId = jwtDecode(store.getters.token).userId;
const userRole = ref("");
const isIncreaseAction = ref(false);
console.log("isIncreaseAction", isIncreaseAction);

onMounted(async () => {
    loadingData(store.getters.filterIncrease);
    userRole.value = await getUserRole(userId);
    isIncreaseAction.value = userRole.value.RoleName === "Admin";
    store.dispatch("resetIncreaseFilter");
    emitter.on("deleteRecords", deleteRecords);
    emitter.on("showIncreaseEdit", showEdit);
    emitter.on("showDialogDelete", (msg) => {
        dialogIncrease.type = QLTSEnum.Dialog.Delete;
        dialogIncrease.content = msg;
        dialogIncrease.isShow = true;
    });
});

onUnmounted(() => {
    emitter.on("deleteRecords", deleteRecords);
    emitter.off("showDialogDelete");
    store.dispatch("resetIncreaseFilter");
});

const searchString = computed({
    get: () => store.getters.filterIncrease.searchString,
    set: (value) => {
        store.commit("setIncreaseSearchString", value);
        store.commit("setIncreasePageNumber", 1);
    },
});

const totalRecord = computed({
    get() {
        return store.getters.filterIncrease.totalRecord;
    },
    set(value) {
        store.commit("setIncreaseTotalRecord", value);
    },
});

const totalPage = computed({
    get() {
        return store.getters.filterIncrease.totalPage;
    },
    set(value) {
        store.commit("setIncreaseTotalPage", value);
    },
});

const pageNumber = computed({
    get() {
        return store.getters.filterIncrease.pageNumber;
    },
    set(value) {
        store.commit("setIncreasePageNumber", value);
    },
});

const pageSize = computed({
    get() {
        return store.getters.filterIncrease.pageSize;
    },
    set(value) {
        store.commit("setIncreasePageSize", value);
    },
});

/**
 * Hàm lấy dữ liệu
 * @param {*} filterObject
 * Author: TTNham (06/10/2023)
 */
async function loadingData(filterObject, increaseId = null) {
    try {
        const idIncreaseEditing = store.getters.idIncreaseEditing;
        store.dispatch("setLoading", true);

        const response = await filterData(
            filterObject.pageSize,
            filterObject.pageNumber,
            filterObject.searchString
        );
        isData.value = response.Data.length > 0;
        store.commit("setIncreaseTotalRecord", response.TotalRecord);
        store.commit("setIncreaseTotalPage", response.TotalPage);
        store.commit("setIncreasePageNumber", response.PageNumber);
        store.commit("setIncreasePageSize", response.PageSize);
        data.value = response.Data;
        if (data.value.length < 1) {
            store.dispatch("setLoading", false);
            return;
        }
        data.value.map((item, index) => {
            item.index =
                store.getters.filterIncrease.pageSize *
                    (store.getters.filterIncrease.pageNumber - 1) +
                index +
                1;
            item.IncreaseDateFormat = format.formatDateToddMMyyyy(
                item.IncreaseDate
            );
            item.IncreaseRecordDateFormat = format.formatDateToddMMyyyy(
                item.IncreaseRecordDate
            );
        });

        data.value.map((it) => {
            if (it.IncreaseId === idIncreaseEditing) it.isChecked = true;
        });

        if (!data.value.some((it) => it.isChecked)) {
            data.value[0].isChecked = true;
            store.dispatch("setIdIncreaseEditing", "");
        }

        dataInfo.value = data.value.filter((item) => item.isChecked);
        setDataDetailTable(dataInfo);
        store.dispatch("setLoading", false);
    } catch (error) {
        console.log(error);
    }
}

const toggleFullScreen = () => {
    isFullScreen.value = !isFullScreen.value;
};

/**
 * Ẩn icon để chọn ẩn/hiện bảng detail
 * Author: TTNham (14/10/2023)
 */
const hideActionIconTable = () => {
    isShowActionIconTable.value = false;
};

/**
 * Toggle bảng detail
 * Author: TTNham (02/10/2023)
 */
const toggleDetailTable = () => {
    // store.dispatch("toggleDetailTable");
    isShowActionIconTable.value = !isShowActionIconTable.value;
    // isShowDetailTable.value = store.getters.isShowDetailTable;
    // hideActionIconTable();
};

/**
 * Toggle action
 * Author: TTNham (02/10/2023)
 */
const toggleAction = () => {
    isShowAction.value = !isShowAction.value;
};

/**
 * hàm hiển thị bảng detail
 * Author: TTNham (14/10/2023)
 */
const setDetailTable = () => {
    store.dispatch("toggleDetailTable");
    isShowDetailTable.value = true;
    hideActionIconTable();
};

/**
 * Hàm ẩn bảng detail
 * Author: TTNham (14/10/2023)
 */
const unSetDetailTable = () => {
    store.dispatch("toggleDetailTable");
    isShowDetailTable.value = false;
    hideActionIconTable();
};

/**
 * Ẩn action
 * Author: TTNham (02/10/2023)
 */
const hideAction = () => {
    isShowAction.value = false;
};

/**
 * Hàm hiển thị form thêm tài sản ghi tăng
 * Author: TTNham (26/09/2023)
 */
const showRecordIncreaseForm = () => {
    isShowRecordIncreaseForm.value = true;
    editItem.value = null;
    dialogIncrease.type = resource.TypeDialog.Add;
};

/**
 * Hàm ẩn form thêm tài sản ghi tăng
 * Author: TTNham (26/09/2023)
 */
const hideRecordIncreaseForm = (isUpdate, isFormAdd) => {
    if (isFormAdd) {
        dialogIncrease.isShow = true;
        dialogIncrease.content = resource.Message.ConfirmCancelAddIncrease;
        dialogIncrease.type = resource.TypeForm.Add;
    } else {
        if (isUpdate) {
            dialogIncrease.isShow = true;
            dialogIncrease.content = resource.Message.ConfirmCancelEditIncrease;
            dialogIncrease.type = resource.TypeForm.Edit;
        } else {
            dialogIncrease.isShow = true;
            dialogIncrease.content =
                resource.Message.ConfirmCancelNotEditIncrease;
            dialogIncrease.type = resource.TypeForm.Add;
        }
    }
};

const closeRecordIncreaseForm = () => {
    dialogIncrease.isShow = false;
    isShowRecordIncreaseForm.value = false;
};

/**
 * Hàm hiển thị form chọn tài sản
 * Author: TTNham (26/09/2023)
 */
const showAssetListIncrease = (data) => {
    isShowAssetListIncrease.value = true;
    dataAssetExist.value = data;
};

/**
 * Hàm ẩn form chọn tài sản
 * Author: TTNham (26/09/2023)
 */
const hideAssetListIncrease = () => {
    isShowAssetListIncrease.value = false;
};

/**
 * Hàm hiển thị form sửa tài sản
 * Author: TTNham (26/09/2023)
 */
const showAssetIncreaseForm = (item) => {
    isShowAssetIncreaseForm.value = true;
    departmentName.value = item.DepartmentName;
    itemEditSource.value = item;
};

/**
 * Hàm ẩn form sửa tài sản
 * Author: TTNham (26/09/2023)
 */
const hideAssetIncreaseForm = () => {
    isShowAssetIncreaseForm.value = false;
};

/**
 * Bắt đầu resize
 * @param {*} event
 * Author: TTNham (27/09/2023)
 */
const startResize = (event) => {
    resizing.value = true;
    startY.value = event.clientY;
    initialHeight1.value = masterTblRef.value.getTableHeight();
    initialHeight2.value = detailTblRef.value.getTableHeight();

    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResize);
};

/**
 * Resize bảng
 * @param {*} event
 * Author: TTNham (27/09/2023)
 */
const resize = (event) => {
    if (!resizing.value) return;
    const deltaY = event.clientY - startY.value;
    // Ngặn chặn resize quá màn hình
    const maxHeight = window.innerHeight - 356;
    const minHeight = 120;
    if (
        initialHeight1.value + deltaY > maxHeight ||
        initialHeight1.value + deltaY < minHeight
    ) {
        return;
    }

    initialHeight1.value += deltaY;
    initialHeight2.value -= deltaY;
    startY.value = event.clientY;
};

/**
 * Kết thúc resize
 * Author: TTNham (27/09/2023)
 */
function stopResize() {
    resizing.value = false;
    window.removeEventListener("mousemove", resize);
    window.removeEventListener("mouseup", stopResize);
}

/**
 * Xóa item
 * Author: TTNham (02/10/2023)
 * @param {*} item
 */
const deleteItem = (item) => {
    increaseDelete.value = item;
    dialogIncrease.type = resource.TypeDialog.Delete;
    dialogIncrease.content =
        resource.Message.ConfirmDeleteIncrease + item.IncreaseCode + "</b>";
    dialogIncrease.isShow = true;
};

/**
 * Hàm set data cho bảng detail
 * @param {*} dataItem
 * Author: TTNham(06/10/2023)
 */
const setDataDetailTable = (dataItem) => {
    if (dataItem.value.length === 0) dataInfo.value = [];
    else {
        data.value
            .filter((item) => {
                return item === dataItem.value[0];
            })
            .forEach((item) => {
                dataInfo.value = item.IncreaseAsset;
            });
        dataInfo.value
            .sort((a, b) => b.AssetCode.localeCompare(a.AssetCode))
            .map((item, index) => {
                item.index = index + 1;
            });
    }
};

/**
 * Hàm hàm filter khi nhấn enter
 */
const filterInput = async (event) => {
    if (event.key === "Enter") {
        store.dispatch("setLoading", true);
        await loadingData(store.getters.filterIncrease);
        store.dispatch("setLoading", false);
    }
};

/** Set lại pageSize và pageNumber
 * Author: TTNham (26/08/2023)
 * @param {*} pageSize
 * @param {*} pageNumber
 */
function setPageSizeAndPageNumber(pageSize, pageNumber) {
    store.commit("setIncreasePageNumber", pageNumber);
    store.commit("setIncreasePageSize", pageSize);
    loadingData(store.getters.filterIncrease);
}

/**
 * Lấy các chứng từ đang được checked
 *
 */
const getRecordIncrease = () => data.value.filter((item) => item.isChecked);

/**
 * Hàm hiển thị dialog xóa nhiều chứng từ
 * Author: TTNham (07/10/2023)
 */
const showDialogDelete = () => {
    const listIds = getListIncreaseDelete();
    dialogIncrease.isShow = true;
    dialogIncrease.type = resource.TypeDialog.Delete;
    if (listIds.length >= 2) {
        dialogIncrease.content = `<b>${
            listIds.length <= 9 ? "0" + listIds.length : listIds.length
        }</b> ${resource.Message.ConfirmDeleteListIncrease}`;
    } else if (listIds.length === 1) {
        increaseDelete.value = getRecordIncrease()[0];
        dialogIncrease.content = `${resource.Message.ConfirmDeleteIncrease} ${increaseDelete.value.IncreaseCode}</b>`;
    } else {
        dialogIncrease.type = resource.TypeDialog.Error;
        dialogIncrease.content = resource.Message.ChooseDeleteIncreaseItem;
    }
};

/**
 * Hàm xóa bản ghi
 * Author: TTNham(07/10/2023)
 */
const deleteRecords = async () => {
    try {
        const listIds = getListIncreaseDelete();
        if (listIds.length >= 2) {
            store.dispatch("setLoading", true);
            await deleteMany(listIds);
            store.commit("setIncreasePageNumber", 1);
            dataInfo.value.length = 0;
            store.dispatch("setLoading", false);
            showToastMsg(
                QLTSEnum.ToastMsg.Success,
                resource.Message.DeleteSuccess
            );
        } else {
            increaseDelete.value = getRecordIncrease()[0];
            if (increaseDelete.value) {
                store.dispatch("setLoading", true);
                await deleteSingle(increaseDelete.value?.IncreaseId);
                store.commit("setIncreasePageNumber", 1);
                dataInfo.value.length = 0;
                store.dispatch("setLoading", false);
                showToastMsg(
                    QLTSEnum.ToastMsg.Success,
                    resource.Message.DeleteSuccess
                );
            }
            increaseDelete.value = null;
        }
        dialogIncrease.isShow = false;
        filterData(
            store.getters.filterIncrease.pageSize,
            store.getters.filterIncrease.pageNumber,
            store.getters.filterIncrease.searchString
        );
        await loadingData(store.getters.filterIncrease);
        store.dispatch("setIdIncreaseEditing", "");
        dialogIncrease.isShow = false;
    } catch (error) {
        console.log(error);
        dialogIncrease.isShow = false;
        store.dispatch("setLoading", false);
        if (error.response.status === 403) {
            showDialogError("Bạn không có quyền xóa chứng từ này");
        } else {
            showDialogError(error);
        }
    }
};

/**
 * Hàm thêm mới chứng từ
 * @param {*} data
 * Author: TTNham(07/10/2023)
 */
const addIncrease = async (data) => {
    try {
        await addNewIncrease(data);
        isShowRecordIncreaseForm.value = false;
        dialogIncrease.isShow = false;
        store.dispatch("setLoading", true);
        store.dispatch("setIdIncreaseEditing", "");
        await loadingData(store.getters.filterIncrease);
        store.dispatch("setLoading", false);
        showToastMsg(
            QLTSEnum.ToastMsg.Success,
            resource.Message.SaveDataSuccess
        );
    } catch (error) {
        showDialogError(error.response.data.UserMessage);
    }
};

/**
 * Sửa chứng từ ghi tăng
 * @param {*} id
 * @param {*} data
 */
const editIncreaseItem = async (id, data) => {
    try {
        console.log("edit");
        await editIncrease(id, data);
        isShowRecordIncreaseForm.value = false;
        dialogIncrease.type = resource.TypeDialog.Edit;
        dialogIncrease.isShow = false;
        store.dispatch("setLoading", true);
        await loadingData(store.getters.filterIncrease);
        store.dispatch("setLoading", false);
        showToastMsg(
            QLTSEnum.ToastMsg.Success,
            resource.Message.UpdateDataSuccess
        );
    } catch (error) {
        console.log("");
        showDialogError("Trùng mã chứng từ");
    }
};

/**
 * Hàm hiển thị form edit
 * Author: TTNham(07/10/2023)
 */
const showEdit = (item) => {
    isShowRecordIncreaseForm.value = true;
    editItem.value = item;
    store.dispatch("setIdIncreaseEditing", item.IncreaseId);
    isEditIncreaseAsset.value = false;
};

/**
 * Hàm lấy danh sách các chứng từ cần xóa
 * Author: TTNham(09/10/2023)
 */
const getListIncreaseDelete = () => {
    const listIds = [];
    data.value
        .filter((item) => item.isChecked)
        .forEach((item) => listIds.push(item.IncreaseId));
    return listIds;
};

/**
 * Load lại trang web
 * @param {*} data
 * Author: TTNham (10/10/2023)
 */
const reloading = (data) => {
    loadingData(store.getters.filterIncrease, data?.IncreaseId);
};

/**
 * Hàm xử lý gửi form
 * Author: TTNham (17/10/2023)
 */
const onSubmitForm = () => {
    recordIncreaseForm.value.saveIncrease();
};

/**
 * hàm hiển thị form sửa thông tin nguồn hình thành
 * @param {*} item
 * Author: TTNham (17/10/2023)
 */

const showFormEditIncreaseAsset = (item, isEditDetailtable) => {
    itemEditSource.value = item;
    departmentName.value = item.DepartmentName;
    isShowAssetIncreaseForm.value = true;
    isEditIncreaseAsset.value = true;
};

/**
 * hàm xóa tài sản ghi tăng
 * @param {*} item
 */
const deleteIncreaseAsset = async (item) => {
    await deleteIncreaseAssetAsync(item.IncreaseAssetId);
    store.dispatch("setLoading", true);
    store.dispatch("setIdIncreaseEditing", item.IncreaseId);
    await filterData(
        store.getters.filterIncrease.pageSize,
        store.getters.filterIncrease.pageNumber,
        store.getters.filterIncrease.searchString
    );
    await loadingData(store.getters.filterIncrease);
    store.dispatch("setLoading", false);
    showToastMsg(QLTSEnum.ToastMsg.Success, resource.Message.DeleteSuccess);
};

/**
 * hàm sửa thông tin nguồn hình thành
 * @param {*} data
 */
const setSourcesData = async (data) => {
    if (isEditIncreaseAsset) {
        const res = await updateIncreaseAssetAsync(data.item.IncreaseAssetId, {
            IncreaseAssetId: data.item.IncreaseAssetId,
            IncreaseId: data.item.IncreaseId,
            AssetId: data.item.AssetId,
            IncreaseCost: data.totalCost,
            sourcesCreateDto: data.sourceCreate,
            sourcesDeleteId: data.deleteSourceIds,
            sourcesUpdateDto: data.sourceUpdate,
        });
        store.dispatch("setIdIncreaseEditing", data.item.IncreaseId);
        await filterData(
            store.getters.filterIncrease.pageSize,
            store.getters.filterIncrease.pageNumber,
            store.getters.filterIncrease.searchString
        );
        await loadingData(store.getters.filterIncrease);
        showToastMsg(
            QLTSEnum.ToastMsg.Success,
            resource.Message.UpdateDataSuccess
        );
    }
};
</script>

<style scoped>
@import url("./record-increase.css");
</style>
