import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PrefectComplaintManagement = ({ complaints, onForwardToWarden, onResolveComplaint }) => {
    const [logs, setLogs] = useState({});
    const [loadingLogs, setLoadingLogs] = useState({});
    const [wardenComplaints, setWardenComplaints] = useState([]);

    // Fetch warden complaints to get warden_complaint_id
    useEffect(() => {
        const fetchWardenComplaints = async () => {
            try {
                const res = await axios.get('/api/complaints/warden');
                setWardenComplaints(res.data);
            } catch (err) {
                console.error('Failed to fetch warden complaints:', err);
            }
        };
        fetchWardenComplaints();
    }, []);

    const getWardenId = (complaintId) => {
        const match = wardenComplaints.find(wc => wc.complaint_id === complaintId);
        return match?.warden_complaint_id;
    };

    const fetchLogs = async (wardenComplaintId) => {
        if (!wardenComplaintId) return;
        setLoadingLogs(prev => ({ ...prev, [wardenComplaintId]: true }));
        try {
            const res = await axios.get(`/api/complaints/${wardenComplaintId}/logs`);
            setLogs(prev => ({ ...prev, [wardenComplaintId]: res.data }));
        } catch (err) {
            console.error('Failed to fetch logs:', err);
        } finally {
            setLoadingLogs(prev => ({ ...prev, [wardenComplaintId]: false }));
        }
    };

    const handleForwardToWarden = async (complaintId) => {
        try {
            await axios.put(`/api/complaints/${complaintId}/escalate`);
            onForwardToWarden(complaintId);
            alert('Complaint forwarded to warden.');
        } catch (error) {
            console.error('Error forwarding complaint to warden:', error);
            alert('Failed to forward complaint to warden.');
        }
    };

    const handleResolveComplaint = async (complaintId) => {
        try {
            await axios.put(`/api/complaints/${complaintId}/status`, { status: 'Resolved' });
            onResolveComplaint(complaintId);
            alert('Complaint resolved.');
        } catch (error) {
            console.error('Error resolving complaint:', error);
            alert('Failed to resolve complaint.');
        }
    };

    // Filter complaints to show only those with 'Approved' status
    const approvedComplaints = complaints.filter(complaint => complaint.approval_status === 'Approved');

    return (
        <div>
            <h3>Prefect Complaint Management</h3>
            <table>
                <thead>
                    <tr>
                        <th>Complaint ID</th>
                        <th>Student Name</th>
                        <th>Category</th>
                        <th>Status</th>
                        <th>Actions</th>
                        <th>Logs</th>
                    </tr>
                </thead>
                <tbody>
                    {approvedComplaints.map(complaint => {
                        const wardenId = getWardenId(complaint.complaint_id);

                        return (
                            <React.Fragment key={complaint.complaint_id}>
                                <tr>
                                    <td>{complaint.complaint_id}</td>
                                    <td>{complaint.student_name}</td>
                                    <td>{complaint.category}</td>
                                    <td>{complaint.status}</td>
                                    <td>
                                        {/* Show the button if status is 'In Progress' and approval_status is 'Approved' */}
                                        {complaint.status === 'In Progress' && (
                                            <button onClick={() => handleForwardToWarden(complaint.complaint_id)}>
                                                Forward to Warden
                                            </button>
                                        )}
                                        {complaint.status !== 'Resolved' && (
                                            <button onClick={() => handleResolveComplaint(complaint.complaint_id)}>
                                                Resolve
                                            </button>
                                        )}
                                    </td>
                                    <td>
                                        {wardenId ? (
                                            <button onClick={() => fetchLogs(wardenId)}>
                                                {loadingLogs[wardenId] ? 'Loading...' : 'Show Logs'}
                                            </button>
                                        ) : (
                                            <span style={{ color: '#888' }}>Not escalated</span>
                                        )}
                                    </td>
                                </tr>

                                {wardenId && logs[wardenId] && logs[wardenId].length > 0 && (
                                    <tr>
                                        <td colSpan="6">
                                            <div style={{ marginTop: '5px', paddingLeft: '10px' }}>
                                                {logs[wardenId].map(log => (
                                                    <div key={log.log_id}>
                                                        📍 <em>{log.update_text}</em>{' '}
                                                        <span style={{ fontSize: '0.85em', color: '#555' }}>
                                                            ({new Date(log.updated_at).toLocaleString()})
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default PrefectComplaintManagement;

