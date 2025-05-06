import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const Signup = () => {
    const [role, setRole] = useState('Warden');
    const [name, setName] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        try {
            const res = await fetch('http://localhost:5000/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify({ role, name, contact_number: contactNumber, email, password })
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText || 'Signup failed');
            }

            const data = await res.json();
            console.log('Signup successful:', data);
            navigate('/');
        } catch (err) {
            console.error('Signup error:', err.message);
            alert(err.message);
        }
    };

    return (
        <div className="auth-container">
            <h2>Sign Up</h2>
            <form onSubmit={handleSignup}>
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="warden">Warden</option>
                    <option value="prefect">Prefect</option>
                    <option value="wing representatives">Wing Representatives</option>
                </select>

                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />

                <input
                    type="text"
                    placeholder="Contact Number"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    required
                />

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

                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />

                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
};

export default Signup;
