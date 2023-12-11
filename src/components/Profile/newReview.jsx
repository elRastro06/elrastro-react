import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";


import "../../assets/styles/reviewForm.css";
import axios from "axios";

export default function NewReview() {

    const navigate = useNavigate();
    const { id } = useParams();

    const reviewsConn = import.meta.env.REVIEWS != undefined ? import.meta.env.REVIEWS : "localhost";

    const loggedUserId = "654f4c3cf99b7fddc72edd1b";    //TEMPORAL HASTA IMPLEMENTAR LOGIN
    //654f4c1bf99b7fddc72edd19 consola
    //654f4c2bf99b7fddc72edd1a
    //654f4c3cf99b7fddc72edd1b silla

    let reviewId;

    const createEmptyReview = async (loggedUserId) => {
        const body = {
            reviewerID: loggedUserId,
            reviewedID: id,
            rating: 1,
            text: "",
        };
    
        const response = await axios.post(`http://${reviewsConn}:5008/v2/`, body);
        return response.data;
    }

    useEffect(() => {

        const redirect = async () => {            
            const newReview = await createEmptyReview(loggedUserId);
            reviewId = newReview.insertedId;
            console.log(newReview);
    
            navigate(`/review/edit/${reviewId}`);
        }    

        redirect().catch(console.error);
    }, []);

    return (
        <>
        </>
    );
}
