import axios from "./config-interceptor";

const url = "https://localhost:7220/api/v1/User";

export const getUserInfo = async (id) => {
    const response = await axios.get(`${url}/${id}`);
    return response.data;
};

export const getUserRole = async (id) => {
    const response = await axios.get(`${url}/${id}/roles`);
    return response.data;
};

export const getOrgInfoByUserId = async (orgId) => {
    const response = await axios.get(`${url}/${orgId}/org`);
    return response.data;
};

export const updateUserInfo = async (id, data) => {
    const response = await axios.patch(`${url}/${id}`, data);
    return response.data;
};
