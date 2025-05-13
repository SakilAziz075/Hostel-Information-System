// components/ComplaintManagement.jsx
import React, { useEffect, useState } from 'react';

const ComplaintManagement = ({ complaints }) => {
    const [localComplaints, setLocalComplaints] = useState(complaints);

    const updateStatus = async (id, status) => {
        try {
            const res = await fetch(`/api/complaints/${id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });

            if (!res.ok) throw new Error('Failed to update status');

            // Refresh list locally
            const updated = localComplaints.map(c =>
                c.complaint_id === id ? { ...c, status } : c
            );
            setLocalComplaints(updated);
        } catch (err) {
            console.error(err);
        }
    };

    const statuses = ['Pending', 'Approved', 'In Progress', 'Resolved'];

    return (
        <div>
            <h3>Complaints</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {localComplaints.map(c => (
                    <li key={c.complaint_id} style={{ marginBottom: '1rem', padding: '0.5rem', border: '1px solid #ccc' }}>
                        <strong>{c.category}</strong> - {c.description}
                        <div>
                            Current Status: <strong>{c.status}</strong>
                        </div>
                        <div style={{ marginTop: '0.5rem' }}>
                            {statuses.map(status => (
                                <button
                                    key={status}
                                    onClick={() => updateStatus(c.complaint_id, status)}
                                    style={{
                                        marginRight: '0.5rem',
                                        padding: '0.3rem 0.6rem',
                                        backgroundColor: c.status === status ? '#4caf50' : '#e0e0e0',
                                        color: c.status === status ? 'white' : 'black',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ComplaintManagement;
