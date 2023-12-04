import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

import "../../assets/styles/productForm.css";

export default function ProductForm() {
    const navigate = useNavigate();

    const productId = useParams().id;
    const loggedUserId = "654f4c3cf99b7fddc72edd1b";    //TEMPORAL HASTA IMPLEMENTAR LOGIN
    //654f4c1bf99b7fddc72edd19 consola
    //654f4c2bf99b7fddc72edd1a
    //654f4c3cf99b7fddc72edd1b silla

    const [product, setProduct] = useState({
        name: "",
        description: "",
        price: 0.0,
    });

    useEffect(() => {
        const fetchData = async () => {
            // const bids = await axios.get(`http://localhost:5002/v1/?productId=${productId}`);
            // if (bids.data.length > 0) {
            //     navigate(`/product/${productId}`);
            //     return;
            // }

            const productData = await axios.get(`http://localhost:5001/v1/${productId}`);
            // if (productData.data._id == undefined) {
            //     navigate("/");
            //     return;
            // } else if (productData.data.userID != loggedUserId) {
            //     navigate(`/product/${productId}`);
            //     return;
            // }
            // else {
            //     setProduct(productData);
            // }
        }

        fetchData().catch(console.error);
    }, []);

    const setName = (event) => {
        const newName = {
            ...product,
            name: event.target.value
        }
        setProduct(newName);
    }

    const setDescription = (event) => {
        const newDesc = {
            ...product,
            description: event.target.value
        }
        setProduct(newDesc);
    }

    return (
        <div className="form-container">
            <form>
                <label>Nombre: </label>
                <input type="text" value={product.name} onChange={setName}></input>
                <br />
                <label>Description: </label>
                <textarea value={product.description} onChange={setDescription}></textarea>
                <br />
                <label >Precio:</label>
                <input type="number" step={0.1}></input>
            </form>
        </div>
    );
}
