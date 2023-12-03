import axios from "axios";

const getProduct = async (id) => {
    const response = await axios.get(`http://localhost:5001/v1/${id}`);
    return response.data;
};

const deleteProduct = async (id) => {
    const response = await axios.delete(`http://localhost:5001/v1/${id}`);
    return response.data;
}

const modifyProduct = async (id, body) => {
    const response = await axios.put(`http://localhost:5001/v1/${id}`, body);
    return response.data;
}

const productServices = { getProduct, deleteProduct, modifyProduct };

export default productServices;