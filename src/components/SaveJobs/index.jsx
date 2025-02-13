import React, { useState } from "react";
import Navbar from "../Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SaveJobs = () => {
  const [refresh, setRefresh] = useState(false);
  const savedJobs = JSON.parse(localStorage.getItem("savedJobs")) || [];

  const removeJob = (jobId) => {
    const updatedJobs = savedJobs.filter(job => job.job_id !== jobId);
    localStorage.setItem("savedJobs", JSON.stringify(updatedJobs));
    toast.info('Job removed from saved jobs');
    setRefresh(!refresh);
  };

  const getImageUrl = (logoUrl) => {
    if (!logoUrl) {
      return 'http://localhost:5000/images/default-company-logo.png';
    }
    return logoUrl;
  };

  return (
    <div>
      <Navbar />
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="jobs-for-you">
        <div className="job-background">
          <div className="title">
            <h2>Saved Jobs</h2>
          </div>
        </div>
        <div className="job-section" style={{ 
          display: 'flex', 
          justifyContent: 'center',
          width: '100%'
        }}>
          <div className="job-page" style={{
            maxWidth: '800px',
            width: '100%',
            padding: '20px'
          }}>
            {savedJobs.length === 0 ? (
              <div className="no-jobs" style={{
                textAlign: 'center',
                marginTop: '40px'
              }}>
                <h3>No saved jobs found</h3>
                <p>Your saved jobs will appear here</p>
              </div>
            ) : (
              savedJobs.map((job) => (
                <div className="job-list" key={job.job_id} style={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginBottom: '20px'
                }}>
                  <div className="job-card" style={{
                    width: '100%',
                    maxWidth: '700px'
                  }}>
                    <div className="job-name">
                      <img
                        src={getImageUrl(job.company_logo)}
                        alt={`${job.company_name} logo`}
                        className="job-profile"
                        style={{
                          maxWidth: '100px',
                          height: '100px',
                          objectFit: 'cover'
                        }}
                        onError={(e) => {
                          e.target.src = 'http://localhost:5000/images/default-company-logo.png';
                        }}
                      />
                      <div className="job-detail">
                        <h4>{job.company_name}</h4>
                        <h3>{job.position}</h3>
                        <div className="category">
                          <p>{job.job_location}</p>
                          <p>Posted: {new Date(job.posted).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                    <div className="job-posting">
                      <button 
                        onClick={() => removeJob(job.job_id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: 'white'
                        }}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaveJobs;
