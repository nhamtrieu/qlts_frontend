<template>
    <!-- <QLTSLoading v-show="isLoading" /> -->
    <div class="container" v-if="isAssetListPath">
        <div class="container-header">
            <div class="container-header__filter">
                <QLTSInput
                    v-model="searchString"
                    style="width: 272px"
                    typeField="with-icon"
                    typeIcon="box"
                    icon="search"
                    placeholder="Tìm kiếm tài sản theo tên, mã tài sản"
                    :isIconLeft="true"
                    @input="debounceInput"
                    ref="searchInput"
                />

                <QLTSDropdown
                    v-model="assetCategory"
                    typeField="with-icon"
                    icon="filter"
                    :isIconLeft="true"
                    :listItem="[
                        ...new Set(
                            listAssetCategories
                                .map((item) => item.AssetCategoryName.trim())
                                .filter((item) => item !== null)
                        ),
                    ]"
                />

                <QLTSDropdown
                    v-model="department"
                    typeField="with-icon"
                    icon="filter"
                    :isIconLeft="true"
                    :listItem="[
                        ...new Set(
                            listDepartments
                                .map((item) => item.DepartmentName.trim())
                                .filter((item) => item !== null)
                        ),
                    ]"
                />
            </div>
            <div class="container-header__action">
                <QLTSButton
                    @click="
                        () => {
                            $emit('showForm', true, QLTSEnum.Form.Add);
                        }
                    "
                    type="primary"
                    :isIcon="true"
                >
                    Thêm tài sản
                    <template v-slot:icon>
                        <QLTSIcon type="box-8" icon="add" />
                    </template>
                </QLTSButton>

                <QLTSButton
                    type="icon"
                    :content="resource.Tooltips.ExportExcel"
                    v-tippy="{
                        animation: 'fade',
                        placement: 'bottom',
                    }"
                    @click="exportExcel"
                >
                    <QLTSIcon type="box" icon="excel" />
                </QLTSButton>
                <QLTSButton
                    @click="showDialogDelete"
                    type="icon"
                    title="Xoá bản ghi"
                    :content="resource.Tooltips.DeleteRecord"
                    v-tippy="{
                        animation: 'fade',
                        placement: 'bottom',
                    }"
                >
                    <QLTSIcon type="box" icon="delete" />
                </QLTSButton>
            </div>
        </div>
        <div
            v-show="!store.getters.loading && !isData"
            class="loading"
            style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%;'
                "
        >
            <h1 style="font-size: 20px">Không có dữ liệu</h1>
        </div>
        <div
            v-if="!isLoading && isData"
            class="content-table"
            @scroll="closeContextMenu"
        >
            <QLTSTable
                :isCheckbox="true"
                :isPagination="true"
                :isTotal="true"
                :isRowAction="true"
                :isContextMenu="true"
                :data="assetList"
                :columns="columns"
                @actionEditRow="showFormEdit"
                @actionDuplicateRow="duplicateAsset"
                :isSummary="true"
                @recordsSelected="recordsSelected"
            />
            <QLTSContextMenu
                ref="contextMenu"
                v-on-click-outside="closeContextMenu"
                :item="contextMenuItem"
            />
        </div>
        <div v-if="!isLoading && isData" class="container-pagination">
            <QLTSPagination
                :totalRecord="totalRecord"
                :currentPage="pageNumber"
                :totalPage="totalPage"
                @pageChanged="setPageSizeAndPageNumber"
                :pageSize="pageSize"
            />
        </div>
    </div>
    <template v-else>
        <router-view> </router-view>
    </template>
</template>

<script setup>
import {
    ref,
    onMounted,
    onUnmounted,
    computed,
    nextTick,
    watchEffect,
} from "vue";
import emitter from "tiny-emitter/instance.js";
import { useStore } from "vuex";
import { vOnClickOutside } from "@vueuse/components";
import { useRoute } from "vue-router";

import { getAssetCategoryList } from "@/apis/assetCategoryApis";
import { getDepartmentList } from "@/apis/departmentApis";
import {
    exportExcelAssetList,
    getIncreaseByAsset,
    getIncreaseByListAsset,
    filterAssetList,
    deleteAssets,
} from "@/apis/assetApis";
import {
    hideDialogError,
    showToastMsg,
    showDialogError,
    errorApi,
} from "../helper/common";
import resource from "@/helper/resource";
import { increaseCode } from "../helper/helper";

import QLTSEnum from "../helper/enum";
import QLTSPagination from "@/components/pagination/QLTSPagination.vue";
import QLTSIcon from "@/components/icon/QLTSIcon.vue";
import QLTSContextMenu from "@/components/contextmenu/QLTSContextMenu.vue";
import QLTSTable from "@/components/table/QLTSTable.vue";
import QLTSDropdown from "@/components/dropdown/QLTSDropdown.vue";
import QLTSInput from "@/components/input/QLTSInput.vue";
import QLTSButton from "@/components/button/QLTSButton.vue";
import { jwtDecode } from "jwt-decode";
import route from "@/router/router";

const store = useStore();

const assetList = ref([]);
const totalQuantity = ref(0);
const totalCost = ref(0);
const totalAccumulatedDepreciation = ref(0);
const totalResidualValue = ref(0);
const isData = ref(false);
const isCheckAll = ref(false);
const selectedRowIndex = ref(-1);
const rowRef = ref();
const contextMenu = ref(null);
const contextMenuItem = ref(null);
const savedState = ref([]);
const listRecord = ref([]);
const listDepartments = ref([]);
const listAssetCategories = ref([]);
const searchInput = ref();
const isLoading = ref(store.getters.loading);

var columns = [
    {
        name: "STT",
        key: "index",
        tootip: "So thu tu",
        isNumber: true,
        isText: false,
        style: { width: "42px" },
    },
    {
        name: "Mã tài sản",
        key: "AssetCode",
        tootip: "Mã tài sản",
        isNumber: false,
        isText: true,
        style: { width: "90px" },
    },
    {
        name: "Tên tài sản",
        key: "AssetName",
        tootip: "So thu tu",
        isNumber: false,
        isText: true,
        style: { width: "205px" },
    },
    {
        name: "Loại tài sản",
        key: "AssetCategoryName",
        tootip: "So thu tu",
        isNumber: false,
        isText: true,
        style: { width: "205px" },
    },
    {
        name: "Tên phòng ban",
        key: "DepartmentName",
        tootip: "So thu tu",
        isNumber: false,
        isText: true,
        style: { width: "205px" },
    },
    {
        name: "Số lượng",
        key: "Quantity",
        tootip: "Số lượng",
        isNumber: true,
        isText: false,
        style: { width: "80px" },
    },
    {
        name: "Nguyên giá",
        key: "Cost",
        tootip: "",
        isNumber: true,
        isText: false,
        style: { width: "110px" },
    },
    {
        name: "HM/KH lũy kế",
        key: "accumulatedDepreciation",
        tootip: "",
        isNumber: true,
        isText: false,
        style: { width: "110px" },
    },
    {
        name: "Giá trị còn lại",
        key: "residualValue",
        tootip: "Giá trị còn lại",
        isNumber: true,
        isText: false,
        style: { width: "104px" },
    },
];

if (store.getters.token) {
    const decode = jwtDecode(store.getters.token);
    console.log(decode);
}

const isAssetListPath = computed(() => {
    return useRoute().path === "/tai-san";
});

filterAsset(store.getters.filter);

onMounted(async () => {
    getListDepartments();
    getListAssetCategories();
    emitter.on("deleteRecords", deleteRecords);
    emitter.on("getAssetList", getAssetList);
    emitter.on("duplicateAsset", duplicateAsset);
    emitter.on("showDialogDelete", showDialogDelete);
    emitter.emit("isManage", window.location.href.includes("quan-ly"));
    store.dispatch("clearListRecordDelete");
    console.log("assetList");
});

onUnmounted(() => {
    emitter.off("deleteRecords");
    emitter.off("getAssetList");
    emitter.off("duplicateAsset");
    emitter.off("showDialogDelete", showDialogDelete);
    emitter.off("isManage");
});

const totalRecord = computed({
    get() {
        return store.getters.filter.totalRecord;
    },
    set(value) {
        store.commit("setTotalRecord", value);
    },
});

const totalPage = computed({
    get() {
        return store.getters.filter.totalPage;
    },
    set(value) {
        store.commit("setTotalPage", value);
    },
});

const pageNumber = computed({
    get() {
        return store.getters.filter.pageNumber;
    },
    set(value) {
        store.commit("setPageNumber", value);
    },
});

const pageSize = computed({
    get() {
        return store.getters.filter.pageSize;
    },
    set(value) {
        store.commit("setPageSize", value);
    },
});

/**
 * HIển thị form chỉnh sửa
 * Author: TTNham (02/08/2023)
 * @param {*} asset
 */
async function showFormEdit(asset) {
    const listIncrease = await getIncreaseByListAsset([asset.AssetId]);
    console.log(listIncrease);
    emitter.emit("showFormEdit", asset, listIncrease.length < 1);
}

/**
 * Hiển thị form nhân bản
 * Author: TTNham (31/08/2023)
 */
function showFormDuplicate(asset) {
    emitter.emit("showFormDuplicate", asset);
}

/**
 * Lấy danh sách các bản ghi
 * Author: TTNham (03/08/2023)
 */
async function getAssetList() {
    store.commit("setPageNumber", 1);
    await filterAsset(store.getters.filter);
}

// Lưu trạng thái vào localStorage khi có sự thay đổi
watchEffect(() => {
    const dataSave = assetList.value
        .filter((item) => item.isChecked)
        .map((item) => item.AssetCode);
    localStorage.setItem("checkboxState", JSON.stringify(dataSave));
});

/**
 * Lấy danh sách tài sản theo điều kiện
 * Author: TTNham (26/08/2023)
 * @param {*} filter
 */

async function filterAsset(filter) {
    totalCost.value = 0;
    totalAccumulatedDepreciation.value = 0;
    totalResidualValue.value = 0;
    totalQuantity.value = 0;
    savedState.value = localStorage.getItem("checkboxState");

    try {
        store.dispatch("setLoading", true);
        const response = await filterAssetList(
            filter.pageSize || 50,
            filter.pageNumber || 1,
            filter.searchString,
            filter.departmentNameFilter,
            filter.assetCategoryNameFilter,
            []
        );
        store.commit("setTotalRecord", response.TotalRecord);
        store.commit("setTotalPage", response.TotalPage);
        store.commit("setPageNumber", response.PageNumber);
        store.commit("setPageSize", response.PageSize);
        assetList.value = response.Data;

        assetList.value.forEach((asset, index) => {
            asset.isChecked = false;
            asset.index =
                store.getters.filter.pageSize *
                    (store.getters.filter.pageNumber - 1) +
                index +
                1;
            const currentYear = new Date().getFullYear();
            const timeUsed =
                currentYear - new Date(asset.UsedDate).getFullYear();
            asset.residualValue = Math.floor(
                timeUsed >= asset.LifeTime
                    ? 0
                    : asset.DepreciationRate *
                          asset.Cost *
                          (asset.LifeTime - timeUsed)
            );
            const accumulatedDepreciation = asset.Cost - asset.residualValue;
            asset.accumulatedDepreciation = +(+accumulatedDepreciation).toFixed(
                3
            );

            totalCost.value += asset.Cost;
            totalAccumulatedDepreciation.value += +accumulatedDepreciation;
            totalResidualValue.value += asset.residualValue;
            totalQuantity.value += asset.Quantity;
        });
        store.dispatch("setLoading", false);
        isData.value = !(assetList.value.length === 0);
    } catch (error) {
        errorApi(error);
    }
}

/**
 * Set lại pageSize và pageNumber
 * Author: TTNham (26/08/2023)
 * @param {*} pageSize
 * @param {*} pageNumber
 */
function setPageSizeAndPageNumber(pageSize, pageNumber) {
    store.commit("setPageNumber", pageNumber);
    store.commit("setPageSize", pageSize);
    filterAsset(store.getters.filter);
}

/**
 * Lấy danh sách bản ghi cần xóa
 * Author: TTNham (26/08/2023)
 */
function getRecordIdsDelete() {
    const listRecords = [];
    assetList.value.forEach((item) => {
        if (item.isChecked) listRecords.push(item.AssetId);
    });
    return listRecords;
}

/**
 * Xóa tài sản đã chọn
 * Author: TTNham (26/08/2023)
 */
async function deleteRecords() {
    try {
        const listIds = getRecordIdsDelete();
        await deleteAssets(listIds);
        hideDialogError();
        store.commit("setPageNumber", 1);
        await filterAsset(store.getters.filter);
        showToastMsg(QLTSEnum.ToastMsg.Success, resource.Message.DeleteSuccess);
        if (assetList.value.length == 0) {
            store.commit("setSearchString", "");
            store.commit("setDepartmentFilter", "");
            store.commit("setAssetCategoryFilter", "");
            filterAsset(store.getters.filter);
            if (assetList.value.length === 0) isData.value = false;
        } else {
            isData.value = true;
        }
    } catch (error) {
        showDialogError(error.response.data.UserMessage);
    }
}

/**
 * Lấy danh sách các bản ghi cần xoá
 * Author: TTNham (26/08/2023)
 */
function getRecordsDelete() {
    const result = [];
    assetList.value.forEach((item) => {
        if (item.isChecked) result.push(item);
    });
    return result;
}

/**
 * Lấy danh sách mã các bản ghi cần xoá
 * Author: TTNham (26/08/2023)
 */
function getCodeRecordsDelete() {
    return assetList.value.filter((item) => item.isChecked);
}

/**
 * Nhân bản bản ghi đã chọn
 * Author: TTNham (30/08/2023)
 */
async function duplicateAsset(asset) {
    try {
        const assetDuplicate = {
            ...asset,
            AssetCode: increaseCode(asset.AssetCode),
            isChecked: false,
        };
        showFormDuplicate(assetDuplicate);
    } catch (error) {
        showDialogError(error);
    }
}

/**
 * Hiển thị context menu
 * Author: TTNham (31/08/2023)
 * @param {*} event
 */
const showContextMenu = (event, item) => {
    nextTick(() => {
        assetList.value.forEach((asset) => {
            asset.isChecked = false;
            if (item === asset) asset.isChecked = true;
        });
        contextMenu.value.showContextMenu(event, item);
        contextMenuItem.value = item;
        item.isChecked = true;
    });
};

/**
 * Ẩn context menu
 * Author: TTNham (03/09/2023)
 */
const closeContextMenu = () => {
    nextTick(() => {
        contextMenu.value.closeContextMenu();
        contextMenuItem.value = null;
    });
};

let previousAssetCategoryName = store.getters.filter.assetCategoryName;
const assetCategory = computed({
    get: () => store.getters.filter.assetCategoryName,
    set: (value) => {
        if (value === previousAssetCategoryName) {
            store.commit("setAssetCategoryFilter", "");
            store.commit("setAssetCategoryName", "Chọn loại tài sản");
        } else {
            store.commit("setAssetCategoryFilter", value);
            store.commit("setAssetCategoryName", value);
        }
        const assetCategory = listAssetCategories.value.find((assetCategory) =>
            assetCategory.assetCategoryName === value ? item : null
        );
        store.commit("setPageNumber", 1);
        store.commit("setAssetCategoryId", assetCategory?.assetCategoryId);
        filterAsset(store.getters.filter);
    },
});

let previousDepartmentName = store.getters.filter.departmentName;
const department = computed({
    get: () => store.getters.filter.departmentName,
    set: (value) => {
        if (value === previousDepartmentName) {
            store.commit("setDepartmentFilter", "");
            store.commit("setDepartmentName", "Chọn bộ phận sử dụng");
        } else {
            store.commit("setDepartmentName", value);
            store.commit("setDepartmentFilter", value);
        }
        const department = listDepartments.value.find(
            (item) => item.departmentName === value
        );
        store.commit("setPageNumber", 1);
        store.commit("setDepartmentId", department?.departmentId);
        filterAsset(store.getters.filter);
    },
});

const searchString = computed({
    get: () => store.getters.filter.searchString,
    set: (value) => {
        store.commit("setSearchString", value);
        store.commit("setPageNumber", 1);
    },
});

/**
 * Lấy danh sách phòng ban
 * Author: TTNham (02/09/2023)
 */
async function getListDepartments() {
    try {
        const res = await getDepartmentList();
        listDepartments.value = res;
    } catch (error) {
        store.dispatch("setLoading", false);
        if (error.response?.status === 401 || error.response?.status === 403) {
            route.push("/dang-nhap");
        }
        console.log(error);
        showDialogError(error);
    }
}

/**
 * Lấy danh sách loại tài sản
 * Author: TTNham (02/09/2023)
 */
async function getListAssetCategories() {
    try {
        const res = await getAssetCategoryList();
        listAssetCategories.value = res;
    } catch (error) {
        store.dispatch("setLoading", false);
        if (error.response?.status === 401 || error.response?.status === 403) {
            route.push("/dang-nhap");
        }
        console.log(error);
        showDialogError(error);
    }
}

/**
 * Hàm thực hiện delay gọi hàm khác
 * Author: TTNham (02/09/2023)
 *
 * @param {*} action
 * @param {*} time
 */
const debounce = (action, time) => {
    let timeOut;
    return () => {
        clearTimeout(timeOut);
        timeOut = setTimeout(action, time);
    };
};

/**
 * Hàm delay filter asset
 */
const debounceInput = debounce(() => {
    filterAsset(store.getters.filter);
}, 500);

/**
 * Hiển thị dialog cảnh báo trước khi xóa
 * Author: TTNham (02/09/2023)
 */
const showDialogDelete = async () => {
    let message = "";
    listRecord.value = getCodeRecordsDelete();
    if (listRecord.value.length > 1) {
        const listIds = listRecord.value.map((item) => item.AssetId);
        const listIncrease = await getIncreaseByListAsset(listIds);
        const totalCannotDelete = listIds.length - listIncrease.length;
        if (listIncrease.length >= 1) {
            message = `<b>${String(listIncrease.length).padStart(
                2,
                0
            )}</b> tài sản được chọn không thể xóa. Vui lòng kiểm tra lại tài sản trước khi thực hiện xóa`;
            showDialogError(message);
        } else {
            message =
                "<b>" +
                String(listRecord.value.length).padStart(2, 0) +
                "</b>" +
                resource.Message.ConfirmDeleteList;
            emitter.emit("showDialogConfirmDelete", message);
        }
        listRecord.value = [];
    } else if (listRecord.value.length === 1) {
        const [asset, ...res] = getCodeRecordsDelete();
        const increase = await getIncreaseByAsset(asset.AssetId);
        if (increase.length > 0) {
            message =
                "Tài sản có mã <b> " +
                asset.AssetCode +
                " </b>" +
                "đã phát sinh chứng từ ghi tăng có mã <b> " +
                increase.map((item) => item.IncreaseCode).join(", ") +
                " </b>";
            showDialogError(message);
        } else {
            message =
                resource.Message.ConfirmDeleteOne +
                `<b>${asset.AssetCode} - ${asset.AssetName}</b>?`;
            emitter.emit("showDialogConfirmDelete", message);
        }
    } else {
        showDialogError("Vui lòng chọn tài sản cần xóa!");
    }
};

/**
 * Xuất ra file excel theo điều kiện lọc
 * Author: TTNham (07/09/2023)
 */
const exportExcel = async () => {
    try {
        const filter = store.getters.filter;
        store.dispatch("setLoading", true);
        await exportExcelAssetList(
            filter.searchString,
            filter.departmentNameFilter,
            filter.assetCategoryNameFilter
        );
        store.dispatch("setLoading", false);
    } catch (error) {
        showDialogError("Có lỗi từ hệ thống!");
    }
};

const deleteByButton = (event) => {
    event.preventDefault();
    if (event.key === "Delete") {
        showDialogDelete();
    }
};

/**
 * Hàm xử lý khi chọn record
 * @param {*} records
 * Author: TTNham (28/09/2023)
 */
const recordsSelected = (records) => {
    store.dispatch("setListRecordDelete", records);
};

defineExpose({ filterAsset, getRecordsDelete, getCodeRecordsDelete });
</script>

<style scoped>
@import url("../css/table.css");

tfoot tr {
    position: sticky;
    bottom: -1px;
    right: 0;
    left: 0;
    background-color: #ffffff;
    border: none;
    font-weight: 700;
}

.container-pagination {
    position: sticky;
    z-index: 10;
}
</style>
