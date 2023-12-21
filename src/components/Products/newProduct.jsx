import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import "../../assets/styles/productForm.css";
import productServices from "../../services/productServices";
import bidServices from "../../services/bidServices";
import loginServices from "../../services/loginServices";

export default function NewProduct({ userLogged }) {
  const navigate = useNavigate();

  let productId;

  useEffect(() => {
    if (userLogged == undefined) {
      alert("Login needed. Please login and try again");
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    const redirect = async () => {
      const newProduct = await productServices.createEmptyProduct(
        userLogged._id,
        userLogged.oauthToken
      );
      productId = newProduct.insertedId;

      navigate(`/product/edit/${productId}`);
    };

    redirect().catch(console.error);
  }, []);

  return <></>;
}
