import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import logo from './assets/nit-white.png';
import '../App.css'; // optional

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <div className="sidebar" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '220px', background: '#2e2e38', color: 'white', padding: '20px' }}>
        <div>
          <img src={logo} alt="Dashboard Logo" style={{ maxWidth: '100%', marginBottom: '20px' }} />
          <hr />
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li><NavLink to="/admin" end>Home</NavLink></li>
            <li><NavLink to="/admin/students">Students</NavLink></li>
            <li><NavLink to="/admin/rooms">Rooms</NavLink></li>
            <li><NavLink to="/admin/payments">Payments</NavLink></li>
            <li><NavLink to="/admin/form">Forms</NavLink></li>
            <li><NavLink to="/admin/about">About</NavLink></li>
            <li><NavLink to="/admin/contact">Contact</NavLink></li>
          </ul>
        </div>

        {/* Logout Button */}
        <button
          className='logout-button'
          onClick={handleLogout}
          style={{
            backgroundColor: '#e95d2c',
            border: 'none',
            padding: '10px',
            color: 'white',
            borderRadius: '5px',
            cursor: 'pointer',
            marginTop: '20px'
          }}
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '20px' }}>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminDashboard;
