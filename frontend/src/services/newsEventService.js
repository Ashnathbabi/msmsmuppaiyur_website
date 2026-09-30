import axios from "axios";
import API_BASE_URL from "../config/api";

const API = `${API_BASE_URL}/api/news-events`;


// =====================================================
// WEBSITE
// =====================================================

export const getNewsEvents = () => {
    return axios.get(API);
};


// =====================================================
// ADMIN
// =====================================================

export const getAllNewsEvents = () => {
    return axios.get(`${API}/admin/all`);
};


// =====================================================
// SINGLE
// =====================================================

export const getNewsEvent = (id) => {
    return axios.get(`${API}/${id}`);
};


// =====================================================
// CREATE
// =====================================================

export const createNewsEvent = (formData) => {

    return axios.post(
        API,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    );

};


// =====================================================
// UPDATE
// =====================================================

export const updateNewsEvent = (id, formData) => {

    return axios.put(
        `${API}/${id}`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    );

};


// =====================================================
// DELETE
// =====================================================

export const deleteNewsEvent = (id) => {

    return axios.delete(
        `${API}/${id}`
    );

};