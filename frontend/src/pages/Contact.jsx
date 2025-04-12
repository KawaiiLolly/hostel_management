import React from 'react';

function Contact() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Contact <span style={{color: '#e95d2c'}}>Page</span></h1>
      <hr />
      <p><strong>Name:</strong> Narayan Hansdah</p>
      <p><strong>Roll No:</strong> 23CS8137</p>
      <p><strong>Registration No:</strong> 23U10609</p>
      <p>
        <strong>Work Email:</strong>{' '}
        <a href="mailto:nh.23cs8137@nitdgp.ac.in" className='email-link'>
          nh.23cs8137@nitdgp.ac.in
        </a>
      </p>
    </div>
  );
}

export default Contact;
