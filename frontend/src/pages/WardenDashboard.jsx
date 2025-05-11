import React, { useEffect, useState } from 'react';
import '../pages/WardenDashboard.css';
import WingManagement from '../components/WingManagement';
import ComplaintManagement from '../components/ComplaintManagement';
import BoarderList from '../components/BoarderList';
import RoomManagement from '../components/RoomManagement';






const WardenDashboard = () => {
    const [activeSection, setActiveSection] = useState('complaints');
    const [complaints, setComplaints] = useState([]);
    const [students, setStudents] = useState([]);
    const [wings, setWings] = useState([]);
    const [newWing, setNewWing] = useState({
        wing_name: '',
        representative_id: '',
        room_start: '',
        room_end: ''
    });
    const [editWingId, setEditWingId] = useState(null);

    // Fetch students and complaints (replace this with real APIs if needed)
    useEffect(() => {
        fetch('/api/students')
            .then(res => res.json())
            .then(setStudents)
            .catch(err => console.error('Error loading students', err));

            fetch('http://localhost:5000/api/complaints')
            .then(res => res.json())
            .then(setComplaints)
            .catch(err => console.error('Error loading complaints', err));
    }, []);

    // Fetch wings
    useEffect(() => {
        fetch('/api/wings')
            .then(res => res.json())
            .then(setWings)
            .catch(err => console.error('Error loading wings', err));
    }, []);

    const currentIssues = complaints.filter(c => c.status !== 'Resolved');
    const resolvedIssues = complaints.filter(c => c.status === 'Resolved');

    const handleChange = e => {
        setNewWing({ ...newWing, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        const method = editWingId ? 'PUT' : 'POST';
        const url = editWingId ? `/api/wings/${editWingId}` : '/api/wings';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newWing)
            });

            if (!res.ok) throw new Error('Failed to save wing');

            // Refresh wings
            const updated = await fetch('/api/wings').then(r => r.json());
            setWings(updated);

            // Reset form
            setNewWing({ wing_name: '', representative_id: '', room_start: '', room_end: '' });
            setEditWingId(null);
        } catch (err) {
            console.error('Error saving wing:', err);
        }
    };

    const handleEdit = wing => {
        setEditWingId(wing.wing_id);
        setNewWing({
            wing_name: wing.wing_name,
            representative_id: wing.representative_id,
            room_start: wing.room_start,
            room_end: wing.room_end
        });
    };

    return (
        <div className="warden-dashboard">
            <h2>Welcome, Warden!</h2>

            {/* Sidebar Menu */}
            <nav className="dashboard-nav">
                <button onClick={() => setActiveSection('complaints')}>Complaint Management</button>
                <button onClick={() => setActiveSection('rooms')}>Room Management</button>
                <button onClick={() => setActiveSection('boarders')}>Boarders List</button>
                <button onClick={() => setActiveSection('wings')}>Wing Management</button>
            </nav>

            {/* Conditional Content */}
            <div className="dashboard-content">
                {activeSection === 'complaints' && (
                    <ComplaintManagement complaints={complaints} />
                )}

                {activeSection === 'rooms' && <RoomManagement />}


                {activeSection === 'boarders' && (
                    <BoarderList students={students} />
                )}

                {activeSection === 'wings' && (
                    <WingManagement
                        wings={wings}
                        newWing={newWing}
                        editWingId={editWingId}
                        onChange={handleChange}
                        onSubmit={handleSubmit}
                        onEdit={handleEdit}
                    />
                )}
            </div>
        </div>
    );
};

export default WardenDashboard;
