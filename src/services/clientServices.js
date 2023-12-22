import axios from "axios";

const clientsConn = import.meta.env.VITE_CLIENTS_URL;

const getClient = async (id) => {
    const response = await axios.get(`${clientsConn}/v1/${id}`);
    return response.data;
}

const getClientByGoogleId = async (id) => {
    const response = await axios.get(`${clientsConn}/v1/?googleID=${id}`);
    return response.data[0];
}

const addClient = async (client, token) => {
    const response = await axios.post(`${clientsConn}/v1/`, client, {
        headers: {
            "Authorization": token
        }
    });
    return response.data;
}

const modifyClient = async (id, set, token) => {
    const response = await axios.put(`${clientsConn}/v1/${id}`, set, {
        headers: {
            "Authorization": token
        }
    });
    return response.data;
}

const clientServices = { getClient, getClientByGoogleId, addClient, modifyClient };

export default clientServices;