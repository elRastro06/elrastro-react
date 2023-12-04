import Chat from "./components/Chats/chat.jsx";
import Chats from "./components/Chats/chats.jsx";
import Login from "./components/Login/login.jsx";
import AboutUs from "./components/AboutUs/aboutus.jsx";
import Products from "./components/Products/products.jsx";
import Product from "./components/Products/product.jsx";
import Profile from "./components/Profile/profile.jsx";
import MyProfile from "./components/Profile/myprofile.jsx";
import Map from "./components/Map/map.jsx";

import Navbar from "./NavBar.jsx";

import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Products />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/chats" element={<Chats />} />
        <Route path="/chats/:id" element={<Chat />} />
        <Route path="/login" element={<Login />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/my-profile" element={<MyProfile />} />
        <Route path="/profile/:id" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
