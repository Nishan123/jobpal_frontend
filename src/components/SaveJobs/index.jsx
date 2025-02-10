import React, { useState } from "react";
import Navbar from "../Navbar";

const SaveJobs = () => {
  const savedJobs = localStorage.getItem("Job");
  const jobs = savedJobs ? JSON.parse(savedJobs) : [];
  // Convert to array if single object was stored
  const jobsArray = Array.isArray(jobs) ? jobs : [jobs];

  return (
    <div>
      <Navbar />
      <div className="jobs-for-you">
        <div className="job-background">
          <div className="title">
            <h2>Saved Jobs</h2>
          </div>
        </div>
        <div className="job-section">
          <div className="job-page">
            {jobsArray.length === 0 ? (
              <div className="no-jobs">
                <h3>No saved jobs found</h3>
                <p>Your saved jobs will appear here</p>
              </div>
            ) : (
              jobsArray.map(({ logo, company, position, location, role }, index) => (
                <div className="job-list" key={index}>
                  <div className="job-card">
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
