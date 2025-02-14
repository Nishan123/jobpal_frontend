import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faBriefcase, faMoneyBillWave } from '@fortawesome/free-solid-svg-icons';
import Navbar from '../Navbar';
import './index.css';
import { Link } from 'react-router-dom';

// Add icons to the library
library.add(faLocationDot, faBriefcase, faMoneyBillWave);

const ApplyJobs = () => {
  const navigate = useNavigate();
  const { jobId } = useParams();
  const [name, setName] = useState("");
  const [resume, setResume] = useState(null);
  const [jobDetails, setJobDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userToken, setUserToken] = useState(null);

  useEffect(() => {
    const checkAuth = () => {
      const userData = localStorage.getItem('user');
      if (!userData) {
        setIsAuthenticated(false);
        return;
      }

      const user = JSON.parse(userData);
      if (!user.token || !user.isLoggedIn) {
        setIsAuthenticated(false);
        return;
      }

      setIsAuthenticated(true);
      setUserToken(user.token);
    };

    checkAuth();

    const fetchJobDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/jobs/${jobId}`);
        setJobDetails(response.data);
      } catch (error) {
        console.error('Error fetching job details:', error);
        toast.error('Failed to load job details');
        navigate('/jobs');
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId, navigate]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setResume(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error("Please login to apply for this job");
      navigate('/login');
      return;
    }

    if (!name.trim()) {
      toast.error("Please fill in your name");
      return;
    }

    if (!resume) {
      toast.error("Please upload your resume");
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('resume', resume);
      formData.append('jobId', jobId);

      const response = await axios.post('http://localhost:5000/applications', formData, {
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Response:', response.data);

      toast.success("Your job application has been submitted successfully!");
      setTimeout(() => {
        navigate("/jobs");
      }, 2000);
    } catch (error) {
      console.error('Application submission error:', error);
      
      if (error.response?.status === 401) {
        toast.error("Your session has expired. Please login again.");
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        navigate('/login');
        return;
      }
      
      const errorMessage = error.response?.data?.error || "Failed to submit application. Please try again.";
      toast.error(errorMessage);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Navbar />
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="job-background">
        <div className="title">
          <h2>Apply for Job</h2>
        </div>
      </div>
      <div className="apply-job">
        {jobDetails && (
          <div className="job-details">
            <h2>{jobDetails.position} at {jobDetails.company_name}</h2>
            <div className="job-info">
              <div className="info-item">
                <FontAwesomeIcon icon={faLocationDot} className="info-icon" />
                <span className="info-label">Location:</span> 
                <span>{jobDetails.job_location}</span>
              </div>
              <div className="info-item">
                <FontAwesomeIcon icon={faBriefcase} className="info-icon" />
                <span className="info-label">Experience Required:</span> 
                <span>{jobDetails.experience}</span>
              </div>
              <div className="info-item">
                <FontAwesomeIcon icon={faMoneyBillWave} className="info-icon" />
                <span className="info-label">Salary:</span> 
                <span>{jobDetails.salary}</span>
              </div>
            </div>
            <div className="job-description">
              <h3>Job Description:</h3>
              <p>{jobDetails.description}</p>
            </div>
          </div>
        )}
        <div className="container">
          <form 
            className='apply-form'
            onSubmit={handleSubmit}
          >
            <div className="form-group">
              <label htmlFor="name">
                Enter Your Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                className="form-control"
                placeholder="Enter your full name"
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="resume">
                Upload Your Resume
              </label>
              <input 
                type="file" 
                id="resume" 
                name="resume"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx"
                required 
              />
              <small className="file-hint">Accepted formats: PDF, DOC, DOCX</small>
            </div>
            <div className="form-group">
              <button
                type="submit"
                className="submit-button"
                disabled={!isAuthenticated}
              >
                {isAuthenticated ? "Submit Application" : "Please Login to Apply"}
              </button>
              {!isAuthenticated && (
                <p className="login-prompt">
                  Please <Link to="/login">login</Link> to apply for this job
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApplyJobs;
