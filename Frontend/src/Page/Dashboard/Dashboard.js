import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from '../../Components/Navbar/Navbar';
import Monitoring from '../../Components/Monitoring/Monitoring';
import DataRecord from '../../Components/DataRecord/DataRecord';
import './Dashboard.css';
import NavButton from '../../Components/NavButton/NavButton';

function Dashboard() {
  const navigate = useNavigate();

  React.useEffect(() => {
    // Redirect to /monitoring if no other path is matched
    if (window.location.pathname === '/dashboard') {
      navigate('/dashboard/monitoring');
    }
  }, [navigate]);

  return (
    <div>
      <Navbar />
      <NavButton />
      <div className='dashboardDiv'>
        <Routes>
          <Route path='/monitoring' element={<Monitoring />} />
          <Route path='/datarecord' element={<DataRecord />} />
          {/* You might want to add a catch-all route here */}
        </Routes>
      </div>
    </div>
  );
}

export default Dashboard;
