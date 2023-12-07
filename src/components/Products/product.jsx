import React from "react";
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

import "../../assets/styles/product.css";
import productServices from "../../services/productServices";
import bidServices from "../../services/bidServices";
import clientServices from "../../services/clientServices";
import chatService from "../../services/chatService";

export default function Product() {

    const navigate = useNavigate();

    const productId = useParams().id;
    const [product, setProduct] = useState({});
    const [bids, setBids] = useState([{ userID: "" }]); // Para que no de fallo al cargar la pagina
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

            if (bidsData.length > 0) {
                setNewBid(bidsData[0].amount + 0.1);
            }

            const ownerData = await clientServices.getClient(productData.userID);
            setOwner(ownerData);
        }

        fetchData().catch(console.error);
    }, []);

    useEffect(() => {
        const calculateTimeLeft = (startDate) => {
            const date = Date.parse(startDate);
            const today = new Date().getTime();

            let length = product.length;
            if (length == undefined) length = 7;

            const maxDiff = length * 24 * 60 * 60 * 1000;

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
        let newSelected = selectedImage - 1;
        if (newSelected < 0) newSelected += product.images.length;
        setSelectedImage(newSelected % product.images.length);
    }

    const nextImage = () => {
        setSelectedImage((selectedImage + 1) % product.images.length);
    }

    const endedBid = () => {
        return timeLeft.seconds < 0 || timeLeft.minutes < 0 ||
            timeLeft.hours < 0 || timeLeft.days < 0;
    }

    const addBid = async (event) => {
        event.preventDefault();

        if (endedBid()) {
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
        if (bids.length != 0) alert("It can not be deleted a product with bids");
        else {
            await productServices.deleteProduct(productId);
            navigate("/");
        }
    }

    const modifyProduct = () => {
        if (bids.length != 0) alert("It can not be modified a product with bids");
        else navigate(`/product/edit/${productId}`);
    }

    const handleChat = async () => {
        const chat = await chatService.getChatFromUserAndProduct(loggedUserId, productId);

        if(chat[0] == undefined) {
            const response = await chatService.createNewChat(productId, product.userID, loggedUserId);
            navigate(`/chats/${response.insertedId}`);
        } else {
            navigate(`/chats/${chat[0]._id}`);
        }
    }

    return (
        <div className="product-container">
            <div className="product-image-container">
                <img className="product-page-image" src={product.images != undefined ? product.images[selectedImage].secure_url : "http://localhost:5173/no_image.png"} alt="Product Image"></img>
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
            </div>

            <div className="product-info-container">
                <div className="product-details">
                    <h2>{product.name}</h2>
                    <p>{product.description}</p>
                    <p className="product-price">{product.price}€</p>

                    <div className="product-owner">
                        <img src={owner.image != undefined ? owner.images : "http://localhost:5173/user.jpg"}></img>
                        <Link to={`/profile/${owner._id}`}>{owner.email}</Link>
                        {
                            loggedUserId != product.userID ?
                                <div className="asksomething">
                                    <p> Any question? </p>
                                    <span className="material-icons" onClick={() => handleChat()}> chat </span>
                                </div>
                                : null
                        }
                    </div>

                    <div className={`product-status ${endedBid() ? "off" : "on"}`}>
                        {
                            endedBid() ?
                                <p> <b> Bid auction ended {Math.abs(timeLeft.days)} days ago </b> </p> :
                                <p> <b> The auction is still ongoing  </b> </p>
                        }
                        <p> <b> {endedBid() ? "" : timeLeftStr()} </b> </p>
                    </div >
                </div>




                <div className="product-bids-container">
                    <h3>Bids</h3>

                    {
                        bids.length > 0 ?
                            <div className={`product-lastbid ${(bids[0].userId == loggedUserId) ? "lastbid-own" : "lastbid-other"}`}>
                                <p> {"Last bid " + ((bids[0].userId == loggedUserId) ? "was" : "wasn't") + " made by you"}</p>
                            </div>
                            : null
                    }



                    <div className="product-bids-list">
                        {bids.map((bid) => {
                            return (
                                <div className={`product-bid ${(bid.userId == loggedUserId) ? "own-bid" : "other-bid"}`} key={bid._id}>
                                    <p>{bid.amount}€</p>
                                    <p>{handleDate(bid.date)}</p>
                                </div>
                            )
                        })}
                    </div>



                    <form className="bid-form">
                        <input type="number" step={0.1} value={newBid} disabled={endedBid() || loggedUserId == product.userID} onChange={(event) => setNewBid(event.target.value)}></input>
                        <button className="bid-form-btn" onClick={addBid} disabled={loggedUserId == product.userID}>
                            <span className="material-icons">gavel</span>
                        </button>
                    </form>

                </div>
            </div>
        </div>
    )
}
