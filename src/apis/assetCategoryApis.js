import axios from "./config-interceptor";

const url = "https://localhost:7220/api/v1/AssetCategoriesControler";

/**
 * Lấy danh sách loại tài sản
 * Author: TTNham(05/08/2023)
 * @returns
 */
export const getAssetCategoryList = async () => {
    const data = await axios.get(url);
    return data.data;
};
