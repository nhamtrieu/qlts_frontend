import axios from "./config-interceptor";

const url = "https://localhost:7220/api/v1/Orgs";

export async function getAllOrgs() {
    const res = await axios.get(url);

    return res.data;
}

export const getUserInfoByOrgId = async (orgId) => {
    const response = await axios.get(`${url}/${orgId}/users`);
    return response.data;
};
