import React from 'react';
import { Link } from 'react-router-dom';
import './index.css';

const UserAvatar = ({ firstName, lastName, email }) => {
  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  return (
    <Link to="/profile" className="user-profile-link">
      <div className="user-profile">
        <div className="user-avatar">
          {getInitials(firstName, lastName)}
        </div>
        <div className="user-info">
          <div className="user-name">{`${firstName} ${lastName}`}</div>
          <div className="user-email">{email}</div>
        </div>
      </div>
    </Link>
  );
};

export default UserAvatar; 