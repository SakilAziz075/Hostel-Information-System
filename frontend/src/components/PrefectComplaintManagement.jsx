import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PrefectComplaintManagement = ({ complaints, onForwardToWarden, onResolveComplaint }) => {
    const [selectedComplaint, setSelectedComplaint] = useState(null);

    const handleForwardToWarden = async (complaintId) => {
        try {
            await axios.put(`/api/complaints/${complaintId}/escalate`);
            onForwardToWarden(complaintId);  // Update parent component (PrefectDashboard) state
            alert('Complaint forwarded to warden.');
        } catch (error) {
            console.error('Error forwarding complaint to warden:', error);
            alert('Failed to forward complaint to warden.');
        }
    };

    const handleResolveComplaint = async (complaintId) => {
        try {
            await axios.put(`/api/complaints/${complaintId}/status`, { status: 'Resolved' });
            onResolveComplaint(complaintId);  // Update parent component (PrefectDashboard) state
            alert('Complaint resolved.');
        } catch (error) {
            console.error('Error resolving complaint:', error);
            alert('Failed to resolve complaint.');
        }
    };

    return (
        <div>
            <h3>Complaint Management</h3>
            <table>
                <thead>
                    <tr>
                        <th>Complaint ID</th>
                        <th>Student Name</th>
                        <th>Category</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {complaints.map(complaint => (
                        <tr key={complaint.complaint_id}>
                            <td>{complaint.complaint_id}</td>
                            <td>{complaint.student_name}</td>
                            <td>{complaint.category}</td>
                            <td>{complaint.status}</td>
                            <td>
                                {complaint.status === 'Pending' && (
                                    <button onClick={() => handleForwardToWarden(complaint.complaint_id)}>
                                        Forward to Warden
                                    </button>
                                )}
                                {complaint.status !== 'Resolved' && (
                                    <button onClick={() => handleResolveComplaint(complaint.complaint_id)}>
                                        Resolve Complaint
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PrefectComplaintManagement;
