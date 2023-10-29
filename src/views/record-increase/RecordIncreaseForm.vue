<template>
    <div
        class="overlay-increase-form"
        @keydown.esc="
            () => {
                if (
                    !props.isShowAssetListIncrease &&
                    !props.isShowAssetIncreaseForm
                ) {
                    closeRecordIncreaseForm();
                } else return;
            }
        "
        @keydown="saveWithSortKey"
        tabindex="0"
    >
        <form
            action=""
            class="form form-increase"
            v-if="!props.isShowAssetListIncrease"
        >
            <div class="header-increase-form">
                <div class="title">
                    {{ titleForm }}
                </div>
                <QLTSIcon
                    @click="closeRecordIncreaseForm"
                    type="box"
                    icon="close"
                    :content="resource.Tooltips.CloseHotKey"
                    v-tippy="{
                        animation: 'fade',
                        placement: 'bottom',
                    }"
                    tabindex="9"
                />
            </div>
            <div class="main-increase-form">
                <div class="increase-master">
                    <div class="increase-master-header">Thông tin chứng từ</div>
                    <div class="input-field">
                        <div class="row">
                            <div class="group">
                                <QLTSInput
                                    label="Mã chứng từ"
                                    :is-required="true"
                                    :error-msg="formData.documentCode.errorMsg"
                                    type="text"
                                    v-model="formData.documentCode.value"
                                    @update:errorMsg="
                                        updateErrorMsg(
                                            formData.documentCode,
                                            'Mã chứng từ'
                                        )
                                    "
                                    tabindex="1"
                                    ref="input1"
                                    :max-length="15"
                                />
                            </div>
                            <div class="group">
                                <QLTSInput
                                    label="Ngày bắt đầu sử dụng"
                                    :is-required="true"
                                    type="date"
                                    v-model="formData.usedDate.value"
                                    :error-msg="formData.usedDate.errorMsg"
                                    @update:errorMsg="
                                        updateErrorMsg(
                                            formData.usedDate,
                                            'Ngày bắt đầu sử dụng'
                                        )
                                    "
                                    tabindex="2"
                                    ref="usedDateRef"
                                />
                            </div>
                            <div class="group">
                                <QLTSInput
                                    label="Ngày ghi tăng"
                                    :is-required="true"
                                    type="date"
                                    v-model="formData.increasedDate.value"
                                    :error-msg="formData.increasedDate.errorMsg"
                                    @update:errorMsg="
                                        updateErrorMsg(
                                            formData.increasedDate,
                                            'Ngày ghi tăng'
                                        )
                                    "
                                    tabindex="3"
                                />
                            </div>
                        </div>
                        <div class="row">
                            <QLTSInput
                                :is-required="false"
                                label="Ghi chú"
                                style="width: 100%"
                                v-model="formData.note.value"
                                :max-length="255"
                                tabindex="4"
                            />
                        </div>
                    </div>
                </div>
                <div class="increase-details">
                    <div class="increase-details-header">
                        Thông tin chi tiết
                    </div>
                    <div class="increase-details-main">
                        <div class="increase-details-table">
                            <div class="increase-details-main-header">
                                <QLTSInput
                                    placeholder="Tìm kiếm theo tên, mã tài sản"
                                    style="width: 300px"
                                    typeField="with-icon"
                                    typeIcon="box"
                                    icon="search"
                                    :isIconLeft="true"
                                    ref="findAsset"
                                    @keydown.enter="
                                        filterData(pagingRecordIncreaseForm)
                                    "
                                    v-model="
                                        pagingRecordIncreaseForm.searchString
                                    "
                                    tabindex="5"
                                />
                                <QLTSButton
                                    type="cancel"
                                    class="chose-asset"
                                    @click="
                                        $emit(
                                            'showAssetListIncrease',
                                            filteredData
                                        )
                                    "
                                    tabindex="6"
                                    >Chọn tài sản</QLTSButton
                                >
                            </div>
                            <QLTSTable
                                :columns="columns"
                                :data="filteredData"
                                class="mw-unset"
                                tbodyMaxHeight="200px"
                                @showAssetIncreaseForm="
                                    emit('showAssetIncreaseForm')
                                "
                                @deleteItem="deleteItem"
                                :showEdit="showEdit"
                                :is-increase-action="true"
                            />
                        </div>
                        <QLTSPagination
                            :total-record="pagingRecordIncreaseForm.totalRecord"
                            :total-page="pagingRecordIncreaseForm.totalPage"
                            :current-page="pagingRecordIncreaseForm.pageNumber"
                            :page-size="pagingRecordIncreaseForm.pageSize"
                            @page-changed="setPageAssetIncrease"
                        />
                    </div>
                </div>
            </div>
            <div class="footer-increase-form">
                <QLTSButton
                    type="cancel"
                    @click="closeRecordIncreaseForm"
                    tabindex="7"
                    :content="resource.Tooltips.CloseHotKey"
                    v-tippy="{
                        animation: 'fade',
                        placement: 'bottom',
                    }"
                    >Hủy</QLTSButton
                >
                <QLTSButton
                    type="primary"
                    @click="saveIncrease"
                    tabindex="8"
                    :content="resource.Tooltips.SaveHotKey"
                    v-tippy="{
                        animation: 'fade',
                        placement: 'bottom',
                    }"
                    >Lưu</QLTSButton
                >
            </div>
        </form>
    </div>
</template>
<script setup>
import { computed, onMounted, onUnmounted, reactive, ref } from "vue";
import emitter from "tiny-emitter/instance";
import { useStore } from "vuex";

import QLTSInput from "@/components/input/QLTSInput.vue";
import QLTSButton from "@/components/button/QLTSButton.vue";
import QLTSPagination from "@/components/pagination/QLTSPagination.vue";
import QLTSIcon from "@/components/icon/QLTSIcon.vue";
import QLTSTable from "@/components/table/QLTSTable.vue";
import QLTSEnum from "@/helper/enum";

import resource from "@/helper/resource";
import format from "@/helper/format";
import { editIncrease } from "@/apis/increaseApis";
import { getNewCode } from "@/apis/autoCodeApis";
import { showDialogError, showToastMsg } from "@/helper/common";

const store = useStore();

const filteredData = ref([]);
const dataTable = ref([]);
const prevValue = ref([]);
const titleForm = ref("");
const deleteIncreaseAssetIds = ref([]); // danh sách id tài sản cần xóa
const dataUpdate = reactive({
    IncreaseUpdateDto: {},
    AssetsUpdateDto: [],
    AssetsCreateDto: [],
    AssetDeleteIds: [],
    IncreaseAssetDeleteIds: [],
    SourceDeteleIds: [],
});

const assetDeleteIds = []; // danh sách Id tài sản xóa khỏi ghi tăng
const sourceDeleteIds = ref([]); // danh sách Id ngân sách xóa khỏi ghi tăng
const assetUpdateDtos = ref([]); // danh sách tài sản chỉnh sửa
const assetCreateDtos = ref([]); // danh sách tài sản thêm mới
const previousItem = props.item?.IncreaseAsset
    ? [...props.item.IncreaseAsset]
    : []; // danh sách các tài sản ban đầu của chứng từ

const pagingRecordIncreaseForm = reactive({
    totalRecord: 0,
    totalPage: 0,
    pageNumber: 1,
    pageSize: 10,
    searchString: "",
});

const isFormUpdated = ref(false); // trạng thái form có thay đổi hay không
const usedDateRef = ref(null);

const emit = defineEmits([
    "showAssetListIncrease",
    "hideAssetListIncrease",
    "showAssetIncreaseForm",
    "addIncrease",
    "hideRecordIncreaseForm",
    "reloading",
    "editIncreaseItem",
]);

const props = defineProps({
    item: Object,
    editIncrease: Function,
    isShowAssetListIncrease: {
        type: Boolean,
        default: false,
    },
    isShowAssetIncreaseForm: {
        type: Boolean,
        default: false,
    },
});

onMounted(async () => {
    input1.value.onFocus();
    if (props.item) {
        prevValue.value = [...props.item?.IncreaseAsset];
        titleForm.value = resource.TitleLabel.EditRecordIncrease;
        formData.documentCode.value = props.item.IncreaseCode;

        formData.usedDate.value = format.formatDateToyyyyMMdd(
            props.item.IncreaseDate
        );
        formData.increasedDate.value = format.formatDateToyyyyMMdd(
            props.item.IncreaseRecordDate
        );
        formData.note.value = props.item.Content;
        filteredData.value = props.item.IncreaseAsset;
        filteredData.value.map(
            (item) =>
                (item.DepreciationCost = item.IncreaseCost - item.ResidualValue)
        );
        pagingRecordIncreaseForm.totalRecord = filteredData.value.length;
    } else {
        titleForm.value = resource.TitleLabel.AddRecordIncrease;
        store.dispatch("setLoading", true);
        formData.documentCode.value = await getNewCode(
            QLTSEnum.CodeType.Increase
        );
        formData.usedDate.value = format.formatDateToyyyyMMdd(Date.now());
        formData.increasedDate.value = format.formatDateToyyyyMMdd(Date.now());
        store.dispatch("setLoading", false);
    }
});
emitter.on("chooseAsset", (data) => {
    data.map((item) => {
        if (deleteIncreaseAssetIds.value.includes(item.IncreaseAssetId)) {
            deleteIncreaseAssetIds.value = deleteIncreaseAssetIds.value.filter(
                (i) => i.IncreaseAssetId !== item.IncreaseAssetId
            );
        }
        dataUpdate.AssetsCreateDto.push(item);
    });
    filteredData.value.push(...data);
    dataTable.value.push(...data);

    // filterData(pagingRecordIncreaseForm);
    pagingRecordIncreaseForm.totalRecord = filteredData.value.length;
    pagingRecordIncreaseForm.totalPage = Math.ceil(
        pagingRecordIncreaseForm.totalRecord / pagingRecordIncreaseForm.pageSize
    );
    filteredData.value = filteredData.value.slice(
        (pagingRecordIncreaseForm.pageNumber - 1) *
            pagingRecordIncreaseForm.pageSize,
        pagingRecordIncreaseForm.pageNumber * pagingRecordIncreaseForm.pageSize
    );

    filteredData.value
        .sort((a, b) => b.AssetCode.localeCompare(a.AssetCode))
        .map((item, index) => {
            item.isChecked = false;
            item.index =
                (pagingRecordIncreaseForm.pageNumber - 1) *
                    pagingRecordIncreaseForm.pageSize +
                index +
                1;
        });
});

emitter.on("setSourceAsset", (data) => {
    filteredData.value.forEach((item) => {
        if (item.AssetId === data.assetId) {
            item.IncreaseCost = data.totalCost;

            const currentYear = new Date().getFullYear();
            const timeUsed =
                currentYear - new Date(item.UsedDate).getFullYear();
            item.IncreaseCost = data.totalCost;

            item.ResidualValue = Math.floor(
                timeUsed >= item.LifeTime
                    ? 0
                    : item.DepreciationRate *
                          item.IncreaseCost *
                          (item.LifeTime - timeUsed)
            );
            item.DepreciationCost = item.IncreaseCost - item.ResidualValue;
            item.Sources = [...data.sourceCreate];
            item.SourcesUpdates = [...data.sourceUpdate];

            sourceDeleteIds.value = [...data.deleteSourceIds];
            dataUpdate.SourceDeteleIds = [...data.deleteSourceIds];

            if (prevValue.value.some((it) => it.AssetId === item.AssetId)) {
                dataUpdate.AssetsUpdateDto.push(item);
            } else {
                dataUpdate.AssetsCreateDto = dataUpdate.AssetsCreateDto.filter(
                    (it) => it.AssetId !== item.AssetId
                );
                dataUpdate.AssetsCreateDto.push(item);
            }
        }
    });
});

onUnmounted(() => {
    formData.documentCode = { value: "", errorMsg: "" };
    formData.usedDate = { value: "", errorMsg: "" };
    formData.increasedDate = { value: "", errorMsg: "" };
    formData.note = { value: "" };
    emitter.off("chooseAsset");
    emitter.off("setSourceAsset");
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
        style: "width: 100px",
        type: "text",
        key: "AssetCode",
        title: "",
        isNumber: false,
        isText: true,
    },
    {
        name: "Tên tài sản",
        style: "width: 200px",
        type: "text",
        key: "AssetName",
        title: "",
        isNumber: false,
        isText: true,
    },
    {
        name: "Bộ phận sử dụng",
        style: "width: 200px",
        type: "text",
        key: "DepartmentName",
        title: "",
        isNumber: false,
        isText: true,
    },
    {
        name: "Nguyên giá",
        style: "width: 115px",
        type: "number",
        key: "IncreaseCost",
        title: "",
        isNumber: true,
        isText: false,
    },
    {
        name: "Hao mòn năm",
        style: "width: 115px",
        type: "text",
        key: "DepreciationCost",
        title: "",
        isNumber: true,
    },
    {
        name: "Giá trị còn lại",
        style: "width: 100%;",
        key: "ResidualValue",
        isNumber: true,
    },
];

const formData = reactive({
    documentCode: { value: "", errorMsg: "" },
    usedDate: { value: "", errorMsg: "" },
    increasedDate: { value: "", errorMsg: "" },
    note: { value: "" },
});

const input1 = ref(null);
const findAsset = ref("");

/**
 * Cập nhật giá trị errorMsg khi blur
 * Author: TTNham(4/8/2023)
 */
const updateErrorMsg = (inputElement, inputName) => {
    inputElement.errorMsg = inputName + resource.Message.NotEmpty;
};

/**
 * Hàm lấy dữ liệu cho việc thêm mới
 * Author: TTNham (07/09/2023)
 */
const getDataForCreate = () => {
    const dataIncrease = {
        IncreaseCode: formData.documentCode.value,
        Content: formData.note.value,
        IncreaseDate: new Date(formData.increasedDate.value),
        IncreaseRecordDate: new Date(formData.usedDate.value),
        AssetUpdateDtos: [...dataTable.value],
    };
    return dataIncrease;
};

/**
 * Hàm xử lý khi lưu form
 * Author: TTNham (07/10/2023)
 */
const saveIncrease = async () => {
    const dateError = [];
    if (filteredData.value.length < 1) {
        showDialogError(resource.Message.ChooseLeastOneAsset);
        return;
    }
    // if (new Date(formData.increasedDate.value) > new Date()) {
    //     dateError.push("Ngày bắt đầu sử dụng");
    //     usedDateRef.value.isError();
    //     return;
    // }
    // if (new Date(formData.usedDate.value) > new Date()) {
    //     dateError.push("Ngày ghi tăng");
    //     return;
    // }
    // if (dateError.length > 0) {
    //     showDialogError(
    //         dateError.join(", ") + " không được lớn hơn ngày hiện tại."
    //     );
    //     return;
    // }
    if (props.item) {
        dataUpdate.IncreaseUpdateDto = {
            IncreaseDate: new Date(formData.increasedDate.value),
            IncreaseRecordDate: new Date(formData.usedDate.value),
            Content: formData.note.value,
            ModifyDate: format.formatDateToyyyyMMdd(Date.now()),
            IncreaseCode: formData.documentCode.value,
        };

        emit("editIncreaseItem", props.item.IncreaseId, dataUpdate);
    } else {
        const dataIncrease = getDataForCreate();
        emit("addIncrease", dataIncrease);
    }

    // emit("reloading", props.item);
};

/**
 * Hàm chuẩn hóa chuỗi
 * @param {String} string
 * Author: TTNham (14/10/2023)
 */
const normalizeString = (string) => {
    return string
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
};

/**
 * Lọc data theo tên, mã tài sản
 * @param {*} event
 * Author: TTNham(01/10/2023)
 */
const filterData = (filter) => {
    const searchValue = filter.searchString.toLowerCase();
    // Kiểm tra nếu giá trị tìm kiếm trống thì hiển thị tất cả dữ liệu
    if (searchValue.trim() === "") {
        filteredData.value = [...dataTable.value];
    } else {
        // Lọc dữ liệu dựa trên giá trị tìm kiếm
        filteredData.value = [...dataTable.value].filter((item) => {
            return (
                normalizeString(item.AssetCode).indexOf(
                    normalizeString(searchValue.trim())
                ) !== -1 ||
                normalizeString(item.AssetName).indexOf(
                    normalizeString(searchValue.trim())
                ) !== -1
            );
        });
    }

    pagingRecordIncreaseForm.totalRecord = filteredData.value.length;
    pagingRecordIncreaseForm.totalPage = Math.ceil(
        pagingRecordIncreaseForm.totalRecord / filter.pageSize
    );
    filteredData.value = filteredData.value.slice(
        (filter.pageNumber - 1) * filter.pageSize,
        filter.pageNumber * filter.pageSize
    );

    filteredData.value
        .sort((a, b) => b.AssetCode.localeCompare(a.AssetCode))
        .map((item, index) => {
            item.isChecked = false;
            item.index = (filter.pageNumber - 1) * filter.pageSize + index + 1;
        });
};

const setPageAssetIncrease = (pageSize, pageNumber = 1) => {
    pagingRecordIncreaseForm.pageSize = pageSize;
    pagingRecordIncreaseForm.pageNumber = pageNumber;
    filterData(pagingRecordIncreaseForm);
};

/**
 * Xóa item
 * Author: TTNham (02/10/2023)
 * @param {*} item
 */
const deleteItem = (item, filter) => {
    filteredData.value = filteredData.value.filter((it) => {
        return it.AssetId !== item.AssetId;
    });

    filteredData.value.map((item, index) => {
        item.index = index + 1;
    });

    dataUpdate.AssetsCreateDto = dataUpdate.AssetsCreateDto.filter((it) => {
        return it.AssetId !== item.AssetId;
    });
    if (item?.Sources) {
        item.Sources.forEach((item) => {
            dataUpdate.SourceDeteleIds.push(item.SourceId);
        });
    }
    if (props.item) {
        previousItem.forEach((prevItem) => {
            if (prevItem.AssetId === item.AssetId) {
                deleteIncreaseAssetIds.value.push(prevItem.IncreaseAssetId);
                dataUpdate.IncreaseAssetDeleteIds.push(
                    prevItem.IncreaseAssetId
                );
            }
        });
    }
    pagingRecordIncreaseForm.totalRecord = filteredData.value.length;
    pagingRecordIncreaseForm.totalPage = Math.ceil(
        pagingRecordIncreaseForm.totalRecord / pagingRecordIncreaseForm.pageSize
    );
    filteredData.value = filteredData.value.slice(
        (pagingRecordIncreaseForm.pageNumber - 1) *
            pagingRecordIncreaseForm.pageSize,
        pagingRecordIncreaseForm.pageNumber * pagingRecordIncreaseForm.pageSize
    );

    filteredData.value
        .sort((a, b) => b.AssetCode.localeCompare(a.AssetCode))
        .map((item, index) => {
            item.isChecked = false;
            item.index =
                (pagingRecordIncreaseForm.pageNumber - 1) *
                    pagingRecordIncreaseForm.pageSize +
                index +
                1;
        });
};

const isIncreaseDataUpdate = () => {
    if (props.item) {
        return (
            formData.documentCode.value !== props.item?.IncreaseCode ||
            formData.usedDate.value !==
                format.formatDateToyyyyMMdd(props.item?.IncreaseDate) ||
            formData.increasedDate.value !==
                format.formatDateToyyyyMMdd(props.item?.IncreaseRecordDate) ||
            !formData.note.value !== !props.item?.Content
        );
    }
};

const closeRecordIncreaseForm = () => {
    isFormUpdated.value =
        isIncreaseDataUpdate() ||
        dataUpdate.AssetDeleteIds.length > 0 ||
        dataUpdate.AssetsCreateDto.length > 0 ||
        dataUpdate.AssetsUpdateDto.length > 0 ||
        dataUpdate.IncreaseAssetDeleteIds.length > 0 ||
        dataUpdate.SourceDeteleIds.length > 0;
    emit(
        "hideRecordIncreaseForm",
        isFormUpdated.value,
        props.item == undefined
    );
};

const showEdit = (item) => {
    emit("showAssetIncreaseForm", item);
};

const saveWithSortKey = (e) => {
    if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        saveIncrease();
    }
};

defineExpose({ saveIncrease });
</script>
<style scoped>
@import url("./record-increase-form.css");
</style>
