<template>
    <router-view></router-view>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import emitter from "tiny-emitter/instance.js";
import { useStore } from "vuex";

import { exportExcelAssetList } from "@/apis/assetApis";
import { getAssetCategoryList } from "@/apis/assetCategoryApis";
import { getDepartmentList } from "@/apis/departmentApis";
import { showDialogError } from "@/helper/common";
import resource from "@/helper/resource";
import QLTSEnum from "@/helper/enum";

const store = useStore();
const assetList = ref();
const listRecord = ref([]);
const listDepartments = ref([]);
const listAssetCategories = ref([]);
const searchInput = ref();
const isLoading = ref(false);
const selectedDate = ref("");
const datePickerOptions = {
    format: ["yyyy-MM-dd", "dd-MM-yyyy"],
};

const handleDateChange = () => {};

onMounted(() => {
    getListDepartments();
    getListAssetCategories();
    // searchInput.value.onFocus();
});

let previousAssetCategoryName = store.getters.filter.assetCategoryName;
const assetCategory = computed({
    get: () => store.getters.filter.assetCategoryName,
    set: (value) => {
        if (value === previousAssetCategoryName) {
            store.commit("setAssetCategoryFilter", "");
            store.commit("setAssetCategoryName", previousAssetCategoryName);
            store.commit("setPageNumber", 1);
        } else {
            store.commit("setAssetCategoryFilter", value);
            store.commit("setAssetCategoryName", value);
            store.commit("setPageNumber", 1);
        }
        const assetCategory = listAssetCategories.value.find((assetCategory) =>
            assetCategory.assetCategoryName === value ? item : null
        );
        store.commit("setAssetCategoryId", assetCategory?.assetCategoryId);
        assetList.value.filterAsset(store.getters.filter);
    },
});

let previousDepartmentName = store.getters.filter.departmentName;
const department = computed({
    get: () => store.getters.filter.departmentName,
    set: (value) => {
        if (value === previousDepartmentName) {
            store.commit("setDepartmentFilter", "");
            store.commit("setDepartmentName", previousDepartmentName);
        } else {
            store.commit("setDepartmentName", value);
            store.commit("setDepartmentFilter", value);
        }
        const department = listDepartments.value.find(
            (item) => item.departmentName === value
        );
        store.commit("setDepartmentId", department?.departmentId);
        assetList.value.filterAsset(store.getters.filter);
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
    assetList.value.filterAsset(store.getters.filter);
}, 500);

/**
 * Hiển thị dialog cảnh báo trước khi xóa
 * Author: TTNham (02/09/2023)
 */
const showDialogDelete = () => {
    let message = "";
    listRecord.value = assetList.value.getCodeRecordsDelete();
    if (listRecord.value.length > 1) {
        message =
            "<b>" +
            String(listRecord.value.length).padStart(2, 0) +
            "</b>" +
            resource.Message.ConfirmDeleteList;
        listRecord.value = [];
        emitter.emit("showDialogConfirmDelete", message);
    } else if (listRecord.value.length === 1) {
        const asset = assetList.value.getRecordsDelete()[0];
        message =
            resource.Message.ConfirmDeleteOne +
            `<b>${asset.AssetCode} - ${asset.AssetName}</b>?`;
        emitter.emit("showDialogConfirmDelete", message);
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
        isLoading.value = true;
        await exportExcelAssetList(
            filter.searchString,
            filter.departmentNameFilter,
            filter.assetCategoryNameFilter
        );
        isLoading.value = false;
    } catch (error) {
        showDialogError("Có lỗi từ hệ thống!");
    }
};

const deleteByButton = (event) => {
    event.preventDefault();
    if (event.key === "Delete") {
        showDialogDelete();
        emitter.emit("deleteRecords");
    }
};
</script>

<style scoped>
@import url("../../css/layout.css");
</style>
