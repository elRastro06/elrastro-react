import axios from "axios";

const clientsConn = import.meta.env.CLIENTS != undefined ? import.meta.env.CLIENTS : "localhost";

const getClient = async (id) => {
    const response = await axios.get(`http://${clientsConn}:5000/v1/${id}`);
    return response.data;
}

const addClient = async (client) => {
    const response = await axios.post(`http://${clientsConn}:5000/v1/`, client);
    return response.data;
}

const clientServices = { getClient, addClient };

export default clientServices;