import axios from "axios";
import bidServices from "./bidServices";

const getProduct = async (id) => {
    const response = await axios.get(`http://localhost:5001/v1/${id}`);
    return response.data;
}

const createProduct = async (body) => {
    const response = await axios.post(`http://localhost:5001/v1/`, { ...body, soldID: "" });
    return response.data;
}

const deleteProduct = async (id) => {
    const response = await axios.delete(`http://localhost:5001/v1/${id}`);
    return response.data;
}

const modifyProduct = async (id, body) => {
    const bids = await bidServices.getBids(id);

    if(bids.length != 0) return { error: "The product has already bids" };

    const response = await axios.put(`http://localhost:5001/v1/${id}`, body);
    return response.data;
}

const addImage = async (id, image) => {
    let data = new FormData();
    data.append("image", image);
    data.append("productId", id);

    const response = await axios.post("http://localhost:5004/v2/images", data, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });

    return response.data.image;
}

const deleteImage = async (imageId) => {
    const imgFields = imageId.split("/");
    const body = {
        productId: imgFields[0],
        imageName: imgFields[1]
    };

    const response = await axios.delete("http://localhost:5004/v2/images", { data: body });

    return response.data;
}

const createEmptyProduct = async (loggedUserId) => {
    const body = {
        name: "",
        description: "",
        price: "",
        length: "",
        userID: loggedUserId,
    };

    const response = await axios.post(`http://localhost:5001/v1/`, body);
    return response.data;
}


const productServices = { getProduct, createProduct, deleteProduct, modifyProduct, addImage, deleteImage, createEmptyProduct };

export default productServices;