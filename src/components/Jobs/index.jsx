import React, { useState, useEffect } from "react";
import Navbar from "../Navbar";
import { Link } from "react-router-dom";
import "./index.css";
import Job from "./../../Assets/jobs.json";
import Filter from "../Filter";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";

const experience = [
  { min: 0, max: 1 },
  { min: 2, max: 3 },
  { min: 4, max: 5 },
  { min: 5, max: 10 },
];

const Jobs = () => {
  // Get saved jobs from localStorage
  const savedJobs = JSON.parse(localStorage.getItem("savedJobs")) || [];
  
  // Initialize state with both saved and default jobs
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchterm, setSearchTerm] = useState("");
  const [active, setActive] = useState(false);

  // Use useEffect to initialize jobs data
  useEffect(() => {
    setFilteredJobs([...savedJobs, ...Job]);
  }, []);

  function handleJobFilter(event) {
    const value = event.target.innerText;
    event.preventDefault();
    setFilteredJobs(
      Job.filter((job) => job.role === value)
    );
  }

  function saveClick(jobData) {
    const savedJobs = JSON.parse(localStorage.getItem("savedJobs")) || [];
    const isJobSaved = savedJobs.find(job => job.id === jobData.id);
    
    if (!isJobSaved) {
      const updatedSavedJobs = [...savedJobs, jobData];
      localStorage.setItem("savedJobs", JSON.stringify(updatedSavedJobs));
    } else {
      const filteredJobs = savedJobs.filter(job => job.id !== jobData.id);
      localStorage.setItem("savedJobs", JSON.stringify(filteredJobs));
    }
    setActive(!active);
  }

  const searchEvent = (event) => {
    const data = event.target.value;
    setSearchTerm(data);
    if (searchterm !== "" || searchterm.length > 2) {
      const filterData = Job.filter((item) => {
        if (item) {
          return Object.values(item)
            .join("")
            .toLowerCase()
            .includes(searchterm.toLowerCase());
        } else {
          return 0;
        }
      });
      setFilteredJobs(filterData);
    } else {
      setFilteredJobs(Job);
    }
  };

  function handleExperienceFilter(checkedState) {
    let filters = [];
    checkedState.forEach((item, index) => {
      if (item === true) {
        const filterS = Job.filter((job) => {
          return (
            job.experience >= experience[index].min &&
            job.experience <= experience[index].max
          );
        });
        filters = [...filters, ...filterS];
      }
      setFilteredJobs(filters);
    });
  }

  return (
    <>
      <Navbar />
      <div className="jobs-for-you">
        <div className="job-background">
          <div className="title">
            <h2>Our Jobs</h2>
          </div>
        </div>
        <div className="job-section">
          <div className="filter-section">
            <Filter
              setFilteredJobs={setFilteredJobs}
              handleJobFilter={handleJobFilter}
              handleExperienceFilter={handleExperienceFilter}
              searchEvent={searchEvent}
            />
          </div>
          <div className="job-page">
            {filteredJobs.length > 0 ? (
              filteredJobs.map(
                ({ id, logo, company, position, location, posted, role }) => {
                  const jobData = { id, logo, company, position, location, posted };
                  const isJobSaved = savedJobs.some(job => job.id === id);

                  return (
                    <div className="job-list" key={id}>
                      <div className="job-card">
                        <div className="job-name">
                          <img
                            src={
                              logo.length > 20
                                ? logo
                                : require(`../../Assets/images/${logo}`)
                            }
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
                        <div className="job-button">
                          <div className="job-posting">
                            <Link to="/apply-jobs">Apply Now</Link>
                          </div>
                          <div className="save-button">
                            <Link
                              to="#"
                              onClick={(e) => {
                                e.preventDefault();
                                saveClick(jobData);
                              }}
                            >
                              {isJobSaved ? <AiFillHeart /> : <AiOutlineHeart />}
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
              )
            ) : (
              <div className="no-jobs-message">No jobs found</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Jobs;
