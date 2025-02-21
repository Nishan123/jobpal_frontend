import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./index.css";
import UserAvatar from "../UserAvatar";
import { ReactComponent as LogoImage } from "../../Assets/images/jobpal_logo.svg";

const Navbar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // Show auth buttons if no user or user is guest
  const showAuthButtons = !user || user.isGuest;

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
                {user && !user.isGuest && (
                  <li>
                    <Link to="/applied-jobs">Applied Jobs</Link>
                  </li>
                )}
              </ul>
            </div>

            <div className="auth-buttons">
              {showAuthButtons ? (
                <>
                  <Link to="/login" className="login-btn">
                    Login
                  </Link>
                  <Link to="/signup" className="signup-btn">
                    Sign Up
                  </Link>
                </>
              ) : (
                <UserAvatar 
                  firstName={user.first_name} 
                  lastName={user.last_name}
                  email={user.email}
                />
              )}
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Navbar;
