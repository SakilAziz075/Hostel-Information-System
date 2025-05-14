import React, { useEffect, useState } from 'react';
import './ComplaintManagement.css';

const WardenComplaintManagement = () => {
    const [complaints, setComplaints] = useState([]);
    const [logs, setLogs] = useState({});
    const [newLog, setNewLog] = useState({});
    const [loadingLogs, setLoadingLogs] = useState({});
    const [logStatus, setLogStatus] = useState({});

    useEffect(() => {
        fetch('/api/complaints/warden')  // Updated API endpoint for all warden complaints
            .then(res => res.json())
            .then(setComplaints)
            .catch(err => console.error('Failed to fetch complaints:', err));
    }, []);

    const fetchLogs = async (id) => {
        setLoadingLogs(prev => ({ ...prev, [id]: true }));
        try {
            const res = await fetch(`/api/complaints/${id}/logs`);  // Updated endpoint for fetching logs
            const data = await res.json();
            setLogs(prev => ({ ...prev, [id]: data }));
        } catch (err) {
            console.error('Failed to fetch logs:', err);
        } finally {
            setLoadingLogs(prev => ({ ...prev, [id]: false }));
        }
    };

    const submitLog = async (id) => {
        const text = newLog[id]?.trim();
        if (!text) return;

        try {
            const res = await fetch(`/api/complaints/${id}/logs`, {
                // Updated endpoint for submitting log
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ update_text: text })
            });

            if (res.ok) {
                await fetchLogs(id);
                setNewLog(prev => ({ ...prev, [id]: '' }));
                setLogStatus(prev => ({ ...prev, [id]: '✅ Update added.' }));
            } else {
                const err = await res.json();
                setLogStatus(prev => ({ ...prev, [id]: err.message || 'Failed to add update.' }));
            }
        } catch (err) {
            console.error('Submit error:', err);
            setLogStatus(prev => ({ ...prev, [id]: '❌ Error submitting update.' }));
        }

        setTimeout(() => {
            setLogStatus(prev => ({ ...prev, [id]: '' }));
        }, 3000);
    };

    return (
        <div className="warden-container">
            <h2 className="warden-title">Warden Complaints</h2>
            {complaints.length === 0 ? (
                <p>No complaints found.</p>
            ) : complaints.map(c => (
                <div key={c.complaint_id} className="complaint-card">
                    <h4><strong>Category: </strong>{c.category}</h4>
                    <p>{c.description}</p>
                    <p><strong>Priority:</strong> {c.priority}</p>
                    <p><strong>Student:</strong> {c.student_name} ({c.student_roll})</p> {/* 👈 Add this line */}

                    <button className="log-button" onClick={() => fetchLogs(c.warden_complaint_id)}>
                        {loadingLogs[c.warden_complaint_id] ? 'Loading logs...' : 'Show Logs'}
                    </button>

                    <div className="logs-container">
                        {loadingLogs[c.warden_complaint_id] ? null : (
                            logs.hasOwnProperty(c.warden_complaint_id) ? (
                                logs[c.warden_complaint_id].length > 0 ? (
                                    logs[c.warden_complaint_id].map(log => (
                                        <div key={`${c.warden_complaint_id}-${log.log_id}`} className="log-entry">
                                            📍 <em>{log.update_text}</em> <span className="log-time">({new Date(log.updated_at).toLocaleString()})</span>
                                        </div>
                                    ))
                                ) : (
                                    <p>No logs yet.</p>
                                )
                            ) : null
                        )}
                    </div>


                    <textarea
                        rows="2"
                        placeholder="Add progress update..."
                        className="log-textarea"
                        value={newLog[c.warden_complaint_id] || ''}
                        onChange={e => setNewLog(prev => ({ ...prev, [c.warden_complaint_id]: e.target.value }))}
                    ></textarea>

                    <button className="submit-button" onClick={() => submitLog(c.warden_complaint_id)}>
                        Add Update
                    </button>

                    {logStatus[c.complaint_id] && (
                        <p className="log-status">{logStatus[c.complaint_id]}</p>
                    )}
                </div>
            ))}
        </div>
    );
};

export default WardenComplaintManagement;
