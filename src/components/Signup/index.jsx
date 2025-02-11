import React from "react";
import { Link } from "react-router-dom";
import "./index.css";
import jobSearching from "../../Assets/images/job_searching.png";
import { ReactComponent as LogoImage } from "../../Assets/images/jobpal_logo.svg";

function Signup() {
  return (
    <div className="signup-page">
      <nav className="signup-nav">
        <Link to="/">
          <LogoImage className="logo-img"/>
        </Link>
      </nav>
      <div className="signup-container">
        <div className="gradient-wrapper">
          <div className="container">
            <div className="signup-box">
              <h2>Create a new account</h2>
              <div className="name-fields">
                <input className="input-field" type="text" placeholder="First name" />
                <input className="input-field" type="text" placeholder="Last name" />
              </div>
              <input className="input-field" type="email" placeholder="Email" />
              <input className="input-field" type="password" placeholder="Password" />
              <input className="input-field" type="password" placeholder="Confirm password" />
              <div className="terms">
                <input type="checkbox" id="terms" />
                <label htmlFor="terms">Agree to the terms and conditions</label>
              </div>
              <button className="signup-button">Signup</button>
              <p className="login-link">
                Already have an account? <a href="/login">Log in.</a>
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

export default Signup;
