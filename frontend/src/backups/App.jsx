import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Import pages
import Home from './pages/Home';
import Students from './pages/Students';
import Rooms from './pages/Rooms';
import Payments from './pages/Payment';
import Form from './pages/Form';
import About from './pages/About';
import Contact from './pages/Contact';

function App() {
  return (
    <Router>
      <div style={{ display: 'flex' }}>
        {/* Sidebar */}
        <div style={{ width: '200px', background: '#f0f0f0', padding: '20px', height: '100vh' }}>
          <h3>DashBoard</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ margin: '10px 0' }}>
              <Link to="/">Home</Link>
            </li>
            <li style={{ margin: '10px 0' }}>
              <Link to="/students">Students</Link>
            </li>
            <li style={{ margin: '10px 0' }}>
              <Link to="/rooms">Rooms</Link>
            </li>
            <li style={{ margin: '10px 0' }}>
              <Link to="/payments">Payments</Link>
            </li>
            <li style={{ margin: '10px 0' }}>
              <Link to="/form">Forms</Link>
            </li>
            <li style={{ margin: '10px 0' }}>
              <Link to="/about">About</Link>
            </li>
            <li style={{ margin: '10px 0' }}>
              <Link to="/contact">Contact</Link>
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
