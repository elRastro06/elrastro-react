import { FaBars } from "react-icons/fa";
import { NavLink as Link } from "react-router-dom";
import styled from "styled-components";
 
export const Nav = styled.nav`
    background: #c6ecf8;
    height: 85px;
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    padding: 20px;
`;
 
export const NavLink = styled(Link)`
    color: #000000;
    display: flex;
    align-items: center;
    text-decoration: none;
    padding: 0 1rem;
    height: 100%;
    cursor: pointer;
    font-size: 1.3rem;
    &.active {
        color: #3498db;
    }
`;
 
export const Bars = styled(FaBars)`
    display: none;
    color: #ffffff;
    @media screen and (max-width: 768px) {
        display: block;
        position: absolute;
        top: 0;
        right: 0;
        transform: translate(-100%, 75%);
        font-size: 1.8rem;
        cursor: pointer;
    }
`;
 
export const NavMenu = styled.div`
    display: flex;
    flex: 1;
    align-self: left;
    margin-left: 24px;
`;
 
export const NavBtn = styled.nav`
    display: flex;
    align-items: center;
    margin-right: 24px;
`;
 
export const NavBtnLink = styled(Link)`
    border-radius: 10px;
    background: #3498db;
    padding: 10px 22px;
    color: #ffffff;
    outline: none;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    text-decoration: none;
    /* Second Nav */
    margin-left: 24px;
    font-size: 1.3rem;
    &:hover {
        transition: all 0.2s ease-in-out;
        background: #fff;
        color: #808080;
    }
`;