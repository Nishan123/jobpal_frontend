import React from "react";
import { Link } from "react-router-dom";
import "./index.css";
import jobSearching from "../../Assets/images/job_searching.png";
import { ReactComponent as LogoImage } from "../../Assets/images/jobpal_logo.svg";

function Login() {
  return (
    <div className="login-page">
      <nav className="login-nav">
        <Link to="/">
          <LogoImage className="logo-img"/>
        </Link>
      </nav>
      <div className="login-container">
        <div className="gradient-wrapper">
          <div className="container">
            <div className="login-box">
              <h2>Login to continue</h2>
             
              <input className="input-field" type="email" placeholder="Email" />
              <input className="input-field" type="password" placeholder="Password" />
              <div className="terms">
                <input type="checkbox" id="terms" />
                <label htmlFor="terms">Agree to the terms and conditions</label>
              </div>
              <button className="login-button">login</button>
              <p className="login-link">
               Don't have an account? <a href="/signup">Sign up.</a>
              </p>
            </div>
          </div>
          <div className="hero-text">
            <h1>Modernizing</h1>
            <h1>the job</h1>
            <h1>search Experience</h1>
            <p>JobPal a job marketplace</p>
            <img src={jobSearching} alt="Job search illustration" className="job-search" />
            <button className="continue-as-guest">Continue as guest</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
