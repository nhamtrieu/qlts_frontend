import axios from "./config-interceptor.js";

const url = "https://localhost:7220/api/v1/AutoCode/NewCode";

export const getNewCode = async (codeType) => {
    const response = await axios.get(url, {
        params: { codeType: codeType },
    });

    return response.data;
};
