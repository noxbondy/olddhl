import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/AppNavbar.css"

const AppNavbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="app-navbar">
      <div className="navbar-brand">
        <button
          className="menu-toggle"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          ☰
        </button>
        <span className="app-title">My App</span>
      </div>

      <div className="navbar-logo">
        <img src="/logo.png" alt="Logo" width="100" />
      </div>

      {/* Dropdown menu */}
      <div className={`navbar-menu ${open ? "open" : ""}`}>
        <Link to="/Loginapp">Login</Link>
        <Link to="/user">Dashboard</Link>
        <Link to="/Userinfo">My page</Link>
        <Link to="/">Logout</Link>
        <Link to="/Assigneedby">Assigneedby</Link>
        <Link to="/Assistant">Assistant</Link>

      </div>
    </nav>
  );
};

export default AppNavbar;