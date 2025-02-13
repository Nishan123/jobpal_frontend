import React from "react";
import { useState } from "react";
import Navbar from "../Navbar";
import axios from "axios";
import "./index.css";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PostJob = () => {
  const [company, setCompany] = useState("");
  const [logo, setLogo] = useState("");
  const [position, setPosition] = useState("");
  const [salary, setSalary] = useState("");
  const [experience, setExperience] = useState("");
  const [role, setRole] = useState("");
  const [location, setLocation] = useState("");
  const current_uid="user_id";

  const navigate=useNavigate();

  const handleImg = (e) => {
    const file = e.target.files[0];
    setLogo(file);
  };

  const handleSubmitButton = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('posted_by', current_uid);
    formData.append('company_name', company);
    formData.append('job_location', location);
    formData.append('position', position);
    formData.append('description', role);
    formData.append('experience', experience);
    formData.append('salary', salary);
    if (logo) {
      formData.append('company_logo', logo);
    }

    try {
      const response = await axios.post("http://localhost:5000/createJob/", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      console.log('Response:', response);
      if (response.status === 200 || response.status === 201) {
        toast.success('Job posted successfully!');
        setTimeout(() => {
          navigate('/jobs');
        }, 2000);
      }
    } catch (error) {
      console.error("Full error details:", error.response || error);
      toast.error(`Failed to post job: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div>
      <Navbar />
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="job-background">
        <div className="title">
          <h2>Post a Job</h2>
        </div>
      </div>
      <div className="container">
        <header className="header">
          <h1 className="post-job">Fill the form </h1>
        </header>
        <form>
          <div className="form-group">
            <label id="name-label" htmlFor="name">
              Company Name
            </label>
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Enter Company Name"
              onChange={(e) => setCompany(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label id="name-label" htmlFor="name">
              Enter Job Location
            </label>
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Enter Job Location"
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label id="logo-label" htmlFor="logo">
              Company logo
            </label>
            <label>
              <input
                type="file"
                id="myFile"
                name="filename"
                onChange={handleImg}
                required
              />
            </label>
          </div>
          <div className="form-group">
            <label id="name-label" htmlFor="name">
              What position are you posting for?
            </label>
            <input
              type="text"
              name="position"
              className="form-control"
              placeholder="Enter Position"
              onChange={(e) => setPosition(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label id="description-label" htmlFor="description">
              Job Description
            </label>
            <textarea
              id="description"
              name="description"
              className="form-control description-input"
              placeholder="Enter detailed job description...
• Required skills
• Responsibilities
• Qualifications
• Benefits"
              onChange={(e) => setRole(e.target.value)}
              rows="6"
              required
            />
          </div>

          <div
            className="form-group"
            onChange={(e) => setExperience(e.target.value)}
          >
            <label>Experience </label>
            <label>
              <input
                name="user-recommend"
                value="0-1 Year"
                type="radio"
                className="input-radio"
              />
              0-1 Year
            </label>
            <label>
              <input
                name="user-recommend"
                value=" 2-3 Years"
                type="radio"
                className="input-radio"
              />
              2-3 Years
            </label>
            <label>
              <input
                name="user-recommend"
                value=" 4-5 Years"
                type="radio"
                className="input-radio"
              />
              4-5 Years
            </label>
            <label>
              <input
                name="user-recommend"
                value="5+ Years"
                type="radio"
                className="input-radio"
              />
              5+ Years
            </label>
          </div>

          <div className="form-group">
            <label>Salary</label>
            <select
              className="form-control"
              onChange={(e) => setSalary(e.target.value)}
              required
            >
              <option disabled selected value>
                Select Salary
              </option>
              <option value="negotiable">Negotiable</option>
              <option value="0-15K">0-15K</option>
              <option value="15-30K">15-30K</option>
              <option value="30K-50K">30K-50K</option>
              <option value="50K-80K">50K-80K</option>
              <option value="80K+">80K+</option>
            </select>
          </div>
          <div className="form-group">
            <button type="submit" className="submit-button" onClick={handleSubmitButton}>
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
