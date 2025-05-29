import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PrefectComplaintManagement = ({ complaints, onForwardToWarden, onResolveComplaint }) => {
    const [logs, setLogs] = useState({});
    const [loadingLogs, setLoadingLogs] = useState({});
    const [wardenComplaints, setWardenComplaints] = useState([]);
    const [logsFetched, setLogsFetched] = useState({});
    const [visibleLogs, setVisibleLogs] = useState({});

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
            setVisibleLogs(prev => ({ ...prev, [wardenComplaintId]: false }));
        } else {
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

    return (
        <div style={{ padding: '1rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>📋 Prefect Complaint Management</h3>
            <div style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ backgroundColor: '#f8f8f8' }}>
                        <tr>
                            <th style={thStyle}>ID</th>
                            <th style={thStyle}>Student</th>
                            <th style={thStyle}>Category</th>
                            <th style={thStyle}>Status</th>
                            <th style={thStyle}>Actions</th>
                            <th style={thStyle}>Logs</th>
                        </tr>
                    </thead>
                    <tbody>
                        {approvedComplaints.map(complaint => {
                            const wardenId = getWardenId(complaint.complaint_id);
                            const isEscalated = !!wardenId;
                            let displayStatus = complaint.status;
                            if (complaint.status === 'In Progress' && isEscalated) {
                                displayStatus = 'In Progress (Escalated)';
                            }

                            return (
                                <React.Fragment key={complaint.complaint_id}>
                                    <tr style={{ borderBottom: '1px solid #eee' }}>
                                        <td style={tdStyle}>{complaint.complaint_id}</td>
                                        <td style={tdStyle}>{complaint.student_name}</td>
                                        <td style={tdStyle}>{complaint.category}</td>
                                        <td style={tdStyle}>{displayStatus}</td>
                                        <td style={tdStyle}>
                                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                                {!isEscalated && complaint.status === 'In Progress' && (
                                                    <button style={btnBlue} onClick={() => handleForwardToWarden(complaint.complaint_id)}>
                                                        Forward
                                                    </button>
                                                )}
                                                {complaint.status !== 'Resolved' && (
                                                    <button style={btnGreen} onClick={() => handleResolveComplaint(complaint.complaint_id)}>
                                                        Resolve
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                        <td style={tdStyle}>
                                            {isEscalated ? (
                                                <button style={btnGray} onClick={() => toggleLogs(wardenId)}>
                                                    {loadingLogs[wardenId]
                                                        ? 'Loading...'
                                                        : visibleLogs[wardenId] ? 'Hide Logs' : 'Show Logs'}
                                                </button>
                                            ) : (
                                                <span style={{ color: '#aaa' }}>Not escalated</span>
                                            )}
                                        </td>
                                    </tr>

                                    {isEscalated && visibleLogs[wardenId] && logsFetched[wardenId] && (
                                        <tr>
                                            <td colSpan="6" style={{ backgroundColor: '#fafafa', padding: '1rem' }}>
                                                {logs[wardenId]?.length > 0 ? (
                                                    <ul style={{ paddingLeft: '1.2rem' }}>
                                                        {logs[wardenId].map(log => (
                                                            <li key={log.log_id}>
                                                                <em>{log.update_text}</em>
                                                                <span style={{ color: '#666', fontSize: '0.85em', marginLeft: '0.5rem' }}>
                                                                    ({new Date(log.updated_at).toLocaleString()})
                                                                </span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <div style={{ fontStyle: 'italic', color: '#888' }}>
                                                        No logs available.
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const thStyle = {
    padding: '12px',
    textAlign: 'left',
    borderBottom: '2px solid #ddd',
    backgroundColor: '#f2f2f2'
};

const tdStyle = {
    padding: '12px',
    verticalAlign: 'top'
};

const btnBlue = {
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '6px 10px',
    cursor: 'pointer'
};

const btnGreen = {
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '6px 10px',
    cursor: 'pointer'
};

const btnGray = {
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '6px 10px',
    cursor: 'pointer'
};

export default PrefectComplaintManagement;
