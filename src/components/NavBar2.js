import React from "react";
import { NavLink } from "react-router-dom";
import "./NavBar.css";

function NavBar2(){


    return (
 
        
        <div className="navbar2">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/about">About</NavLink>
        <NavLink to="/todolist">To-Do List</NavLink>
        <NavLink to="/portfolio">Portfolio</NavLink>
        </div>



     );
}

export default NavBar2;
