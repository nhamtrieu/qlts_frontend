import axios from "./config-interceptor.js";

const url = "https://localhost:7220/api/v1/User/register";

export async function register(data) {
    const response = await axios.post(url, data);
    return response.data;
}
