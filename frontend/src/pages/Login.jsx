import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const Login = () => {
    const [role, setRole] = useState('warden');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify({ role, email, password })
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Login failed');
            }

            const data = await res.json();
            const { token, role: userRole, student_id } = data;
            
            localStorage.setItem('token', token);
            localStorage.setItem('role', userRole);
            if (student_id) {
                localStorage.setItem('student_id', student_id);
            }
            

            // Redirect based on role
            if (role === "warden") {
                navigate('/warden-dashboard');
            } else if (role === 'prefect') {
                navigate('/prefect-dashboard');
            } else if (role === 'wing representatives') {
                navigate('/wing-representative-dashboard');
            } else {
                navigate('/');
            }

        } catch (err) {
            console.error('Login error:', err.message);
            alert(err.message); 
        }
    }

    return (
        <div className="auth-container">
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="warden">Warden</option>
                    <option value="prefect">Prefect</option>
                    <option value="wing representatives">Wing Representative</option>
                </select>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
