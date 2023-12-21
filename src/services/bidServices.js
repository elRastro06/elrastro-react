import axios from "axios";
import loginServices from "./loginServices";

const bidsConn =
  import.meta.env.PUJAS != undefined ? import.meta.env.PUJAS : "localhost";

const getBids = async (id, token) => {
  const response = await axios.get(
    `http://${bidsConn}:5002/v1/?productId=${id}&orderBy=date&order=desc`,
    {
      headers: {
        Authorization: token,
      },
    }
  );
  loginServices.checkResponse(response.data);
  return response.data;
};

const addBid = async (bid, token) => {
  let highestBid = await axios.get(
    `http://${bidsConn}:5002/v1/highest/?productId=${bid.productId}`,
    {
      headers: {
        Authorization: token,
      },
    }
  );
  loginServices.checkResponse(highestBid.data);
  highestBid = highestBid.data.maxAmount;

  if (bid.amount <= highestBid) return { error: "" };
  const response = await axios.post(`http://${bidsConn}:5002/v1/`, bid, {
    headers: {
      Authorization: token,
    },
  });
  loginServices.checkResponse(response.data);
  return response.data;
};

const getBidsByUser = async (id, token) => {
  const response = await axios.get(`http://${bidsConn}:5002/v1/?userId=${id}`, {
    headers: {
      Authorization: token,
    },
  });
  loginServices.checkResponse(response.data);
  return response.data;
};

const bidServices = { getBids, addBid, getBidsByUser };

export default bidServices;
