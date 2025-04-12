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
 
  return (
    <div style={{ padding: "10px" }}>
      <h1>Payments <span style={{ color: '#e95d2c' }}>Records</span></h1>
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
    </div>
  );
}

export default Payments;
