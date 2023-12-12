import axios from "axios";
import loginServices from "./loginServices";

const clientsConn = import.meta.env.CLIENTS != undefined ? import.meta.env.CLIENTS : "localhost";

const getClient = async (id, token) => {
    const response = await axios.get(`http://${clientsConn}:5000/v1/${id}`, {
        headers: {
            "Authorization": token
        }
    });
    loginServices.checkResponse(response.data);
    return response.data;
}

const getClientByGoogleId = async (id, token) => {
    const response = await axios.get(`http://${clientsConn}:5000/v1/?googleID=${id}`, {
        headers: {
            "Authorization": token
        }
    });
    loginServices.checkResponse(response.data);
    return response.data[0];
}

const addClient = async (client, token) => {
    const response = await axios.post(`http://${clientsConn}:5000/v1/`, client, {
        headers: {
            "Authorization": token
        }
    });
    loginServices.checkResponse(response.data);
    return response.data;
}

const modifyClient = async (id, set, token) => {
    const response = await axios.put(`http://${clientsConn}:5000/v1/${id}`, set, {
        headers: {
            "Authorization": token
        }
    });
    loginServices.checkResponse(response.data);
    return response.data;
}

const clientServices = { getClient, getClientByGoogleId, addClient, modifyClient };

export default clientServices;