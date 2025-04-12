import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Rooms() {

  // Room States
  const [rooms, setRooms] = useState([]);

  // Fetch
  const fetchRooms = async () => {
    try {
      const response = await fetch('http://localhost:8081/rooms');
      const data = await response.json();
      setRooms(data);
    } catch (err) {
      console.error('Error fetching rooms:', err);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);


  return (
    <div style={{ padding: "10px" }}>
      <h1>Room <span style={{ color: '#e95d2c' }}>List</span></h1>
      <table border="1" cellPadding="10" cellSpacing="0" className='table table-hover table-shadow'>
        <thead className='table-dark'>
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

export default Rooms