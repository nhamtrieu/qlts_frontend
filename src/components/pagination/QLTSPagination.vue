<template>
    <div class="pagination">
        <div class="pagination__total-record">
            Tổng số:
            <strong>{{ format.formatMoney(props.totalRecord) }}</strong> bản ghi
        </div>
        <div class="pagination__record">
            <QLTSDropdown
                :isIconCheck="false"
                typeField="with-icon"
                v-model="pagePerPage"
                :listItem="[10, 30, 50, 100, 200]"
            />

            <div class="pagination__num-page">
                <div class="pagination__page-before" @click="backPage">
                    <QLTSIcon
                        type="box"
                        icon="chevron-left"
                        :isDisabled="pageSelected === 1"
                        v-tippy="
                            pageSelected !== 1 && {
                                animation: 'fade',
                                placement: 'top',
                            }
                        "
                        :content="
                            pageSelected !== 1
                                ? resource.Tooltips.PrevPage
                                : null
                        "
                    />
                </div>
                <div
                    @click="pageIndexChoose(1)"
                    class="page-index"
                    :class="{ 'page-index--selected': pageSelected === 1 }"
                    v-tippy="{
                        animation: 'fade',
                        placement: 'top',
                    }"
                    :content="1"
                >
                    {{ 1 }}
                </div>
                <div v-if="isPageDotFirst" class="page-index page-index-dot">
                    ...
                </div>
                <template v-for="page in pages" :key="page">
                    <div
                        @click="pageIndexChoose(page)"
                        class="page-index"
                        :class="{
                            'page-index--selected': page === pageSelected,
                        }"
                        v-tippy="{
                            animation: 'fade',
                            placement: 'top',
                        }"
                        :content="page"
                    >
                        {{ page }}
                    </div>
                </template>
                <div v-if="isPageDotLast" class="page-index page-index-dot">
                    ...
                </div>
                <div
                    v-if="totalPage > 1"
                    @click="pageIndexChoose(totalPage)"
                    class="page-index"
                    :class="{
                        'page-index--selected': pageSelected === totalPage,
                    }"
                    v-tippy="{
                        animation: 'fade',
                        placement: 'top',
                    }"
                    :content="totalPage"
                >
                    {{ totalPage }}
                </div>
                <div class="pagination__page-after" @click="nextPage">
                    <QLTSIcon
                        type="box"
                        icon="chevron-right"
                        :isDisabled="pageSelected === totalPage"
                        v-tippy="
                            pageSelected !== totalPage && {
                                animation: 'fade',
                                placement: 'top',
                            }
                        "
                        :content="
                            pageSelected !== totalPage
                                ? resource.Tooltips.NextPage
                                : null
                        "
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, computed, onUpdated } from "vue";
import resource from "@/helper/resource";
import format from "@/helper/format";

import QLTSDropdown from "../dropdown/QLTSDropdown.vue";
import QLTSIcon from "../icon/QLTSIcon.vue";

const emit = defineEmits(["pageChanged"]);

const props = defineProps({
    totalRecord: {
        type: Number,
        default: 0,
    },
    totalPage: {
        type: Number,
        default: 1,
    },
    currentPage: {
        type: Number,
        default: 1,
    },
    visablePage: {
        type: Number,
        default: 3,
    },
    pageSize: {
        type: Number,
        default: 10,
    },
});

const pageSelected = ref(props.currentPage);
const isPageDotFirst = ref(false);
const isPageDotLast = ref(false);

let pageBefore = 0,
    pageAfter = 0;

const pagePerPage = computed({
    get() {
        return props.pageSize;
    },
    set(value) {
        emit("pageChanged", value);
        return value;
    },
});

const pages = computed(() => {
    let start = 2;
    let end = props.totalPage - 1;
    let pages = [];

    if (end > props.visablePage) {
        start = Math.max(
            pageSelected.value - Math.floor(props.visablePage / 2),
            start
        );
        end = Math.min(start + props.visablePage - 1, end);
        if (end - start < props.visablePage - 1) {
            start = end - props.visablePage + 1;
        }
    }
    if (start == 3) {
        start = 2;
    }
    if (end == props.totalPage - 2) {
        end = props.totalPage - 1;
    }
    pageBefore = start;
    pageAfter = end;
    for (let i = start; i <= end; i++) {
        pages.push(i);
    }
    return pages;
});

onMounted(() => {
    pageSelected.value = props.currentPage;
    isPageDotFirst.value = pageBefore !== 2;
    isPageDotLast.value = pageAfter !== props.totalPage - 1;
});

onUpdated(() => {
    pageSelected.value = props.currentPage;
    isPageDotFirst.value = pageBefore !== 2;
    isPageDotLast.value = pageAfter !== props.totalPage - 1;
});

/**
 * Hàm chọn số trang
 * Author: TTNham (26/08/2023)
 * @param {*} page
 */
function pageIndexChoose(page) {
    if (page !== pageSelected.value) {
        pageSelected.value = page;
        emit("pageChanged", pagePerPage.value, page);
    }
}

/**
 * Lùi trang
 * Author: TTNham (26/08/2023)
 */
function backPage() {
    if (pageSelected.value > 1) {
        pageSelected.value -= 1;
        emit("pageChanged", pagePerPage.value, pageSelected.value);
    }
}

/**
 * Tiến trang
 * Author: TTNham (26/08/2023)
 */
function nextPage() {
    if (pageSelected.value < props.totalPage) {
        pageSelected.value += 1;
        emit("pageChanged", pagePerPage.value, pageSelected.value);
    }
}
</script>

<style scoped>
@import url("./pagination.css");
.pagination .dropdown__list-item {
    align-items: center;
}
</style>
