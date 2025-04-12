import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Rooms() {

  // Room States
  const [rooms, setRooms] = useState([]);


  // Search in rooms
  const [searchRoomId, setSearchRoomId] = useState("");
  const [roomStudents, setRoomStudents] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRoomSearch = async () => {
    if (!searchRoomId) return;
    setLoading(true);

    try {
      const res = await axios.get(`http://localhost:8081/api/room/${searchRoomId}/students`);
      setRoomStudents(res.data.students);
      setMessage(res.data.message || "");
    } catch (err) {
      console.error(err);
      alert("Error fetching students.");
    }

    setLoading(false);
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


  // DELETE ROOM

  const [deleteRoomId, setDeleteRoomId] = useState("");

  const handleDeleteRoom = async () => {
    if (!deleteRoomId) {
      alert("Please enter a Room ID to delete.");
      return;
    }

    try {
      const response = await axios.delete(`http://localhost:8081/api/rooms/${deleteRoomId}`);
      alert(response.data.message);
      setDeleteRoomId("");
      fetchRooms(); // Refresh the room list
    } catch (error) {
      alert("Delete failed: " + (error.response?.data?.error || error.message));
    }
  };


  return (
    <div style={{ padding: "10px" }}>


      <h1>Room <span style={{color: '#e95d2c'}}>List</span></h1>
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

      <hr />

      <h3 style={{ marginTop: "40px" }}>Find Students in a Room</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "400px" }}>
        <input
          type="number"
          placeholder="Enter Room ID"
          value={searchRoomId}
          onChange={(e) => setSearchRoomId(e.target.value)}
        />
        <button className='button' 
          onClick={handleRoomSearch}
          style={{
            padding: "10px",
            background: "teal",
            color: "white",
            border: "none",
          }}
        >
          Search
        </button>
      </div>

      {/* Results */}
      {loading ? (
        <p>Loading...</p>
      ) : roomStudents.length > 0 ? (
        <div style={{ marginTop: "20px" }}>
          <h3>Students in Room {searchRoomId}</h3>
          <ul>
            {roomStudents.map((student) => (
              <li key={student.student_id}>
                ID: {student.student_id} | Name: {student.name}
              </li>
            ))}
          </ul>
        </div>
      ) : message ? (
        <p style={{ color: "gray", marginTop: "10px" }}>{message}</p>
      ) : null}

      <hr />

      <h3 style={{ marginTop: '40px' }}>Delete Room</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px' }}>
        <input
          type="number"
          name="delete_room_id"
          placeholder="Room ID"
          value={deleteRoomId}
          onChange={(e) => setDeleteRoomId(e.target.value)}
        />
        <button className='button' 
          onClick={handleDeleteRoom}
          style={{ padding: '10px', background: 'red', color: 'white', border: 'none' }}
        >
          Delete Room
        </button>
      </div>



    </div>
  );
}

export default Rooms