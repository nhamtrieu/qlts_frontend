import axios from "./config-interceptor.js";

export const refreshToken = async () => {
    const response = axios.post(
        "https://localhost:7220/api/v1/Token/refresh-token"
    );
    return response;
};
