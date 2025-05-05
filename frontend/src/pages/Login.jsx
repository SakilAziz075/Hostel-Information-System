import React, { use, useState } from "react";
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const Login = () => {
    const [role, setRole] = useState('Warden');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate()


    const handleLogin = (e) => {
        e.preventDefault();
        // TODO: Make API call for login
        console.log('Logging in:', { role, email, password });
        navigate('/')
    }


    return (
        <div className="auth-container">
            <h2>Login</h2>
            <form onSubmit={handleLogin}>

                <select value={role} onChange={(e) => { setRole(e.target.value) }}>
                    <option value="Warden">Warden</option>
                    <option value="Prefect">Prefect</option>
                    <option value="Wing Representatives">Wing Representatives</option>

                </select>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required />

                <button type="submit">Login</button>

            </form>
        </div >
    )

}

export default Login;