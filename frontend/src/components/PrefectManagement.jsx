// components/PrefectManagement.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PrefectManagement = () => {
    const [prefects, setPrefects] = useState([]);
    const [studentIdInput, setStudentIdInput] = useState('');

    useEffect(() => {
        fetchPrefects();
    }, []);

    const fetchPrefects = async () => {
        try {
            const res = await axios.get('/api/prefects/prefects');
            setPrefects(res.data);
        } catch (err) {
            console.error('Error fetching prefects:', err);
        }
    };

    const handleAddPrefect = async () => {
        if (!studentIdInput.trim()) return;

        try {
            console.log('firing add prefect');
            
            await axios.post('/api/prefects/add-prefect', {
                student_id: studentIdInput.trim()
            });

            setStudentIdInput('');
            fetchPrefects();
        } catch (err) {
            console.error('Error adding prefect:', err);
        }
    };

    const handleRemovePrefect = async (user_id) => {
        try {
            await axios.delete(`/api/prefects/remove-prefect/${user_id}`);
            fetchPrefects();
        } catch (err) {
            console.error('Error removing prefect:', err);
        }
    };

    return (
        <div>
            <h2>Prefect Management</h2>

            <div style={{ marginBottom: '1rem' }}>
                <input
                    type="text"
                    placeholder="Enter Student ID"
                    value={studentIdInput}
                    onChange={(e) => setStudentIdInput(e.target.value)}
                />
                <button onClick={handleAddPrefect}>Add Prefect</button>
            </div>

            <ul>
                {prefects.length === 0 ? (
                    <p>No prefects assigned yet.</p>
                ) : (
                    prefects.map(prefect => (
                        <li key={prefect.user_id}>
                            {prefect.name} ({prefect.student_id})
                            <button onClick={() => handleRemovePrefect(prefect.user_id)} style={{ marginLeft: '10px' }}>
                                Remove
                            </button>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default PrefectManagement;
