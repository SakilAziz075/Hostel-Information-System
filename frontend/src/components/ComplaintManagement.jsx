// components/ComplaintManagement.jsx
import React , { useEffect, useState } from 'react';


// Inside ComplaintManagement.jsx
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

    return (
        <div>
            <h3>Complaints</h3>
            <ul>
                {localComplaints.map(c => (
                    <li key={c.complaint_id}>
                        <strong>{c.category}</strong> - {c.description} ({c.status})
                        <br />
                        <select
                            value={c.status}
                            onChange={e => updateStatus(c.complaint_id, e.target.value)}
                        >
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Resolved">Resolved</option>
                        </select>
                    </li>
                ))}
            </ul>
        </div>
    );
};


export default ComplaintManagement;
