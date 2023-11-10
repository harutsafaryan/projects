
import axios from "axios";
import { URI } from "../utility/constants";
import getCookie from "../utility/getCookie";

const token = getCookie("_auth");
const projectApi = axios.create({
    baseURL: URI,
    headers: { "Authorization": `bearer ${token}` }
});

export async function getProjects() {
    const response = await projectApi.get('/project');
    return response.data;
}

export async function getProject(id) {
    const response = await projectApi.get(`/project/${id}`);
    return response.data;
}