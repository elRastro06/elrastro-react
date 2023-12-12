import { useNavigate } from "react-router-dom";

let navigate;

const initLoginService = () => {
    navigate = useNavigate();
}
initLoginService();

const getUserLogged = () => {
    let user = localStorage.getItem("user");
    if (user) user = JSON.parse(user);
    else user = undefined;
    return user;
}

const checkResponse = (res) => {
    if (res.error == "Expired token" || res.error == "No token specified") {
        localStorage.removeItem("user");
        navigate("/login");
    }
}

const loginServices = { getUserLogged };

export default loginServices;