import { useNavigate } from "react-router-dom";

const getUserLogged = () => {
    let user = localStorage.getItem("user");
    if (user) user = JSON.parse(user);
    else user = undefined;
    return user;
}

const checkResponse = (res) => {
    if (res.error == "Expired token" || res.error == "No token specified") {
        alert("Token expired. Please login again");
        localStorage.removeItem("user");

        const navigate = useNavigate();
        navigate("/login");
    }
}

const loginServices = { getUserLogged, checkResponse };

export default loginServices;