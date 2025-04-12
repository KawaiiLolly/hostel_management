import React from 'react';

function About() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>About <span style={{color: '#e95d2c'}}>Page</span></h1>
      <hr />
      <p style={{ fontSize: "16px", lineHeight: "1.6", marginTop: "10px" }}>
        This is a <strong>Hostel Management System Project</strong> designed to simplify the process of managing students, payments, and room allocations within a hostel. The system provides full <strong>CRUD functionality</strong> (Create, Read, Update, Delete) for:
        <ul>
          <li><strong>Students</strong> – add, view, update, or remove student records.</li>
          <li><strong>Payments</strong> – track payment status, amounts, and manage records efficiently.</li>
          <li><strong>Rooms</strong> – monitor room types, capacity, and current <strong>availability status</strong>.</li>
        </ul>
        The system helps ensure room assignments are accurately tracked and automatically updates availability when students check-in or check-out. It's built with a React frontend and Node.js + MySQL backend for seamless data handling and user-friendly interaction.
      </p>
    </div>
  );
}

export default About;
