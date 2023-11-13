import axios from "axios";
import { URI } from "../utility/constants";
import getCookie from "../utility/getCookie";
import { redirect } from "react-router-dom";

const token = getCookie("_auth");
const projectApi = axios.create({
    baseURL: URI,
    headers: { "Authorization": `bearer ${token}` }
});

export async function getProjects() {
    if (!token)
        return null;

    const response = await projectApi.get('/project');
    return response.data;
}

export async function getProject(id) {
    if (!token)
        return null;

    const response = await projectApi.get(`/project/${id}`);
    return response.data;
}

export async function addProject(project) {
    if (!token)
        return null;

    const response = await projectApi.post('/project', project)
    return response;
}

export async function deleteProject(id) {
    if (!token)
        return null;

        const response = await projectApi.delete(`/project/${id}`);
        return response;
}