import Chat from "./components/Chats/chat.jsx";
import Chats from "./components/Chats/chats.jsx";
import Login from "./components/Login/login.jsx";
import AboutUs from "./components/AboutUs/aboutus.jsx";
import Products from "./components/Products/products.jsx";
import Product from "./components/Products/product.jsx";
import ProductForm from "./components/Products/productForm.jsx";
import Profile from "./components/Profile/profile.jsx";
import MyProfile from "./components/Profile/myprofile.jsx";
import NewProduct from "./components/Products/newProduct.jsx";

import Navbar from "./NavBar.jsx";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import { useState, useEffect } from "react";

import loginServices from "./services/loginServices.js";

function App() {
    const errorHandler = (error, componentStack) => {
        console.log(error);
    }
    
    const [userLogged, setUserLogged] = useState(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const user = loginServices.getUserLogged();
        setUserLogged(user);
        setLoading(false);
    }, []);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <ErrorBoundary onError={errorHandler}>
            <BrowserRouter>
                <Navbar />

                <Routes>
                    <Route path="/" element={<Products userLogged={userLogged} />} />
                    <Route path="/product/:id" element={<Product userLogged={userLogged} />} />
                    <Route path="/product/edit/:id" element={<ProductForm userLogged={userLogged} />} />
                    <Route path="/product/new" element={<NewProduct userLogged={userLogged} />} />
                    <Route path="/chats" element={<Chats userLogged={userLogged} />} />
                    <Route path="/chats/:id" element={<Chat userLogged={userLogged} />} />
                    <Route path="/login" element={<Login userLogged={userLogged} setUserLogged={setUserLogged} />} />
                    <Route path="/about-us" element={<AboutUs userLogged={userLogged} />} />
                    <Route path="/my-profile" element={<Profile userLogged={userLogged} />} />
                    <Route path="/profile/:id" element={<Profile userLogged={userLogged} />} />
                </Routes>
            </BrowserRouter>
        </ErrorBoundary>
    );
}

export default App;
