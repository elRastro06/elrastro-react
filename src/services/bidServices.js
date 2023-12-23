import axios from "axios";
import loginServices from "./loginServices";

const bidsConn = import.meta.env.VITE_BIDS_URL;

const getBids = async (id) => {
  const response = await axios.get(
    `${bidsConn}/v1/?productId=${id}&orderBy=date&order=desc`);
  return response.data;
};

const addBid = async (bid, token) => {
  let highestBid = await axios.get(
    `${bidsConn}/v1/highest/?productId=${bid.productId}`,
    {
      headers: {
        Authorization: token,
      },
    }
  );
  loginServices.checkResponse(highestBid.data);
  highestBid = highestBid.data.maxAmount;

  if (bid.amount <= highestBid) return { error: "" };
  const response = await axios.post(`${bidsConn}/v1/`, bid, {
    headers: {
      Authorization: token,
    },
  });
  loginServices.checkResponse(response.data);
  return response.data;
};

const getBidsByUser = async (id) => {
  const response = await axios.get(`${bidsConn}/v1/?userId=${id}`);
  return response.data;
};

const getHighestBidByUserAndProduct = async (userId, productId, token) => {
  const bids = await axios.get(
    `http://${bidsConn}:5002/v1/?userId=${userId}&productId=${productId}`,
    {
      headers: {
        Authorization: token,
      },
    }
  );
  loginServices.checkResponse(bids.data);

  let highestBid = {};
  bids.data.forEach((b) => {
    if (highestBid.amount == undefined || highestBid.amount < b.amount)
      highestBid = b;
  });

  return highestBid;
};

const bidServices = {
  getBids,
  addBid,
  getBidsByUser,
  getHighestBidByUserAndProduct,
};

export default bidServices;
