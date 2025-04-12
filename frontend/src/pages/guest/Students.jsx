import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Students() {
  const [data, setData] = useState([]);

  // Student Search
  const [searchId, setSearchId] = useState("");
  // Delete Student
  const [studentId, setStudentId] = useState("");

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

  return (
    <div style={{ padding: "10px" }}>
      <h1>Students <span style={{ color: '#e95d2c' }}>List</span></h1>
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
    </div>

  );
}

export default Students;
