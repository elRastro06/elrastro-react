import { useState } from 'react'
import './assets/css/App.css'

import Home from "./components/Home/home.jsx";
import Chats from "./components/Chats/chats.jsx";
import AboutUs from "./components/AboutUs/aboutus.jsx";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    // errorElement: <PaginaError />,
  },
  {
    path: "/:id/chats",
    element: <Chats />,
    // errorElement: <PaginaError />,
  },
  {
    path: "/about-us",
    element: <AboutUs />,
    // errorElement: <PaginaError />,
  }
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
