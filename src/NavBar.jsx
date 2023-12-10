import React from "react";
import { Link } from "react-router-dom";
import {
  Nav,
  NavLink,
  Bars,
  NavMenu,
  NavBtn,
  NavBtnLink,
} from "./navbarElements";

import "./assets/styles/navExtra.css";

const Navbar = () => {
  return (
    <>
      <Nav>
        <NavLink to="/">
          <img
            src="https://github.com/elRastro06/elrastro-react/blob/main/public/elrastro.png?raw=true"
            alt="elRastro"
            width="90"
          />
        </NavLink>
        {/* <Bars /> */}
        <NavMenu>
          <NavLink to="/">Products</NavLink>
          <NavLink to="/chats">Chats</NavLink>
          <NavLink to="/my-profile">Profile</NavLink>
          <NavLink to="/about-us">About Us</NavLink>
          <NavLink to="/product/new" id="create">
            Sell something
          </NavLink>
        </NavMenu>

        <NavBtn>
          <NavBtnLink to="/login">Logged in Roberto</NavBtnLink>
        </NavBtn>
      </Nav>
    </>
  );
};

export default Navbar;
