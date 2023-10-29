<template>
    <div class="overlay">
        <form
            action=""
            class="edit-asset-increase"
            @keydown.esc="emit('hideAssetIncreaseForm')"
        >
            <div class="header">
                <div class="title">
                    {{ titleForm }}
                </div>
                <QLTSIcon
                    type="box"
                    icon="close"
                    @click="emit('hideAssetIncreaseForm')"
                    v-tippy="{
                        animation: 'fade',
                        placement: 'top',
                    }"
                    :content="resource.Tooltips.CloseHotKey"
                />
            </div>
            <div class="main">
                <div class="department-info">
                    <div class="title">Bộ phận sử dụng</div>
                    <QLTSInput
                        :is-disabled="true"
                        :is-readonly="true"
                        v-model="departmentName"
                    />
                </div>
                <div class="cost-info">
                    <div class="title-formation">Nguyên giá</div>
                    <div class="title-formation">
                        <div class="title-fomation-source">
                            Nguồn hình thành
                        </div>
                        <div class="title-fomation-cost">Giá trị</div>
                    </div>
                    <div class="main-title"></div>
                    <div class="main-cost-info">
                        <div
                            class="formation-source"
                            v-for="(item, index) in costInfo"
                            :key="index"
                        >
                            <div class="info">
                                <QLTSDropdown
                                    typeField="with-icon"
                                    :listItem="listSource"
                                    v-model="item.formationSource"
                                />
                                <div class="fomation-cost">
                                    <QLTSInput
                                        v-model="item.cost"
                                        :is-right-text="true"
                                        :is-format-number="true"
                                    />
                                </div>
                            </div>
                            <div class="action">
                                <QLTSIcon
                                    type="box"
                                    icon="square-add"
                                    @click="addFormationSourceInfo(index)"
                                />
                                <QLTSIcon
                                    type="box"
                                    icon="circle-remove"
                                    :class="{
                                        'disabled-icon': costInfo.length == 1,
                                    }"
                                    @click="removeInfomationSourceInfo(index)"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="summary-info">
                    <div class="summary-title">
                        <QLTSInput
                            :is-disabled="true"
                            :is-readonly="true"
                            v-model="titleSummary"
                        />
                    </div>
                    <div class="summary-cost">
                        <QLTSInput
                            :is-disabled="true"
                            :is-readonly="true"
                            :is-right-text="true"
                            :is-format-number="true"
                            v-model="totalSummary"
                        />
                    </div>
                </div>
            </div>
            <div class="footer">
                <QLTSButton
                    type="cancel"
                    @click="emit('hideAssetIncreaseForm')"
                    v-tippy="{
                        animation: 'fade',
                        placement: 'top',
                    }"
                    :content="resource.Tooltips.CloseHotKey"
                    >Hủy</QLTSButton
                >
                <QLTSButton
                    type="primary"
                    @click="setSourcesData"
                    v-tippy="{
                        animation: 'fade',
                        placement: 'top',
                    }"
                    :content="resource.Tooltips.SaveHotKey"
                    >Lưu</QLTSButton
                >
            </div>
        </form>
    </div>
</template>
<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import { useStore } from "vuex";
import emitter from "tiny-emitter/instance";

import QLTSButton from "@/components/button/QLTSButton.vue";
import QLTSIcon from "@/components/icon/QLTSIcon.vue";
import QLTSInput from "@/components/input/QLTSInput.vue";
import QLTSDropdown from "@/components/dropdown/QLTSDropdown.vue";

import format from "@/helper/format";
import resource from "@/helper/resource";
import QLTSEnum from "@/helper/enum";
import { showDialogError } from "@/helper/common";
import { getListSourceById } from "@/apis/sourceApis";

const store = useStore();
const emit = defineEmits(["hideAssetIncreaseForm", "setSourcesData"]);
const props = defineProps({
    departmentName: {
        type: String,
        default: "",
    },
    itemEditSource: {
        type: Object,
        default: {},
    },
    isEditIncreaseAsset: {
        type: Boolean,
        default: false,
    },
});
const titleSummary = ref("Tổng");
const titleForm = ref("");
const departmentName = ref("");
const sources = ref([]); // danh sách nguồn hình thành đang có trong form
const deleteSourceIds = ref([]); // danh sách nguồn hình thành cần xóa
const prevSource = ref([]); // danh sách nguồn hình thành lúc đầu
const unUpdateSource = ref([]); // danh sách nguồn hình thành nguyên bản
const sourceUpdate = ref([]); // danh sách nguồn hình thành thay đổi
const sourceCreate = ref([]); // danh sách nguồn hình thành thêm mới
const mapListSource = ref(
    new Map([
        [QLTSEnum.Source.Central, resource.Source.Center],
        [QLTSEnum.Source.Provincial, resource.Source.Province],
        [QLTSEnum.Source.District, resource.Source.District],
        [QLTSEnum.Source.Commune, resource.Source.Commune],
    ])
);

onMounted(async () => {
    store.dispatch("setLoading", true);
    departmentName.value = props.departmentName;
    const assetIncreaseItem = props.itemEditSource;

    if (!props.itemEditSource.IncreaseAssetId) {
        costInfo.value.push({
            formationSource: "",
            cost: ref(format.formatMoney(assetIncreaseItem.IncreaseCost)),
        });
    } else {
        const response = await getListSourceById(
            props.itemEditSource.IncreaseAssetId,
            "increase-asset-id"
        );

        unUpdateSource.value.push(...response.data);

        if (!props.itemEditSource.Sources?.length) {
            assetIncreaseItem.Sources = [...response.data];
        } else {
            assetIncreaseItem.Sources = props.itemEditSource.Sources;
        }

        if (!assetIncreaseItem.Sources?.length) {
            costInfo.value.push({
                formationSource: "",
                cost: ref(
                    format.formatMoney(
                        assetIncreaseItem.Cost || assetIncreaseItem.IncreaseCost
                    )
                ),
            });
        } else {
            assetIncreaseItem.Sources.map((item) => {
                costInfo.value.push({
                    formationSource: mapListSource.value.get(item.SourceType),
                    cost: ref(format.formatMoney(item.Cost)),
                    sourceId: item.SourceId,
                });
                if (item.SourceId !== "") {
                    prevSource.value.push({ ...item });
                }
            });
        }
    }
    titleForm.value =
        resource.TitleLabel.EditAssetIncrease + props.itemEditSource.AssetName;
    store.dispatch("setLoading", false);
});

const costInfo = ref([]);

const listSource = computed({
    get() {
        return [...mapListSource.value.values()];
    },
    set(value) {
        return value;
    },
});

const totalSummary = computed({
    get: () =>
        format.formatMoney(
            costInfo.value.reduce(
                (total, item) => total + format.unFomatMoney(item.cost),
                0
            ) || 0
        ),
});

/**
 * Hàm thêm 1 nguồn hình thành
 * Author: TTNham (02/10/2023)
 */
const addFormationSourceInfo = (index) => {
    const info = {
        formationSource: "Ngân sách trung ương",
        cost: ref(0),
        sourceId: "",
    };
    costInfo.value.splice(index + 1, 0, info);
};

/**
 * Hàm xóa 1 nguồn hình thành đồng thời thêm nguồn hình thành cần xóa
 * @param {*} index
 * Author: TTNham (02/10/2023)
 */
const removeInfomationSourceInfo = (index) => {
    if (costInfo.value.length === 1) return;
    const deleteSource = costInfo.value.splice(index, 1);
    if (deleteSource[0].sourceId !== "") {
        deleteSourceIds.value.push(deleteSource[0].sourceId);
    }
};

/**
 * Hàm validate thông tin form
 * Author: TTNham (06/10/2023)
 */
const validateSourceForm = () => {
    const listSource = new Set(
        costInfo.value.map((item) => item.formationSource)
    );

    if (listSource.size !== costInfo.value.length) {
        showDialogError(resource.Message.DuplicateSourceName);
        return false;
    }
    return listSource.size === costInfo.value.length;
};

/**
 * Hàm set giá trị nguồn hình thành cho tài sản
 * Author: TTNham(08/10/2023)
 */
const setSourcesData = () => {
    sources.value.length = 0;
    const reverseMap = new Map(
        [...mapListSource.value].map(([key, value]) => [value, key])
    );

    costInfo.value.map((item) => {
        const newItem = {
            AssetId: props.itemEditSource.AssetId,
            Cost: format.unFomatMoney(item.cost),
            IncreaseAssetId: props.itemEditSource.IncreaseAssetId,
            SourceType: reverseMap.get(item.formationSource),
            SourceId: item.sourceId,
        };

        if (
            !newItem.SourceId ||
            newItem.SourceId === "00000000-0000-0000-0000-000000000000"
        ) {
            delete newItem.SourceId;
        }
        sourceCreate.value.push(newItem);
        sources.value.push(newItem);
        sourceCreate.value = sourceCreate.value.filter(
            (item) => !item.SourceId
        );
        sources.value.forEach((item) => {
            if (item.SourceId) {
                unUpdateSource.value.forEach((it) => {
                    if (
                        it.Cost != item.Cost ||
                        it.SourceType != item.SourceType
                    ) {
                        sourceUpdate.value.push(item);
                    }
                });
            }
        });
    });

    if (validateSourceForm()) {
        console.log(props.isEditIncreaseAsset);
        if (props.isEditIncreaseAsset) {
            emit("setSourcesData", {
                sources: sources.value,
                assetId: props.itemEditSource.AssetId,
                sourceCreate: sourceCreate.value,
                deleteSourceIds: deleteSourceIds.value,
                totalCost: format.unFomatMoney(totalSummary.value),
                sourceUpdate: sourceUpdate.value,
                item: props.itemEditSource,
            });
        } else {
            emitter.emit("setSourceAsset", {
                sources: sources.value,
                assetId: props.itemEditSource.AssetId,
                sourceCreate: sourceCreate.value,
                deleteSourceIds: deleteSourceIds.value,
                totalCost: format.unFomatMoney(totalSummary.value),
                sourceUpdate: sourceUpdate.value,
            });
        }
        emit("hideAssetIncreaseForm");
    }
};
</script>
<style scoped>
@import url("./asset-increase-form.css");
.textfield-container label {
    display: none;
}
</style>
