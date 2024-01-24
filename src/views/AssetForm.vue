<template>
    <div>
        <div class="overlay overlay--form"></div>

        <form
            ref="form"
            id="form-asset"
            action=""
            @keydown="shortCutForm($event)"
        >
            <div class="form-container">
                <div class="form-header">
                    <div class="form-header__left">
                        <div class="form-title">
                            {{ label }}
                        </div>
                    </div>

                    <div class="form-header__right">
                        <QLTSIcon
                            tabindex="14"
                            @click="$emit('closeForm', false)"
                            @keydown="onKeydownClose($event)"
                            type="box"
                            :content="resource.Tooltips.CloseHotKey"
                            v-tippy="{
                                animation: 'fade',
                                placement: 'top',
                            }"
                            icon="close"
                        />
                    </div>
                </div>

                <div class="form-main">
                    <div class="form-row">
                        <div class="form-col col-4">
                            <QLTSInput
                                ref="input1"
                                tabindex="1"
                                v-model="dataAsset.assetCode.value"
                                :isRequired="true"
                                :label="resource.TitleInput.AssetCode"
                                type="text"
                                :error-msg="dataAsset.assetCode.errorMsg"
                                @update:errorMsg="
                                    updateErrorMsg(
                                        dataAsset.assetCode,
                                        resource.TitleInput.AssetCode
                                    )
                                "
                                :max-length="10"
                                :is-disabled="!isEditedForm"
                            />
                        </div>

                        <div class="form-col col-8">
                            <QLTSInput
                                v-model="dataAsset.assetName.value"
                                tabindex="2"
                                :isRequired="true"
                                :label="resource.TitleInput.AssetName"
                                type="text"
                                placeholder="Nhập tên tài sản"
                                :error-msg="dataAsset.assetName.errorMsg"
                                @update:errorMsg="
                                    updateErrorMsg(
                                        dataAsset.assetName,
                                        resource.TitleInput.AssetName
                                    )
                                "
                                :max-length="255"
                                ref="input2"
                                :is-disabled="!isEditedForm"
                            />
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-col col-4">
                            <QLTSCombobox
                                type="combobox-form"
                                ref="input3"
                                :fieldList="[
                                    {
                                        value: resource.TitleInput.Code,
                                        size: 30,
                                    },
                                    {
                                        value: resource.TitleInput
                                            .DepartmentName,
                                        size: 70,
                                    },
                                ]"
                                :list-item="dataAsset.departmentCode.list"
                                v-model="dataAsset.departmentCode.value"
                                :isRequired="true"
                                :label="resource.TitleInput.DepartmentName"
                                placeholder="Chọn mã bộ phận sử dụng"
                                tabindex="3"
                                :error-msg="dataAsset.departmentCode.errorMsg"
                                @selected="onUpdateDepartmentCode"
                                @update:errorMsg="
                                    updateErrorMsg(
                                        dataAsset.departmentCode,
                                        resource.TitleInput.DepartmentName
                                    )
                                "
                                :is-disabled="!isEditedForm"
                            />
                        </div>

                        <div class="form-col col-8">
                            <QLTSInput
                                v-model="dataAsset.departmentName.value"
                                type="text"
                                :isDisabled="true"
                                label="Tên bộ phận sử dụng"
                                :max-length="255"
                            />
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-col col-4">
                            <QLTSCombobox
                                ref="input4"
                                v-model="dataAsset.assetCategoryCode.value"
                                :error-msg="
                                    dataAsset.assetCategoryCode.errorMsg
                                "
                                :fieldList="[
                                    {
                                        value: resource.TitleInput.Code,
                                        size: 30,
                                    },
                                    {
                                        value: resource.TitleInput
                                            .AssetCategoryCode,
                                        size: 70,
                                    },
                                ]"
                                :list-item="dataAsset.assetCategoryCode.list"
                                type="combobox-form"
                                tabindex="4"
                                :isRequired="true"
                                :label="resource.TitleInput.AssetCategoryCode"
                                placeholder="Chọn mã loại tài sản"
                                @selected="onUpdateAssetCategoryCode"
                                @update:errorMsg="
                                    updateErrorMsg(
                                        dataAsset.assetCategoryCode,
                                        resource.TitleInput.AssetCategoryCode
                                    )
                                "
                                :is-disabled="!isEditedForm"
                            />
                        </div>

                        <div class="form-col col-8">
                            <QLTSInput
                                v-model="dataAsset.assetCategoryName.value"
                                :isDisabled="true"
                                :label="resource.TitleInput.AssetCategoryName"
                                :max-length="255"
                            />
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-col col-4">
                            <QLTSInput
                                ref="input5"
                                v-model="dataAsset.quantity.value"
                                :error-msg="dataAsset.quantity.errorMsg"
                                tabindex="5"
                                :isNumber="true"
                                :label="resource.TitleInput.Quantity"
                                :isRequired="true"
                                :is-number="true"
                                :is-format-number="true"
                                @update:errorMsg="
                                    updateErrorMsg(
                                        dataAsset.quantity,
                                        resource.TitleInput.Quantity
                                    )
                                "
                                :max-length="10"
                                :is-disabled="!isEditedForm"
                            />
                        </div>
                        <div class="form-col col-4">
                            <QLTSInput
                                ref="input6"
                                v-model="costUpdate"
                                :error-msg="dataAsset.cost.errorMsg"
                                tabindex="6"
                                :label="resource.TitleInput.Cost"
                                :isRequired="true"
                                :isRightText="true"
                                :is-format-number="true"
                                type="text"
                                @update:errorMsg="
                                    updateErrorMsg(
                                        dataAsset.cost,
                                        resource.TitleInput.Cost
                                    )
                                "
                                :max-length="15"
                                :is-disabled="!isEditedForm"
                            />
                        </div>
                        <div class="form-col col-4">
                            <QLTSInput
                                ref="input7"
                                v-model="lifeTimeUpdated"
                                :error-msg="dataAsset.lifeTime.errorMsg"
                                tabindex="7"
                                :label="resource.TitleInput.LifeTime"
                                :isRequired="true"
                                :isRightText="true"
                                :is-format-number="true"
                                @update:errorMsg="
                                    updateErrorMsg(
                                        dataAsset.lifeTime,
                                        resource.TitleInput.LifeTime
                                    )
                                "
                                :max-length="3"
                                :is-disabled="!isEditedForm"
                            />
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-col col-4">
                            <QLTSInput
                                ref="input8"
                                v-model="depreciationRateUpdated"
                                :error-msg="dataAsset.depreciationRate.errorMsg"
                                tabindex="8"
                                :label="
                                    resource.TitleInput.DepreciationRate +
                                    ' (%)'
                                "
                                :is-disabled="true"
                                :isRequired="true"
                                :isRightText="true"
                                :is-format-number="true"
                                @update:errorMsg="
                                    updateErrorMsg(
                                        dataAsset.depreciationRate,
                                        resource.TitleInput.DepreciationRate
                                    )
                                "
                                :max-length="2"
                            />
                        </div>
                        <div class="form-col col-4">
                            <QLTSInput
                                ref="input9"
                                v-model="depreciationCostUpdated"
                                tabindex="9"
                                :is-disabled="true"
                                :isRequired="true"
                                :isRightText="true"
                                :is-format-number="true"
                                label="Giá trị hao mòn năm"
                                @update:errorMsg="
                                    updateErrorMsg(
                                        dataAsset.depreciationCost,
                                        'Giá trị hao mòn năm'
                                    )
                                "
                                :max-length="15"
                            />
                        </div>
                        <div class="form-col col-4">
                            <QLTSInput
                                :isDisabled="true"
                                label="Năm theo dõi"
                                :isRightText="true"
                                :model-value="dataAsset.trackedYear.value"
                                :max-length="4"
                            />
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-col col-4">
                            <QLTSInput
                                v-model="dataAsset.purchaseDate.value"
                                :error-msg="dataAsset.purchaseDate.errorMsg"
                                tabindex="10"
                                type="date"
                                :isRequired="true"
                                label="Ngày mua"
                                @update:errorMsg="
                                    updateErrorMsg(
                                        dataAsset.purchaseDate,
                                        'Ngày mua'
                                    )
                                "
                                :max-length="20"
                                :is-disabled="!isEditedForm"
                            />
                        </div>
                        <div class="form-col col-4">
                            <QLTSInput
                                v-model="dataAsset.usedDate.value"
                                :error-msg="dataAsset.usedDate.errorMsg"
                                tabindex="11"
                                type="date"
                                label="Ngày bắt đầu sử dụng"
                                :isRequired="true"
                                @update:errorMsg="
                                    updateErrorMsg(
                                        dataAsset.usedDate,
                                        'Ngày bắt đầu sử dụng'
                                    )
                                "
                                :max-length="20"
                                :is-disabled="!isEditedForm"
                            />
                        </div>
                        <div class="form-col col-4"></div>
                    </div>
                </div>
            </div>
            <div class="form-action">
                <div class="form-action__right">
                    <QLTSButton
                        tabindex="12"
                        type="cancel"
                        @click="$emit('cancel')"
                    >
                        {{ resource.Button.Cancel }}
                    </QLTSButton>
                    <QLTSButton
                        tabindex="13"
                        type="primary"
                        @click="submitForm"
                        :title="resource.Tooltips.SaveHotKey"
                        :is-disabled="!isEditedForm"
                    >
                        {{ resource.Button.Save }}
                    </QLTSButton>
                </div>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, reactive, computed } from "vue";
import emitter from "tiny-emitter/instance";
import { jwtDecode } from "jwt-decode";
import { useStore } from "vuex";

import QLTSButton from "@/components/button/QLTSButton.vue";
import QLTSInput from "@/components/input/QLTSInput.vue";
import QLTSIcon from "@/components/icon/QLTSIcon.vue";
import QLTSCombobox from "@/components/combobox/QLTSCombobox.vue";

import { addNewAsset, updateAsset } from "@/apis/assetApis";
import { getDepartmentList } from "@/apis/departmentApis";
import { getAssetCategoryList } from "@/apis/assetCategoryApis";
import { getNewCode } from "@/apis/autoCodeApis";
import {
    endNumberValidate,
    purchaseDateLessUsedDateValidate,
} from "@/helper/validate";
import QLTSEnum from "@/helper/enum";
import resource from "@/helper/resource";
import format from "@/helper/format";
import { showDialogError, showToastMsg, errorApi } from "@/helper/common";
import { getOrgInfoByUserId } from "@/apis/userApis";

const props = defineProps({
    assetId: {},
    assetEdit: {},
    assetDuplicate: {},
    isEditedForm: {
        type: Boolean,
        default: true,
    },
});
const emit = defineEmits([
    "showWarning",
    "closeForm",
    "cancel",
    "showToastMsg",
    "typeForm",
]);

const store = useStore();
const dataDecode = jwtDecode(store.getters.token);
console.log(dataDecode);

let errorDialogMsg;
const label = ref(QLTSEnum.Form.AddLabel);

const dataAsset = reactive({
    assetCode: { value: "", errorMsg: "" }, // Mã tài sản
    assetName: { value: "", errorMsg: "" }, // Tên tài sản
    assetId: { value: "" }, // Id tài sản
    departmentCode: { value: "", errorMsg: "", list: [] }, // Mã bộ phận sử dụng
    departmentName: { value: "" }, // Tên bộ phận sử dụng
    departmentId: { value: "" }, // Id bộ phận sử dụng
    assetCategoryCode: { value: "", errorMsg: "", list: [] }, // Mã loại tài sản
    assetCategoryName: { value: "" }, // Tên loại tài sản
    assetCategoryId: { value: "" }, // Id loại tài sản
    quantity: { value: 1, errorMsg: "" }, // Số lượng
    cost: { value: "0", errorMsg: "" }, // Nguyên giá
    lifeTime: { value: 0, errorMsg: "" }, // Thời gian sử dụng
    depreciationRate: { value: 0, errorMsg: "" }, // Tỷ lệ hao mòn
    depreciationCost: { value: 0, errorMsg: "" }, // Giá trị hao mòn năm
    trackedYear: { value: new Date().getFullYear() }, // Năm theo dõi
    purchaseDate: { value: "", errorMsg: "" }, // Ngày mua
    usedDate: { value: "", errorMsg: "" }, // Ngày sử dụng
    createdDate: { value: "" }, // Ngày tạo
    modifyDate: { value: "" }, // Ngày sửa
    orgId: { value: "" }, // Id đơn vị
});

const input1 = ref();
const input2 = ref();
const input3 = ref();
const input4 = ref();
const input5 = ref();
const input6 = ref();
const input7 = ref();
const input8 = ref();
const input9 = ref();

const listDepartments = ref([]),
    listAssetCategories = ref([]);

const getDepartmentCode = async () => {
    try {
        const data = await getDepartmentList();
        listDepartments.value = data;
        listDepartments.value.map((item) => item.DepartmentCode.trim());
        const seenDepartmentCode = new Set();
        Array.from(data).filter((array) => {
            const code = array.DepartmentCode;
            if (!seenDepartmentCode.has(code)) {
                seenDepartmentCode.add(code);
                dataAsset.departmentCode.list.push([
                    array.DepartmentCode,
                    array.DepartmentName,
                    array.DepartmentId,
                ]);
            }
        });
    } catch (error) {
        showDialogError(error);
    }
};

const getAssetCategoryCode = async () => {
    try {
        const data = await getAssetCategoryList();
        listAssetCategories.value = data;
        listAssetCategories.value.map((item) => item.AssetCategoryCode.trim());
        const seenAssetCategoryCode = new Set();
        Array.from(data).filter((array) => {
            const code = array.AssetCategoryCode;
            if (!seenAssetCategoryCode.has(code) && code != null) {
                seenAssetCategoryCode.add(code);
                dataAsset.assetCategoryCode.list.push([
                    array.AssetCategoryCode,
                    array.AssetCategoryName,
                    array.AssetCategoryId,
                    Math.floor(100 / array.LifeTime),
                    array.LifeTime,
                ]);
            }
        });
    } catch (error) {
        showDialogError(error);
    }
};

onMounted(async () => {
    label.value = QLTSEnum.Form.AddLabel;
    input1.value.onFocus();
    getDepartmentCode();
    getAssetCategoryCode();
    const orgId = await getOrgInfoByUserId(dataDecode.userId);
    console.log(orgId);
    dataAsset.orgId.value = orgId.OrgId;
    if (props.assetEdit) {
        label.value = QLTSEnum.Form.EditLabel;
        getDataAsset(props.assetEdit);
    } else if (props.assetDuplicate) {
        label.value = QLTSEnum.Form.Duplicate;
        getDataAsset(props.assetDuplicate);
    } else {
        dataAsset.assetCode.value = await getNewCode(QLTSEnum.CodeType.Asset);
        dataAsset.purchaseDate.value = format.formatDateToyyyyMMdd(Date.now());
        dataAsset.usedDate.value = format.formatDateToyyyyMMdd(Date.now());
    }
    emitter.on("submitForm", submitForm);
});

onUnmounted(() => {
    emitter.off("submitForm");
});

async function getDataAsset(asset) {
    dataAsset.assetCode.value = asset.AssetCode;
    dataAsset.assetName.value = asset.AssetName;
    dataAsset.assetId.value = asset.AssetId;
    dataAsset.assetCategoryCode.value = asset.AssetCategoryCode;
    dataAsset.assetCategoryName.value = asset.AssetCategoryName;
    dataAsset.assetCategoryId.value = asset.AssetCategoryId;
    dataAsset.departmentCode.value = asset.DepartmentCode;
    dataAsset.departmentName.value = asset.DepartmentName;
    dataAsset.departmentId.value = asset.DepartmentId;
    dataAsset.quantity.value = asset.Quantity;
    dataAsset.cost.value = asset.Cost;
    dataAsset.lifeTime.value = asset.LifeTime;
    dataAsset.depreciationRate.value = asset.DepreciationRate;
    dataAsset.depreciationCost.value = format.formatMoney(
        (asset.DepreciationRate * asset.Cost) / 100
    );
    dataAsset.trackedYear = asset.TrackedYear;
    dataAsset.purchaseDate.value = format.formatDateToyyyyMMdd(
        asset.PurchaseDate
    );
    dataAsset.usedDate.value = format.formatDateToyyyyMMdd(asset.UsedDate);
    dataAsset.createdDate.value = format.formatDateToyyyyMMdd(
        asset.CreatedDate
    );
    dataAsset.modifyDate.value = format.formatDateToyyyyMMdd(asset.ModifyDate);
}

/**
 * Xử lý sự kiện keydown vào close icon
 * @param {*} event
 * Author: TTNham (5/8/2023)
 */
const onKeydownClose = (event) => {
    if (event.key === "Tab") {
        event.preventDefault();
        input1.value.onFocus();
    }
    if (event.key === "Enter") {
        event.preventDefault();
        emit("closeForm", false);
    }
};

/**
 * Phím tắt form
 */

function shortCutForm(event) {
    /**
     * Cất dữ liệu: Ctrl + S
     */
    if (event.ctrlKey && event.key === "s") {
        event.preventDefault();
        submitForm();
    }
    /**
     * Thoát nhập form
     */
    if (event.key === "Escape") {
        event.preventDefault();
        emit("closeForm", false);
    }
}

/**
 * Validate dữ liệu
 * Author: TTNham (4/8/2023)
 */
const error = [];
const validateInputs = () => {
    try {
        let isValid = true;
        errorDialogMsg = "Cần phải nhập thông tin <b>";
        error.push(
            conditionValidate(
                dataAsset.assetCode,
                resource.TitleInput.AssetCode
            )
        );
        error.push(
            conditionValidate(
                dataAsset.assetName,
                resource.TitleInput.AssetName
            )
        );
        error.push(
            conditionValidate(
                dataAsset.departmentCode,
                resource.TitleInput.DepartmentCode
            )
        );
        error.push(
            conditionValidate(
                dataAsset.assetCategoryCode,
                resource.TitleInput.AssetCategoryCode
            )
        );
        error.push(
            conditionValidate(dataAsset.quantity, resource.TitleInput.Quantity)
        );
        error.push(conditionValidate(dataAsset.cost, resource.TitleInput.Cost));
        error.push(
            conditionValidate(
                dataAsset.lifeTime,
                resource.TitleInput.DepartmentCode
            )
        );
        error.push(
            conditionValidate(
                dataAsset.depreciationRate,
                resource.TitleInput.DepreciationRate
            )
        );
        error.push(
            conditionValidate(
                dataAsset.depreciationCost,
                resource.TitleInput.DepreciationCost
            )
        );
        error.push(
            conditionValidate(
                dataAsset.purchaseDate,
                resource.TitleInput.PurchaseDate
            )
        );
        error.push(
            conditionValidate(dataAsset.usedDate, resource.TitleInput.UsedDate)
        );
        error.push(
            purchaseDateLessUsedDateValidate(
                dataAsset.purchaseDate.value,
                dataAsset.usedDate.value
            ) || ""
        );
        if (error.join("").length) isValid = false;
        error.forEach((item) => {
            if (item !== "") errorDialogMsg += item + ", ";
        });
        errorDialogMsg = errorDialogMsg.substring(0, errorDialogMsg.length - 2);
        if (!endNumberValidate(dataAsset.assetCode.value)) {
            errorDialogMsg += resource.Message.AssetNotEndChar + "<br/>";
            dataAsset.assetCode.errorMsg = resource.Message.AssetNotEndChar;
        }
        errorDialogMsg += "</b>";
        error.length = 0;
        return isValid;
    } catch (error) {
        showDialogError(error);
    }
};

/**
 * Xử lý tạo data tạo bản ghi mới
 * Author: TTNham (30/08/2023)
 */
const setDataForCreate = () => {
    const data = {};
    for (const key in dataAsset) {
        if (key === "createdDate" || key === "modifyDate") continue;
        data[key] = dataAsset[key].value;
    }
    return {
        ...data,
        assetCategoryId: listAssetCategories.value.find(
            (item) =>
                item.AssetCategoryCode.trim() ===
                dataAsset.assetCategoryCode.value.trim()
        ).AssetCategoryId,
        departmentId: listDepartments.value.find(
            (item) =>
                item.DepartmentCode.trim() ===
                dataAsset.departmentCode.value.trim()
        ).DepartmentId,
        cost: format.unFomatMoney(dataAsset.cost.value),
        depreciationRate: dataAsset.depreciationRate.value / 100,
    };
};

const setDataForUpdate = () => {
    const data = {};
    for (const key in dataAsset) {
        if (key === "createdDate" || key === "modifyDate") continue;
        data[key] = dataAsset[key].value;
    }
    return {
        ...data,
        assetCategoryId: listAssetCategories.value.find(
            (item) =>
                item.AssetCategoryCode.trim() ===
                dataAsset.assetCategoryCode.value.trim()
        ).AssetCategoryId,
        departmentId: listDepartments.value.find(
            (item) =>
                item.DepartmentCode.trim() ===
                dataAsset.departmentCode.value.trim()
        ).DepartmentId,
    };
};

/**
 * Thêm tài sản
 * Author: TTNham (30/08/2023)
 */
const createAsset = async () => {
    try {
        const asset = setDataForCreate();
        await addNewAsset(asset);
        emitter.emit("getAssetList");
        return 1;
    } catch (error) {
        errorApi(error);
    }
};

/**
 * Sửa tài sản
 * Author: TTNham (30/08/2023)
 */
const editAsset = async () => {
    try {
        const asset = setDataForUpdate();
        await updateAsset(props.assetEdit.AssetId, asset);
        emitter.emit("getAssetList");
        return 1;
    } catch (error) {
        errorApi(error);
    }
};

/**
 * Hàm kiểm tra điều kiện validate chung
 * Author: TTNham (03/08/2023)
 * @param {*} input
 */
const conditionValidate = (input, inputName) => {
    if (input.value === "" || input.value === null) {
        input.errorMsg = inputName + resource.Message.NotEmpty;
        return inputName.toLowerCase();
    } else {
        input.errorMsg = "";
        return "";
    }
};

/**
 * Focus vào ô input bị lỗi đầu tiên
 * Author: TTNham(11/09/2023)
 */

const focusInputError = () => {
    const inputErrors = [
        input1,
        input2,
        input3,
        input4,
        input5,
        input6,
        input7,
        input8,
        input9,
    ].filter((input) => {
        return input.value && input.value.isError();
    });
    if (inputErrors.length) {
        inputErrors[0].value.onFocus();
    }
};

/**
 * Cập nhật giá trị hao mòn năm khi nguyên giá thay đổi
 */
const costUpdate = computed({
    get() {
        return dataAsset.cost.value;
    },

    set(newCost) {
        dataAsset.cost.value = newCost;
        const value = Math.round(
            (format.unFomatMoney(newCost) *
                format.unFomatMoney(dataAsset.depreciationRate.value)) /
                100
        );
        dataAsset.depreciationCost.value = format.formatMoney(value);
    },
});

/**
 * Cập nhật tỷ lệ hao mòn năm
 */

const depreciationRateUpdated = computed({
    get() {
        return dataAsset.depreciationRate.value;
    },
    set(newDepreciationRate) {
        dataAsset.depreciationRate.value = newDepreciationRate;
        const val = Math.round(
            (format.unFomatMoney(newDepreciationRate) / 100) *
                format.unFomatMoney(dataAsset.cost.value)
        );
        dataAsset.depreciationCost.value = format.formatMoney(val);
    },
});

// Giá trị hao mòn năm thay đổi thì tỷ lệ hao mòn thay đổi theo
const depreciationCostUpdated = computed({
    get() {
        return dataAsset.depreciationCost.value;
    },
    set(newDepreciationCost) {
        dataAsset.depreciationCost.value = newDepreciationCost;
        const val = (
            (format.unFomatMoney(newDepreciationCost) /
                format.unFomatMoney(dataAsset.cost.value)) *
            100
        ).toFixed(2);
        dataAsset.depreciationRate.value = val;
        if (format.unFomatMoney(cost.value) == "0")
            dataAsset.depreciationRate.value = 0;
    },
});

const lifeTimeUpdated = computed({
    get() {
        return dataAsset.lifeTime.value;
    },
    set(newLifeTime) {
        dataAsset.lifeTime.value = newLifeTime;
        newLifeTime = format.unFomatMoney(newLifeTime);
        let val;
        if (newLifeTime == 0) val = 0;
        else val = ((1 / newLifeTime) * 100).toFixed(2);
        dataAsset.depreciationRate.value = val;
        const newDepreciationCost =
            (val / 100) * format.unFomatMoney(dataAsset.cost.value);
        dataAsset.depreciationCost.value =
            format.formatMoney(newDepreciationCost);
    },
});

/**
 * Cập nhật giá trị errorMsg khi blur
 * Author: TTNham(4/8/2023)
 */
const updateErrorMsg = (inputElement, inputName) => {
    inputElement.errorMsg = inputName + resource.Message.NotEmpty;
};

/**
 * Gửi form lưu dữ liệu
 * Author: TTNham (4/8/2023)
 */
const submitForm = async () => {
    let res = 0;
    if (!props.isEditedForm) return;
    try {
        if (
            validateInputs() &&
            !purchaseDateLessUsedDateValidate(
                dataAsset.purchaseDate.value,
                dataAsset.usedDate.value
            )
        ) {
            if (!props.assetEdit) {
                if (!endNumberValidate(dataAsset.assetCode.value)) {
                    showDialogError(resource.Message.AssetNotEndChar);
                    return;
                } else {
                    res = await createAsset();
                    if (res === 1)
                        showToastMsg(
                            QLTSEnum.ToastMsg.Success,
                            resource.Message.SaveDataSuccess
                        );
                }
            } else {
                res = await editAsset();
                if (res === 1)
                    showToastMsg(
                        QLTSEnum.ToastMsg.Success,
                        resource.Message.UpdateDataSuccess
                    );
            }
            if (res === 1) emit("closeForm", false);
            // dataAsset = {};
        } else {
            showDialogError(errorDialogMsg);
        }
    } catch (error) {
        console.log(error);
        emitter.emit("showWarning", error);
    }
};

/**
 * Cập nhật tên bộ phận sử dụng khi chọn mã bộ phận sử dụng
 * Author:  TTNham (4/8/2023)
 * @param {*} deparment
 */
const onUpdateDepartmentCode = (deparment) => {
    dataAsset.departmentName.value =
        deparment[QLTSEnum.Department.NameIndex].trim();
    dataAsset.departmentCode.value =
        deparment[QLTSEnum.Department.CodeIndex].trim();
};

/**
 * Cập nhật tên loại tài sản khi chọn mã loại tàn sản
 * Author:  TTNham (4/8/2023)
 * @param {*} category
 */
const onUpdateAssetCategoryCode = (category) => {
    dataAsset.assetCategoryName.value =
        category[QLTSEnum.AssetCategory.NameIndex].trim();
    dataAsset.assetCategoryCode.value =
        category[QLTSEnum.AssetCategory.CodeIndex].trim();
    dataAsset.depreciationRate.value =
        category[QLTSEnum.AssetCategory.DepreciationRateIndex];
    dataAsset.lifeTime.value = category[QLTSEnum.AssetCategory.LifeTimeIndex];
};

defineExpose({ focusInputError });
</script>

<style scoped>
@import url("../css/form-asset.css");
</style>
