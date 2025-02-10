import React from "react";
import { Link } from "react-router-dom";
import "./index.css";

import { ReactComponent as LogoImage } from "../../Assets/images/jobpal_logo.svg";

const Navbar = () => {
  return (
    <>
      <div className="main-page">
        <nav id="navbar">
          <Link to="/">
            <LogoImage className="logo-img"/>
          </Link>

          <div className="nav-content">
            <div className="nav-links">
              <ul>
                <li>
                  <Link to="/jobs">Find a Job</Link>
                </li>
                <li>
                  <Link to="/post-job">Post Job</Link>
                </li>
                <li>
                  <Link to="/saved-job">Saved Job</Link>
                </li>
              </ul>
            </div>

            <div className="auth-buttons">
              <Link to="/login" className="login-btn">
                Login
              </Link>
              <Link to="/signup" className="signup-btn">
                Sign Up
              </Link>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Navbar;
