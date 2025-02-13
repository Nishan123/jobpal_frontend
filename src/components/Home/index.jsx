import React, { useState } from "react";
import Navbar from "../Navbar";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import FloatingLogos from "../FloatingLogos";
import "./index.css";

const Home = () => {
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchText.trim()) {
      navigate(`/jobs?search=${encodeURIComponent(searchText.trim())}`);
    } else {
      navigate('/jobs');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSignup = () => {
    console.log("Sign up");
  }
  return (
    <div className="home-container">
      <Navbar />
      <div className="banner-img">
        <FloatingLogos />
        <div className="title">
          <h3>
            Modernizing the job <br />
           Search Experience
            <br />
          </h3>
          <div className="small-tagline">
            <p>
              Search and find your dream job now easier than ever,
              <br/>
              you can simply browse and find a job if you need it
            </p>
          </div>
        </div>
        <div className="search-container">
          <div className="search-wrapper">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search for jobs..." 
              className="search-input" 
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>
          <button className="search-button" onClick={handleSearch}>Search</button>
        </div>
      </div>
    </div>
  );
};

export default Home;
