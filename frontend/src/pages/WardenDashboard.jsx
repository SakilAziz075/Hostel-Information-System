import React, { useEffect, useState } from 'react';
import '../pages/WardenDashboard.css';

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

        fetch('/api/complaints')
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
                    <section>
                        <h3>Complaint Management</h3>
                        <h4>Current Issues</h4>
                        <ul>
                            {currentIssues.map(issue => (
                                <li key={issue.complaint_id}>
                                    #{issue.complaint_id} - {issue.category}: {issue.description} ({issue.status})
                                </li>
                            ))}
                        </ul>
                        <h4>Resolved Issues</h4>
                        <ul>
                            {resolvedIssues.map(issue => (
                                <li key={issue.complaint_id}>
                                    #{issue.complaint_id} - {issue.category}: {issue.description}
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                {activeSection === 'rooms' && (
                    <section>
                        <h3>Room Management</h3>
                        <p>Room allotment and room change request functionality coming soon.</p>
                    </section>
                )}

                {activeSection === 'boarders' && (
                    <section>
                        <h3>Boarders List</h3>
                        <ul>
                            {students.map(student => (
                                <li key={student.student_id}>
                                    {student.name} - {student.email} (Room ID: {student.room_id})
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                {activeSection === 'wings' && (
                    <section>
                        <h3>Wing Management</h3>

                        <form onSubmit={handleSubmit} className="wing-form">
                            <input
                                type="text"
                                name="wing_name"
                                value={newWing.wing_name}
                                onChange={handleChange}
                                placeholder="Wing Name"
                                required
                            />
                            <input
                                type="text"
                                name="representative_id"
                                value={newWing.representative_id}
                                onChange={handleChange}
                                placeholder="Representative ID"
                                required
                            />
                            <input
                                type="text"
                                name="room_start"
                                value={newWing.room_start}
                                onChange={handleChange}
                                placeholder="Start Room"
                                required
                            />
                            <input
                                type="text"
                                name="room_end"
                                value={newWing.room_end}
                                onChange={handleChange}
                                placeholder="End Room"
                                required
                            />
                            <button type="submit">{editWingId ? 'Update Wing' : 'Add Wing'}</button>
                        </form>

                        <ul>
                            {wings.map(wing => (
                                <li key={wing.wing_id}>
                                    <strong>{wing.wing_name}</strong> | Rep ID: {wing.representative_id} | Rooms: {wing.room_start} - {wing.room_end}
                                    <button onClick={() => handleEdit(wing)}>Edit</button>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}
            </div>
        </div>
    );
};

export default WardenDashboard;
