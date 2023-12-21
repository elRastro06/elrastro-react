import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

import "../../assets/styles/profile.css";
import ReviewForm from "./reviewForm";
import loginServices from "../../services/loginServices";
import productServices from "../../services/productServices";

export default function Profile({ userLogged }) {
  const PayPalButton = paypal.Buttons.driver("react", { React, ReactDOM });
  const navigate = useNavigate();
  let { id } = useParams();

  const [user, setUser] = useState({});
  const [products, setProducts] = useState([]);
  const [bidedProducts, setBidedProducts] = useState([]);
  const [wonProducts, setWonProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [userLocation, setUserLocation] = useState("");
  const [reviewers, setReviewers] = useState([]);
  const [avg, setAvg] = useState([]);

  const [commonSale, setCommonSale] = useState({});
  const [commonReview, setCommonReview] = useState({});

  const clientsConn =
    import.meta.env.CLIENTS != undefined
      ? import.meta.env.CLIENTS
      : "localhost";
  const productsConn =
    import.meta.env.PRODUCTS != undefined
      ? import.meta.env.PRODUCTS
      : "localhost";
  const reviewsConn =
    import.meta.env.REVIEWS != undefined
      ? import.meta.env.REVIEWS
      : "localhost";

  useEffect(() => {
    if (userLogged == undefined) {
      alert("Login needed. Please login and try again");
      navigate("/login");
      return;
    }

    if (!id) {
      id = userLogged._id;
    }
    // Fetch user data by ID
    axios
      .get(`http://${clientsConn}:5000/v1/${id}`, {
        headers: {
          Authorization: userLogged.oauthToken,
        },
      })
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

    // Fetch potential reviewer data
    axios
      .get(`http://${clientsConn}:5000/v1/`, {
        headers: {
          Authorization: userLogged.oauthToken,
        },
      })
      .then((response) => {
        setReviewers(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

    // Fetch products data for the user
    axios
      .get(`http://${productsConn}:5001/v2/?userID=${id}`, {
        headers: {
          Authorization: userLogged.oauthToken,
        },
      })
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

    //Fetch reviews data for the user
    axios
      .get(`http://${clientsConn}:5000/v2/${id}/reviews`, {
        headers: {
          Authorization: userLogged.oauthToken,
        },
      })
      .then((response) => {
        setReviews(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

    //Fetch average review value
    axios
      .get(`http://${clientsConn}:5000/v2/${id}/reviewsavg`, {
        headers: {
          Authorization: userLogged.oauthToken,
        },
      })
      .then((response) => {
        setAvg(response.data.reviewAvg);
      })
      .catch((error) => {
        console.log(error);
      });

    //Fetch data for conditions on review interaction
    axios
      .get(`http://${productsConn}:5001/v2/${userLogged._id}/${id}`, {
        headers: {
          Authorization: userLogged.oauthToken,
        },
      })
      .then((response) => {
        setCommonSale(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
    axios
      .get(`http://${reviewsConn}:5008/v2/${userLogged._id}/${id}`, {
        headers: {
          Authorization: userLogged.oauthToken,
        },
      })
      .then((response) => {
        setCommonReview(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

    productServices
      .getActiveBidProductsByUser(userLogged._id, userLogged.oauthToken)
      .then((data) => {
        setBidedProducts(data);
      });

    productServices
      .getWonProductsByUser(userLogged._id, userLogged.oauthToken)
      .then((response) => {
        setWonProducts(response);
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
        reviews.find((review) => review.reviewerID === ReviewerId)
          .reviewerID === reviewer._id
    );
  };

  const createOrder = (data, actions, price) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: price.toString(),
          },
        },
      ],
    });
  };

  const onApprove = (data, actions, product) => {
    return actions.order.capture().then(function (details) {
      productServices
        .uncontrolledModifyProduct(
          product._id,
          { ...product, payed: true },
          userLogged.oauthToken
        )
        .then((response) => {
          alert("Transaction completed by " + details.payer.name.given_name);
          productServices
            .getWonProductsByUser(userLogged._id, userLogged.oauthToken)
            .then((response) => {
              setWonProducts(response);
            });
        });
    });
  };

  return (
    <div className="profile-first-container">
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
          <div className="profile-valoraciones">
            <span className="material-icons">star</span>
            <p>
              <strong>Review Average: </strong>{" "}
              {avg ? avg / 5 : "No reviews yet"}
            </p>
          </div>
        </div>
      </div>
      <h2 className="profile-products-title">Products</h2>
      {Array.isArray(products) && products.length > 0 && (
        <div className="profile-container">
          {products.map((product) => (
            <div
              className="profile-product"
              key={product._id}
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
              </div>
            </div>
          ))}
        </div>
      )}

      {Array.isArray(products) && products.length == 0 && (
        <div className="profile-review-interaction">
          This user has not published any products yet
        </div>
      )}
      {userLogged?._id === id ||
        (!id && (
          <>
            <h2 className="profile-products-title">
              Products you have to pay for
            </h2>
            {Array.isArray(wonProducts) && wonProducts.length > 0 && (
              <div className="profile-container">
                {wonProducts.map((product) => {
                  return (
                    <div
                      className="profile-product"
                      key={product._id}
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
                      </div>
                      <PayPalButton
                        createOrder={(data, actions) =>
                          createOrder(data, actions, product.highestBid)
                        }
                        onApprove={(data, actions) =>
                          onApprove(data, actions, product)
                        }
                      />
                    </div>
                  );
                })}
              </div>
            )}
            {Array.isArray(wonProducts) && wonProducts.length == 0 && (
              <div className="profile-review-interaction">
                You have not won any products yet
              </div>
            )}

            <h2 className="profile-products-title">
              Active products you have bid
            </h2>
            {Array.isArray(bidedProducts) && bidedProducts.length > 0 && (
              <div className="profile-container">
                {bidedProducts.map((product) => {
                  return (
                    <div
                      className="profile-product"
                      key={product._id}
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
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {Array.isArray(bidedProducts) && bidedProducts.length == 0 && (
              <div className="profile-review-interaction">
                You have not bidded any products yet
              </div>
            )}
          </>
        ))}

      <h2 className="profile-reviews-title">
        {" "}
        <span className="material-icons">star</span> Reviews
      </h2>

      {Array.isArray(reviews) &&
        reviews.length > 0 &&
        (commonSale._id == undefined ? (
          <div className="profile-review-interaction">
            You have not yet sold to or bought an item from this user. Do so in
            order to rate him.
          </div>
        ) : commonReview._id == undefined ? (
          <div className="profile-container">
            <ReviewForm reviewedID={id} />
          </div>
        ) : (
          <div className="profile-review-interaction">
            You have already reviewed this user
          </div>
        ))}

      {Array.isArray(reviews) && reviews.length > 0 && (
        <div className="profile-container-reviews">
          {reviews.map((review) => {
            const reviewer = getReviewer(review.reviewerID);

            return (
              <div className="review-container" key={review._id}>
                <ReviewForm
                  passedReview={review}
                  reviewedID={id}
                  reviewer={reviewer}
                  userLogged={userLogged}
                />
              </div>
            );
          })}
        </div>
      )}
      {Array.isArray(reviews) && reviews.length === 0 && (
        <div className="profile-review-interaction">
          There are not reviews for this user yet
        </div>
      )}
    </div>
  );
}
