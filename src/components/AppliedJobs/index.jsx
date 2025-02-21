import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../Navbar';
import './index.css';

const AppliedJobs = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const storedUserData = localStorage.getItem('user');
    if (!storedUserData) {
      navigate('/login');
      return;
    }
    const parsedData = JSON.parse(storedUserData);
    setUserData(parsedData);
    fetchApplications(parsedData);
  }, [navigate]);

  const fetchApplications = async (user) => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/applications/my-applications', {
        headers: { Authorization: `Bearer ${user.token}` }
      });

      // Transform the data to match our component's expected format
      const transformedApplications = response.data.map(app => ({
        application_id: app.application_id,
        job_title: app.Job.position,
        company_name: app.Job.company_name,
        applied_date: app.applied_date,
        status: app.status,
        cv_path: app.cv_path
      }));

      setApplications(transformedApplications);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to load applications: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    const statusColors = {
      pending: '#ffd700',
      reviewed: '#17a2b8',
      accepted: '#28a745',
      rejected: '#dc3545'
    };
    return statusColors[status] || '#ffd700';
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="applied-jobs-container">
          <div className="loading-message">Loading applications...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="applied-jobs-container">
        <h1>My Job Applications</h1>
        
        {applications.length === 0 ? (
          <div className="no-applications-message">
            <p>You haven't applied to any jobs yet.</p>
          </div>
        ) : (
          <div className="applications-grid">
            {applications.map((application) => (
              <div key={application.application_id} className="application-card">
                <div className="job-title">{application.job_title}</div>
                <div className="company-name">{application.company_name}</div>
                <div className="application-details">
                  <div className="detail-row">
                    <span className="label">Applied on:</span>
                    <span className="value">{formatDate(application.applied_date)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Status:</span>
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(application.status) }}
                    >
                      {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </span>
                  </div>
                </div>
                <div className="application-actions">
                  <a 
                    href={`http://localhost:5000/${application.cv_path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="view-cv-button"
                  >
                    View CV
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default AppliedJobs;
