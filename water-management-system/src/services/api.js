import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

const baseURL = import.meta.env.VITE_BASE_URL;

// User APIs
export const createUser = async (userData) => {
    try {
        const response = await api.post(`${baseURL}/users`, userData);
        return response.data;
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
}

export const getUsers = async () => {

    try {
        const response = await api.get(`${baseURL}/users`);
        return response.data;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
}

export const getWaterUsages = async (userId, period) => {
    let usageURL = `${baseURL}/users/${userId}/usage`;

    if (period !== 'all') {
      usageURL = `${baseURL}/users/${userId}/usage/filter?period=${period}`;
    }

    try {
        const response = await api.get(usageURL);
        return response.data;
    } catch (error) {
        console.error("Error fetching water usage:", error);
        throw error;
    }
};

export const createInvoice = async (userId, invoiceData) => {
	try {
			const response = await api.post(`${baseURL}/users/${userId}/invoice`, invoiceData);
			return response.data;
	} catch (error) {
			console.error("Error creating invoice:", error);
			throw error;
	}
};