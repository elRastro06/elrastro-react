import axios from "axios";
import bidServices from "./bidServices";
import loginServices from "./loginServices";

const productsConn = import.meta.env.PRODUCTS != undefined ? import.meta.env.PRODUCTS : "localhost";
const cloudinaryConn = import.meta.env.CLOUDINARY != undefined ? import.meta.env.CLOUDINARY : "localhost";

const getProduct = async (id, token) => {
    const response = await axios.get(`http://${productsConn}:5001/v1/${id}`, {
        headers: {
            "Authorization": token
        }
    });
    loginServices.checkResponse(response.data);
    return response.data;
};

const createProduct = async (body, token) => {
    const response = await axios.post(`http://${productsConn}:5001/v1/`, {
        ...body,
        soldID: "",
    },
    {
        headers: {
            "Authorization": token
        }
    });
    loginServices.checkResponse(response.data);
    return response.data;
};

const deleteProduct = async (id, token) => {
    const response = await axios.delete(`http://${productsConn}:5001/v2/${id}`, {
        headers: {
            "Authorization": token
        }
    });
    loginServices.checkResponse(response.data);
    return response.data;
};

const modifyProduct = async (id, body, token) => {
    const bids = await bidServices.getBids(id, token);

    if (bids.length != 0) return { error: "The product has already bids" };

    const response = await axios.put(`http://${productsConn}:5001/v1/${id}`, body, {
        headers: {
            "Authorization": token
        }
    });
    loginServices.checkResponse(response.data);
    return response.data;
};

const addImage = async (id, image, token) => {
    let data = new FormData();
    data.append("image", image);
    data.append("productId", id);

    const response = await axios.post(`http://${cloudinaryConn}:5004/v2/images`, data, {
        headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": token
        },
    });

    return response.data.image;
};

const deleteImage = async (imageId, token) => {
    const imgFields = imageId.split("/");
    const body = {
        productId: imgFields[0],
        imageName: imgFields[1],
    };

    const response = await axios.delete(`http://${cloudinaryConn}:5004/v2/images`, {
        data: body,
    },
    {
        headers: {
            "Authorization": token
        }
    });
    loginServices.checkResponse(response.data);

    return response.data;
};

const createEmptyProduct = async (loggedUserId, token) => {
    const body = {
        name: "",
        description: "",
        price: "",
        length: "",
        userID: loggedUserId,
    };

    const response = await axios.post(`http://${productsConn}:5001/v1/`, body, {
        headers: {
            "Authorization": token
        }
    });
    loginServices.checkResponse(response.data);
    return response.data;
};

const productServices = {
    getProduct,
    createProduct,
    deleteProduct,
    modifyProduct,
    addImage,
    deleteImage,
    createEmptyProduct,
};

export default productServices;
