import axios from "axios";
import { URI } from "../utility/constants";
import getCookie from "../utility/getCookie";
import { redirect } from "react-router-dom";

const imageApi = axios.create({
    baseURL: URI,
});

export async function getImage(id) {
    const response =await imageApi.get(`/image`);

    return response.data;
}
