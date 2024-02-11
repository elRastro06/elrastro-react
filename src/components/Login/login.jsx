import React from "react";
import { useEffect } from "react";
import * as jwt_decode from "jwt-decode";

// import "../../assets/css/Login.css";
import clientServices from "../../services/clientServices";
import geoapiServices from "../../services/geoapiServices";

export default function Login({ userLogged, setUserLogged }) {
    const handleCallbackResponse = async (response) => {
        const user = jwt_decode.jwtDecode(response.credential);

        //https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${user.jti}

        let bdUser = await clientServices.getClientByGoogleId(user.sub);

        if (bdUser == undefined) {
            bdUser = {
                name: user.name,
                email: user.email,
                googleID: user.sub,
                oauthToken: user.jti,
                exp: user.exp,
                lat: 36.7201600,    //Default coordinates in case user does not introduce postal code
                long: -4.4203400
            };

            let zipCode = window.prompt("Type here your postal code");
            if (zipCode) {
                const response = await geoapiServices.getCoordinates(zipCode);
                bdUser.lat = response.lat;
                bdUser.long = response.lon;
            }

            const result = await clientServices.addClient(bdUser, import.meta.env.VITE_GOOGLE_CLIENT_ID);
            bdUser = await clientServices.getClient(result.insertedId);
        } else {
            await clientServices.modifyClient(bdUser._id, {
                oauthToken: user.jti,
                exp: user.exp
            }, import.meta.env.VITE_GOOGLE_CLIENT_ID);
            bdUser.oauthToken = user.jti;
            bdUser.exp = user.exp;
        }
        localStorage.setItem("user", JSON.stringify(bdUser));
        setUserLogged(bdUser);
    }

    const handleLogout = () => {
        localStorage.removeItem("user");
        setUserLogged(undefined);
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

    return (
        <div>
            {userLogged != undefined ?
                <div id="signOutDiv">
                    <button onClick={() => handleLogout()}>Logout</button>
                </div>
                :
                <div id="signInDiv"></div>
            }
        </div>
    );
}
