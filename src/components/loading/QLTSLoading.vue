<template>
    <div class="loading">
        <QLTSIcon
            style="width: 32px; height: 32px"
            type="full"
            icon="loading"
        />
    </div>
</template>

<script setup>
import QLTSIcon from "../icon/QLTSIcon.vue";
</script>

<style scoped>
.loading {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.4);
    display: flex;
    justify-content: center;
    align-items: center;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 999;
}
</style>
