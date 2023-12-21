import axios from "axios";
import bidServices from "./bidServices";
import loginServices from "./loginServices";

const productsConn = import.meta.env.VITE_PRODUCTS_URL;
const cloudinaryConn = import.meta.env.VITE_CLOUDINARY_URL;

const getProduct = async (id) => {
  const response = await axios.get(`${productsConn}/v1/${id}`);
  loginServices.checkResponse(response.data);
  return response.data;
};

const createProduct = async (body, token) => {
  const response = await axios.post(
    `${productsConn}/v1/`,
    {
      ...body,
      soldID: "",
    },
    {
      headers: {
        Authorization: token,
      },
    }
  );
  loginServices.checkResponse(response.data);
  return response.data;
};

const deleteProduct = async (id, token) => {
  const response = await axios.delete(`${productsConn}/v2/${id}`, {
    headers: {
      Authorization: token,
    },
  });
  loginServices.checkResponse(response.data);
  return response.data;
};

const modifyProduct = async (id, body, token) => {
  const bids = await bidServices.getBids(id, token);

  if (bids.length != 0) return { error: "The product has already bids" };

  const response = await axios.put(
    `${productsConn}/v1/${id}`,
    body,
    {
      headers: {
        Authorization: token,
      },
    }
  );
  loginServices.checkResponse(response.data);
  return response.data;
};

const addImage = async (id, image, token) => {
  let data = new FormData();
  data.append("image", image);
  data.append("productId", id);

  const response = await axios.post(
    `${cloudinaryConn}/v2/images`,
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: token,
      },
    }
  );

  return response.data.image;
};

const deleteImage = async (imageId, token) => {
  const imgFields = imageId.split("/");
  const body = {
    productId: imgFields[0],
    imageName: imgFields[1],
  };

  const response = await axios.delete(
    `${cloudinaryConn}/v2/images`,
    {
      data: body,
    },
    {
      headers: {
        Authorization: token,
      },
    }
  );
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

  const response = await axios.post(`${productsConn}/v1/`, body, {
    headers: {
      Authorization: token,
    },
  });
  loginServices.checkResponse(response.data);
  return response.data;
};

const getBidProductsByUser = async (id) => {
  const getBids = await bidServices.getBidsByUser(id);
  const productIdsArray = getBids.map((bid) => bid.productId);

  const products = await Promise.all(
    productIdsArray.map(async (id) => {
      const product = await getProduct(id);
      return product;
    })
  );

  return products;
};

const productServices = {
  getProduct,
  createProduct,
  deleteProduct,
  modifyProduct,
  addImage,
  deleteImage,
  createEmptyProduct,
  getBidProductsByUser,
};

export default productServices;
