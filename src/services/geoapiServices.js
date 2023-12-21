import axios from "axios";

const geoapiConn = import.meta.env.GEOAPI != undefined ? import.meta.env.GEOAPI : "localhost";

const getCoordinates = async (str) => {
    const response = await axios.get(`http://${geoapiConn}:5006/v1/geocoding?location=${str},Spain`);
    return response.data;
}

const geoapiServices = { getCoordinates };

export default geoapiServices;