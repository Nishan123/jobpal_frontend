import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../Navbar';
import './index.css';

const Profile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedFirstName, setEditedFirstName] = useState('');
  const [editedLastName, setEditedLastName] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [applications, setApplications] = useState([]);
  const [postedJobs, setPostedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    const storedUserData = localStorage.getItem('user');
    if (!storedUserData) {
      navigate('/login');
      return;
    }
    const parsedData = JSON.parse(storedUserData);
    setUserData(parsedData);
    setEditedFirstName(parsedData.first_name);
    setEditedLastName(parsedData.last_name);

    // Fetch posted jobs and their applications
    fetchPostedJobsAndApplications(parsedData);
  }, [navigate]);

  const fetchPostedJobsAndApplications = async (user) => {
    try {
      setLoading(true);
      console.log('Fetching with user:', user);

      // First, fetch all jobs posted by the user
      const jobsResponse = await axios.get('http://localhost:5000/jobs', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      console.log('Jobs response:', jobsResponse.data);

      // Filter jobs posted by the current user
      const userJobs = jobsResponse.data.filter(job => {
        // Convert both IDs to strings for comparison
        const jobPosterId = String(job.posted_by);
        const userId = String(user.id);
        console.log('Comparing job.posted_by:', jobPosterId, 'with user.id:', userId);
        return jobPosterId === userId;
      });
      console.log('Filtered user jobs:', userJobs);
      setPostedJobs(userJobs);

      if (userJobs.length > 0) {
        // Fetch applications for each job
        console.log('Fetching applications for jobs:', userJobs.map(job => job.job_id));
        const applicationsPromises = userJobs.map(job => 
          axios.get(`http://localhost:5000/applications/job/${job.job_id}`, {
            headers: { Authorization: `Bearer ${user.token}` }
          })
        );

        try {
          const applicationsResponses = await Promise.all(applicationsPromises);
          console.log('Applications responses:', applicationsResponses.map(r => r.data));
          const allApplications = applicationsResponses.flatMap(response => response.data);
          console.log('All applications:', allApplications);
          setApplications(allApplications);
        } catch (appError) {
          console.error('Error fetching applications:', appError);
          console.error('Applications error details:', {
            message: appError.message,
            response: appError.response?.data,
            status: appError.response?.status
          });
          toast.error('Error loading applications: ' + (appError.response?.data?.error || appError.message));
        }
      } else {
        console.log('No jobs found for user');
        setApplications([]);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      toast.error('Failed to load jobs: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    setTimeout(() => {
      navigate('/login');
    }, 1500);
  };

  const handleDeleteProfile = async () => {
    if (!window.confirm('Are you sure you want to delete your profile? This action cannot be undone.')) {
      return;
    }

    try {
      const token = userData?.token;
      if (!token) {
        toast.error('Authentication required');
        return;
      }

      await axios.delete('http://localhost:5000/users/profile', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      localStorage.removeItem('user');
      toast.success('Profile deleted successfully');
      setTimeout(() => {
        navigate('/signup');
      }, 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete profile');
    }
  };

  const handleSaveChanges = async () => {
    if (!editedFirstName.trim() || !editedLastName.trim()) {
      toast.error('Name fields cannot be empty');
      return;
    }

    try {
      const response = await axios.put('http://localhost:5000/profile', 
        {
          first_name: editedFirstName,
          last_name: editedLastName
        },
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const { token, user } = response.data;
      
      // Update local storage with new user data and token
      const updatedUserData = {
        ...userData,
        ...user,
        token
      };
      localStorage.setItem('user', JSON.stringify(updatedUserData));
      setUserData(updatedUserData);
      
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Profile update error:', error);
      if (error.response?.status === 401) {
        toast.error('Your session has expired. Please login again');
        localStorage.removeItem('user');
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else {
        const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Failed to update profile';
        toast.error(errorMessage);
        console.error('Full error object:', error.response?.data);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditedFirstName(userData.first_name);
    setEditedLastName(userData.last_name);
    setIsEditing(false);
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSavePassword = async () => {
    // Validate passwords
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmNewPassword) {
      toast.error('All password fields are required');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long');
      return;
    }

    try {
      const response = await axios.put('http://localhost:5000/change-password',
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        },
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Reset form and show success message
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      });
      setIsChangingPassword(false);
      toast.success(response.data.message || 'Password updated successfully');
    } catch (error) {
      console.error('Password update error:', error);
      const errorMessage = error.response?.data?.error || 'Failed to update password';
      toast.error(errorMessage);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getJobTitle = (jobId) => {
    const job = postedJobs.find(job => job.job_id === jobId);
    return job ? job.position : 'Unknown Position';
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      setIsUpdatingStatus(true);
      const response = await axios.put(
        `http://localhost:5000/applications/${applicationId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Update the applications list with the new status
      setApplications(applications.map(app => 
        app.application_id === applicationId 
          ? { ...app, status: newStatus }
          : app
      ));

      toast.success('Application status updated successfully');
    } catch (error) {
      console.error('Status update error:', error);
      toast.error(error.response?.data?.error || 'Failed to update status');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  if (!userData) {
    return null;
  }

  return (
    <>
      <Navbar />
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            {editedFirstName[0]?.toUpperCase() || ''}
            {editedLastName[0]?.toUpperCase() || ''}
          </div>
          <h1>My Profile</h1>
        </div>

        <div className="profile-info">
          <div className="info-group">
            <label>Name</label>
            {isEditing ? (
              <div className="edit-name-container">
                <input
                  type="text"
                  value={editedFirstName}
                  onChange={(e) => setEditedFirstName(e.target.value)}
                  placeholder="First Name"
                  className="edit-input"
                />
                <input
                  type="text"
                  value={editedLastName}
                  onChange={(e) => setEditedLastName(e.target.value)}
                  placeholder="Last Name"
                  className="edit-input"
                />
                <div className="edit-actions">
                  <button className="save-profile-button" onClick={handleSaveChanges}>
                    <i className="fas fa-check"></i>
                    Save
                  </button>
                  <button className="cancel-button" onClick={handleCancelEdit}>
                    <i className="fas fa-times"></i>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="name-display">
                <p>{`${userData.first_name} ${userData.last_name}`}</p>
                <button className="edit-button" onClick={() => setIsEditing(true)}>
                  <i className="fas fa-edit"></i>
                  Edit
                </button>
              </div>
            )}
          </div>
          <div className="info-group">
            <label>Email</label>
            <p>{userData.email}</p>
          </div>

          <div className="info-group">
            <label>Password</label>
            {isChangingPassword ? (
              <div className="edit-password-container">
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="Current Password"
                  className="edit-input"
                />
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="New Password"
                  className="edit-input"
                />
                <input
                  type="password"
                  name="confirmNewPassword"
                  value={passwordData.confirmNewPassword}
                  onChange={handlePasswordChange}
                  placeholder="Confirm New Password"
                  className="edit-input"
                />
                <div className="edit-actions">
                  <button className="save-profile-button" onClick={handleSavePassword}>
                    <i className="fas fa-check"></i>
                    Save Password
                  </button>
                  <button className="cancel-button" onClick={() => {
                    setIsChangingPassword(false);
                    setPasswordData({
                      currentPassword: '',
                      newPassword: '',
                      confirmNewPassword: ''
                    });
                  }}>
                    <i className="fas fa-times"></i>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="password-display">
                <p>••••••••</p>
                <button className="edit-button" onClick={() => setIsChangingPassword(true)}>
                  <i className="fas fa-edit"></i>
                  Change Password
                </button>
              </div>
            )}
          </div>

          <div className="profile-actions">
            <button className="logout-button" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt"></i>
              Logout
            </button>
            <button className="delete-button" onClick={handleDeleteProfile}>
              <i className="fas fa-user-times"></i>
              Delete Profile
            </button>
          </div>
        </div>

        <div className="applications-section">
          <h2>Job Applications Received</h2>
          {loading ? (
            <p>Loading applications...</p>
          ) : applications.length > 0 ? (
            <div className="applications-list">
              {applications.map(application => (
                <div key={application.application_id} className="application-card">
                  <div className="application-header">
                    <h3>{getJobTitle(application.job_id)}</h3>
                    <div className="status-section">
                      <span className={`status status-${application.status}`}>
                        {application.status}
                      </span>
                      <select
                        value={application.status}
                        onChange={(e) => handleStatusChange(application.application_id, e.target.value)}
                        disabled={isUpdatingStatus}
                        className="status-select"
                      >
                        <option value="pending">Pending</option>
                        <option value="reviewed">Reviewed</option>
                        <option value="accepted">Accepted</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                  </div>
                  <div className="application-details">
                    <p><strong>Applicant:</strong> {application.applicant_name}</p>
                    <p><strong>Applied on:</strong> {formatDate(application.applied_date)}</p>
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
                </div>
              ))}
            </div>
          ) : (
            <p className="no-applications">No applications received yet.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;
