import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Form() {
  // Student States
  const [newStudent, setNewStudent] = useState({
    student_id: '',
    name: '',
    email: '',
    phone: '',
    room_id: '',
    check_in: '',
  });
  const [deleteStudentId, setDeleteStudentId] = useState('');

  // Payment States
  const [newPayment, setNewPayment] = useState({
    student_id: '',
    amount: '',
    status: 'pending',
  });
  const [payments, setPayments] = useState([]);
  const [deletePaymentId, setDeletePaymentId] = useState('');
  const [updatePayment, setUpdatePayment] = useState({
    payment_id: '',
    status: 'pending',
  });

  // Room States
  const [newRoom, setNewRoom] = useState({
    room_id: '',
    type: '',
    capacity: '',
    availability_status: 'available',
  });

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await axios.get('http://localhost:8081/payments');
      setPayments(res.data);
    } catch (err) {
      console.error('❌ Error fetching payments:', err);
    }
  };

  // Handlers
  const handleChange = (e) => {
    setNewStudent(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleDeleteChange = (e) => {
    setDeleteStudentId(e.target.value);
  };

  const handlePaymentChange = (e) => {
    setNewPayment(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdatePaymentChange = (e) => {
    setUpdatePayment(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRoomChange = (e) => {
    setNewRoom(prev => ({ ...prev, [e.target.name]: e.target.value }));
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
      });
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
    } catch (err) {
      console.error(err);
    }
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




  return (
    <div style={{ padding: "20px" }}>
      {/* Add Student Form */}
      <h2>Add New Student</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px' }}>
        <input type="number" name="student_id" placeholder="Student ID" value={newStudent.student_id} onChange={handleChange} required />
        <input type="text" name="name" placeholder="Name" value={newStudent.name} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={newStudent.email} onChange={handleChange} required />
        <input type="text" name="phone" placeholder="Phone" value={newStudent.phone} onChange={handleChange} required />
        <input type="text" name="room_id" placeholder="Room ID (optional)" value={newStudent.room_id} onChange={handleChange} />
        <input type="datetime-local" name="check_in" value={newStudent.check_in} onChange={handleChange} />
        <button type="submit" style={{ padding: '10px', background: 'blue', color: 'white', border: 'none' }}>Add Student</button>
      </form>

      {/* Delete Student */}
      <h2>Delete Student</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px', marginTop: '20px' }}>
        <input type="number" placeholder="Enter Student ID to Delete" value={deleteStudentId} onChange={handleDeleteChange} />
        <button onClick={handleDelete} style={{ padding: '10px', background: 'red', color: 'white', border: 'none' }}>Delete Student</button>
      </div>

      {/* Add Payment Form */}
      <h2 style={{ marginTop: '40px' }}>Add Payment</h2>
      <form onSubmit={handlePaymentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px' }}>
        <input type="number" name="payment_id" placeholder="Payment ID" value={newPayment.payment_id || ''} onChange={handlePaymentChange} required />
        <input type="number" name="student_id" placeholder="Student ID" value={newPayment.student_id} onChange={handlePaymentChange} required />
        <input type="number" step="0.01" name="amount" placeholder="Amount" value={newPayment.amount} onChange={handlePaymentChange} required />
        <input type="datetime-local" name="payment_date" value={newPayment.payment_date || ''} onChange={handlePaymentChange} required />
        <select name="status" value={newPayment.status} onChange={handlePaymentChange} required>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
        <button type="submit" style={{ padding: '10px', background: 'green', color: 'white', border: 'none' }}>Add Payment</button>
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
        <input type="number" name="payment_id" placeholder="Payment ID" value={updatePayment.payment_id} onChange={handleUpdatePaymentChange} />
        <select name="status" value={updatePayment.status} onChange={handleUpdatePaymentChange}>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
        <button onClick={handlePaymentUpdate} style={{ padding: '10px', background: 'purple', color: 'white', border: 'none' }}>
          Update Payment Status
        </button>
      </div>

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

export default Form;
