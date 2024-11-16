import axios, { CreateAxiosDefaults } from 'axios';

// Função para criar a instância do Axios
const createAxiosInstance = () => {
    const token = localStorage.getItem("access_token");

    const axiosParams = {
        baseURL: "http://localhost:3333",
        headers: {
            Authorization: token ? "Bearer " + token : undefined
        },
        timeout: 1500
    } as Partial<CreateAxiosDefaults>;

    return axios.create(axiosParams);
};

const api = createAxiosInstance();

export const storeToken = (newToken: string) => {
    localStorage.setItem("access_token", newToken);
    api.defaults.headers.Authorization = "Bearer " + newToken;
};

export default api;