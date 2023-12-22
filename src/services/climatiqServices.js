import axios from "axios";
import loginServices from "./loginServices";

const climatiqConn = import.meta.env.CLIMATIQ != undefined ? import.meta.env.CLIMATIQ : "localhost";

const getCarbonFee = async (long1, lat1, long2, lat2, token) => {


    const response = await axios.get(`http://${climatiqConn}:5003/v2/co2/${long1}/${lat1}/${long2}/${lat2}`, {
        headers: {
            "Authorization": token
        }
    });

    
    loginServices.checkResponse(response.data);
    return response.data;
}

const climatiqServices = { getCarbonFee };

export default climatiqServices;