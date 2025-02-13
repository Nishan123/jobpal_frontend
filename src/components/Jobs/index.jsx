import React, { useState, useEffect } from "react";
import Navbar from "../Navbar";
import { Link, useSearchParams } from "react-router-dom";
import "./index.css";
import axios from "axios";
import Filter from "../Filter";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const experience = [
  { min: 0, max: 1 },
  { min: 2, max: 3 },
  { min: 4, max: 5 },
  { min: 5, max: 10 },
];

const Jobs = () => {
  const [searchParams] = useSearchParams();
  const savedJobs = JSON.parse(localStorage.getItem("savedJobs")) || [];
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [allJobs, setAllJobs] = useState([]);
  const [searchterm, setSearchTerm] = useState(searchParams.get('search') || "");
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageErrors, setImageErrors] = useState({});

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get("http://localhost:5000/jobs");
        setAllJobs(response.data);
        const initialSearchTerm = searchParams.get('search');
        if (initialSearchTerm) {
          const filteredData = response.data.filter((item) => {
            if (item) {
              return Object.values(item)
                .join("")
                .toLowerCase()
                .includes(initialSearchTerm.toLowerCase());
            }
            return false;
          });
          setFilteredJobs(filteredData);
        } else {
          setFilteredJobs(response.data);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setError("Failed to load jobs");
        setLoading(false);
      }
    };

    fetchJobs();
  }, [searchParams]);

  function handleJobFilter(event) {
    const value = event.target.innerText;
    event.preventDefault();
    setFilteredJobs(
      allJobs.filter((job) => job.position.toLowerCase() === value.toLowerCase())
    );
  }

  function saveClick(jobData) {
    const savedJobs = JSON.parse(localStorage.getItem("savedJobs")) || [];
    const isJobSaved = savedJobs.find(job => job.job_id === jobData.job_id);
    
    if (!isJobSaved) {
      const updatedSavedJobs = [...savedJobs, jobData];
      localStorage.setItem("savedJobs", JSON.stringify(updatedSavedJobs));
      toast.success('Job saved successfully!');
    } else {
      const filteredJobs = savedJobs.filter(job => job.job_id !== jobData.job_id);
      localStorage.setItem("savedJobs", JSON.stringify(filteredJobs));
      toast.info('Job removed from saved jobs');
    }
    setActive(!active);
  }

  const searchEvent = (event) => {
    const data = event.target.value;
    setSearchTerm(data);
    if (data !== "" && data.length > 2) {
      const filterData = allJobs.filter((item) => {
        if (item) {
          return Object.values(item)
            .join("")
            .toLowerCase()
            .includes(data.toLowerCase());
        }
        return false;
      });
      setFilteredJobs(filterData);
    } else {
      setFilteredJobs(allJobs);
    }
  };

  function handleExperienceFilter(checkedState) {
    let filters = [];
    checkedState.forEach((item, index) => {
      if (item === true) {
        const filterS = allJobs.filter((job) => {
          const expYears = parseInt(job.experience);
          return (
            expYears >= experience[index].min &&
            expYears <= experience[index].max
          );
        });
        filters = [...filters, ...filterS];
      }
    });
    if (filters.length > 0) {
      setFilteredJobs(filters);
    }
  }

  const getImageUrl = (logoUrl) => {
    if (!logoUrl) {
      console.log('No logo URL provided, using default');
      return 'http://localhost:5000/images/default-company-logo.png';
    }

    if (logoUrl.startsWith('http://') || logoUrl.startsWith('https://')) {
      console.log('Using full URL:', logoUrl);
      return logoUrl;
    }

    const pathName = logoUrl.startsWith('/') ? logoUrl : `/${logoUrl}`;
    console.log('Using backend URL:', `http://localhost:5000${pathName}`);
    return `http://localhost:5000${pathName}`;
  };

  if (loading) return <div>Loading jobs...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <Navbar />
      <ToastContainer position="top-right" autoClose={3000} />
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
              filteredJobs.map((job) => {
                const jobData = {
                  job_id: job.job_id,
                  company_logo: job.company_logo,
                  company_name: job.company_name,
                  position: job.position,
                  job_location: job.job_location,
                  posted: job.createdAt
                };
                const isJobSaved = savedJobs.some(saved => saved.job_id === job.job_id);

                return (
                  <div className="job-list" key={job.job_id}>
                    <div className="job-card">
                      <div className="job-name">
                        <img
                          src={getImageUrl(job.company_logo)}
                          alt={`${job.company_name} logo`}
                          className="job-profile"
                          onError={(e) => {
                            if (!imageErrors[job.job_id]) {
                              setImageErrors(prev => ({
                                ...prev,
                                [job.job_id]: true
                              }));
                              e.target.src = 'http://localhost:5000/images/default-company-logo.png';
                            }
                          }}
                          style={{ 
                            maxWidth: '100px',
                            height: '100px',
                            objectFit: 'cover',
                            display: 'block'
                          }}
                        />
                        <div className="job-detail">
                          <h4>{job.company_name}</h4>
                          <h3>{job.position}</h3>
                          <div className="category">
                            <p>{job.job_location}</p>
                            <p>Experience: {job.experience}</p>
                            <p>Salary: {job.salary}</p>
                          </div>
                        </div>
                      </div>
                      <div className="job-button">
                        <div className="job-posting">
                          <Link to={`/apply-jobs/${job.job_id}`}>Apply Now</Link>
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
              })
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
