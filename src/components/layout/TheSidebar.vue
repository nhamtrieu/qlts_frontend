<template>
    <div :class="['sidebar', isSidebarCollapsed ? 'collapse' : '']">
        <div class="sidebar-header">
            <div class="logo icon--logo"></div>
            <div class="title">MISA QLTS</div>
        </div>
        <div class="nav">
            <template v-for="(item, index) in navListItem" :key="index">
                <router-link
                    :title="item.title"
                    :class="[
                        'nav-item',
                        item.isActive ? 'nav-item--active' : '',
                    ]"
                    :to="item.link || '/'"
                    @click="toggleChildrenMenu(item)"
                >
                    <div
                        :class="[
                            'root-menu',
                            item.isActive ? 'root-menu--active' : '',
                        ]"
                    >
                        <QLTSIcon
                            type="box"
                            :icon="item.icon + (item.isActive ? '-active' : '')"
                        />
                        <div class="nav__text">{{ item.text }}</div>
                        <div class="nav-item__dropdown" v-if="item.isDropdown">
                            <QLTSIcon type="box" icon="chevron-down" />
                        </div>
                    </div>
                </router-link>
                <template v-if="item.isShowChildrenMenu && item.children">
                    <router-link
                        v-for="(childItem, index) in item.children"
                        :key="index"
                        :to="childItem.link"
                        class="child-menu"
                    >
                        <div class="child-menu-item">
                            {{ childItem.text }}
                        </div>
                    </router-link>
                </template>
            </template>
        </div>
        <div @click="onToggleSidebar" class="nav-action">
            <div class="nav-action__icon">
                <QLTSIcon
                    type="box"
                    :icon="isSidebarCollapsed ? 'extend' : 'collapse'"
                />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";

import QLTSIcon from "../icon/QLTSIcon.vue";
import resource from "@/helper/resource";
import { useStore } from "vuex";

const navListItem = ref([
    {
        text: "Quản lý",
        icon: "overview",
        title: resource.Sidebar.Overview,
        isActive: false,
        isDropdown: false,
        link: "/quan-ly",
    },
    {
        text: resource.Sidebar.Asset,
        icon: "asset",
        title: resource.Sidebar.Asset,
        isActive: false,
        isDropdown: false,
        link: resource.Link.Asset,
    },
    {
        text: "Ghi tăng",
        icon: "asset",
        title: "Ghi tăng",
        isActive: false,
        isDropdown: false,
        link: "/ghi-tang",
    },
]);

const store = useStore();

// check collapsed sidebar
const isSidebarCollapsed = ref(store.getters.isCollapsed);

const emits = defineEmits(["collapsed"]);

/**
 * Thu gọn và mở rộng sidebar
 * Author: TTNham (29/07/2023)
 */
function onToggleSidebar() {
    isSidebarCollapsed.value = !isSidebarCollapsed.value;
    emits("collapsed", isSidebarCollapsed.value);
}

function toggleChildrenMenu(item) {
    if (item.isDropdown) {
        item.isShowChildrenMenu = !item.isShowChildrenMenu;
    }
}
</script>

<style scoped>
@import url("../../css/sidebar.css");
</style>
