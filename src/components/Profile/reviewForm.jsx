import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

import "../../assets/styles/reviewForm.css";

export default function ReviewForm() {
    const navigate = useNavigate();
    const loggedUserId = "654f4c3cf99b7fddc72edd1b";    //TEMPORAL HASTA IMPLEMENTAR LOGIN
    //654f4c1bf99b7fddc72edd19 consola
    //654f4c2bf99b7fddc72edd1a
    //654f4c3cf99b7fddc72edd1b silla
    
    const [review, setReview] = useState({
        rating: 1,
        text: ""
    });
    const [user, setUser] = useState({});
    let reviewId = useParams().id;

    useEffect(() => {

        const fetchData = async () => {
            
            const response = await axios.get(`http://localhost:5008/v2/${reviewId}`);
            const reviewData = response.data;
            
            if (reviewData._id == undefined) {
                navigate("/");
                return;
            } else if (reviewData.reviewerID != loggedUserId) {
                navigate(`/profile/${reviewData.reviewedID}`);
                return;
            } else {
                setReview(reviewData);
            }

        }

        fetchData().catch(console.error);
    }, [reviewId]);

    useEffect(() => {
        // Fetch user data
        axios
        .get(`http://localhost:5000/v1/${review.reviewedID}`)
        .then((response) => {
          setUser(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }, [review]);

    const setText = (event) => {
        const newText = {
            ...review,
            text: event.target.value
        }
        setReview(newText);
    }

    const setRating = (event) => {
        const newRating = {
            ...review,
            rating: parseFloat(event.target.value)
        }
        setReview(newRating);
    }

    const handleCancel = () => {
        navigate(`/profile/${review.reviewedID}`);
    }

    const handleSave = async () => {
        const body = {
            reviewerID: loggedUserId,
            reviewedID: review.reviewedID,
            rating: review.rating,
            text: review.text,
            date: new Date()
        };

        let response = await axios.put(`http://localhost:5008/v2/${reviewId}`, body);

        if (response.error != undefined) {
            if (confirm(response.error)) {
                handleCancel();
            }
        } else {
            navigate(`/profile/${review.reviewedID}`);
        }
    }


    const starRating = (numStars) => {
        var stars = [];
        for (var i=1; i<=5; i++) {
          if(i<=numStars) {
            stars.push(<span className="material-icons">star</span>)
        } else {
            stars.push(<span className="material-icons">star_border</span>)
          }
        }

        return stars;
    }

    return (
        <>
            <h2 className="profile-reviews-title"> <span className="material-icons">star</span> Review for {user.name}</h2>
            <div className="editproduct-container">

                <div className="productedit-form-container">
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
                </div>

            </div>
            <div className="editproduct-finalbuttons">
                <button id="cancel-button" onClick={handleCancel}>Cancel</button>
                <button id="accept-button" onClick={handleSave}>Save changes</button>
            </div>
        </>
    );
}