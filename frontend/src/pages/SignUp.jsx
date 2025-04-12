import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './LoginSign.css'

function SignUpPage() {
  const [user_id, setUserId] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(''); 
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8081/signup', {
        user_id,
        username,
        password,
        role,
      });
      alert('Account created successfully! Please login.');
      navigate('/login');
    } catch (error) {
      alert(error.response?.data?.error || 'Signup failed');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Sign Up</h2>
      <form onSubmit={handleSignup}>
        <input 
          type="text" 
          placeholder="User ID" 
          value={user_id}
          onChange={(e) => setUserId(e.target.value)}
          required
          style={styles.input}
        />
        <input 
          type="text" 
          placeholder="Username" 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={styles.input}
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />
        <input 
          type="text" 
          placeholder="Role (admin/guest)" 
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Sign Up</button>
      </form>

      <p style={styles.text}>
        Already have an account? <Link to="/login" style={styles.link}>Login</Link>
      </p>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '400px',
    margin: '100px auto',
    padding: '20px',
    textAlign: 'center',
    boxShadow: 'rgba(0, 0, 0, 0.9) 0 20px 20px 2px',
    borderRadius: '8px',
    backgroundColor: 'white',
    color: '#1f222b'
  },
  heading: {
    marginBottom: '20px'
  },
  input: {
    display: 'block',
    marginBottom: '15px',
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ccc'
  },
  button: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  text: {
    marginTop: '15px',
    fontSize: '14px',
    color: '#1f222b'
  },
  link: {
    color: '#007bff',
    textDecoration: 'none',
    fontWeight: 'bold'
  }
};

export default SignUpPage;
