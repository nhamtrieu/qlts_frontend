import axios from "./config-interceptor.js";

const url = "https://localhost:7220/api/v1/IncreaseDetail";

export const deleteIncreaseAssetAsync = async (id) => {
    const response = axios.delete(`${url}/${id}`);

    return response.data;
};

export const updateIncreaseAssetAsync = async (id, data) => {
    const response = axios.put(`${url}/${id}`, data);

    return response.data;
};
