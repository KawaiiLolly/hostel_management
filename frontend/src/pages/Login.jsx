import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './LoginSign.css';

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8081/login', {
                username,
                password,
            });

            const { role } = response.data;
            if (role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/guest');
            }
        } catch (error) {
            alert(error.response?.data?.error || 'Login failed');
        }
    };

    return (
        <div style={styles.pageWrapper}>
            <div style={styles.container}>
                <h2 style={styles.heading}>Log In</h2>
                <form onSubmit={handleLogin}>
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
                    <button type="submit" style={styles.button}>Log In</button>
                </form>

                <p style={styles.text}>
                    Don't have an account? <Link to="/signup" style={styles.link}>Sign up</Link>
                </p>
            </div>
        </div>
    );
}

const styles = {
    pageWrapper: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
    },
    container: {
        maxWidth: '400px',
        width: '100%',
        padding: '20px',
        textAlign: 'center',
        boxShadow: 'rgba(0, 0, 0, 0.9) 0 20px 20px 2px',
        borderRadius: '8px',
        backgroundColor: 'white',
    },
    heading: {
        marginBottom: '20px',
        color: '#1f222b'
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

export default LoginPage;
