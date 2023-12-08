import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import "../../assets/styles/productForm.css";
import productServices from "../../services/productServices";
import bidServices from "../../services/bidServices";

export default function NewProduct() {

    const navigate = useNavigate();

    const loggedUserId = "654f4c3cf99b7fddc72edd1b";    //TEMPORAL HASTA IMPLEMENTAR LOGIN
    //654f4c1bf99b7fddc72edd19 consola
    //654f4c2bf99b7fddc72edd1a
    //654f4c3cf99b7fddc72edd1b silla

    let productId;

    useEffect(() => {

        const redirect = async () => {            
            const newProduct = await productServices.createEmptyProduct(loggedUserId);
            productId = newProduct.insertedId;
            console.log(newProduct);
    
            navigate(`/product/edit/${productId}`);
        }    

        redirect().catch(console.error);
    }, []);


    return (
        <>
        </>
    );
}
