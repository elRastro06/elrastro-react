import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import "../../assets/styles/profile.css";

export default function Profile() {
  const { id } = useParams();

  const [user, setUser] = useState({});
  const [products, setProducts] = useState([]);
  const [userLocation, setUserLocation] = useState("");

  useEffect(() => {
    // Fetch user data by ID
    axios
      .get(`http://localhost:5000/v1/${id}`)
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

    // Fetch products data for the user
    axios
      .get(`http://localhost:5001/v1/?userID=${id}`)
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id]);

  useEffect(() => {
    // Fetch user location
    if (!user.location) return;
    axios
      .get(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${user.location.coordinates[1]}&longitude=${user.location.coordinates[0]}&localityLanguage=es`
      )
      .then((response) => {
        setUserLocation(response.data.city + ", " + response.data.countryName);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [user]);

  return (
    <div>
      <h1 className="profile-title">{user.name}</h1>
      <div className="profile-info">
        <div className="profile-image">
          <img src={"/user.jpg"} alt={user.name} />
        </div>
        <div className="profile-details">
          <div className="profile-email">
            <span className="material-icons">mail</span>
            <p>
              <strong>Email: </strong> {user.email}
            </p>
          </div>
          <div className="profile-location">
            <span className="material-icons">location_on</span>
            <p>
              <strong>Location: </strong> {userLocation}
            </p>
          </div>
        </div>
        <div className="valoraciones">  
          <div className="profile-valoraciones">
            <span className="material-icons">star</span>
            <p>
              <strong>Valoraciones: </strong> {user.valoraciones}
            </p>
          </div>
        </div>
      </div>
      <h2 className="profile-products-title">Products</h2>
      {Array.isArray(products) && products.length > 0 && (
        <div className="profile-container">
          {products.map((product, key) => (
            <div className="profile-product" key={key}>
              {product.images ? (
                <div className="profile-product-image">
                  <img src={product.images[0].url} alt={product.name} />
                </div>
              ) : (
                <div className="profile-product-image">
                  <img src="/no_image.png" alt="No image available" />
                </div>
              )}
              <div className="profile-product-info">
                <h3 className="profile-product-name">{product.name}</h3>
                <p className="profile-product-description">
                  {product.description}
                </p>
                <p className="profile-product-price">{product.price}€</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
