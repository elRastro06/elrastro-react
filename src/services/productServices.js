import axios from "axios";

const getProduct = async (id) => {
    const response = await axios.get(`http://localhost:5001/v1/${id}`);
    return response.data;
};

const productServices = { getProduct };

export default productServices;