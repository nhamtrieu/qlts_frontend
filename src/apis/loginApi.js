import axios from "./config-interceptor";

const url = "https://localhost:7220/api/v1/User/login";

export const loginAsync = async (data) => {
    const response = await axios.post(url, data);
    return response;
};
