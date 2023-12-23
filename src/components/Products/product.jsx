import React from "react";
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

import "../../assets/styles/product.css";
import productServices from "../../services/productServices";
import bidServices from "../../services/bidServices";
import clientServices from "../../services/clientServices";
import chatService from "../../services/chatService";

export default function Product({ userLogged }) {
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
    seconds: 0,
  });

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
      } else {
        setNewBid(productData.price + 0.1);
      }

      const ownerData = await clientServices.getClient(productData.userID);
      setOwner(ownerData);
    };

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
        seconds: Math.floor((diff / 1000) % 60),
      });
    };

    if (product.date != undefined) {
      const interval = setInterval(() => calculateTimeLeft(product.date), 1000);

      return () => clearInterval(interval);
    }
  }, [product]);

  const prevImage = () => {
    let newSelected = selectedImage - 1;
    if (newSelected < 0) newSelected += product.images.length;
    setSelectedImage(newSelected % product.images.length);
  };

  const nextImage = () => {
    setSelectedImage((selectedImage + 1) % product.images.length);
  };

  const endedBid = () => {
    return (
      timeLeft.seconds < 0 ||
      timeLeft.minutes < 0 ||
      timeLeft.hours < 0 ||
      timeLeft.days < 0
    );
  };

  const addBid = async (event) => {
    event.preventDefault();

    if (endedBid()) {
      alert("Bid is over. You can not make a new bid");
      return;
    } else if (parseFloat(newBid) < product.price) {
      alert("The amount must be greater than the initial price");
      return;
    }

    const bid = {
      amount: parseFloat(newBid),
      userId: userLogged._id,
      productId: product._id,
    };

    const res = await bidServices.addBid(bid, userLogged.oauthToken);
    if (res.error != undefined || res.information != undefined) {
      alert("Bid not inserted. Price must be higher than current highest bid");
    } else {
      //navigate(0);    //refresh
      console.log(res);
    }
  };

  const handleDate = (dateStr) => {
    let date = new Date(Date.parse(dateStr));

    const options = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    return date.toLocaleDateString(undefined, options); //'es-ES'
  };

  const timeLeftStr = () => {
    return (
      timeLeft.days +
      "d " +
      timeLeft.hours +
      "h " +
      timeLeft.minutes +
      "m " +
      timeLeft.seconds +
      "s"
    );
  };

  const deleteProduct = async () => {
    if (bids.length != 0) alert("It can not be deleted a product with bids");
    else {
      await productServices.deleteProduct(productId, userLogged.oauthToken);
      navigate("/");
    }
  };

  const modifyProduct = () => {
    if (bids.length != 0) alert("It can not be modified a product with bids");
    else navigate(`/product/edit/${productId}`);
  };

  const handleChat = async () => {
    const chat = await chatService.getChatFromUserAndProduct(
      userLogged._id,
      productId,
      userLogged.oauthToken
    );

    if (chat[0] == undefined) {
      const response = await chatService.createNewChat(
        productId,
        product.userID,
        userLogged._id,
        userLogged.oauthToken
      );
      navigate(`/chats/${response.insertedId}`);
    } else {
      navigate(`/chats/${chat[0]._id}`);
    }
  };

  return (
    <div className="product-container">
      <div className="product-image-container">
        <img
          className="product-page-image"
          src={
            product.images != undefined && product.images.length > 0
              ? product.images[selectedImage].secure_url
              : "http://localhost:5173/no_image.png"
          }
          alt="Product Image"
        ></img>
        <button
          className="product-image-button prev"
          onClick={() => prevImage()}
        >
          &#8249;
        </button>
        <button
          className="product-image-button next"
          onClick={() => nextImage()}
        >
          &#8250;
        </button>
        <div className="product-owner-options">
          {userLogged != undefined && userLogged._id == product.userID ? (
            <>
              <button id="product-modify" onClick={() => modifyProduct()}>
                <span className="material-icons">edit</span>
              </button>
              <button id="product-delete" onClick={() => deleteProduct()}>
                <span className="material-icons">delete</span>
              </button>
            </>
          ) : null}
        </div>
      </div>
      <div className="product-info-container">
        <div className="product-details">
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <p className={"product-price " + (bids.length > 0 ? "with-bid" : "")}>
            {product.price}€
          </p>

          <div className="product-owner">
            <img
              src={
                owner.image != undefined
                  ? owner.images
                  : "http://localhost:5173/user.jpg"
              }
            ></img>
            <Link to={`/profile/${owner._id}`}>{owner.email}</Link>
            {userLogged != undefined && userLogged._id != product.userID ? (
              <div className="asksomething" onClick={handleChat}>
                <p> Any question? </p>
                <span className="material-icons"> chat </span>
              </div>
            ) : null}
          </div>

          <div className={`product-status ${endedBid() ? "off" : "on"}`}>
            {endedBid() ? (
              <p>
                {" "}
                <b>
                  {" "}
                  Bid auction ended {Math.abs(timeLeft.days)} days ago{" "}
                </b>{" "}
              </p>
            ) : (
              <p>
                {" "}
                <b> The auction is still ongoing </b>{" "}
              </p>
            )}
            <p>
              {" "}
              <b> {endedBid() ? "" : timeLeftStr()} </b>{" "}
            </p>
          </div>
        </div>

        <div className="product-bids-container">
          <h3>Bids</h3>

          {userLogged != undefined && userLogged._id != product.userID ? (
            bids.length > 0 ? (
              <div
                className={`product-lastbid ${
                  bids[0].userId == userLogged._id
                    ? "lastbid-own"
                    : "lastbid-other"
                }`}
              >
                <p>
                  {" "}
                  {"Last bid " +
                    (bids[0].userId == userLogged._id ? "was" : "wasn't") +
                    " made by you"}
                </p>
              </div>
            ) : null
          ) : (
            <></>
          )}

          <div className="product-bids-list">
            {bids.map((bid, key) => {
              return (
                <div
                  className={`product-bid ${
                    userLogged != undefined && bid.userId == userLogged._id ? "own-bid" : "other-bid"
                  }`}
                  key={key}
                >
                  <p>{bid.amount}€</p>
                  <p>{handleDate(bid.date)}</p>
                </div>
              );
            })}
          </div>

          <form className="bid-form">
            <input
              type="number"
              step={0.1}
              value={parseFloat(newBid.toFixed(2))}
              disabled={endedBid() || userLogged == undefined || userLogged._id == product.userID}
              onChange={(event) => setNewBid(event.target.value)}
            ></input>
            <button
              className="bid-form-btn"
              onClick={addBid}
              disabled={userLogged == undefined || userLogged._id == product.userID}
            >
              <span className="material-icons">gavel</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
