import React, { useEffect, useState } from 'react';

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
    <div style={{ padding: "10px" }} className='home'>
      <h1>WELCOME TO HOSTEL MANAGEMENT <span style={{color: '#e95d2c'}}>SYSTEM</span></h1>
      <div style={{ marginTop: "20px", fontSize: "18px" }}>
        <p><strong>Total Rooms:</strong> {counts.total_rooms}</p>
        <p><strong>Available Rooms:</strong> {counts.available_rooms}</p>
        <p><strong>Total Students:</strong> {counts.total_students}</p>
        <p><strong>Pending Payments:</strong> {counts.pending_payments}</p>
      </div>
    </div>
  );
}

export default Home;
