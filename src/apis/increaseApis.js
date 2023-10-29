import axios from "./config-interceptor";
const url = "https://localhost:7220/api/v1/Increase";

export const getNewCode = async () => {
    const response = await axios.get(
        "https://localhost:7220/api/v1/Increase/NewCode"
    );
    return response.data;
};

/**
 * Hàm thêm 1 chứng từ
 * @param {*} data
 * @returns
 * Author: TTNham (07/10/2023)
 */
export const addNewIncrease = async (data) => {
    const response = axios.post(url, data);
    return response;
};

/**
 * Hàm lấy toàn bộ chứng từ
 * @returns
 * Author: TTNham (07/10/2023)
 */
export const getAllData = async () => {
    const response = await axios.get("https://localhost:7220/api/v1/Increase");
    return response;
};

/**
 * Hàm lọc chứng từ theo điều kiện
 * @param {*} recordPerPage
 * @param {*} currentPage
 * @param {*} searchValue
 * @returns
 * Author: TTNham(07/10/2023)
 */
export const filterData = async (
    recordPerPage,
    currentPage,
    searchValue,
    ids = []
) => {
    const param = {
        PageSize: recordPerPage,
        PageNumber: currentPage,
        SearchString: searchValue,
    };
    for (const key in param) {
        if (param[key] === 0 || param[key] === "") {
            delete param[key];
        }
    }
    const response = await axios.get(`${url}/Filter`, {
        params: param,
    });

    return response.data;
};

/**
 * Hàm xóa 1 chứng từ
 * @param {*} id
 * @returns
 * Author: TTNham (07/10/2023)
 */
export const deleteSingle = async (id) => {
    const response = await axios.delete(`${url}/${id}`);
    return response;
};

/**
 * Hàm xóa nhiều chứng từ
 * @param {*} listIds
 * @returns
 */
export const deleteMany = async (listIds) => {
    const response = await axios.delete(url, {
        data: listIds,
    });
    return response;
};

/**
 * Hàm sửa chứng từ
 * @param {*} id
 * @param {*} data
 * @returns
 */
export const editIncrease = async (id, data) => {
    const response = await axios.put(`${url}/${id}`, data);
    return response.data;
};
