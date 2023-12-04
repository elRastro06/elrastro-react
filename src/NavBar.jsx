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

const Navbar = () => {
  return (
    <>
      <Nav>
        <NavLink to="/">
          <img
            src="./elrastro-logo.png"
            alt="elrastro"
            width="200"
          />
        </NavLink>
        {/* <Bars /> */}
        <NavMenu>
          <NavLink to="/">Products</NavLink>
          <NavLink to="/chats">Chats</NavLink>
          <NavLink to="/my-profile">Profile</NavLink>
          <NavLink to="/aboutus">About Us</NavLink>
        </NavMenu>

        <NavBtn>
          <NavBtnLink to="/login">Login</NavBtnLink>
        </NavBtn>
      </Nav>
    </>
  );
};

export default Navbar;
