import { refreshToken } from "@/apis/refreshTokenApi";
import { createStore } from "vuex";

import createPersistedState from "vuex-persistedstate";

const store = createStore({
    state: {
        filter: {
            totalPage: 1,
            totalRecord: 0,
            pageNumber: 1,
            pageSize: 100,
            searchString: "",
            departmentId: null,
            departmentName: "Bộ phận sử dụng",
            departmentNameFilter: "",
            assetCategoryId: null,
            assetCategoryName: "Loại tài sản",
            assetCategoryNameFilter: "",
        },
        filterIncrease: {
            totalPage: 1,
            totalRecord: 0,
            pageNumber: 1,
            pageSize: 50,
            searchString: "",
        },
        isLogin: false,
        token: "",
        tokenExpiration: "",
        isTokenValid: false,
        isLoading: false,
        isCollapsed: false,
        isShowDetailTable: false,
        listRecordDelete: [],
        formationSource: "Ngân sách trung ương",
        idIncreaseEditing: "",
    },
    mutations: {
        /**
         * Hàm thay đổi giá trị của pageSise
         * @param {*} state
         * @param {*} pageSize
         * Author: TTNham (28/08/2023)
         */
        setPageSize(state, pageSize) {
            state.filter.pageSize = pageSize;
        },

        setIncreasePageSize(state, pageSize) {
            state.filterIncrease.pageSize = pageSize;
        },
        /**
         * Hàm thiết lập số trang hiện tại
         * @param {object} state - Trạng thái hiện tại của ứng dụng
         * @param {number} pageNumber - Số trang hiện tại
         */
        setPageNumber(state, pageNumber) {
            state.filter.pageNumber = pageNumber;
        },
        setIncreasePageNumber(state, pageNumber) {
            state.filterIncrease.pageNumber = pageNumber;
        },
        /**
         * Hàm thiết lập tổng số trang
         * @param {object} state - Trạng thái hiện tại của ứng dụng
         * @param {number} totalRecord - Tổng số trang
         */
        setTotalRecord(state, totalRecord) {
            state.filter.totalRecord = totalRecord;
        },

        setIncreaseTotalRecord(state, totalRecord) {
            state.filterIncrease.totalRecord = totalRecord;
        },

        /**
         * Hàm thiết lập tổng số trang
         * @param {object} state - Trạng thái hiện tại của ứng dụng
         * @param {number} totalPage - Tổng số trang
         */
        setTotalPage(state, totalPage) {
            state.filter.totalPage = totalPage;
        },

        setIncreaseTotalPage(state, totalPage) {
            state.filterIncrease.totalPage = totalPage;
        },

        /**
         * Hàm thiết lập từ khóa tìm kiếm
         * @param {object} state - Trạng thái hiện tại của ứng dụng
         * @param {string} searchString - Từ khóa tìm kiếm
         */
        setSearchString(state, searchString) {
            state.filter.searchString = searchString.trim();
        },

        setIncreaseSearchString(state, searchString) {
            state.filterIncrease.searchString = searchString.trim();
        },

        /**
         * Hàm thiết lập ID của bộ phận
         * @param {object} state - Trạng thái hiện tại của ứng dụng
         * @param {number} departmentId - ID của bộ phận
         */
        setDepartmentId(state, departmentId) {
            state.filter.departmentId = departmentId;
        },

        /**
         * Hàm thiết lập tên bộ phận
         * @param {object} state - Trạng thái hiện tại của ứng dụng
         * @param {string} departmentName - Tên bộ phận
         */
        setDepartmentName(state, departmentName) {
            state.filter.departmentName = departmentName;
        },

        /**
         * Hàm thiết lập bộ lọc tên bộ phận
         * @param {object} state - Trạng thái hiện tại của ứng dụng
         * @param {string} departmentNameFilter - Bộ lọc tên bộ phận
         */
        setDepartmentFilter(state, departmentNameFilter) {
            state.filter.departmentNameFilter = departmentNameFilter;
        },

        /**
         * Hàm thiết lập ID của danh mục tài sản
         * @param {object} state - Trạng thái hiện tại của ứng dụng
         * @param {number} assetCategoryId - ID của danh mục tài sản
         */
        setAssetCategoryId(state, assetCategoryId) {
            state.filter.assetCategoryId = assetCategoryId;
        },

        /**
         * Hàm thiết lập tên danh mục tài sản
         * @param {object} state - Trạng thái hiện tại của ứng dụng
         * @param {string} assetCategoryName - Tên danh mục tài sản
         */
        setAssetCategoryName(state, assetCategoryName) {
            state.filter.assetCategoryName = assetCategoryName;
        },

        /**
         * Hàm thiết lập bộ lọc tên danh mục tài sản
         * @param {object} state - Trạng thái hiện tại của ứng dụng
         * @param {string} assetCategoryNameFilter - Bộ lọc tên danh mục tài sản
         */
        setAssetCategoryFilter(state, assetCategoryNameFilter) {
            state.filter.assetCategoryNameFilter = assetCategoryNameFilter;
        },

        /**
         * Hàm thiết lập token
         * @param {object} state - Trạng thái hiện tại của ứng dụng
         * @param {string} token - Token xác thực
         */
        setToken(state, token) {
            state.token = token;
        },

        /**
         * Hàm thiết lập thời gian hết hạn của token
         * @param {object} state - Trạng thái hiện tại của ứng dụng
         * @param {string} tokenExpiration - Thời gian hết hạn của token
         */
        setTokenExpiration(state, tokenExpiration) {
            state.tokenExpiration = tokenExpiration;
        },

        /**
         * Hàm xóa token và thời gian hết hạn của token
         * @param {object} state - Trạng thái hiện tại của ứng dụng
         */
        clearToken(state) {
            state.token = "";
            state.tokenExpiration = "";
        },

        /**
         * Hàm thiết lập trạng thái đăng nhập
         * @param {object} state - Trạng thái hiện tại của ứng dụng
         */
        setLogin(state) {
            state.isLogin = true;
        },

        /**
         * Hàm thiết lập trạng thái đăng xuất
         * @param {object} state - Trạng thái hiện tại của ứng dụng
         */

        setLogout(state) {
            state.isLogin = false;
        },

        /**
         * Hàm kiểm tra tính hợp lệ của token
         * @param {object} state - Trạng thái hiện tại của ứng dụng
         */
        setIsTokenValid: (state) => {
            if (!state.token || !state.tokenExpiration) {
                state.isTokenValid = false;
            }
            const currentTime = new Date().getTime();
            const timeTokenExpiration = new Date(
                state.tokenExpiration
            ).getTime();
            state.isTokenValid = currentTime < timeTokenExpiration;
        },

        /**
         * Hàm thiết lập trạng thái tải dữ liệu
         * @param {object} state - Trạng thái hiện tại của ứng dụng
         * @param {boolean} value - Giá trị trạng thái tải dữ liệu
         */
        setLoading(state, value) {
            state.isLoading = value;
        },

        /**
         * Hàm thiết lập trạng thái thu gọn/hiện rộng
         * @param {object} state - Trạng thái hiện tại của ứng dụng
         * @param {boolean} val - Giá trị trạng thái thu gọn/hiện rộng
         */
        setCollapsed(state, val) {
            state.isCollapsed = val;
        },

        /**
         * Hàm thiết lập danh sách các bản ghi cần xóa
         * @param {object} state - Trạng thái hiện tại của ứng dụng
         * @param {array} val - Danh sách các bản ghi cần xóa
         */
        setListRecordDelete(state, val) {
            state.listRecordDelete = val;
        },

        addRecordDelete(state, val) {
            state.listRecordDelete.push(val);
        },
        removeRecordDelete(state, val) {
            state.listRecordDelete = state.listRecordDelete.filter(
                (item) => item.assetId !== val.assetId
            );
        },
        resetFilter(state) {
            state.filter = {
                ...state.filter,
                totalPage: 1,
                totalRecord: 0,
                pageNumber: 1,
                pageSize: 100,
                searchString: "",
                departmentId: null,
                departmentName: "Bộ phận sử dụng",
                departmentNameFilter: "",
                assetCategoryId: null,
                assetCategoryName: "Loại tài sản",
                assetCategoryNameFilter: "",
            };
        },

        resetIncreaseFilter(state) {
            state.filterIncrease = {
                ...state.filterIncrease,
                totalPage: 1,
                totalRecord: 0,
                pageNumber: 1,
                pageSize: 50,
                searchString: "",
            };
        },
        setFormationSource(state, value) {
            state.formationSource = value;
        },
        clearListRecordDelete(state) {
            state.listRecordDelete = [];
        },
        toggleDetailTable(state) {
            state.isShowDetailTable = !state.isShowDetailTable;
            return state.isShowDetailTable;
        },
        setIdIncreaseEditing(state, id) {
            state.idIncreaseEditing = id;
        },
    },
    actions: {
        refreshToken({ commit, state }, data) {
            if (!state.token) {
                // khong co token
                return;
            } else {
                if (state.isLogin && !state.isTokenValid) {
                    commit("setToken", data.accessToken);
                    commit("setTokenExpiration", data.tokenExpiration);
                    commit("setIsTokenValid");
                    commit("setLogin");
                }
            }
        },
        login({ commit }, tokenData) {
            commit("setToken", tokenData.token);
            commit("setTokenExpiration", tokenData.tokenExpiration);
            commit("setIsTokenValid");
            commit("setLogin");
        },
        logout({ commit }) {
            commit("clearToken");
            commit("setLogout");
        },
        setLoading({ commit }, value) {
            commit("setLoading", value);
        },
        setCollapsed({ commit }, value) {
            commit("setCollapsed", value);
        },
        setListRecordDelete({ commit }, value) {
            commit("setListRecordDelete", value);
        },
        addRecordDelete({ commit }, value) {
            commit("addRecordDelete", value);
        },
        removeRecordDelete({ commit }, value) {
            commit("removeRecordDelete", value);
        },
        resetFilter({ commit }) {
            commit("resetFilter");
        },
        setFormationSource({ commit }, value) {
            commit("setFormationSource", value);
        },
        clearListRecordDelete({ commit }) {
            commit("clearListRecordDelete");
        },
        resetIncreaseFilter({ commit }) {
            commit("resetIncreaseFilter");
        },
        toggleDetailTable({ commit }) {
            commit("toggleDetailTable");
        },
        setIdIncreaseEditing({ commit }, id) {
            commit("setIdIncreaseEditing", id);
        },
    },
    getters: {
        filter: (state) => state.filter,
        filterIncrease: (state) => state.filterIncrease,
        isLogin: (state) => state.isLogin,
        isTokenValid: (state) => state.isTokenValid,
        isShowDetailTable: (state) => state.isShowDetailTable,
        token: (state) => state.token,
        tokenExpiration: (state) => state.tokenExpiration,
        loading: (state) => state.isLoading,
        isCollapsed: (state) => state.isCollapsed,
        listRecordDelete: (state) => state.listRecordDelete,
        formationSource: (state) => state.formationSource,
        idIncreaseEditing: (state) => state.idIncreaseEditing,
    },
    plugins: [
        createPersistedState({
            key: "qlts",
            storage: window.localStorage,
        }),
    ],
});

export default store;
