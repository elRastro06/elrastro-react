import React from "react";
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

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
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    const loggedUserId = "654f4c3cf99b7fddc72edd1b";    //TEMPORAL HASTA IMPLEMENTAR LOGIN
    //654f4c1bf99b7fddc72edd19 consola
    //654f4c2bf99b7fddc72edd1a
    //654f4c3cf99b7fddc72edd1b silla

    useEffect(() => {
        const fetchData = async () => {
            const productData = await productServices.getProduct(productId);

            if (productData._id) {
                setProduct(productData);
            } else {
                navigate("/");
                return;
            }

            const bidsData = await bidServices.getBids(productId);
            setBids(bidsData);

            const ownerData = await clientServices.getClient(productData.userID);
            setOwner(ownerData);
        }

        fetchData().catch(console.error);
    }, []);

    useEffect(() => {
        const calculateTimeLeft = (startDate) => {
            const date = Date.parse(startDate);
            const today = new Date().getTime();
            const maxDiff = 7 * 24 * 60 * 60 * 1000;

            const diff = date + maxDiff - today;

            setTimeLeft({
                days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((diff / 1000 / 60) % 60),
                seconds: Math.floor((diff / 1000) % 60)
            });
        }

        if (product.date != undefined) {
            const interval = setInterval(() => calculateTimeLeft(product.date), 1000);

            return () => clearInterval(interval);
        }
    }, [product]);

    const prevImage = () => {
        setSelectedImage(Math.abs(selectedImage - 1) % product.images.length);
    }

    const nextImage = () => {
        setSelectedImage((selectedImage + 1) % product.images.length);
    }

    const addBid = async (event) => {
        event.preventDefault();

        if(timeLeft.seconds < 0 || timeLeft.minutes < 0 || timeLeft.hours < 0
            || timeLeft.days < 0) {
                alert("Bid is over. You can not make a new bid");
                return;
            }

        const bid = {
            amount: parseFloat(newBid),
            userId: loggedUserId,
            productId: product._id
        };

        const res = await bidServices.addBid(bid);

        if (res.error != undefined || res.information != undefined) {
            alert("Bid not inserted. Price must be higher than current highest bid");
        } else {
            navigate(0);    //refresh
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

    const timeLeftStr = () => {
        return timeLeft.days + "d " + timeLeft.hours + "h " + timeLeft.minutes +
            "m " + timeLeft.seconds + "s";
    }

    const deleteProduct = async () => {
        if (bids.length != 0) alert("No se puede eliminar un producto con pujas");
        else {
            await productServices.deleteProduct(productId);
            navigate("/");
        }
    }

    const modifyProduct = () => {

    }

    return (
        <div className="product-container">
            <section className="product-image-container">
                <img className="product-page-image" src={product.images[selectedImage].url} alt="Product Image"></img>
                <button className="product-image-button prev" onClick={() => prevImage()}>&#8249;</button>
                <button className="product-image-button next" onClick={() => nextImage()}>&#8250;</button>
                <div className="product-owner-options">
                    {loggedUserId == product.userID &&
                        <>
                            <button id="product-modify" onClick={() => modifyProduct()}>
                                <span className="material-icons">edit</span>
                            </button>
                            <button id="product-delete" onClick={() => deleteProduct()}>
                                <span className="material-icons">delete</span>
                            </button>
                        </>
                    }
                </div>
            </section>

            <section className="product-info-container">
                <section className="product-details">
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                    <p className="product-price">{product.price}€</p>
                    <span>{timeLeftStr()}</span>
                </section>
                <div className="product-owner">
                    <Link to={`/profile/${owner._id}`}>{owner.email}</Link>
                    <img src="https://avatars.githubusercontent.com/u/100372552?s=96&v=4"></img>
                </div>
                <h4>Bids made</h4>
                {bids.map((bid) => {
                    return <div className="product-bid" key={bid._id}>
                        <p>{bid.amount}€</p>
                        <p>{handleDate(bid.date)}</p>
                    </div>
                })}
                <form className="bid-form">
                    <input type="number" step={0.1} value={newBid} onChange={(event) => setNewBid(event.target.value)}></input>
                    <button className="bid-form-btn" onClick={addBid} disabled={loggedUserId == product.userID}>
                        <span className="material-icons">gavel</span>
                    </button>
                </form>
            </section>
        </div>
    )
}
