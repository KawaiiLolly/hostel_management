import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Form() {
  const [newStudent, setNewStudent] = useState({
    student_id: '',
    name: '',
    email: '',
    phone: '',
    room_id: '',
    check_in: '',
  });

  const [newPayment, setNewPayment] = useState({
    payment_id: '',
    student_id: '',
    amount: '',
    payment_date: '',
    status: 'pending',
  });

  const [updatePayment, setUpdatePayment] = useState({
    payment_id: '',
    status: 'pending',
  });



  const handleChange = (e) => {
    setNewStudent(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePaymentChange = (e) => {
    setNewPayment(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdatePaymentChange = (e) => {
    setUpdatePayment(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmitAll = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        student: newStudent,
        payment: newPayment,
      };

      await axios.post('http://localhost:8081/registerStudent', payload);

      alert('✅ Student and Payment added successfully!');

      setNewStudent({ student_id: '', name: '', email: '', phone: '', room_id: '', check_in: '' });
      setNewPayment({ payment_id: '', student_id: '', amount: '', payment_date: '', status: 'pending' });

    } catch (err) {
      console.error('❌ Error submitting data:', err);
      alert('❌ Failed to submit data. Please try again.');
    }
  };

  const handlePaymentUpdate = async () => {
    try {
      await axios.put('http://localhost:8081/updatePaymentStatus', updatePayment);
      alert('✅ Payment status updated successfully!');
      setUpdatePayment({ payment_id: '', status: 'pending' });
    } catch (err) {
      console.error('❌ Error updating payment status:', err);
      alert('❌ Failed to update payment status.');
    }
  };


  const [studentId, setStudentId] = useState("");
  const [checkOut, setCheckOut] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put("http://localhost:8081/api/checkout", {
        studentId,
        checkOut,
      });
      alert("Check-out updated and room availability verified!");
    } catch (err) {
      console.error(err);
      alert("Error updating check-out");
    }
  };

  const [newRoom, setNewRoom] = useState({
    room_id: "",
    type: "",
    capacity: "",
    availability_status: "",
  });

  const handleNewRoomChange = (e) => {
    const { name, value } = e.target;
    setNewRoom((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddRoom = async () => {
    try {
      const response = await axios.post("http://localhost:8081/api/rooms", newRoom);
      alert(response.data.message);
      setNewRoom({ room_id: "", type: "", capacity: "", availability_status: "" });
    } catch (error) {
      alert("Error adding room: " + (error.response?.data?.error || error.message));
    }
  };






  return (
    <div style={{ padding: "20px", display: 'flex', flexDirection: 'column' }}>
      <h1>Add New Student <span style={{color: '#e95d2c'}}>Details</span></h1>
      <h3>Student Details</h3>
      <form onSubmit={handleSubmitAll} style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '400px' }}>

        {/* Student Section */}
        <input type="number" name="student_id" placeholder="Student ID" value={newStudent.student_id} onChange={handleChange} required />
        <input type="text" name="name" placeholder="Name" value={newStudent.name} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={newStudent.email} onChange={handleChange} required />
        <input type="text" name="phone" placeholder="Phone" value={newStudent.phone} onChange={handleChange} required />
        <input type="text" name="room_id" placeholder="Room ID (optional)" value={newStudent.room_id} onChange={handleChange} />
        <input type="datetime-local" name="check_in" value={newStudent.check_in} onChange={handleChange} />

        <h3>Payment Details</h3>
        {/* Payment Section */}
        <input type="number" name="payment_id" placeholder="Payment ID" value={newPayment.payment_id} onChange={handlePaymentChange} required />
        <input type="number" name="student_id" placeholder="Student ID for Payment" value={newPayment.student_id} onChange={handlePaymentChange} required />
        <input type="number" step="0.01" name="amount" placeholder="Amount" value={newPayment.amount} onChange={handlePaymentChange} required />
        <input type="datetime-local" name="payment_date" value={newPayment.payment_date} onChange={handlePaymentChange} required />
        <select name="status" value={newPayment.status} onChange={handlePaymentChange} required>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>

        {/* Submit Button */}
        <button className='button' type="submit" style={{ padding: '15px', background: 'purple', color: 'white', border: 'none', marginTop: '20px' }}>
          Submit All
        </button>
      </form>
      <hr />

      <h1>Updates <span style={{color: '#e95d2c'}}>Form</span></h1>

      {/* Update Payment Status Section */}
      <h3 style={{ marginTop: '40px' }}>Update Payment Status</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px' }}>
        <input type="number" name="payment_id" placeholder="Payment ID" value={updatePayment.payment_id} onChange={handleUpdatePaymentChange} />
        <select name="status" value={updatePayment.status} onChange={handleUpdatePaymentChange}>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
        <button className='button' onClick={handlePaymentUpdate} style={{ padding: '10px', background: 'blue', color: 'white', border: 'none' }}>
          Update Payment Status
        </button>
      </div>

      {/* Update Check-Out Section */}
      <h3 style={{ marginTop: '40px' }}>Update Check-Out</h3>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px' }}>
        <input
          type="number"
          name="student_id"
          placeholder="Student ID"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          required
        />
        <input
          type="datetime-local"
          name="check_out"
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
          required
        />
        <button className='button'  type="submit" style={{ padding: '10px', background: 'blue', color: 'white', border: 'none' }}>
          Update Check-Out
        </button>
      </form>

      <hr />
      <h1 style={{ marginTop: '40px' }}>Add New <span style={{color: '#e95d2c'}}>Room</span></h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px' }}>
        <input
          type="number"
          name="room_id"
          placeholder="Room ID"
          value={newRoom.room_id}
          onChange={handleNewRoomChange}
        />
        <input
          type="text"
          name="type"
          placeholder="Room Type"
          value={newRoom.type}
          onChange={handleNewRoomChange}
        />
        <input
          type="number"
          name="capacity"
          placeholder="Capacity"
          value={newRoom.capacity}
          onChange={handleNewRoomChange}
        />
        <select
          name="availability_status"
          value={newRoom.availability_status}
          onChange={handleNewRoomChange}
        >
          <option value="">Select Availability</option>
          <option value="available">Available</option>
          <option value="occupied">Occupied</option>
        </select>
        <button className='button' 
          onClick={handleAddRoom}
          style={{ padding: '10px', background: 'green', color: 'white', border: 'none' }}
        >
          Add Room
        </button>
      </div>

      <hr />
    </div>
  );
}

export default Form;
