import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Payments() {
  const [payments, setPayments] = useState([]);

  const fetchPayments = async () => {
    try {
      const res = await axios.get('http://localhost:8081/payments');
      setPayments(res.data);
    } catch (err) {
      console.error('❌ Error fetching payments:', err);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // DELETE PAYMENT
  const [paymentId, setPaymentId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleDelete = async () => {
    if (!paymentId) {
      setError("Please enter a Payment ID.");
      return;
    }
  
    try {
      const res = await axios.delete(`http://localhost:8081/api/payments/${paymentId}`);
      setMessage(res.data.message);
      setError("");
      setPaymentId("");
      setTimeout(() => {
        window.location.reload(); // ✅ Refresh the entire page
      }, 1000); // Optional: short delay for user to see success message
    } catch (err) {
      setError(err.response?.data?.message || "Error deleting payment");
      setMessage("");
    }
  };
  
  return (
    <div style={{ padding: "10px" }}>
      <h1>Payments <span style={{color: '#e95d2c'}}>Records</span></h1>
      <table border="1" cellPadding="10" cellSpacing="0" className='table table-hover table-shadow'>
        <thead className='table-dark'>
          <tr>
            <th>Payment ID</th>
            <th>Student ID</th>
            <th>Amount</th>
            <th>Payment Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment, i) => (
            <tr key={i}>
              <td>{payment.payment_id}</td>
              <td>{payment.student_id}</td>
              <td>{payment.amount}</td>
              <td>{new Date(payment.payment_date).toLocaleString()}</td>
              <td style={{ color: payment.status === 'completed' ? 'green' : 'red' }}>
                {payment.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr />

      <div style={{ padding: '10px', maxWidth: '400px' }}>
        <h3>Delete Payment by ID</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input
            type="number"
            placeholder="Enter Payment ID"
            value={paymentId}
            onChange={(e) => setPaymentId(e.target.value)}
            style={{ padding: "10px" }}
          />
          <button className='button'
            onClick={handleDelete}
            style={{ padding: '10px', background: 'red', color: 'white', border: 'none' }}
          >
            Delete Payment
          </button>
          {message && <p style={{ color: "green" }}>{message}</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      </div>
    </div>
  );
}

export default Payments;
