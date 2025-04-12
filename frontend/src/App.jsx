import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import './App.css'; // (optional) if you have any CSS

// Import pages
import Home from './pages/Home';
import Students from './pages/Students';
import Rooms from './pages/Rooms';
import Payments from './pages/Payment';
import Form from './pages/Form';
import About from './pages/About';
import Contact from './pages/Contact';
import logo from './assets/nit-white.png'

function App() {
  return (
    <Router>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        {/* Sidebar */}
        <div className='sidebar'>
        <img src={logo} alt="Dashboard Logo" />
          <hr />
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ margin: '10px 0' }}>
              <NavLink
                to="/"
                style={({ isActive }) => ({
                  color: isActive ? '#e95d2c' : '',
                  textDecoration: isActive ? 'underline' : 'none',
                })}
              >
                Home
              </NavLink>
            </li>
            <li style={{ margin: '10px 0' }}>
              <NavLink
                to="/students"
                style={({ isActive }) => ({
                  color: isActive ? '#e95d2c' : '',
                  textDecoration: isActive ? 'underline' : 'none',
                })}
              >
                Students
              </NavLink>
            </li>
            <li style={{ margin: '10px 0' }}>
              <NavLink
                to="/rooms"
                style={({ isActive }) => ({
                  color: isActive ? '#e95d2c' : '',
                  textDecoration: isActive ? 'underline' : 'none',
                })}
              >
                Rooms
              </NavLink>
            </li>
            <li style={{ margin: '10px 0' }}>
              <NavLink
                to="/payments"
                style={({ isActive }) => ({
                  color: isActive ? '#e95d2c' : '',
                  textDecoration: isActive ? 'underline' : 'none',
                })}
              >
                Payments
              </NavLink>
            </li>
            <li style={{ margin: '10px 0' }}>
              <NavLink
                to="/form"
                style={({ isActive }) => ({
                  color: isActive ? '#e95d2c' : '',
                  textDecoration: isActive ? 'underline' : 'none',
                })}
              >
                Forms
              </NavLink>
            </li>
            <li style={{ margin: '10px 0' }}>
              <NavLink
                to="/about"
                style={({ isActive }) => ({
                  color: isActive ? '#e95d2c' : '',
                  textDecoration: isActive ? 'underline' : 'none',
                })}
              >
                About
              </NavLink>
            </li>
            <li style={{ margin: '10px 0' }}>
              <NavLink
                to="/contact"
                style={({ isActive }) => ({
                  color: isActive ? '#e95d2c' : '',
                  textDecoration: isActive ? 'underline' : 'none',
                })}
              >
                Contact
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Page Content */}
        <div style={{ flex: 1, padding: '20px' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/students" element={<Students />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/form" element={<Form />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
