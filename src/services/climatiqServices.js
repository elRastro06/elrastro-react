import axios from "axios";
import loginServices from "./loginServices";

const climatiqConn = import.meta.env.VITE_CLIMATIQ_URL;

const getCarbonFee = async (long1, lat1, long2, lat2, token) => {
  //usuario1 es el origen, usuario2 el destino

  const response = await axios.get(
    `${climatiqConn}/v2/co2/${long1}/${lat1}/${long2}/${lat2}`,
    {
      headers: {
        Authorization: token,
      },
    }
  );

  loginServices.checkResponse(response.data);
  return response.data;
};

const climatiqServices = { getCarbonFee };

export default climatiqServices;
