import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/Login';
import SignUp from './pages/SignUp';
import AdminDashboard from './pages/AdminDashboard';
import GuestDashboard from './pages/GuestDashboard';

import AdminHome from './pages/admin/Home';
import AdminStudents from './pages/admin/Students';
import AdminRooms from './pages/admin/Rooms';
import AdminPayments from './pages/admin/Payment';
import AdminForm from './pages/admin/Form';
import AdminAbout from './pages/admin/About';
import AdminContact from './pages/admin/Contact';

import GuestHome from './pages/guest/Home';
import GuestStudents from './pages/guest/Students';
import GuestRooms from './pages/guest/Rooms';
import GuestPayments from './pages/guest/Payment';
import GuestAbout from './pages/guest/About';
import GuestContact from './pages/guest/Contact';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Admin Dashboard Routes */}
        <Route path="/admin" element={<AdminDashboard />}>
          <Route index element={<AdminHome />} />
          <Route path="students" element={<AdminStudents />} />
          <Route path="rooms" element={<AdminRooms />} />
          <Route path="payments" element={<AdminPayments />} />
          <Route path="form" element={<AdminForm />} />
          <Route path="about" element={<AdminAbout />} />
          <Route path="contact" element={<AdminContact />} />
        </Route>

        {/* Guest Dashboard Routes */}
        <Route path="/guest" element={<GuestDashboard />}>
          <Route index element={<GuestHome />} />
          <Route path="students" element={<GuestStudents />} />
          <Route path="rooms" element={<GuestRooms />} />
          <Route path="payments" element={<GuestPayments />} />
          <Route path="about" element={<GuestAbout />} />
          <Route path="contact" element={<GuestContact />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
