import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

import "../../assets/styles/profile.css";

export default function Profile() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [user, setUser] = useState({});
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState({});
  const [userLocation, setUserLocation] = useState("");
  const [reviewers, setReviewers] = useState([]);
  

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

    // Fetch potential reviewer data
    axios
    .get(`http://localhost:5000/v1/`)
    .then((response) => {
        setReviewers(response.data);
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

    //Fetch reviews data for the user
    axios
      .get(`http://localhost:5000/v2/${id}/reviews`)
      .then((response) => {
        setReviews(response.data);
      })
      .catch((error) => {
        console.log(error);
      })

  }, [id]);

  useEffect(() => {
    // Fetch user location
    axios
      .get(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${user.lat}&longitude=${user.long}&localityLanguage=es`
      )
      .then((response) => {
        setUserLocation(response.data.city + ", " + response.data.countryName);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [user]);

  const getReviewer = (ReviewerId) => {
    return reviewers.find(
        (reviewer) =>
          reviews.find((review) => review.reviewerID === ReviewerId).reviewerID === reviewer._id
    );
  };

  const formatDate = (timestamp) => {
    // Crear un objeto de fecha a partir de la cadena de fecha
    const fechaObjeto = new Date(timestamp);

    // Verificar si la fecha es válida antes de formatearla
    if (!isNaN(fechaObjeto.getTime())) {
        // Formatear la fecha con hora y minutos
        const opciones = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
        return fechaObjeto.toLocaleDateString('en-EN', opciones);
    } else {
        console.error('La cadena de fecha no es válida.');
        return ''; // Puedes devolver una cadena vacía o algún valor predeterminado en caso de error
    }
};

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
            <div 
                className="profile-product" key={key}
                onClick={() => {
                    navigate("/product/" + product._id);
                }}
            >
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

      <h2 className="profile-reviews-title"> <span className="material-icons">star</span> Valoraciones</h2>

      
      <button className="profile-review-button">Valorar</button>

      {Array.isArray(reviews) && reviews.length > 0 && (
        <div className="profile-container">
          {reviews.map((review, key) => {
            const reviewer = getReviewer(review.reviewerID);
            return (
                <div className="profile-review" key={key}>
                    <div
                        className="review-user"
                        onClick={() => {
                        navigate("/profile/" + reviewer._id);
                        }}
                    >
                        <img src="http://localhost:5173/user.jpg" />
                        <p className="reviewer-user-name">{reviewer.name}</p>
                    </div>

                    <p className="review-rating">{review.rating}/5</p>
                    <p className="review-date">{formatDate(review.date)}</p>
                    <p className="review-text">{review.text}</p>
                </div>
          )})}
        </div>
      )}
    </div>
  );
}
