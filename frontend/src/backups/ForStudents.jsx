import React, { useEffect, useState } from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import axios from 'axios';


function Sidebar() {
  return (
    <div style={{ width: '200px', height: '100vh', background: '#f0f0f0', padding: '20px' }}>
      <h2>
        <Link to="/" style={{ textDecoration: 'none', color: 'black' }}>
          Home
        </Link>
      </h2>
      <nav>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li><Link to="/students">Students</Link></li>
          <li><Link to="/rooms">Rooms</Link></li>
          <li><Link to="/payments">Payments</Link></li>
        </ul>
      </nav>
    </div>
  );
}


function Home() {
  const [counts, setCounts] = useState({ total_rooms: 0, available_rooms: 0, total_students: 0, pending_payments: 0 });

  useEffect(() => {
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    try {
      const roomsRes = await fetch('http://localhost:8081/rooms/counts');
      const roomsData = await roomsRes.json();

      const studentsRes = await fetch('http://localhost:8081/students/count');
      const studentsData = await studentsRes.json();

      const paymentsRes = await fetch('http://localhost:8081/payments/pending/count');
      const paymentsData = await paymentsRes.json();

      setCounts({
        total_rooms: roomsData.total_rooms,
        available_rooms: roomsData.available_rooms,
        total_students: studentsData.total_students,
        pending_payments: paymentsData.pending_payments,
      });
    } catch (err) {
      console.error('❌ Error fetching counts:', err);
    }
  };

  return (
    <div style={{ padding: "10px" }}>
      <h2>🏠 WELCOME TO HOSTEL MANAGEMENT</h2>
      <div style={{ marginTop: "20px", fontSize: "18px" }}>
        <p><strong>Total Rooms:</strong> {counts.total_rooms}</p>
        <p><strong>Available Rooms:</strong> {counts.available_rooms}</p>
        <p><strong>Total Students:</strong> {counts.total_students}</p>
        <p><strong>Pending Payments:</strong> {counts.pending_payments}</p>
      </div>
    </div>
  );
}



function Students() {
  const [data, setData] = useState([]);
  const fetchStudents = () => {
    fetch('http://localhost:8081/students')
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchStudents();
  }, []);


  return (
    <div style={{ padding: "10px" }}>
      <h2>Students List</h2>
      <table border="1" cellPadding="10" cellSpacing="0">
        <thead>
          <tr>
            <th>Student ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Room ID</th>
            <th>Check-in</th>
            <th>Check-out</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d, i) => (
            <tr key={i}>
              <td>{d.student_id}</td>
              <td>{d.name}</td>
              <td>{d.email}</td>
              <td>{d.phone}</td>
              <td>{d.room_id ? d.room_id : "N/A"}</td>
              <td>{d.check_in ? new Date(d.check_in).toLocaleString() : "N/A"}</td>
              <td>{d.check_out ? new Date(d.check_out).toLocaleString() : "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Rooms() {

  // Room States
  const [rooms, setRooms] = useState([]);

  // 1. First, create a separate function
  const fetchRooms = async () => {
    try {
      const response = await fetch('http://localhost:8081/rooms');
      const data = await response.json();
      setRooms(data);
    } catch (err) {
      console.error('❌ Error fetching rooms:', err);
    }
  };

  // 2. Then call it inside useEffect
  useEffect(() => {
    fetchRooms();
  }, []);


  return (
    <div style={{ padding: "10px" }}>
      <h2>Room List</h2>
      <table border="1" cellPadding="10" cellSpacing="0">
        <thead>
          <tr>
            <th>Room ID</th>
            <th>Type</th>
            <th>Capacity</th>
            <th>Availability Status</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room, i) => (
            <tr key={i}>
              <td>{room.room_id}</td>
              <td>{room.type}</td>
              <td>{room.capacity}</td>
              <td style={{ color: room.availability_status?.toLowerCase() === 'available' ? 'green' : 'red' }}>
                {room.availability_status}
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Payments() {
  const [payments, setPayments] = useState([]);

  const fetchPayments = async () => {
    try {
      const res = await axios.get('http://localhost:8081/payments');
      setPayments(res.data);
    } catch (err) {
      console.error('❌ Error fetching payments:', err);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return (
    <div style={{ padding: "10px" }}>
      <h2>Payments</h2>
      <table border="1" cellPadding="10" cellSpacing="0">
        <thead>
          <tr>
            <th>Payment ID</th>
            <th>Student ID</th>
            <th>Amount</th>
            <th>Payment Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment, i) => (
            <tr key={i}>
              <td>{payment.payment_id}</td>
              <td>{payment.student_id}</td>
              <td>{payment.amount}</td>
              <td>{new Date(payment.payment_date).toLocaleString()}</td>
              <td style={{ color: payment.status === 'completed' ? 'green' : 'red' }}>
                {payment.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}

function App() {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1, padding: '20px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/students" element={<Students />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/payments" element={<Payments />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
