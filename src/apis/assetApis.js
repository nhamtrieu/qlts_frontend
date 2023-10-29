import axios from "./config-interceptor";
const url = "https://localhost:7220/api/v1/Assets";

/**
 * Lấy toàn bộ tài sản
 * Author: TTNham (05/08/2023)
 * @returns
 */
export const getAllAssetList = async () => {
    const data = await axios.get(url);
    return data.data;
};

/**
 *  Lấy danh tài sản theo id
 * Author: TTNham (05/08/2023)
 * @param {String} url
 * @returns
 */
export const getAssetById = async (id) => {
    const data = await axios.get(`${url}/${id}`);
    return data.data;
};

/**
 * Lấy mã tài sản mới
 * Author: TTNham(26/08/2023)
 * @returns
 */
export const getNewAssetCode = async () => {
    const data = await axios.get(`${url}/NewCode`);
    return data.data;
};

/**
 * Thêm tài sản mới
 * Author: TTNham(09/08/2023)
 * @param {*} data
 * @returns
 */
export const addNewAsset = async (data) => {
    const response = await axios.post(url, data);
    return response.data;
};

/**
 *  Xóa tài sản
 * Author: TTNham (09/08/2023)
 * @param {*} ids
 * @returns
 */
export const deleteAssets = async (ids) => {
    const res = await axios.delete(url, {
        data: ids,
    });
    return res.data;
};

/**
 * Sửa tài sản
 * Author: TTNham (09/08/2023)
 * @param {String} id
 * @param {Object} data
 * @returns
 */
export const updateAsset = async (id, data) => {
    const response = await axios.put(`${url}?id=${id}`, data);
    return response.data;
};

/**
 * Xuất file excel
 * Author: TTNham (07/09/2023)
 * @param {*} searchString
 * @param {*} departmentNameFilter
 * @param {*} assetCategoryNameFilter
 */
export const exportExcelAssetList = async (
    searchString,
    departmentNameFilter,
    assetCategoryNameFilter
) => {
    const param = {
        SearchString: searchString,
        DepartmentName: departmentNameFilter,
        AssetCategoryName: assetCategoryNameFilter,
    };
    for (const key in param) {
        if (param[key] === 0 || param[key] === "") {
            delete param[key];
        }
    }

    // Gọi API xuất Excel từ máy chủ
    const response = await axios.get(`${url}/ExportExcel`, {
        params: param,
        responseType: "blob",
    });

    // Tạo một đối tượng Blob từ dữ liệu nhận được
    const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // Tạo một URL cho Blob
    const urlExcel = window.URL.createObjectURL(blob);

    // Tạo một thẻ <a> để tải xuống tệp Excel
    const a = document.createElement("a");
    a.href = urlExcel;
    a.download = "Danh_sach_tai_san.xlsx"; // Tên tệp Excel khi tải xuống
    document.body.appendChild(a);
    a.click();

    // Xóa URL sau khi đã sử dụng
    window.URL.revokeObjectURL(urlExcel);
};

/**
 * Lâyd danh sách tài sản theo điều kiện lọc
 * Author: TTNham(26/08/2023)
 * @param {*} recordPerPage
 * @param {*} currentPage
 * @param {*} searchValue
 * @param {*} departmentId
 * @param {*} assetCategoryId
 * @returns
 */
export const filterAssetList = async (
    recordPerPage,
    currentPage,
    searchValue,
    departmentNameFilter,
    assetCategoryNameFilter,
    ids = []
) => {
    const param = {
        PageSize: recordPerPage,
        PageNumber: currentPage,
        SearchString: searchValue,
        DepartmentName: departmentNameFilter,
        AssetCategoryName: assetCategoryNameFilter,
        assetid: ids,
    };

    const response = await axios.post(`${url}/Filter`, param);
    return response.data;
};

export const getIncreaseByAsset = async (id) => {
    const response = await axios.get(`${url}/Increase/${id}`);

    return response.data;
};

export const getIncreaseByListAsset = async (ids) => {
    const response = await axios.post(`${url}/Increase`, ids);

    return response.data;
};
