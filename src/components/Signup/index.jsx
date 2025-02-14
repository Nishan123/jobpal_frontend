import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import axios from "axios";
import jobSearching from "../../Assets/images/job_searching.png";
import { ReactComponent as LogoImage } from "../../Assets/images/jobpal_logo.svg";

function Signup() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  const handleGuestLogin = () => {
    // Store minimal guest user data
    const guestData = {
      first_name: "Guest",
      last_name: "User",
      email: "",
      isLoggedIn: false,
      isGuest: true,
    };
    localStorage.setItem("user", JSON.stringify(guestData));
    toast.info("Continuing as guest");
    setTimeout(() => {
      navigate("/home");
    }, 1000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const user = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: password,
    };

    try {
      const response = await axios.post("http://localhost:5000/signup", user, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200 || response.status === 201) {
        // Store user data in localStorage
        const userData = {
          first_name: firstName,
          last_name: lastName,
          email: email,
          isLoggedIn: true,
        };
        localStorage.setItem("user", JSON.stringify(userData));
        toast.success("Signup Successful!");
        setTimeout(() => {
          navigate("/home");
        }, 1000);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Signup failed. Please try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="signup-page">
      <ToastContainer position="top-right" autoClose={3000} />
      <nav className="signup-nav">
        <Link to="/">
          <LogoImage className="logo-img" />
        </Link>
      </nav>
      <div className="signup-container">
        <div className="gradient-wrapper">
          <div className="container">
            <div className="signup-box">
              <h2>Create a new account</h2>
              <div className="name-fields">
                <input
                  onChange={(e) => setFirstName(e.target.value)}
                  className="input-field"
                  type="text"
                  placeholder="First name"
                />
                <input
                  onChange={(e) => setLastName(e.target.value)}
                  className="input-field"
                  type="text"
                  placeholder="Last name"
                />
              </div>
              <input
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                type="email"
                placeholder="Email"
              />
              <input
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                type="password"
                placeholder="Password"
              />
              <input
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-field"
                type="password"
                placeholder="Confirm password"
              />
              <div className="terms">
                <input type="checkbox" id="terms" />
                <label htmlFor="terms">Agree to the terms and conditions</label>
              </div>
              <button className="signup-button" onClick={handleSubmit}>
                Signup
              </button>
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
            <img
              src={jobSearching}
              alt="Job search illustration"
              className="job-search-image"
            />
            <button className="continue-as-guest" onClick={handleGuestLogin}>
              Continue as guest
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
