<template>
    <div class="overlay-asset-list-increase">
        <div
            class="asset-list-increase"
            @keydown.esc="emit('hideAssetListIncrease')"
        >
            <div class="header">
                <div class="title">
                    {{ resource.TitleLabel.ChooseAssetIncrease }}
                </div>
                <QLTSIcon
                    type="box"
                    icon="close"
                    v-tippy="{
                        animation: 'fade',
                        placement: 'top',
                    }"
                    :content="resource.Tooltips.CloseHotKey"
                    @click="emit('hideAssetListIncrease')"
                />
            </div>
            <div class="main">
                <div class="main-search">
                    <QLTSInput
                        style="width: 300px"
                        typeField="with-icon"
                        typeIcon="box"
                        icon="search"
                        placeholder="Tìm kiếm theo mã, tên tài sản"
                        @input="debounceInput"
                        :isIconLeft="true"
                        v-model="searchString"
                        ref="input"
                    />
                </div>
                <div class="asset-table" :class="{ 'no-data': !isData }">
                    <div v-if="!isData">Không có dữ liệu</div>
                    <QLTSTable
                        v-else
                        :is-checkbox="true"
                        :columns="columns"
                        :data="data"
                        class="mw-unset"
                        tbody-max-height="456px"
                    />
                </div>
                <QLTSPagination
                    :total-record="totalRecord"
                    :total-page="totalPage"
                    :page-size="pageSize"
                    :current-page="pageNumber"
                    @pageChanged="setPageSizeAndPageNumber"
                />
            </div>
            <div class="footer">
                <QLTSButton
                    type="cancel"
                    @click="emit('hideAssetListIncrease')"
                    v-tippy="{
                        animation: 'fade',
                        placement: 'top',
                    }"
                    :content="resource.Tooltips.CloseHotKey"
                    >Hủy bỏ</QLTSButton
                >
                <QLTSButton
                    type="primary"
                    @click="listItem"
                    v-tippy="{
                        animation: 'fade',
                        placement: 'top',
                    }"
                    :content="resource.Tooltips.SaveHotKey"
                    >Đồng ý</QLTSButton
                >
            </div>
        </div>
    </div>
</template>
<script setup>
import { useStore } from "vuex";
import { ref, computed, onUnmounted, onMounted } from "vue";
import emitter from "tiny-emitter/instance";

import QLTSButton from "@/components/button/QLTSButton.vue";
import QLTSTable from "@/components/table/QLTSTable.vue";
import QLTSInput from "@/components/input/QLTSInput.vue";
import QLTSPagination from "@/components/pagination/QLTSPagination.vue";
import QLTSIcon from "@/components/icon/QLTSIcon.vue";

import { filterAssetList } from "@/apis/assetApis";
import resource from "@/helper/resource";

const emit = defineEmits(["hideAssetListIncrease"]);
const store = useStore();
const props = defineProps({ dataAssetExist: Array });
const listAssetIdExist = props.dataAssetExist.map((item) => item.AssetId);
const input = ref(null);

onMounted(() => {
    input.value.onFocus();
    store.dispatch("clearListRecordDelete");
    store.dispatch("resetFilter");
});

onUnmounted(() => {
    store.dispatch("resetFilter");
    store.dispatch("clearListRecordDelete");
});

const columns = [
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
        name: "Mã tài sản",
        style: "width: 90px;",
        type: "text",
        key: "AssetCode",
        title: "",
        isNumber: false,
        isText: true,
    },
    {
        name: "Tên tài sản",
        style: "width: 150px",
        type: "date",
        key: "AssetName",
        title: "",
        isNumber: false,
        isText: true,
    },
    {
        name: "Bộ phận sử dụng",
        style: "width: 150px",
        type: "date",
        key: "DepartmentName",
        title: "",
        isNumber: false,
        isText: true,
    },
    {
        name: "Nguyên giá",
        style: "width: 150px",
        type: "number",
        key: "Cost",
        title: "",
        isNumber: true,
        isText: false,
    },
    {
        name: "Hao mòn năm",
        style: "width: 120px",
        type: "text",
        key: "DepreciationCost",
        title: "",
        isNumber: true,
    },
    {
        name: "Giá trị còn lại",
        style: "width: 150px;",
        key: "ResidualValue",
        isNumber: true,
    },
];

const data = ref([]);
const isData = ref(true);

filterAsset(store.getters.filter);

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

const searchString = computed({
    get: () => store.getters.filter.searchString,
    set: (value) => {
        store.commit("setSearchString", value);
        store.commit("setPageNumber", 1);
    },
});

/**
 * Hàm set lại pagesize và pagenumber
 * @param {*} pageSize
 * @param {*} pageNumber
 * Author: TTNham (02/10/2023)
 */
function setPageSizeAndPageNumber(pageSize, pageNumber) {
    store.commit("setPageNumber", pageNumber);
    store.commit("setPageSize", pageSize);
    filterAsset(store.getters.filter);
}

/**
 * Hàm lọc tài sản
 * Author: TTNham (02/10/2023)
 * @param {*} filter
 */
async function filterAsset(filter) {
    try {
        store.dispatch("setLoading", true);
        const response = await filterAssetList(
            filter.pageSize || 50,
            filter.pageNumber || 1,
            filter.searchString,
            filter.departmentNameFilter,
            filter.assetCategoryNameFilter
        );

        data.value = response.Data.filter(
            (item) => !listAssetIdExist.includes(item.AssetId)
        );

        isData.value = data.value.length > 0;
        store.dispatch("setLoading", false);
        data.value.map((item, index) => {
            item.index =
                store.getters.filter.pageSize *
                    (store.getters.filter.pageNumber - 1) +
                index +
                1;
            const currentYear = new Date().getFullYear();
            const timeUsed =
                currentYear - new Date(item.UsedDate).getFullYear();

            item.ResidualValue =
                timeUsed >= item.LifeTime
                    ? 0
                    : item.DepreciationRate *
                      item.Cost *
                      (item.LifeTime - timeUsed);
            item.IncreaseCost = item.Cost;
            const depreciationCost = item.Cost - item.ResidualValue;
            item.DepreciationCost = +(+depreciationCost).toFixed(3);
        });

        store.commit(
            "setTotalRecord",
            response.TotalRecord - listAssetIdExist.length
        );
        store.commit("setTotalPage", response.TotalPage);
        store.commit("setPageNumber", response.PageNumber);
        store.commit("setPageSize", response.PageSize);
    } catch (error) {}
}

/**
 * Hàm debounce 1 action
 * @param {*} action
 * @param {*} time
 * Author: TTNham (02/10/2023)
 */
const debounce = (action, time) => {
    let timeOut;
    return () => {
        clearTimeout(timeOut);
        timeOut = setTimeout(action, time);
    };
};

/**
 * Hàmm debounce khi nhập vào ô input
 * Author: TTNham (02/10/2023)
 */
const debounceInput = debounce(() => {
    filterAsset(store.getters.filter);
}, 500);

const getListRecordsChoose = () => {
    return data.value.filter((item) => item.isChecked);
};

/**
 * Hàm chọn tài sản để thêm vào bảng
 * Author: TTNham (02/10/2023)
 */
const listItem = () => {
    emitter.emit("chooseAsset", getListRecordsChoose());
    emit("hideAssetListIncrease");
};
</script>
<style scoped>
@import url("./AssetListIncrease.css");
.overlay-asset-list-increase {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.16);
    z-index: 4;
}
</style>
