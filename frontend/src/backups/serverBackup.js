// Import required packages
const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON bodies

// MySQL Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'l011yp0p',
    database: 'hostel_management',
});

// Connect to database
db.connect((err) => {
    if (err) {
        console.error('❌ Error connecting to database:', err);
        return;
    }
    console.log('✅ Connected to MySQL database!');
});

// ROUTES

// Test route
app.get('/', (req, res) => {
    res.json({ message: "From backend side" });
});

// Get all students
app.get('/students', (req, res) => {
    const sql = 'SELECT * FROM students';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('❌ Error fetching students:', err);
            return res.status(500).json({ error: 'Database error while fetching students' });
        }
        res.json(results);
    });
});

// Get total students count
app.get('/students/count', (req, res) => {
    const sql = 'SELECT COUNT(*) AS total_students FROM students';
    db.query(sql, (err, result) => {
        if (err) {
            console.error('❌ Error fetching student count:', err);
            return res.status(500).json({ error: 'Database error while fetching student count' });
        }
        res.json(result[0]); // result[0] because single row
    });
});

app.post('/students', (req, res) => {
    const { student_id, name, email, phone, room_id, check_in} = req.body;

    const sql = "INSERT INTO students (student_id, name, email, phone, room_id, check_in) VALUES (?, ?, ?, ?, ?, ?, ?)";
    const values = [student_id, name, email, phone, room_id, check_in];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error inserting student:', err);
            return res.status(500).json({ error: err.sqlMessage }); // 👈 return actual SQL error message
        }
        res.json({ message: 'Student added successfully!' });
    });
        
});


app.delete('/students/:student_id', (req, res) => {
    const studentId = req.params.student_id;
    const sql = 'DELETE FROM students WHERE student_id = ?';
    db.query(sql, [studentId], (err, result) => {
      if (err) {
        return res.status(500).send({ error: err });
      }
      if (result.affectedRows === 0) {
        return res.status(404).send({ message: 'Student not found' });
      }
      res.send({ message: 'Student deleted successfully' });
    });
  });

// Get all rooms
app.get('/rooms', (req, res) => {
    const sql = 'SELECT * FROM rooms';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('❌ Error fetching rooms:', err);
            return res.status(500).json({ error: 'Database error while fetching rooms' });
        }
        res.json(results);
    });
});

// Get total rooms and available rooms
app.get('/rooms/counts', (req, res) => {
    const sql = `
      SELECT 
        COUNT(*) AS total_rooms,
        SUM(CASE WHEN availability_status = 'available' THEN 1 ELSE 0 END) AS available_rooms
      FROM rooms;
    `;
    db.query(sql, (err, result) => {
        if (err) {
            console.error('❌ Error fetching room counts:', err);
            return res.status(500).json({ error: 'Database error while fetching room counts' });
        }
        res.json(result[0]); // result[0] because it's a single row
    });
});


// Add a new room
app.post('/rooms', (req, res) => {
    const { room_id, type, capacity, availability_status } = req.body;

    // Validate incoming data
    if (!room_id || !type || !capacity || !availability_status) {
        return res.status(400).json({ error: 'Missing required fields: room_id, type, capacity, or availability_status' });
    }

    const sql = 'INSERT INTO rooms (room_id, type, capacity, availability_status) VALUES (?, ?, ?, ?)';
    const values = [room_id, type, capacity, availability_status];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('❌ Error adding room:', err);
            return res.status(500).json({ error: 'Database error while adding room' });
        }
        res.json({ message: '✅ Room added successfully!', room_id });
    });
});

app.put('/rooms/:room_id', (req, res) => {
    const roomId = req.params.room_id;
    const { availability_status } = req.body;

    if (!availability_status) {
        return res.status(400).json({ error: 'Availability status is required to update room' });
    }

    const sql = 'UPDATE rooms SET availability_status = ? WHERE room_id = ?';
    db.query(sql, [availability_status, roomId], (err, result) => {
        if (err) {
            console.error('❌ Error updating room availability:', err);
            return res.status(500).json({ error: 'Database error while updating room availability' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Room not found' });
        }
        res.json({ message: '✅ Room availability updated successfully!' });
    });
});




// Get all payments
app.get('/payments', (req, res) => {
    const sql = 'SELECT * FROM payments ORDER BY payment_date DESC'; // Newest first
    db.query(sql, (err, results) => {
        if (err) {
            console.error('❌ Error fetching payments:', err);
            return res.status(500).json({ error: 'Database error while fetching payments' });
        }
        res.json(results);
    });
});

// Get pending payments count
app.get('/payments/pending/count', (req, res) => {
    const sql = "SELECT COUNT(*) AS pending_payments FROM payments WHERE status = 'pending'";
    db.query(sql, (err, result) => {
        if (err) {
            console.error('❌ Error fetching pending payments count:', err);
            return res.status(500).json({ error: 'Database error while fetching pending payments count' });
        }
        res.json(result[0]); // result[0] because single row
    });
});



// Add a new payment
app.post('/payments', (req, res) => {
    const { payment_id, student_id, amount, payment_date, status } = req.body;

    // Validate incoming data
    if (!student_id || !amount || !status) {
        return res.status(400).json({ error: 'Missing required fields: student_id, amount, or status' });
    }

    const sql = 'INSERT INTO payments (payment_id, student_id, amount, payment_date, status) VALUES (?, ?, ?, ?, ?)';
    const values = [payment_id, student_id, amount, payment_date, status];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('❌ Error adding payment:', err);
            return res.status(500).json({ error: 'Database error while adding payment' });
        }
        res.json({ message: '✅ Payment added successfully!', payment_id: result.insertId });
    });
});

// Update payment status
app.put('/payments/:payment_id', (req, res) => {
    const paymentId = req.params.payment_id;
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({ error: 'Status is required to update payment' });
    }

    const sql = 'UPDATE payments SET status = ? WHERE payment_id = ?';
    db.query(sql, [status, paymentId], (err, result) => {
        if (err) {
            console.error('❌ Error updating payment status:', err);
            return res.status(500).json({ error: 'Database error while updating payment status' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        res.json({ message: '✅ Payment status updated successfully!' });
    });
});

// Student + Payment Registration
app.post('/registerStudent', (req, res) => {
    const { student, payment } = req.body;
  
    const { student_id, name, email, phone, room_id, check_in } = student;
    const { payment_id, amount, payment_date, status } = payment;
  
    // 1. Check if room exists and is available
    const roomCheckQuery = 'SELECT capacity, availability_status FROM rooms WHERE room_id = ?';
    db.query(roomCheckQuery, [room_id], (err, roomResults) => {
      if (err) return res.status(500).json({ message: 'Database error on room check' });
      if (roomResults.length === 0) return res.status(404).json({ message: 'Room not found' });
  
      const room = roomResults[0];
      if (room.availability_status !== 'available') {
        return res.status(400).json({ message: 'Room is not available' });
      }
  
      // 2. Count current students in that room
      const countQuery = 'SELECT COUNT(*) AS student_count FROM students WHERE room_id = ?';
      db.query(countQuery, [room_id], (err, countResults) => {
        if (err) return res.status(500).json({ message: 'Error counting room occupancy' });
  
        const currentCount = countResults[0].student_count;
        if (currentCount >= room.capacity) {
          return res.status(400).json({ message: 'Room is full' });
        }
  
        // 3. Insert student
        const insertStudentQuery = `
          INSERT INTO students (student_id, name, email, phone, room_id, check_in)
          VALUES (?, ?, ?, ?, ?, ?)
        `;
        db.query(insertStudentQuery, [student_id, name, email, phone, room_id, check_in], (err) => {
          if (err) return res.status(500).json({ message: 'Error inserting student' });
  
          // 4. Insert payment
          const insertPaymentQuery = `
            INSERT INTO payments (payment_id, student_id, amount, payment_date, status)
            VALUES (?, ?, ?, ?, ?)
          `;
          db.query(insertPaymentQuery, [payment_id, student_id, amount, payment_date, status], (err) => {
            if (err) return res.status(500).json({ message: 'Error inserting payment' });
  
            // 5. Update room status if needed
            const newCount = currentCount + 1;
            if (newCount >= room.capacity) {
              const updateRoomQuery = 'UPDATE rooms SET availability_status = "occupied" WHERE room_id = ?';
              db.query(updateRoomQuery, [room_id], (err) => {
                if (err) console.error('Room status update failed:', err); // not fatal
              });
            }
  
            res.status(200).json({ message: 'Student and payment registered successfully' });
          });
        });
      });
    });
  });

// Start the server
const PORT = 8081;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
