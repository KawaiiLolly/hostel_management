// SERVER CODE ------------------------------------------------------------------

// Import required packages
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
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
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to MySQL database!');
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
            console.error('Error fetching students:', err);
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
            console.error('Error fetching student count:', err);
            return res.status(500).json({ error: 'Database error while fetching student count' });
        }
        res.json(result[0]); // result[0] because single row
    });
});

// Insert students
app.post('/students', (req, res) => {
    const { student_id, name, email, phone, room_id, check_in } = req.body;

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

// Delete Students
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
            console.error('Error fetching rooms:', err);
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
            console.error('Error fetching room counts:', err);
            return res.status(500).json({ error: 'Database error while fetching room counts' });
        }
        res.json(result[0]); 
    });
});


// Add a new room
app.post('/rooms', (req, res) => {
    const { room_id, type, capacity, availability_status } = req.body;

    // check incoming data
    if (!room_id || !type || !capacity || !availability_status) {
        return res.status(400).json({ error: 'Missing required fields: room_id, type, capacity, or availability_status' });
    }

    const sql = 'INSERT INTO rooms (room_id, type, capacity, availability_status) VALUES (?, ?, ?, ?)';
    const values = [room_id, type, capacity, availability_status];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error adding room:', err);
            return res.status(500).json({ error: 'Database error while adding room' });
        }
        res.json({ message: 'Room added successfully!', room_id });
    });
});


// Updating room
app.put('/rooms/:room_id', (req, res) => {
    const roomId = req.params.room_id;
    const { availability_status } = req.body;

    if (!availability_status) {
        return res.status(400).json({ error: 'Availability status is required to update room' });
    }

    const sql = 'UPDATE rooms SET availability_status = ? WHERE room_id = ?';
    db.query(sql, [availability_status, roomId], (err, result) => {
        if (err) {
            console.error('Error updating room availability:', err);
            return res.status(500).json({ error: 'Database error while updating room availability' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Room not found' });
        }
        res.json({ message: 'Room availability updated successfully!' });
    });
});


// Get all payments
app.get('/payments', (req, res) => {
    const sql = 'SELECT * FROM payments ORDER BY payment_date DESC'; 
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching payments:', err);
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
            console.error('Error fetching pending payments count:', err);
            return res.status(500).json({ error: 'Database error while fetching pending payments count' });
        }
        res.json(result[0]); 
    });
});

// Add a new payment
app.post('/payments', (req, res) => {
    const { payment_id, student_id, amount, payment_date, status } = req.body;

    // Checking incoming data
    if (!student_id || !amount || !status) {
        return res.status(400).json({ error: 'Missing required fields: student_id, amount, or status' });
    }

    const sql = 'INSERT INTO payments (payment_id, student_id, amount, payment_date, status) VALUES (?, ?, ?, ?, ?)';
    const values = [payment_id, student_id, amount, payment_date, status];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error adding payment:', err);
            return res.status(500).json({ error: 'Database error while adding payment' });
        }
        res.json({ message: 'Payment added successfully!', payment_id: result.insertId });
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
            console.error('Error updating payment status:', err);
            return res.status(500).json({ error: 'Database error while updating payment status' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        res.json({ message: 'Payment status updated successfully!' });
    });
});

// Student + Payment Registration
app.post('/registerStudent', (req, res) => {
    const { student, payment } = req.body;

    const { student_id, name, email, phone, room_id, check_in } = student;
    const { payment_id, amount, payment_date, status } = payment;

    // Check if room exists and is available
    const roomCheckQuery = 'SELECT capacity, availability_status FROM rooms WHERE room_id = ?';
    db.query(roomCheckQuery, [room_id], (err, roomResults) => {
        if (err) return res.status(500).json({ message: 'Database error on room check' });
        if (roomResults.length === 0) return res.status(404).json({ message: 'Room not found' });

        const room = roomResults[0];
        if (room.availability_status !== 'available') {
            return res.status(400).json({ message: 'Room is not available' });
        }

        // Count current students in that room
        const countQuery = 'SELECT COUNT(*) AS student_count FROM students WHERE room_id = ?';
        db.query(countQuery, [room_id], (err, countResults) => {
            if (err) return res.status(500).json({ message: 'Error counting room occupancy' });

            const currentCount = countResults[0].student_count;
            if (currentCount >= room.capacity) {
                return res.status(400).json({ message: 'Room is full' });
            }

            // Insert student
            const insertStudentQuery = `
          INSERT INTO students (student_id, name, email, phone, room_id, check_in)
          VALUES (?, ?, ?, ?, ?, ?)
        `;
            db.query(insertStudentQuery, [student_id, name, email, phone, room_id, check_in], (err) => {
                if (err) return res.status(500).json({ message: 'Error inserting student' });

                // Insert payment
                const insertPaymentQuery = `
            INSERT INTO payments (payment_id, student_id, amount, payment_date, status)
            VALUES (?, ?, ?, ?, ?)
          `;
                db.query(insertPaymentQuery, [payment_id, student_id, amount, payment_date, status], (err) => {
                    if (err) return res.status(500).json({ message: 'Error inserting payment' });

                    // Update room status if needed
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

// Update payment status
app.put('/updatePaymentStatus', (req, res) => {
    const { payment_id, status } = req.body;
    const query = 'UPDATE payments SET status = ? WHERE payment_id = ?';
    db.query(query, [status, payment_id], (err, result) => {
        if (err) return res.status(500).json({ message: 'Error updating payment status' });
        res.status(200).json({ message: 'Payment status updated' });
    });
});

// Update Check out
app.put("/api/checkout", (req, res) => {
    const { studentId, checkOut } = req.body;

    // Get the student's current room_id BEFORE removing it
    const getRoomQuery = `SELECT room_id FROM students WHERE student_id = ?`;
    db.query(getRoomQuery, [studentId], (err, roomResult) => {
        if (err) return res.status(500).json({ error: err.message });
        if (roomResult.length === 0) return res.status(404).json({ error: "Student not found" });

        const roomId = roomResult[0].room_id;
        if (!roomId) return res.status(400).json({ error: "No room assigned" });

        // Update student's check_out and set room_id to NULL
        const updateCheckOutQuery = `
        UPDATE students
        SET check_out = ?, room_id = NULL
        WHERE student_id = ?
      `;
        db.query(updateCheckOutQuery, [checkOut, studentId], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });

            // Count active students in that room (those not checked out)
            const countQuery = `
          SELECT COUNT(*) AS activeCount
          FROM students
          WHERE room_id = ? AND check_out IS NULL
        `;

            db.query(countQuery, [roomId], (err, countResult) => {
                if (err) return res.status(500).json({ error: err.message });

                const activeCount = countResult[0].activeCount;

                // Get capacity of the room
                const capacityQuery = `SELECT capacity FROM rooms WHERE room_id = ?`;
                db.query(capacityQuery, [roomId], (err, capacityResult) => {
                    if (err) return res.status(500).json({ error: err.message });

                    const capacity = capacityResult[0].capacity;
                    const newStatus = activeCount >= capacity ? "occupied" : "available";

                    // Update room availability status
                    const updateRoomQuery = `
              UPDATE rooms
              SET availability_status = ?
              WHERE room_id = ?
            `;

                    db.query(updateRoomQuery, [newStatus, roomId], (err) => {
                        if (err) return res.status(500).json({ error: err.message });
                        res.json({ message: "Check-out and room status updated!" });
                    });
                });
            });
        });
    });
});


app.post("/api/rooms", (req, res) => {
    const { room_id, type, capacity, availability_status } = req.body;

    if (!room_id || !type || !capacity || !availability_status) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const insertQuery = `
      INSERT INTO rooms (room_id, type, capacity, availability_status)
      VALUES (?, ?, ?, ?)
    `;

    db.query(insertQuery, [room_id, type, capacity, availability_status], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ error: "Room ID already exists" });
            }
            return res.status(500).json({ error: err.message });
        }

        res.status(201).json({ message: "Room added successfully!" });
    });
});

// DELETE room by room_id

app.delete('/api/rooms/:roomId', (req, res) => {
    const roomId = req.params.roomId;

    // Check if any student is still occupying the room
    const checkQuery = "SELECT * FROM students WHERE room_id = ? AND check_out IS NULL";

    db.query(checkQuery, [roomId], (err, result) => {
        if (err) return res.status(500).json({ error: "Database error during check." });

        if (result.length > 0) {
            return res.status(400).json({ error: "Cannot delete room: It is currently assigned to one or more students." });
        }

        // Safe to delete
        const deleteQuery = "DELETE FROM rooms WHERE room_id = ?";

        db.query(deleteQuery, [roomId], (err2, result2) => {
            if (err2) return res.status(500).json({ error: "Database error during deletion." });

            if (result2.affectedRows === 0) {
                return res.status(404).json({ error: "Room not found." });
            }

            return res.json({ message: "Room deleted successfully." });
        });
    });
});

// Search in Rooms
app.get("/api/room/:roomId/students", (req, res) => {
    const roomId = req.params.roomId;

    const query = `
      SELECT student_id, name 
      FROM students 
      WHERE room_id = ? AND check_out IS NULL
    `;

    db.query(query, [roomId], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        if (result.length === 0) {
            return res.json({ students: [], message: "No student has occupied this room." });
        }

        res.json({ students: result });
    });
});


// Full student details
app.get("/api/student/:id", (req, res) => {
    const studentId = req.params.id;

    const studentQuery = `
      SELECT s.student_id, s.name, s.email, s.phone, s.room_id, s.check_in, s.check_out,
             p.payment_id, p.amount, p.payment_date, p.status,
             r.type AS room_type, r.capacity, r.availability_status
      FROM students s
      LEFT JOIN payments p ON s.student_id = p.student_id
      LEFT JOIN rooms r ON s.room_id = r.room_id
      WHERE s.student_id = ?
    `;

    db.query(studentQuery, [studentId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: "Student not found" });

        const student = results[0];

        // If no room_id, override room info with message
        if (!student.room_id) {
            student.room_info = "NOT ASSIGNED/CHECKED_OUT";
        } else {
            student.room_info = `Type: ${student.room_type}, Capacity: ${student.capacity}, Status: ${student.availability_status}`;
        }

        res.json(student);
    });
});

// Delete Student

app.delete("/api/students/:student_id", (req, res) => {
    const studentId = req.params.student_id;

    const deleteQuery = "DELETE FROM students WHERE student_id = ?";
    db.query(deleteQuery, [studentId], (err, result) => {
        if (err) return res.status(500).json({ message: "Database error", error: err.message });

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.json({ message: "Student deleted successfully" });
    });
});

// Delete Payment
app.delete('/api/payments/:payment_id', (req, res) => {
    const paymentId = req.params.payment_id;

    const query = "DELETE FROM payments WHERE payment_id = ?";
    db.query(query, [paymentId], (err, result) => {
        if (err) {
            console.error("Error deleting payment:", err);
            return res.status(500).json({ message: "Server error while deleting payment" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Payment not found" });
        }

        res.json({ message: "Payment deleted successfully" });
    });
});

// Login route
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.query('SELECT * FROM admins WHERE username = ?', [username], async (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });

        if (results.length === 0) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        const token = jwt.sign({ user_id: user.user_id, role: user.role }, 'your_secret_key', { expiresIn: '1h' });

        res.json({ message: 'Login successful', role: user.role, token });
    });
});

// SignUp Route
app.post('/signup', async (req, res) => {
    const { user_id, username, password, role } = req.body;

    db.query('SELECT * FROM admins WHERE username = ?', [username], async (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });

        if (results.length > 0) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        try {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            db.query('INSERT INTO admins (user_id, username, password_hash, role) VALUES (?, ?, ?, ?)',
                [user_id, username, hashedPassword, role || 'guest'],
                (err, result) => {
                    if (err) return res.status(500).json({ error: 'Failed to create user' });

                    res.json({ message: 'User created successfully' });
                }
            );
        } catch (error) {
            res.status(500).json({ error: 'Error while creating user' });
        }
    });
});

// Start the server
const PORT = 8081;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});