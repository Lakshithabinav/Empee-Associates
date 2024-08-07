import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './NavButton.css';

function NavButton() {
    const location = useLocation();
    const [activePath, setActivePath] = useState(location.pathname);

    useEffect(() => {
        setActivePath(location.pathname);
    }, [location]);

    return (
        <div className='navButtonOuterDiv'>
            <Link to='/dashboard/monitoring' className={`navButtonLink ${activePath === '/dashboard/monitoring' ? 'active' : ''}`}>
                <p>Monitoring</p>
            </Link>
            <Link to='/dashboard/datarecord' className={`navButtonLink ${activePath === '/dashboard/datarecord' ? 'active' : ''}`}>
                <p>Data Records</p>
            </Link>
        </div>
    );
}

export default NavButton;
