import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PrefectComplaintManagement = ({ complaints, onForwardToWarden, onResolveComplaint }) => {
    const [logs, setLogs] = useState({});
    const [loadingLogs, setLoadingLogs] = useState({});
    const [wardenComplaints, setWardenComplaints] = useState([]);
    const [logsFetched, setLogsFetched] = useState({});
    const [visibleLogs, setVisibleLogs] = useState({}); // Track visibility of logs per complaint

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
            setLogsFetched(prev => ({ ...prev, [wardenComplaintId]: true }));
        } catch (err) {
            console.error('Failed to fetch logs:', err);
            setLogsFetched(prev => ({ ...prev, [wardenComplaintId]: true }));
        } finally {
            setLoadingLogs(prev => ({ ...prev, [wardenComplaintId]: false }));
        }
    };

    const toggleLogs = async (wardenComplaintId) => {
        if (!wardenComplaintId) return;

        if (visibleLogs[wardenComplaintId]) {
            // Currently visible — hide logs
            setVisibleLogs(prev => ({ ...prev, [wardenComplaintId]: false }));
        } else {
            // Not visible — fetch if needed, then show logs
            if (!logsFetched[wardenComplaintId]) {
                await fetchLogs(wardenComplaintId);
            }
            setVisibleLogs(prev => ({ ...prev, [wardenComplaintId]: true }));
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

    const approvedComplaints = complaints.filter(complaint => complaint.approval_status === 'Approved');

    const cellStyle = {
        border: '1px solid #ccc',
        padding: '8px',
        textAlign: 'left'
    };

    return (
        <div>
            <h3>Prefect Complaint Management</h3>
            <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                <thead>
                    <tr>
                        <th style={cellStyle}>Complaint ID</th>
                        <th style={cellStyle}>Student Name</th>
                        <th style={cellStyle}>Category</th>
                        <th style={cellStyle}>Status</th>
                        <th style={cellStyle}>Actions</th>
                        <th style={cellStyle}>Logs</th>
                    </tr>
                </thead>
                <tbody>
                    {approvedComplaints.map(complaint => {
                        const wardenId = getWardenId(complaint.complaint_id);
                        const isEscalated = !!wardenId;

                        let displayStatus = complaint.status;
                        if (complaint.status === 'In Progress' && isEscalated) {
                            displayStatus = 'In Progress (Escalated to Warden)';
                        }

                        return (
                            <React.Fragment key={complaint.complaint_id}>
                                <tr>
                                    <td style={cellStyle}>{complaint.complaint_id}</td>
                                    <td style={cellStyle}>{complaint.student_name}</td>
                                    <td style={cellStyle}>{complaint.category}</td>
                                    <td style={cellStyle}>{displayStatus}</td>
                                    <td style={cellStyle}>
                                        {!isEscalated && complaint.status === 'In Progress' && (
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
                                    <td style={cellStyle}>
                                        {isEscalated ? (
                                            <button onClick={() => toggleLogs(wardenId)}>
                                                {loadingLogs[wardenId]
                                                    ? 'Loading...'
                                                    : visibleLogs[wardenId] ? 'Hide Logs' : 'Show Logs'}
                                            </button>
                                        ) : (
                                            <span style={{ color: '#888' }}>Not escalated</span>
                                        )}
                                    </td>
                                </tr>

                                {isEscalated && visibleLogs[wardenId] && logsFetched[wardenId] && (
                                    <tr>
                                        <td colSpan="6" style={cellStyle}>
                                            <div style={{ marginTop: '5px', paddingLeft: '10px' }}>
                                                {logs[wardenId] && logs[wardenId].length > 0 ? (
                                                    logs[wardenId].map(log => (
                                                        <div key={log.log_id}>
                                                            📍 <em>{log.update_text}</em>{' '}
                                                            <span style={{ fontSize: '0.85em', color: '#555' }}>
                                                                ({new Date(log.updated_at).toLocaleString()})
                                                            </span>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div style={{ fontStyle: 'italic', color: '#888' }}>
                                                        No logs available.
                                                    </div>
                                                )}
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
