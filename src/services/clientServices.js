import axios from "axios";

const getClient = async (id) => {
    const response = await axios.get(`http://localhost:5000/v1/${id}`);
    return response.data;
}

const addClient = async (client) => {
    const response = await axios.post(`http://localhost:5000/v1/`, client);
    return response.data;
}

const clientServices = { getClient, addClient };

export default clientServices;