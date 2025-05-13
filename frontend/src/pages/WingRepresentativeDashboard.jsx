import React, { useEffect, useState } from 'react';
import BoarderList from '../components/BoarderList';
import WingComplaintManagement from '../components/WingComplaintManagement';
import axios from 'axios';

const WingRepresentativeDashboard = () => {
    const [activeSection, setActiveSection] = useState('complaints');
    const [complaints, setComplaints] = useState([]);
    const [students, setStudents] = useState([]);
    const [currentUserId, setCurrentUserId] = useState('');

    // Fetch current user id (student_id) from localStorage
    useEffect(() => {
        const storedId = localStorage.getItem('student_id');
        if (storedId) {
            setCurrentUserId(storedId);
        }

        // Fetch students list for BoarderList
        axios.get('/api/students')
            .then(res => setStudents(res.data))
            .catch(err => console.error('Error fetching students:', err));
    }, []);

    // Fetch complaints assigned to current wing rep
    useEffect(() => {
        if (!currentUserId) return;

        const fetchComplaints = async () => {
            try {
                const res = await axios.get('/api/complaints');
                const assigned = res.data.filter(
                    c => String(c.assigned_to) === String(currentUserId) &&
                        c.approval_status === 'Pending'
                );
                setComplaints(assigned);
            } catch (err) {
                console.error('Error fetching complaints:', err);
            }
        };

        fetchComplaints();
    }, [currentUserId]);

    const handleProcessComplaint = async (id, action) => {
        try {
            const res = await axios.put(`/api/complaints/${id}/process`, {
                action,
                student_id: currentUserId,
                role: 'wing',
            });

            alert(res.data.message || 'Complaint processed successfully');

            // Refresh the complaints list
            const updated = await axios.get('/api/complaints');
            const assigned = updated.data.filter(
                c => String(c.assigned_to) === String(currentUserId) &&
                    c.approval_status === 'Pending'
            );
            setComplaints(assigned);
        } catch (err) {
            console.error('Failed to process complaint:', err);
            alert('Something went wrong while processing the complaint');
        }
    };

    return (
        <div className="wing-dashboard">
            <h2>Welcome, Wing Representative!</h2>

            <nav className="dashboard-nav">
                <button onClick={() => setActiveSection('complaints')}>Manage Complaints</button>
                <button onClick={() => setActiveSection('boarders')}>Boarder List</button>
            </nav>

            <div className="dashboard-content">
                {activeSection === 'complaints' && (
                    <WingComplaintManagement
                        complaints={complaints}
                        onProcess={handleProcessComplaint}
                    />
                )}

                {activeSection === 'boarders' && (
                    <BoarderList
                        students={students}
                        onAdd={() => {}}
                        onRemove={() => {}}
                        onUpdate={() => {}}
                        onUpload={() => {}}
                    />
                )}
            </div>
        </div>
    );
};

export default WingRepresentativeDashboard;
