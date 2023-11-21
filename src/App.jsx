import { useState } from 'react'

import Chat from "./components/Chats/chat.jsx";
import Chats from "./components/Chats/chats.jsx";

import Login from "./components/Login/login.jsx";

import AboutUs from "./components/AboutUs/aboutus.jsx";

import Products from "./components/Products/products.jsx";
import Product from "./components/Products/product.jsx";

import Profile from "./components/Profile/profile.jsx";
import MyProfile from "./components/Profile/myprofile.jsx";

import Map from "./components/Map/map.jsx"


import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
    /**
     * ====================
     *       Products
     * ====================
     */
    {
        path: "/",
        element: <Products />,
        // errorElement: <PaginaError />,
    },
    {
        path: "/product/:id",
        element: <Product />,
        // errorElement: <PaginaError />,
    },

    /**
     * ====================
     *        Chats
     * ====================
     */
    {
        path: "/chats",
        element: <Chats />,
        // errorElement: <PaginaError />,
    },
    {
        path: "/chats/:id",
        element: <Chat />,
        // errorElement: <PaginaError />,
    },
    /**
     * ====================
     *        Login
     * ====================
     */
    {
        path: "/login",
        element: <Login />,
        // errorElement: <PaginaError />,
    },
    /**
     * ====================
     *       About Us
     * ====================
     */
    {
        path: "/aboutus",
        element: <AboutUs />,
        // errorElement: <PaginaError />,
    },
    /**
     * ====================
     *       Profile
     * ====================
     */
    {
        path: "/my-profile",
        element: <MyProfile />,
        // errorElement: <PaginaError />,
    },
    {
        path: "/profile/:id",
        element: <Profile />,
        // errorElement: <PaginaError />,
    },
    /**
     * ====================
     *         Map
     * ====================
     */
    {
        path: "/map",
        element: <Map />,
        // errorElement: <PaginaError />,
    },
]);

function App() {

    return (
        <>
            <div>
                <RouterProvider router={router} />
            </div>
        </>
    )
}

export default App
