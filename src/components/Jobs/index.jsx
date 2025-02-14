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
  const [showMyJobs, setShowMyJobs] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || "",
    experience: [],
    salary: []
  });

  useEffect(() => {
    // Get current user ID from localStorage
    const userData = localStorage.getItem('user');
    console.log('User data from localStorage:', userData);
    
    if (userData) {
      const user = JSON.parse(userData);
      console.log('Parsed user data:', user);
      
      if (user.token) {
        try {
          const tokenData = JSON.parse(atob(user.token.split('.')[1]));
          console.log('Decoded token data:', tokenData);
          setCurrentUserId(tokenData.id.toString());
        } catch (error) {
          console.error('Error parsing token:', error);
        }
      } else if (user.id) {
        setCurrentUserId(user.id.toString());
      }
    }
  }, []);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get("http://localhost:5000/jobs");
        setAllJobs(response.data);
        let jobsToShow = response.data;

        // Apply all active filters
        jobsToShow = applyFilters(jobsToShow, filters);

        // Filter by current user if switch is on
        if (showMyJobs && currentUserId) {
          console.log('Filtering for user:', currentUserId);
          jobsToShow = jobsToShow.filter(job => {
            const jobPosterId = job.posted_by ? job.posted_by.toString() : null;
            console.log(`Comparing job ${job.job_id}: posted_by=${jobPosterId} with currentUserId=${currentUserId}`);
            return jobPosterId === currentUserId;
          });
        }

        setFilteredJobs(jobsToShow);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setError("Failed to load jobs");
        setLoading(false);
      }
    };

    fetchJobs();
  }, [searchParams, showMyJobs, currentUserId, filters]);

  const applyFilters = (jobs, currentFilters) => {
    let filteredResults = [...jobs];

    // Apply search filter
    if (currentFilters.search) {
      filteredResults = filteredResults.filter((item) => {
        if (item) {
          return Object.values(item)
            .join("")
            .toLowerCase()
            .includes(currentFilters.search.toLowerCase());
        }
        return false;
      });
    }

    // Apply experience filter
    if (currentFilters.experience.length > 0) {
      filteredResults = filteredResults.filter((job) => {
        const expYears = parseInt(job.experience);
        return currentFilters.experience.some(
          range => expYears >= range.min && expYears <= range.max
        );
      });
    }

    // Apply salary filter
    if (currentFilters.salary.length > 0) {
      filteredResults = filteredResults.filter((job) => {
        const jobSalary = parseInt(job.salary.replace(/[^0-9]/g, ''));
        return currentFilters.salary.some(
          range => jobSalary >= range.min && (range.max === Infinity || jobSalary <= range.max)
        );
      });
    }

    return filteredResults;
  };

  // Add toggle handler
  const handleToggleMyJobs = () => {
    if (!currentUserId) {
      toast.error("Please login to filter your posted jobs");
      return;
    }
    setShowMyJobs(!showMyJobs);
    
  };

  function handleJobFilter(event) {
    if (event.target.name === 'salary') {
      const selectedRanges = [];
      const salaryRanges = [
        { min: 0, max: 30000 },
        { min: 30000, max: 50000 },
        { min: 50000, max: 80000 },
        { min: 80000, max: 100000 },
        { min: 100000, max: Infinity }
      ];
      
      event.target.checkedRanges.forEach((isChecked, index) => {
        if (isChecked) {
          selectedRanges.push(salaryRanges[index]);
        }
      });

      setFilters(prev => ({
        ...prev,
        salary: selectedRanges
      }));
    }
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
    setFilters(prev => ({
      ...prev,
      search: data
    }));
  };

  function handleExperienceFilter(checkedState) {
    const selectedRanges = [];
    checkedState.forEach((isChecked, index) => {
      if (isChecked) {
        selectedRanges.push(experience[index]);
      }
    });

    setFilters(prev => ({
      ...prev,
      experience: selectedRanges
    }));
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

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job post?')) {
      try {
        const userData = localStorage.getItem('user');
        if (!userData) {
          toast.error("Please login to delete jobs");
          return;
        }

        const user = JSON.parse(userData);
        console.log('Delete attempt:', {
          jobId,
          userId: user.id,
          tokenExists: !!user.token
        });

        const response = await axios.delete(`http://localhost:5000/jobs/${jobId}`, {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });

        if (response.data.message === "Job deleted") {
          setAllJobs(prev => prev.filter(job => job.job_id !== jobId));
          setFilteredJobs(prev => prev.filter(job => job.job_id !== jobId));
          toast.success("Job deleted successfully");
        }
      } catch (error) {
        console.error("Error deleting job:", error.response?.data || error);
        const errorMessage = error.response?.data?.error || "Failed to delete job";
        if (error.response?.data?.debug) {
          console.log('Debug info:', error.response.data.debug);
        }
        toast.error(errorMessage);
      }
    }
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
            <div className="my-jobs-switch">
              <label className="switch">
                <input
                  type="checkbox"
                  checked={showMyJobs}
                  onChange={handleToggleMyJobs}
                />
                <span className="slider round"></span>
              </label>
              <span className="switch-label">Show My Posted Jobs</span>
            </div>
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
                
                // Convert both IDs to strings and ensure they exist
                const jobPosterId = job.posted_by ? job.posted_by.toString() : null;
                const userIdString = currentUserId ? currentUserId.toString() : null;
                
                // Debug logs
                console.log('Job ownership comparison:', {
                  jobId: job.job_id,
                  jobPosterId,
                  userIdString,
                  jobPostedBy: job.posted_by,
                  currentUserId
                });
                
                const isOwnJob = jobPosterId && userIdString && jobPosterId === userIdString;

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
                        {isOwnJob ? (
                          <div className="job-posting delete-button">
                            <button
                              onClick={() => handleDeleteJob(job.job_id)}
                              className="delete-link"
                            >
                              Delete Job
                            </button>
                          </div>
                        ) : (
                          <div className="job-posting">
                            <Link to={`/apply-jobs/${job.job_id}`} className="apply-link">
                              Apply Now
                            </Link>
                          </div>
                        )}
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
              <div className="no-jobs-message">
                {showMyJobs ? "You haven't posted any jobs yet" : "No jobs found"}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Jobs;
