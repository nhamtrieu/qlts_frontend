import axios from "./config-interceptor.js";
const url = "https://localhost:7220/api/v1/Source";

export const getListSourceById = async (assetId, name) => {
    const response = await axios.get(`${url}/${name}/${assetId}`);
    return response;
};
