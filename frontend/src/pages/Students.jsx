import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Students() {
  const [data, setData] = useState([]);

  // Student Search
  const [searchId, setSearchId] = useState("");
  const [studentData, setStudentData] = useState(null);
  const [searchError, setSearchError] = useState("");

  // Delete Student
  const [studentId, setStudentId] = useState("");
  const [deleteMessage, setDeleteMessage] = useState("");
  const [deleteError, setDeleteError] = useState("");

  // Fetch all students
  const fetchStudents = () => {
    fetch('http://localhost:8081/students')
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleSearch = async () => {
    try {
      const res = await axios.get(`http://localhost:8081/api/student/${searchId}`);
      setStudentData(res.data);
      setSearchError("");
    } catch (err) {
      setStudentData(null);
      setSearchError(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleDelete = async () => {
    if (!studentId) {
      setDeleteError("Please enter a Student ID.");
      return;
    }
  
    try {
      const res = await axios.delete(`http://localhost:8081/api/students/${studentId}`);
      setDeleteMessage(res.data.message);
      setDeleteError("");
      setStudentId("");
  
      // Refresh student list after short delay (for UX)
      setTimeout(() => {
        fetchStudents(); // refresh data
      }, 300);
    } catch (err) {
      setDeleteError(err.response?.data?.message || "Something went wrong");
      setDeleteMessage("");
    }
  };
  

  return (
    <div style={{ padding: "10px" }}>
      <h1>Students <span style={{color: '#e95d2c'}}>List</span></h1>
      <table border="1" cellPadding="10" cellSpacing="0" className='table table-hover table-shadow'>
        <thead className='table-dark'>
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

      <hr />

      {/* Search Section */}
      
        <h2>Search Student by ID</h2>
        <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
          <input
            type="number"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="Enter Student ID"
            style={{ padding: "10px", flex: 1 }}
          />
          <button className='button' 
            onClick={handleSearch}
            style={{ padding: "10px 20px", background: "teal", color: "white", border: "none" }}
          >
            Search
          </button>
        </div>

        {searchError && <p style={{ color: "red", marginTop: "10px" }}>{searchError}</p>}

        {studentData && (
          <div style={{ marginTop: "20px", border: "1px solid #ccc", padding: "15px", background: '#363435' }}>
            <h3>Student <span style={{color: '#e95d2c'}}>Info</span></h3>
            <p><strong>ID:</strong> {studentData.student_id}</p>
            <p><strong>Name:</strong> {studentData.name}</p>
            <p><strong>Email:</strong> {studentData.email}</p>
            <p><strong>Phone:</strong> {studentData.phone}</p>
            <p><strong>Check-in:</strong> {studentData.check_in}</p>
            <p><strong>Check-out:</strong> {studentData.check_out || "N/A"}</p>

            <h4>Room <span style={{color: '#e95d2c'}}>Info</span></h4>
            <p>{studentData.room_info || "NOT ASSIGNED/CHECKED_OUT"}</p>

            <h4>Payment <span style={{color: '#e95d2c'}}>Info</span></h4>
            {studentData.payment_id ? (
              <>
                <p><strong>Payment ID:</strong> {studentData.payment_id}</p>
                <p><strong>Amount:</strong> ₹{studentData.amount}</p>
                <p><strong>Status:</strong> {studentData.status}</p>
                <p><strong>Date:</strong> {studentData.payment_date}</p>
              </>
            ) : (
              <p>No Payment Record Found</p>
            )}
          </div>
        )}
      

      <hr />

      {/* Delete Section */}
     
        <h2>Delete Student by ID</h2>
        <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
          <input
            type="number"
            placeholder="Enter Student ID"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            style={{ padding: "10px", flex: 1 }}
          />
          <button className='button' 
            onClick={handleDelete}
            style={{ padding: "10px 20px", background: "red", color: "white", border: "none" }}
          >
            Delete
          </button>
        </div>

        {deleteMessage && <p style={{ color: "green" }}>{deleteMessage}</p>}
        {deleteError && <p style={{ color: "red" }}>{deleteError}</p>}
      </div>
    
  );
}

export default Students;
