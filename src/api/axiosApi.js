import axios from 'axios';

const API_URL = "http://localhost:5000"

export const axiosApi = axios.create({
  baseURL: API_URL,
})

export async function get(url, config = {}) {
    return await axiosApi
        .get(url, { ...config })
        .then(response => response.data)
}
export async function getBYID(url, id , config = {}) {
    return await axiosApi
        .get(url + id, { ...config })
        .then(response => response.data)
}
  
export async function post(url, data, config = {}) {
    return await axiosApi
        .post(url, { ...data } , { ...config })
        .then(response => response.data)
}
  
export async function put(url, id , data) {
    return await axiosApi
        .put(url + id, data)
        .then(response => response.data)
}

export async function edit(url, id) {
    return await axiosApi
        .put(url + id)
        .then(response => response.data)
}

export async function del(url , id , config = {}) {
    return await axiosApi
        .delete(url + id, { ...config })
        .then(response => response.data)
}
  