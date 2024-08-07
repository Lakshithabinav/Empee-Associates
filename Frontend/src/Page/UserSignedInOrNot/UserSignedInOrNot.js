import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Dashboard from '../Dashboard/Dashboard';
import './UserSignedInOrNot.css';

function UserSignedInOrNot() {
  const navigate = useNavigate();
  const loggedIn = useSelector(state => state.login.value);
  const [isHovered, setIsHovered] = useState(false);

  const handleHover = () => setIsHovered(true);
  const handleMouseOut = () => setIsHovered(false);

  return (
    <div>
      {loggedIn ? (
        <Dashboard />
      ) : (
        <div className='outerDiv'>
          <div className='loginErrorContent'>
            <p>Please log in to access the dashboard.</p>
          </div>
          <div className='emoji'>{isHovered ? '😊' : '😔'}</div>
          <button
            onMouseOver={handleHover}
            onMouseOut={handleMouseOut}
            className='loginbtn'
            onClick={() => navigate('/')}
          >
            Login
          </button>
        </div>
      )}
    </div>
  );
}

export default UserSignedInOrNot;
