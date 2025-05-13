import React from 'react';

const WingComplaintManagement = ({ complaints, onProcess }) => {
    const handleAction = async (id, action) => {
        try {
            await onProcess(id, action);
        } catch (err) {
            console.error('Failed to process complaint:', err);
        }
    };

    return (
        <div>
            <h3>Assigned Complaints</h3>
            <ul>
                {complaints.map(c => (
                    <li key={c.complaint_id}>
                        <strong>{c.category}</strong> - {c.description}
                        <br />
                        Status: {c.status} | Approval: {c.approval_status}
                        <br />
                        <button onClick={() => handleAction(c.complaint_id, 'Approved')}>Approve</button>
                        <button onClick={() => handleAction(c.complaint_id, 'Rejected')}>Reject</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default WingComplaintManagement;
