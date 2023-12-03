import React from "react";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import "../../assets/styles/product.css";
import productServices from "../../services/productServices";
import bidServices from "../../services/bidServices";
import clientServices from "../../services/clientServices";

export default function Product() {

    const navigate = useNavigate();

    const productId = useParams().id;
    const [product, setProduct] = useState({ images: [{ url: "" }] });
    const [bids, setBids] = useState([]);
    const [selectedImage, setSelectedImage] = useState(0);
    const [owner, setOwner] = useState({});
    const [newBid, setNewBid] = useState(0.0);

    const fetchData = async () => {
        const productData = await productServices.getProduct(productId);

        if (productData._id) {
            setProduct(productData);
        } else {
            navigate("/");
        }

        const bidsData = await bidServices.getBids(productId);
        setBids(bidsData);

        const ownerData = await clientServices.getClient(productData.userID);
        setOwner(ownerData);
    }

    useEffect(() => {
        fetchData().catch(console.error);
    }, []);

    const prevImage = () => {
        setSelectedImage(Math.abs(selectedImage - 1) % product.images.length);
    }

    const nextImage = () => {
        setSelectedImage((selectedImage + 1) % product.images.length);
    }

    const addBid = async (event) => {
        const bid = {
            amount: parseFloat(newBid),
            userId: 0, //userId
            productId: product._id
        };

        const res = await bidServices.addBid(bid);

        if (res.error != undefined || res.information != undefined) {
            alert("Bid not inserted. Price must be higher than current highest bid");
        } else {
            navigate(0);
        }
    }

    const handleDate = (dateStr) => {
        let date = new Date(Date.parse(dateStr));

        const options = {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        };
        return date.toLocaleDateString(undefined, options); //'es-ES'
    }

    return (
        <div className="product-container">
            <section className="product-image-container">
                <img className="product-page-image" src={product.images[selectedImage].url} alt="Product Image"></img>
                <button className="product-image-button prev" onClick={() => prevImage()}>&#8249;</button>
                <button className="product-image-button next" onClick={() => nextImage()}>&#8250;</button>
            </section>

            <section className="product-info-container">
                <section className="product-details">
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                    <p className="product-price">{product.price}€</p>
                </section>
                <div className="product-owner">
                    <span>Owner</span>
                    <img src="https://avatars.githubusercontent.com/u/100372552?s=96&v=4"></img>
                </div>
                <h4>Bids made</h4>
                {bids.map((bid) => {
                    return <div className="product-bid" key={bid._id}>
                        <p>{bid.amount}€</p>
                        <p>{handleDate(bid.date)}</p>
                    </div>
                })}

                <input type="number" step={0.1} value={newBid} onChange={(event) => setNewBid(event.target.value)}></input>
                <button className="bid-form-btn" onClick={addBid}>Make bid</button>
            </section>
        </div>
    )
}
