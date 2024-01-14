<template>
    <div class="form-info">
        <div class="form__header">
            <h1 class="form__title">Thông tin thanh vien</h1>
            <QLTSIcon
                type="box"
                icon="close"
                v-tippy="{
                    animation: 'fade',
                    placement: 'top',
                }"
                :content="resource.Tooltips.CloseHotKey"
                @click="() => emit('closeFormInfo')"
            />
        </div>
        <div class="form__body">
            <div class="group">
                <QLTSInput
                    label="Họ và tên"
                    v-model="dataUser.FullName"
                    :is-disabled="!isEdit"
                />
            </div>
            <div class="group">
                <QLTSInput
                    label="Email"
                    v-model="dataUser.Email"
                    :is-disabled="!isEdit"
                />
            </div>
            <div class="group">
                <QLTSInput
                    label="Số điện thoại"
                    v-model="dataUser.PhoneNumber"
                    :is-disabled="!isEdit"
                />
            </div>
            <div class="group role">
                <label for="">Vai trò</label>
                <QLTSDropdown
                    :list-item="['Admin', 'User']"
                    typeField="with-icon"
                    v-model="role"
                    :is-readonly="!isEdit"
                    :isDisabled="!isEdit"
                />
            </div>
        </div>
        <div class="form__footer">
            <QLTSButton type="primary" @click="() => handleEditUser()">
                Lưu
            </QLTSButton>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import { useStore } from "vuex";

import QLTSIcon from "@/components/icon/QLTSIcon.vue";
import QLTSInput from "@/components/input/QLTSInput.vue";
import resource from "@/helper/resource";
import QLTSButton from "@/components/button/QLTSButton.vue";
import QLTSDropdown from "@/components/dropdown/QLTSDropdown.vue";

import { updateUserInfo } from "@/apis/userApis";

const store = useStore();
const props = defineProps({
    user: {
        type: Object,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
});
console.log("props.role", props.role);
const isEdit = ref(props.role === "Admin");

const dataUser = reactive({
    FullName: "",
    Email: "",
    PhoneNumber: "",
    RoleName: "",
});

onMounted(() => {
    dataUser.FullName = props.user.FullName;
    dataUser.Email = props.user.Email;
    dataUser.PhoneNumber = props.user.PhoneNumber;
    dataUser.RoleName = props.user.Role;
    console.log("isEdit", isEdit.value);
});

const emit = defineEmits(["closeFormInfo"]);
const roleRef = ref(props.user.Role);
const role = computed({
    get() {
        return roleRef.value;
    },
    set(value) {
        roleRef.value = value;
    },
});

const handleEditUser = async () => {
    try {
        dataUser.RoleName = role.value || "User";
        console.log("dataUser.value", dataUser, props.user);
        store.dispatch("setLoading", true);
        await updateUserInfo(props.user.UserId, dataUser);
        store.dispatch("setLoading", false);
        emit("closeFormInfo");
    } catch (error) {
        store.dispatch("setLoading", false);
        emit("closeFormInfo");
        console.log(error);
    }
};
</script>
<style scoped>
@import url("./FormInfo.scss");
</style>
