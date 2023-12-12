import axios from "axios";
import loginServices from "./loginServices";

const geoapiConn = import.meta.env.GEOAPI != undefined ? import.meta.env.GEOAPI : "localhost";

const getCoordinates = async (str, token) => {
    const response = await axios.get(`http://${geoapiConn}:5006/v1/geocoding?location=${str},Spain`, {
        headers: {
            "Authorization": token
        }
    });
    loginServices.checkResponse(response.data);
    return response.data;
}

const geoapiServices = { getCoordinates };

export default geoapiServices;