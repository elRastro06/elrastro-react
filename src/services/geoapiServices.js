import axios from "axios";

const geoapiConn = import.meta.env.VITE_GEOAPI_URL;

const getCoordinates = async (str) => {
    const response = await axios.get(`${geoapiConn}/v1/geocoding?location=${str},Spain`);
    return response.data;
}

const geoapiServices = { getCoordinates };

export default geoapiServices;