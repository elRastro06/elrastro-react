import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import "../../assets/styles/reviewForm.css";
import axios from "axios";

export default function NewReview({ userLogged }) {
  const navigate = useNavigate();
  const { id } = useParams();

  const reviewsConn = import.meta.env.VITE_REVIEWS_URL;

  let reviewId;

  const checkResponse = (res) => {
    if (res.error == "Expired token" || res.error == "No token specified") {
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  const createEmptyReview = async (userId) => {
    const body = {
      reviewerID: userId,
      reviewedID: id,
      rating: 1,
      text: "",
    };

    const response = await axios.post(`${reviewsConn}/v2/`, body, {
      headers: {
        Authorization: userLogged.oauthToken,
      },
    });
    checkResponse(response.data);
    return response.data;
  };

  useEffect(() => {
    const redirect = async () => {
      const newReview = await createEmptyReview(userLogged._id);
      reviewId = newReview.insertedId;

      navigate(`/review/edit/${reviewId}`);
    };

    redirect().catch(console.error);
  }, []);

  return <></>;
}
