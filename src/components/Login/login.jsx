import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as jwt_decode from "jwt-decode";

// import "../../assets/css/Login.css";
import loginServices from "../../services/loginServices";
import clientServices from "../../services/clientServices";
import geoapiServices from "../../services/geoapiServices";

export default function Login() {
    const navigate = useNavigate();

    const [loggedUser, setLoggedUser] = useState(undefined);

    const handleCallbackResponse = async (response) => {
        const user = jwt_decode.jwtDecode(response.credential);

        let bdUser = await clientServices.getClientByGoogleId(user.sub);

        if (bdUser == undefined) {
            bdUser = {
                name: user.name,
                email: user.email,
                googleID: user.sub,
                oauthToken: user.jti,
                exp: user.exp,
                lat: 36.7201600,
                long: -4.4203400
            };

            let zipCode = window.prompt("Type here your postal code");
            if (zipCode) {
                const response = await geoapiServices.getCoordinates(zipCode);
                bdUser.lat = response.lat;
                bdUser.long = response.lon;
            }

            const result = await clientServices.addClient(bdUser);
            bdUser._id = result.insertedId;
        } else {
            await clientServices.modifyClient(bdUser._id, {
                oauthToken: user.jti,
                exp: user.exp
            });
            bdUser.oauthToken = user.jti;
            bdUser.exp = user.exp;
        }
        localStorage.setItem("user", JSON.stringify(bdUser));

        navigate(0);
    }

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate(0);
    }

    useEffect(() => {
        /* global google */
        google.accounts.id.initialize({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
            callback: handleCallbackResponse
        });

        google.accounts.id.renderButton(
            document.getElementById("signInDiv"),
            { theme: "outline", size: "large" }
        );
    }, []);

    useEffect(() => {
        setLoggedUser(loginServices.getUserLogged());
    }, []);

    return (
        <div>
            {loggedUser != undefined ?
                <div id="signOutDiv">
                    <button onClick={() => handleLogout()}>Logout</button>
                </div>
                :
                <div id="signInDiv"></div>
            }
        </div>
    );
}
