<template>
    <!-- <QLTSLoading v-if="store.getters.loading" /> -->

    <div class="main-table" ref="contentTableRef">
        <table class="tbl" :class="props.class">
            <thead>
                <tr class="tbl__header-row">
                    <th v-if="props.isCheckbox" style="width: 34px">
                        <input
                            @change="($event) => checkAll($event)"
                            type="checkbox"
                            name=""
                            id=""
                            ref="isCheckAll"
                            :checked="isCheckedAll"
                        />
                    </th>
                    <th
                        v-for="(item, index) in columns"
                        :key="index"
                        :style="item.style"
                        style="color: #1f1f1f"
                        :title="item.title"
                        :class="[
                            { 'right-text': item.isNumber },
                            {
                                'center-text': !item.isText && !item.isNumber,
                            },
                        ]"
                    >
                        {{ item.name }}
                    </th>
                    <th
                        v-if="isRowAction"
                        style="width: 90px"
                        class="row-action asset-action"
                    >
                        Chức năng
                    </th>
                    <th
                        v-if="isIncreaseAction"
                        style="width: 90px"
                        class="row-action"
                    ></th>
                </tr>
            </thead>
            <tbody
                :style="{
                    'max-height': tbodyMaxHeight ? tbodyMaxHeight : '',
                    height: tbodyMaxHeight ? tbodyMaxHeight : '',
                }"
                @scroll="closeContextMenu"
            >
                <tr
                    v-for="(item, index) in listData"
                    :key="index"
                    ref="rowRef"
                    :class="[{ checked: item.isChecked }]"
                    @contextmenu.prevent="showContextMenu($event, item)"
                    @keydown="onKeydownRow($event)"
                    @mousedown="onMousedownRow($event)"
                    @dbclick="props.showEdit(item)"
                    @click="onClickRow($event, item, index)"
                >
                    <td v-if="isCheckbox" style="width: 34px">
                        <input
                            @click="onClickChecked($event, item, index)"
                            :class="{ checked: item.isChecked }"
                            type="checkbox"
                            :checked="item.isChecked"
                        />
                    </td>
                    <td
                        v-for="(column, index) in columns"
                        :key="index"
                        :title="
                            column.isNumber
                                ? format.formatMoney(item[column.key])
                                : item[column.key]
                        "
                        :style="column.style"
                        :class="[
                            { 'right-text': column.isNumber },
                            {
                                'center-text':
                                    !column.isText && !column.isNumber,
                            },
                        ]"
                        @mouseover="checkScroll($event)"
                        v-tippy="{
                            animation: fade,
                            placement: column.isNumber
                                ? 'bottom-end'
                                : column.isText
                                ? 'bottom-start'
                                : 'bottom',
                        }"
                        :content="
                            showTippy
                                ? column.isNumber
                                    ? format.formatMoney(item[column.key])
                                    : item[column.key]
                                : null
                        "
                    >
                        {{
                            column.isNumber
                                ? format.formatMoney(item[column.key])
                                : item[column.key]
                        }}
                    </td>
                    <td
                        v-if="isRowAction"
                        class="row-action"
                        style="width: 90px"
                    >
                        <div class="tbl__action">
                            <QLTSIcon
                                @click="onClickActionEdit(item)"
                                type="box"
                                icon="edit"
                                :content="resource.Tooltips.Edit"
                                v-tippy="{
                                    animation: 'fade',
                                    placement: 'bottom',
                                }"
                            />
                            <QLTSIcon
                                type="box"
                                icon="duplicate"
                                :content="resource.Tooltips.Duplicate"
                                v-tippy="{
                                    animation: 'fade',
                                    placement: 'bottom',
                                }"
                                @click="onClickActionDuplicate(item)"
                            />
                        </div>
                    </td>
                    <td
                        class="td__action--absolute row-action"
                        v-if="isIncreaseAction"
                        style="width: 90px"
                    >
                        <div class="icon">
                            <QLTSIcon
                                @click="props.showEdit(item)"
                                type="box"
                                icon="edit"
                                title="Chỉnh sửa"
                                :content="resource.Tooltips.Edit"
                                v-tippy="{
                                    animation: 'fade',
                                    placement: 'bottom',
                                }"
                                v-on-click-outside="
                                    () => {
                                        iconClick = false;
                                    }
                                "
                            />
                        </div>
                        <div class="icon">
                            <QLTSIcon
                                type="box"
                                icon="delete"
                                :content="resource.Tooltips.Delete"
                                v-tippy="{
                                    animation: 'fade',
                                    placement: 'bottom',
                                }"
                                @click="deleteItem(item)"
                                v-on-click-outside="
                                    () => {
                                        iconClick = false;
                                    }
                                "
                            />
                        </div>
                    </td>
                </tr>
            </tbody>
            <tfoot v-if="isSummary">
                <tr>
                    <td v-if="isCheckbox" style="width: 34px"></td>
                    <td
                        v-for="(column, index) in columns"
                        :key="index"
                        :class="[{ 'right-text': column.isNumber }]"
                        :style="column.style"
                    >
                        {{
                            column.isNumber && column.key !== "index"
                                ? format.formatMoney(
                                      summaryColNumber(column.key)
                                  )
                                : ""
                        }}
                    </td>
                    <td></td>
                </tr>
            </tfoot>
        </table>

        <QLTSContextMenu
            v-if="isContextMenu"
            ref="contextMenu"
            v-on-click-outside="closeContextMenu"
            :item="contextMenuItem"
            :type="props.contextMenuType"
        />
    </div>
</template>
<script setup>
import { ref, onMounted, nextTick, onUpdated } from "vue";
import { useStore } from "vuex";

import { vOnClickOutside } from "@vueuse/components";
import QLTSContextMenu from "../contextmenu/QLTSContextMenu.vue";
import QLTSIcon from "../icon/QLTSIcon.vue";

import resource from "@/helper/resource";
import format from "@/helper/format";

const store = useStore();

const emit = defineEmits([
    "recordsSelected",
    "actionEditRow",
    "actionDuplicateRow",
    "showAssetIncreaseForm",
    "deleteItem",
    "setDataDetailTable",
]);

const props = defineProps({
    isCheckbox: {
        type: Boolean,
        default: false,
    },
    isPagination: {
        type: Boolean,
        default: false,
    },
    isTotal: {
        type: Boolean,
        defalse: false,
    },
    isRowAction: {
        type: Boolean,
        default: false,
    },
    isSummary: {
        type: Boolean,
        default: false,
    },
    isIncreaseAction: {
        type: Boolean,
        default: false,
    },
    isContextMenu: {
        type: Boolean,
        default: false,
    },
    isMasterTable: {
        type: Boolean,
        default: false,
    },
    contextMenuType: {
        type: Number,
        default: 1,
    },
    class: {
        type: String,
        default: "",
    },
    data: {
        type: Array,
        default: () => [],
    },
    tbodyMaxHeight: {},
    columns: {
        type: Array,
        default: () => [
            {
                // Tên cột
                name: "",
                // Tên thuộc tính của dữ liệu
                key: "",
                tootip: "",
                // Có phải là số hay không
                isNumber: false,
                isText: false,
                type: "",
                style: {},
            },
        ],
    },
    listAction: {},
    showEdit: Function,
});

const isData = ref(false);
const isCheckedAll = ref(false);
const listItemSelected = ref([]);
const rowRef = ref(null);
const contextMenu = ref(null);
const contextMenuItem = ref(null);
const contentTableRef = ref(null);
const listData = ref(props.data);
const delay = 500;
const click = ref(0);
const iconClick = ref(false);
const showTippy = ref(false);

onMounted(() => {
    isData.value = props.data.length > 0;
    scrollToItem();
});

onUpdated(() => {
    listData.value = props.data;
    if (listData.value.length > 0) {
        isData.value = true;
        isCheckedAll.value = listData.value.every((item) => item?.isChecked);
    } else {
        isData.value = false;
    }
});

/**
 * Checked tất cả bản ghi
 * Author: TTNham (04/08/2023)
 */
const checkAll = (event) => {
    const isChecked = event.target.checked;
    listData.value.forEach((item) => {
        item.isChecked = isChecked;
    });
};

/**
 * Hàm xử lý khi nhấn chuột vào hàng
 * @param {*} event
 * Author: TTNham (25/09/2023)
 */

const onMousedownRow = (event) => {
    if (event.shiftKey) {
        // Ngăn chặn bôi đen chữ khi nhấn shift
        event.preventDefault();
    }
};

/**
 * Cập nhật trạng thái check của hàng
 * @param {*} event
 * @param {*} item
 * Author:TTNham (04/08/2023)
 */
const onClickChecked = (event, item) => {
    event.stopPropagation();
    item.isChecked = !item.isChecked;
    if (item.isChecked) {
        listItemSelected.value.push(item);
        emit("recordsSelected", listItemSelected.value);
    } else {
        isCheckedAll.value = false;
        listItemSelected.value = listItemSelected.value.filter(
            (it) => it.assetId !== item.assetId
        );
        emit("recordsSelected", listItemSelected.value);
    }
};

/**
 * Hàm xử lý khi click vào hàng
 * @param {*} event
 * @param {*} item
 * @param {*} index
 * Author: TTNham (25/09/2023)
 */
const onClickRow = (event, item, index) => {
    if (iconClick.value) return;
    if (event.shiftKey) {
        event.preventDefault();
        const firstCheckedIndex = listData.value.findIndex(
            (it) => it.isChecked
        );
        if (firstCheckedIndex === -1) {
            item.isChecked = true;
            isCheckedAll.value = false;
            listItemSelected.value.push(item);
            emit("recordsSelected", listItemSelected.value);
        } else {
            const lastCheckedIndex = index;
            const minIndex = Math.min(firstCheckedIndex, lastCheckedIndex);
            const maxIndex = Math.max(firstCheckedIndex, lastCheckedIndex);
            listData.value.forEach((it, idx) => {
                if (idx >= minIndex && idx <= maxIndex) it.isChecked = true;
            });
            listData.value.forEach((it, idx) => {
                if (idx < minIndex || idx > maxIndex) it.isChecked = false;
            });
            listItemSelected.value = [];
            listData.value
                .filter((it) => it.isChecked)
                .forEach((it) => {
                    listItemSelected.value.push(it);
                });
            // Xoá các phần tử trùng nhau
            listItemSelected.value = [...new Set(listItemSelected.value)];

            emit("recordsSelected", listItemSelected.value);

            if (maxIndex - minIndex + 1 !== listData.value.length) {
                isCheckedAll.value = false;
            }
        }
    } else if (event.ctrlKey) {
        item.isChecked = !item.isChecked;
        if (item.isChecked) {
            listItemSelected.value.push(item);
            emit("recordsSelected", listItemSelected.value);
        } else {
            isCheckedAll.value = false;
            listItemSelected.value = listItemSelected.value.filter(
                (it) => it.assetId !== item.assetId
            );
            emit("recordsSelected", listItemSelected.value);
        }
    } else {
        listData.value.forEach((it) => {
            if (it != item) it.isChecked = false;
        });
        item.isChecked = !item.isChecked;
        if (isCheckedAll.value) {
            isCheckedAll.value = false;
        }
        // isCheckedAll.value = listData.value.every((item) => item.isChecked);
        if (item.isChecked) {
            listItemSelected.value = [item];
            emit("recordsSelected", listItemSelected.value);
        } else {
            listItemSelected.value = [];
            emit("recordsSelected", listItemSelected.value);
        }
    }
    emit("setDataDetailTable", listItemSelected);
    click.value = 0;
};

/**
 * Hàm xử lý khi double click vào hàng
 * @param {*} event
 * @param {*} item
 * Author: TTNham (25/09/2023)
 */
const onDoubleClickRow = (event, item) => {
    // event.stopPropagation();
    props.showEdit(item);
};

/**
 * Lên xuống bằng phím mũi tên
 * Author: TTNHam (08/09/2023)
 * @param {*} event
 * @param {*} item
 */
const onKeydownRow = (event) => {
    const scrollIntoViewOptions = {
        behavior: "smooth",
        block: "center",
        inline: "nearest",
    };
    let index = listData.value.findIndex((it) => it.isChecked);
    if (event.key === "ArrowDown") {
        if (index < listData.value.length - 1) {
            listData.value[index + 1].isChecked = true;
            listData.value[index].isChecked = false;
            rowRef.value[index + 1].focus();
            rowRef.value[index + 1].scrollIntoView(scrollIntoViewOptions);
        }
    } else if (event.key === "ArrowUp") {
        if (index > 0) {
            listData.value[index - 1].isChecked = true;
            listData.value[index].isChecked = false;
            rowRef.value[index - 1].focus();
            rowRef.value[index - 1].scrollIntoView(scrollIntoViewOptions);
        }
    }
};

/** Hiển thị context menu
 * Author: TTNham (31/08/2023)
 * @param {*} event
 * @param {*} item
 */
const showContextMenu = (event, item) => {
    if (props.isContextMenu) {
        nextTick(() => {
            listData.value.forEach((asset) => {
                asset.isChecked = false;
                if (item === asset) asset.isChecked = true;
            });
            contextMenu.value.showContextMenu(event, item);
            contextMenuItem.value = item;
            item.isChecked = true;
        });
    }
};

/**
 * Ẩn context menu
 * Author: TTNham (03/09/2023)
 */
const closeContextMenu = () => {
    if (props.isContextMenu) {
        nextTick(() => {
            contextMenu.value.closeContextMenu();
            contextMenuItem.value = null;
        });
    }
};

/**
 * Hàm xử lý khi click vào nút sửa
 * @param {*} item
 * Author: TTNham (04/08/2023)
 */
const onClickActionEdit = (item) => {
    emit("actionEditRow", item);
};

/**
 * Hàm xử lý khi click vào nút nhân bản
 * @param {*} item
 * Author: TTNham (26/09/2023)
 */
const onClickActionDuplicate = (item) => {
    emit("actionDuplicateRow", item);
};

/**
 * Hàm tính tổng
 * @param {*} key
 * Author: TTNham (26/09/2023)
 */
const summaryColNumber = (key) => {
    return listData.value.reduce((total, item) => total + Number(item[key]), 0);
};

/**
 * Hàm lấy chiều cao của bảng
 * Author: TTNham (27/09/2023)
 */
const getTableHeight = () => {
    return contentTableRef.value.clientHeight;
};

/**
 * xóa item
 * @param {*} item
 */
const deleteItem = (item) => {
    iconClick.value = true;
    listData.value.forEach((item) => (item.isChecked = false));
    if (!item.isChecked) item.isChecked = true;

    emit("deleteItem", item);
};

function scrollToItem() {
    const scrollIntoViewOptions = {
        behavior: "smooth",
        block: "center",
        inline: "nearest",
    };
    if (props.isMasterTable) {
        props.data.forEach((item, index) => {
            if (item.IncreaseId === store.getters.idIncreaseEditing)
                rowRef.value[index].scrollIntoView(scrollIntoViewOptions);
        });
    }
}

const checkScroll = (event) => {
    if (event.currentTarget.scrollWidth > event.currentTarget.clientWidth) {
        showTippy.value = true;
    } else {
        showTippy.value = false;
    }
};

defineExpose({ getTableHeight });
</script>
<style scoped>
@import url("../../css/table.css");
</style>
