import axios from "axios";
import { URI } from "../utility/constants";

const imageApi = axios.create({
    baseURL: URI,
});

export async function getImage() {
    const response =await imageApi.get(`/image`);

    return response.data;
}
