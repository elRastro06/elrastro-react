import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

import "../../assets/styles/reviewForm.css";

export default function ReviewForm({ passedReview, reviewedID, reviewer, userLogged }) {
    const navigate = useNavigate();
    const [editMode, setEditMode] = useState(false);
    const [review, setReview] = useState({
        rating: 1,
        text: "",
    });
    const [reviewerUser, setReviewerUser] = useState({});

    const reviewsConn = import.meta.env.VITE_REVIEWS_URL;

    useEffect(() => {
        if (passedReview) setReview(passedReview);
        if (reviewer) setReviewerUser(reviewer);
    }, [passedReview]);

    const checkResponse = (res) => {
        if (res.error == "Expired token" || res.error == "No token specified") {
            localStorage.removeItem("user");
            navigate("/login");
        }
    }

    const starRating = (numStars) => {
        var stars = [];
        for (var i = 1; i <= 5; i++) {
            if (i <= numStars) {
                stars.push(<span className="material-icons">star</span>);
            } else {
                stars.push(<span className="material-icons">star_border</span>);
            }
        }

        return stars;
    };

    const handleDelete = async () => {
        const response = await axios.delete(
            `${reviewsConn}/v2/${review._id}`,
            {
                headers: {
                    "Authorization": userLogged.oauthToken
                }
            }
        );
        checkResponse(response.data);
        window.location.reload();
    };

    const setText = (event) => {
        const newText = {
            ...review,
            text: event.target.value,
        };
        setReview(newText);
    };

    const setRating = (event) => {
        const newRating = {
            ...review,
            rating: parseFloat(event.target.value),
        };
        setReview(newRating);
    };

    const handleSave = async () => {
        const body = {
            reviewerID: userLogged._id,
            reviewedID: reviewedID,
            rating: review.rating,
            text: review.text,
        };
        if (passedReview) {
            const response = await axios.put(
                `${reviewsConn}/v2/${review._id}`,
                body,
                {
                    headers: {
                        "Authorization": userLogged.oauthToken
                    }
                }
            );
            checkResponse(response.data);
            window.location.reload();
        } else {
            try {
                const response = await axios.post(`${reviewsConn}/v2/`, body, {
                    headers: {
                        "Authorization": userLogged.oauthToken
                    }
                });
                checkResponse(response.data);
                window.location.reload();
            } catch (error) {
                console.log(error);
            }
        }
    };

    const formatDate = (timestamp) => {
        // Crear un objeto de fecha a partir de la cadena de fecha
        const fechaObjeto = new Date(timestamp);

        // Verificar si la fecha es válida antes de formatearla
        if (!isNaN(fechaObjeto.getTime())) {
            // Formatear la fecha con hora y minutos
            const opciones = {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
            };
            return fechaObjeto.toLocaleDateString("en-EN", opciones);
        } else {
            console.error("La cadena de fecha no es válida.");
            return ""; // Puedes devolver una cadena vacía o algún valor predeterminado en caso de error
        }
    };

    return (
        <>
            {passedReview ? (
                <div className="profile-review">
                    <div className="review-user-buttons">
                        <div
                            className="review-user"
                            onClick={() => {
                                navigate("/profile/" + reviewerUser._id);
                            }}
                        >
                            <img src={"/user.jpg"} />
                            <p className="reviewer-user-name">{reviewerUser.name}</p>
                        </div>
                        {userLogged._id == reviewerUser._id && (
                            <div className="editproduct-finalbuttons">
                                {passedReview ? (
                                    <>
                                        {editMode ? (
                                            <>
                                                <button onClick={() => setEditMode(false)}>
                                                    Cancel
                                                </button>
                                                <button onClick={handleSave}>Save changes</button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() => {
                                                        setEditMode(true);
                                                    }}
                                                >
                                                    Edit
                                                </button>
                                                <button onClick={handleDelete}>Delete</button>
                                            </>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <button id="accept-button" onClick={handleSave}>
                                            Add Review
                                        </button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="review-form-container">
                        <form>
                            <label>Rating:</label>
                            {editMode ? (
                                <select onChange={setRating} value={review.rating}>
                                    <option value={1}>1</option>
                                    <option value={2}>2</option>
                                    <option value={3}>3</option>
                                    <option value={4}>4</option>
                                    <option value={5}>5</option>
                                </select>
                            ) : (
                                <p className="review-rating">{starRating(review.rating)}</p>
                            )}
                            <br />
                            <label>Text: </label>
                            {editMode ? (
                                <>
                                    <textarea value={review.text} onChange={setText}></textarea>
                                </>
                            ) : (
                                <>
                                    <p className="review-text">{review.text}</p>
                                </>
                            )}
                            <p className="review-date">{formatDate(review.date)}</p>
                        </form>
                    </div>
                </div>
            ) : (
                <>
                    <div className="profile-review">
                        <div className="review-form-container">
                            <div className="review-add-title">
                                <h3>Add your review!</h3>
                            </div>
                            <form>
                                <label>Rating:</label>
                                <select onChange={setRating} value={review.rating}>
                                    <option value={1}>1</option>
                                    <option value={2}>2</option>
                                    <option value={3}>3</option>
                                    <option value={4}>4</option>
                                    <option value={5}>5</option>
                                </select>
                                <br />
                                <label>Text: </label>
                                <textarea value={review.text} onChange={setText}></textarea>
                            </form>
                            <div className="add-review-button-container">
                                <button onClick={handleSave}>Add Review</button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
