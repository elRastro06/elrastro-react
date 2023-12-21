import axios from "axios";
import bidServices from "./bidServices";
import loginServices from "./loginServices";

const productsConn =
  import.meta.env.PRODUCTS != undefined
    ? import.meta.env.PRODUCTS
    : "localhost";
const cloudinaryConn =
  import.meta.env.CLOUDINARY != undefined
    ? import.meta.env.CLOUDINARY
    : "localhost";
const bidsConn =
  import.meta.env.BIDS != undefined ? import.meta.env.BIDS : "localhost";

const getProduct = async (id, token) => {
  const response = await axios.get(`http://${productsConn}:5001/v1/${id}`, {
    headers: {
      Authorization: token,
    },
  });
  loginServices.checkResponse(response.data);
  return response.data;
};

const createProduct = async (body, token) => {
  const response = await axios.post(
    `http://${productsConn}:5001/v1/`,
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
  const response = await axios.delete(`http://${productsConn}:5001/v2/${id}`, {
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
    `http://${productsConn}:5001/v1/${id}`,
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

const uncontrolledModifyProduct = async (id, body, token) => {
  const response = await axios.put(
    `http://${productsConn}:5001/v1/${id}`,
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
    `http://${cloudinaryConn}:5004/v2/images`,
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
    `http://${cloudinaryConn}:5004/v2/images`,
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

  const response = await axios.post(`http://${productsConn}:5001/v1/`, body, {
    headers: {
      Authorization: token,
    },
  });
  loginServices.checkResponse(response.data);
  return response.data;
};

const getBidProductsByUser = async (id, token) => {
  const getBids = await bidServices.getBidsByUser(id, token);
  const productIdsArray = getBids.map((bid) => bid.productId);

  const products = await Promise.all(
    productIdsArray.map(async (id) => {
      const product = await getProduct(id, token);
      return product;
    })
  );

  return products;
};

const getActiveBidProductsByUser = async (id, token) => {
  const products = await getBidProductsByUser(id, token);

  return products.filter((product) => {
    const productDate = new Date(product.date);
    const limitDate = new Date(productDate);
    limitDate.setDate(productDate.getDate() + 14);
    const today = new Date();

    return !product.payed && today < limitDate;
  });
};

const getWonProductsByUser = async (id, token) => {
  try {
    const products = await getBidProductsByUser(id, token);
    const wonProducts = [];

    for (const product of products) {
      const productDate = new Date(product.date);
      const limitDate = new Date(productDate);
      limitDate.setDate(productDate.getDate() + 14);
      const today = new Date();

      const response = await axios.get(`http://${bidsConn}:5002/v1/highest`, {
        headers: {
          Authorization: token,
        },
        params: {
          productId: product._id,
        },
      });

      const highestBid = response.data.maxAmount;

      const userHighestBidResponse =
        await bidServices.getHighestBidByUserAndProduct(id, product._id, token);
      const userHighestBid = userHighestBidResponse.amount;

      if (highestBid === userHighestBid && today > limitDate && !product.payed) {
        wonProducts.push({ ...product, highestBid });
      }
    }
    return wonProducts;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

const productServices = {
  getProduct,
  createProduct,
  deleteProduct,
  modifyProduct,
  uncontrolledModifyProduct,
  addImage,
  deleteImage,
  createEmptyProduct,
  getBidProductsByUser,
  getWonProductsByUser,
  getActiveBidProductsByUser,
};

export default productServices;
