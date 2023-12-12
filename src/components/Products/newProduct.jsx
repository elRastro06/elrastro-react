import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import "../../assets/styles/productForm.css";
import productServices from "../../services/productServices";
import bidServices from "../../services/bidServices";
import loginServices from "../../services/loginServices";

export default function NewProduct() {

    const navigate = useNavigate();

    let productId;
    const [userLogged, setUserLogged] = useState({});

    useEffect(() => {

        const user = loginServices.getUserLogged();
        setUserLogged(user);

        const redirect = async () => {
            const newProduct = await productServices.createEmptyProduct(user._id, userLogged.oauthToken);
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
