import { createApp } from "vue";
import App from "./App.vue";
import VueTippy from "vue-tippy";
import router from "@/router/router.js";
import store from "./store/store";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "./css/main.css";
import "tippy.js/dist/tippy.css"; // optional for styling

import QLTSButton from "./components/button/QLTSButton.vue";
import QLTSCombobox from "./components/combobox/QLTSCombobox.vue";
import QLTSContextMenu from "./components/contextmenu/QLTSContextMenu.vue";
import QLTSDropdown from "./components/dropdown/QLTSDropdown.vue";
import QLTSDialog from "./components/dialog/QLTSDialog.vue";
import QLTSIcon from "./components/icon/QLTSIcon.vue";
import QLTSInput from "./components/input/QLTSInput.vue";
import QLTSLoading from "./components/loading/QLTSLoading.vue";
import QLTSPagination from "./components/pagination/QLTSPagination.vue";
import QLTSToastmsg from "./components/toast/QLTSToastmsg.vue";
import TheHeader from "./components/layout/TheHeader.vue";
import TheSideBar from "./components/layout/TheSidebar.vue";
import TheMain from "./components/layout/TheMain.vue";
import AssetForm from "./views/AssetForm.vue";
import AssetList from "./views/AssetList.vue";

const app = createApp(App);

app.use(router);
app.use(store);
app.use(ElementPlus);
app.use(
    VueTippy,
    // optional
    {
        directive: "tippy", // => v-tippy
        component: "tippy", // => <tippy/>
        componentSingleton: "tippy-singleton", // => <tippy-singleton/>,
        defaultProps: {
            placement: "bottom",
            allowHTML: true,
            arrow: false,
            theme: "tomato",
            duration: [100, 0],
            maxWidth: 500,
        }, // => Global default options * see all props
    }
);

app.component("QLTSIcon", QLTSIcon)
    .component("QLTSLoading", QLTSLoading)
    .component("TheHeader", TheHeader)
    .component("TheSideBar", TheSideBar)
    .component("TheMain", TheMain)
    .component("QLTSDialog", QLTSDialog)
    .component("AssetForm", AssetForm)
    .component("QLTSToastmsg", QLTSToastmsg)
    .component("QLTSButton", QLTSButton)
    .component("QLTSInput", QLTSInput)
    .component("QLTSCombobox", QLTSCombobox)
    .component("QLTSContextMenu", QLTSContextMenu)
    .component("QLTSDropdown", QLTSDropdown)
    .component("QLTSPagination", QLTSPagination)
    .component("AssetList", AssetList);
app.mount("#app");
