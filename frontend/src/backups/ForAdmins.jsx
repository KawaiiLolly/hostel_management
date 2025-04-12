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
  const [newStudent, setNewStudent] = useState({
    student_id: '',
    name: '',
    email: '',
    phone: '',
    room_id: '',
    check_in: '',
  });


  const [deleteStudentId, setDeleteStudentId] = useState('');
  const handleChange = (e) => {
    setNewStudent(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleDeleteChange = (e) => {
    setDeleteStudentId(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8081/students', newStudent);
      alert('✅ New student added successfully!');
      setNewStudent({
        student_id: '',
        name: '',
        email: '',
        phone: '',
        room_id: '',
        check_in: '',
        // check_out: '',
      });
      fetchStudents();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!deleteStudentId) {
      alert('Please enter a Student ID to delete.');
      return;
    }
    try {
      await axios.delete(`http://localhost:8081/students/${deleteStudentId}`);
      alert(`✅ Student with ID ${deleteStudentId} deleted successfully!`);
      setDeleteStudentId('');
      fetchStudents();
    } catch (err) {
      console.error(err);
    }
  };

  // Add these new states:
  const [updateStudentId, setUpdateStudentId] = useState('');
  const [newCheckOut, setNewCheckOut] = useState('');

  // Function to handle update
  const handleUpdateCheckOut = async () => {
    if (!updateStudentId || !newCheckOut) {
      alert('Please enter Student ID and new Check-out date.');
      return;
    }
    try {
      await axios.put(`http://localhost:8081/students/${updateStudentId}`, {
        check_out: newCheckOut
      });
      alert(`✅ Check-out updated for Student ID ${updateStudentId}!`);
      setUpdateStudentId('');
      setNewCheckOut('');
      fetchStudents();
    } catch (err) {
      console.error(err);
    }
  };



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
            <th>Check-out</th> {/* ✅ add this back */}
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
              <td>{d.check_out ? new Date(d.check_out).toLocaleString() : "N/A"}</td> {/* ✅ show check_out */}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add Student Form */}
      <h2>Add New Student</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px' }}>
        <input type="number" name="student_id" placeholder="Student ID" value={newStudent.student_id} onChange={handleChange} required />
        <input type="text" name="name" placeholder="Name" value={newStudent.name} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={newStudent.email} onChange={handleChange} required />
        <input type="text" name="phone" placeholder="Phone" value={newStudent.phone} onChange={handleChange} required />
        <input type="text" name="room_id" placeholder="Room ID (optional)" value={newStudent.room_id} onChange={handleChange} />
        <input type="datetime-local" name="check_in" value={newStudent.check_in} onChange={handleChange} />
        <button type="submit" style={{ padding: '10px', background: 'blue', color: 'white', border: 'none' }}>
          Add Student
        </button>
      </form>


      {/* Update Student Check-Out */}
      <h2>Update Student Check-Out</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px', marginTop: '20px' }}>
        <input
          type="number"
          placeholder="Enter Student ID"
          value={updateStudentId}
          onChange={(e) => setUpdateStudentId(e.target.value)}
        />
        <input
          type="datetime-local"
          placeholder="New Check-out Date"
          value={newCheckOut}
          onChange={(e) => setNewCheckOut(e.target.value)}
        />
        <button
          onClick={handleUpdateCheckOut}
          style={{ padding: '10px', background: 'green', color: 'white', border: 'none' }}
        >
          Update Check-Out
        </button>
      </div>


      {/* Delete Student */}
      <h2>Delete Student</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px', marginTop: '20px' }}>
        <input type="number" placeholder="Enter Student ID to Delete" value={deleteStudentId} onChange={handleDeleteChange} />
        <button onClick={handleDelete} style={{ padding: '10px', background: 'red', color: 'white', border: 'none' }}>Delete Student</button>
      </div>
    </div>
  );
}

function Rooms() {
  const [rooms, setRooms] = useState([]);
  // Room States
  const [newRoom, setNewRoom] = useState({
    room_id: '',
    type: '',
    capacity: '',
    availability_status: 'available',
  });

  const handleRoomChange = (e) => {
    setNewRoom(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRoomSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8081/rooms', newRoom);
      alert('✅ Room added successfully!');
      setNewRoom({
        room_id: '',
        type: '',
        capacity: '',
        availability_status: 'available',
      });
    } catch (err) {
      console.error(err);
    }
  };


  const [updateRoom, setUpdateRoom] = useState({
    room_id: '',
    availability_status: 'available',
  });

  const handleRoomUpdate = async () => {
    if (!updateRoom.room_id) {
      alert('Please enter a Room ID to update.');
      return;
    }
    try {
      await axios.put(`http://localhost:8081/rooms/${updateRoom.room_id}`, {
        availability_status: updateRoom.availability_status,
      });
      alert('✅ Room availability updated successfully!');
      setUpdateRoom({
        room_id: '',
        availability_status: 'available',
      });
      fetchRooms(); // You can create this function to refresh the room list if needed
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateRoomChange = (e) => {
    setUpdateRoom(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };


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

      {/* Add Room Form */}
      <h2 style={{ marginTop: '40px' }}>Add Room</h2>
      <form onSubmit={handleRoomSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px' }}>
        <input type="number" name="room_id" placeholder="Room ID (manual)" value={newRoom.room_id} onChange={handleRoomChange} required />
        <input type="text" name="type" placeholder="Room Type (e.g., Single, Double)" value={newRoom.type} onChange={handleRoomChange} required />
        <input type="number" name="capacity" placeholder="Capacity" value={newRoom.capacity} onChange={handleRoomChange} required />
        <select name="availability_status" value={newRoom.availability_status} onChange={handleRoomChange} required>
          <option value="available">Available</option>
          <option value="occupied">Occupied</option>
        </select>
        <button type="submit" style={{ padding: '10px', background: 'orange', color: 'white', border: 'none' }}>
          Add Room
        </button>
      </form>

      {/* Update Room Form */}

      <h2 style={{ marginTop: '40px' }}>Update Room Availability</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px' }}>
        <input
          type="number"
          name="room_id"
          placeholder="Room ID"
          value={updateRoom.room_id}
          onChange={handleUpdateRoomChange}
        />
        <select
          name="availability_status"
          value={updateRoom.availability_status}
          onChange={handleUpdateRoomChange}
        >
          <option value="available">Available</option>
          <option value="Occupied">Occupied</option>
        </select>
        <button
          onClick={handleRoomUpdate}
          style={{ padding: '10px', background: 'green', color: 'white', border: 'none' }}
        >
          Update Room Availability
        </button>
      </div>

    </div>
  );
}

function Payments() {
  const [payments, setPayments] = useState([]);
  const [newPayment, setNewPayment] = useState({
    payment_id: '',
    student_id: '',
    amount: '',
    payment_date: '',
    status: 'pending',
  });


  const [deletePaymentId, setDeletePaymentId] = useState('');

  const [updatePayment, setUpdatePayment] = useState({
    payment_id: '',
    status: 'pending',
  });

  const handlePaymentChange = (e) => {
    setNewPayment(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleUpdatePaymentChange = (e) => {
    setUpdatePayment(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8081/payments', newPayment);
      alert('✅ Payment record added successfully!');
      setNewPayment({
        student_id: '',
        amount: '',
        status: 'pending',
      });
      fetchPayments();
    } catch (err) {
      console.error(err);
    }
  };

  const handlePaymentDelete = async () => {
    if (!deletePaymentId) {
      alert('Please enter a Payment ID to delete.');
      return;
    }
    try {
      await axios.delete(`http://localhost:8081/payments/${deletePaymentId}`);
      alert('✅ Payment deleted successfully!');
      setDeletePaymentId('');
      fetchPayments();
    } catch (err) {
      console.error(err);
    }
  };

  const handlePaymentUpdate = async () => {
    if (!updatePayment.payment_id) {
      alert('Please enter a Payment ID to update.');
      return;
    }
    try {
      await axios.put(`http://localhost:8081/payments/${updatePayment.payment_id}`, {
        status: updatePayment.status,
      });
      alert('✅ Payment status updated successfully!');
      setUpdatePayment({
        payment_id: '',
        status: 'pending',
      });
      fetchPayments();
    } catch (err) {
      console.error(err);
    }
  };


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

      {/* Add Payment Form */}
      <h2 style={{ marginTop: '40px' }}>Add Payment</h2>
      <form onSubmit={handlePaymentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px' }}>
        <input
          type="number"
          name="payment_id"
          placeholder="Payment ID"
          value={newPayment.payment_id || ''}
          onChange={handlePaymentChange}
          required
        />
        <input
          type="number"
          name="student_id"
          placeholder="Student ID"
          value={newPayment.student_id}
          onChange={handlePaymentChange}
          required
        />
        <input
          type="number"
          step="0.01"
          name="amount"
          placeholder="Amount"
          value={newPayment.amount}
          onChange={handlePaymentChange}
          required
        />
        <input
          type="datetime-local"
          name="payment_date"
          value={newPayment.payment_date || ''}
          onChange={handlePaymentChange}
          required
        />
        <select
          name="status"
          value={newPayment.status}
          onChange={handlePaymentChange}
          required
        >
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
        <button
          type="submit"
          style={{ padding: '10px', background: 'green', color: 'white', border: 'none' }}
        >
          Add Payment
        </button>
      </form>

      {/* Delete Payment */}
      <h2 style={{ marginTop: '40px' }}>Delete Payment</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px' }}>
        <input type="number" placeholder="Payment ID to Delete" value={deletePaymentId} onChange={e => setDeletePaymentId(e.target.value)} />
        <button onClick={handlePaymentDelete} style={{ padding: '10px', background: 'red', color: 'white', border: 'none' }}>Delete Payment</button>
      </div>

      {/* Update Payment Status */}
      <h2 style={{ marginTop: '40px' }}>Update Payment Status</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px' }}>
        <input
          type="number"
          name="payment_id"
          placeholder="Payment ID"
          value={updatePayment.payment_id}
          onChange={handleUpdatePaymentChange}
        />
        <select
          name="status"
          value={updatePayment.status}
          onChange={handleUpdatePaymentChange}
        >
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
        <button
          onClick={handlePaymentUpdate}
          style={{ padding: '10px', background: 'purple', color: 'white', border: 'none' }}
        >
          Update Payment Status
        </button>
      </div>
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
