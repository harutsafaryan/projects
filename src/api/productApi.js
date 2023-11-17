import axios from "axios";
import { URI } from "../utility/constants";
import getCookie from "../utility/getCookie";

const token = getCookie("_auth");
const productApi = axios.create({
    baseURL: URI,
    headers: { "Authorization": `bearer ${token}` }
});

export async function getProducts() {
    if (!token)
        return null;

    const response = await productApi.get('/product');
    return response.data;
}

export async function getProduct(id) {
    if (!token)
        return null;

    const response = await productApi.get(`/product/${id}`);
    return response.data;
}

export async function addProduct(product) {
    if (!token)
        return null;

    try {

        const response = await productApi.post('/product', product)
        return response;
    }
    catch(error) {
        console.log(error);
    }
}

export async function deleteProduct(id) {
    if (!token)
        return null;

        const response = await productApi.delete(`/product/${id}`);
        return response;
}