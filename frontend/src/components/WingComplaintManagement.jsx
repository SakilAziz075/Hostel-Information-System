import React from 'react';
import './WingComplaintManagement.css';

const WingComplaintManagement = ({ complaints, onProcess }) => {
    const handleAction = async (id, action) => {
        try {
            await onProcess(id, action);
        } catch (err) {
            console.error('Failed to process complaint:', err);
        }
    };

    return (
        <div className="wing-complaint-container">
            <h3>Assigned Complaints</h3>
            {complaints.length === 0 ? (
                <p>No pending complaints assigned to you.</p>
            ) : (
                complaints.map(c => (
                    <div key={c.complaint_id} className="complaint-item">
                        <p><strong>Category:</strong> {c.category}</p>
                        <p><strong>Description:</strong> {c.description}</p>
                        <p><strong>Priority:</strong> {c.priority}</p>
                        <p><strong>Status:</strong> {c.status}</p>
                        <p><strong>Approval Status:</strong> {c.approval_status}</p>
                        <p><strong>Submitted By:</strong> {c.student_name} ({c.student_id})</p>
                        <p><strong>Submitted At:</strong> {new Date(c.submitted_at).toLocaleString()}</p>

                        <div className="complaint-actions">
                            <button onClick={() => handleAction(c.complaint_id, 'Approved')}>Approve</button>
                            <button onClick={() => handleAction(c.complaint_id, 'Rejected')}>Reject</button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default WingComplaintManagement;
