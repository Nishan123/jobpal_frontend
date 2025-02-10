import React, { useState } from "react";
import Navbar from "../Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const SaveJobs = () => {
  const [refresh, setRefresh] = useState(false);
  const savedJobs = localStorage.getItem("Job");
  const jobs = savedJobs ? JSON.parse(savedJobs) : [];
  const jobsArray = Array.isArray(jobs) ? jobs : [jobs];

  const removeJob = (index) => {
    const updatedJobs = jobsArray.filter((_, i) => i !== index);
    localStorage.setItem("Job", JSON.stringify(updatedJobs));
    setRefresh(!refresh); // Trigger re-render
  };

  return (
    <div>
      <Navbar />
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
            {jobsArray.length === 0 ? (
              <div className="no-jobs" style={{
                textAlign: 'center',
                marginTop: '40px'
              }}>
                <h3>No saved jobs found</h3>
                <p>Your saved jobs will appear here</p>
              </div>
            ) : (
              jobsArray.map(({ logo, company, position, location, role }, index) => (
                <div className="job-list" key={index} style={{
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
                        src={require(`../../Assets/images/${logo}`)}
                        alt="logo"
                        className="job-profile"
                      />
                      <div className="job-detail">
                        <h4>{company}</h4>
                        <h3>{position}</h3>
                        <div className="category">
                          <p>{location}</p>
                          <p>{role}</p>
                        </div>
                      </div>
                    </div>
                    <div className="job-posting">
                      <button 
                        onClick={() => removeJob(index)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#ff4444'
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
