import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import "./index.css";
import jobSearching from "../../Assets/images/job_searching.png";
import { ReactComponent as LogoImage } from "../../Assets/images/jobpal_logo.svg";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGuestLogin = () => {
    // Store minimal guest user data
    const guestData = {
      first_name: "Guest",
      last_name: "User",
      email: "",
      isLoggedIn: false,
      isGuest: true
    };
    localStorage.setItem('user', JSON.stringify(guestData));
    toast.info("Continuing as guest");
    setTimeout(() => {
      navigate("/home");
    }, 1000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post("http://localhost:5000/login", {
        email,
        password
      }, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        const { user, token } = response.data;
        
        // Store user data and token in localStorage
        const userData = {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          isLoggedIn: true,
          token
        };
        localStorage.setItem('user', JSON.stringify(userData));
        
        toast.success("Login successful!");
        
        // Short delay to show the success toast before navigation
        setTimeout(() => {
          navigate("/home");
        }, 1000);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Login failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <ToastContainer position="top-right" autoClose={3000} />
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
              <form onSubmit={handleSubmit} className="login-form">
                <input 
                  className="input-field" 
                  type="email" 
                  placeholder="Email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input 
                  className="input-field" 
                  type="password" 
                  placeholder="Password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div className="terms">
                  <input type="checkbox" id="terms" />
                  <label htmlFor="terms">Remember me</label>
                </div>
                <button 
                  type="submit" 
                  className="login-button" 
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : "Login"}
                </button>
              </form>
              <p className="login-link">
                Don't have an account? <Link to="/signup">Sign up</Link>
              </p>
            </div>
          </div>
          <div className="hero-text">
            <h1>Modernizing</h1>
            <h1>the job</h1>
            <h1>search Experience</h1>
            <p>JobPal a job marketplace</p>
            <img src={jobSearching} alt="Job search illustration" className="job-search-image" />
            <button className="continue-as-guest" onClick={handleGuestLogin}>
              Continue as guest
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
