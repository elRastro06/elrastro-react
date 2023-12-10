import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

import "../../assets/styles/profile.css";

export default function Profile() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [user, setUser] = useState({});
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [userLocation, setUserLocation] = useState("");
  const [reviewers, setReviewers] = useState([]);
  const [avg, setAvg] = useState([]);

  const loggedUserId = "654f4c3cf99b7fddc72edd1b";    //TEMPORAL HASTA IMPLEMENTAR LOGIN
  //654f4c1bf99b7fddc72edd19 consola
  //654f4c2bf99b7fddc72edd1a
  //654f4c3cf99b7fddc72edd1b silla
  const [commonSale, setCommonSale] = useState({});
  const [commonReview, setCommonReview] = useState({});

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
      });

      //Fetch average review value
      axios
      .get(`http://localhost:5000/v2/${id}/reviewsavg`)
      .then((response) => {
        setAvg(response.data.reviewAvg);
      })
      .catch((error) => {
        console.log(error);
      });

      //Fetch data for conditions on review interaction
      axios
      .get(`http://localhost:5001/v2/${loggedUserId}/${id}`)
      .then((response) => {
        setCommonSale(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
      axios
      .get(`http://localhost:5008/v2/${loggedUserId}/${id}`)
      .then((response) => {
        setCommonReview(response.data);
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

const deleteReview = async () => {
      const response = await axios.delete(`http://localhost:5008/v2/${commonReview._id}`);
      //navigate("/profile/" + id);
      window.location.reload(false);
}


/*
- ejecutamos la llamada de ver que compras hay en común
- si undefined, 
- - entonces sale el mensajito de que todavía no hay compras en común
- si no, entonces
- - si el usuario loggeado ha posteado una review (aka, si _id=undefined pa cojer reviews en comun)
- - - entonces aparecen los botones de editar y borrar review
- - si no
- - - aparece el botón de valorar
*/
const reviewInteraction = () => {
  var elems = [];

  if(commonSale._id == undefined) {
    elems.push(<div className="profile-review-interaction">You have not yet sold to or bought an item from this user. Do so in order to rate him.</div>);
  } else {
    if(commonReview._id == undefined) {
      elems.push(
        <button
           className="profile-review-valuebutton"
           onClick={() => {
            navigate("/review/new/" + user._id);
           }}
          >Valorar</button>
      )
    } else {
      elems.push(
        <button
           className="profile-review-valuebutton"
           onClick={() => {
            navigate("/review/edit/" + commonReview._id);
           }}
          >Edit Review</button>
      )
      elems.push(
        <button
           className="profile-review-deletebutton"
           onClick={() => {
            deleteReview();
           }}
          >Delete Review</button>
      )
    }
  }

  return elems;
}

const starRating = (numStars) => {
  var stars = [];
  for (var i=1; i<=5; i++) {
    if(i<=numStars) {
      stars.push(<span className="material-icons">star</span>);
  } else {
      stars.push(<span className="material-icons">star_border</span>);
    }
  }

  return stars;
}

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
              <strong>Review Average: </strong> {avg}/5
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

      <h2 className="profile-reviews-title"> <span className="material-icons">star</span> Reviews</h2>
      
      {reviewInteraction()}

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
                    <p className="review-rating">{starRating(review.rating)}</p>
                    <p className="review-text">{review.text}</p>
                    <p className="review-date">{formatDate(review.date)}</p>
                </div>
          )})}

          
        </div>
      )}
    </div>
  );
}
