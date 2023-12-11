import axios from "axios";

const bidsConn = import.meta.env.PUJAS != undefined ? import.meta.env.PUJAS : "localhost";

const getBids = async (id) => {
    const response = await axios.get(`http://${bidsConn}:5002/v1/?productId=${id}&orderBy=date&order=desc`);
    return response.data;
}

const addBid = async (bid) => {
    let highestBid = await axios.get(`http://${bidsConn}:5002/v1/highest/?productId=${bid.productId}`);
    highestBid = highestBid.data.maxAmount;

    if(bid.amount <= highestBid) return { error: "" }

    const response = await axios.post(`http://${bidsConn}:5002/v1/`, bid);
    return response.data;
}

const bidServices = { getBids, addBid };

export default bidServices;