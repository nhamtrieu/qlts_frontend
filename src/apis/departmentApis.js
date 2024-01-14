import axios from "./config-interceptor.js";

const url = "https://localhost:7220/api/v1/Departments";

/**
 * Lấy danh sách phòng ban
 * Author: TTNham(05/08/2023)
 * @returns
 */
export const getDepartmentList = async () => {
    const data = await axios.get(url);
    return data.data;
};
