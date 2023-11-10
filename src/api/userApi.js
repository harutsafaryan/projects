
import axios from "axios";
import { URI } from "../utility/constants";
import getCookie from "../utility/getCookie";

const token = getCookie("_auth");
const userApi = axios.create({
    baseURL: URI,
    headers: { "Authorization": `bearer ${token}` }
});

export async function getCustomers() {
    const response = await userApi.get('user/getclients');
    return response.data;
}
