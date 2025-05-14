import React, { useEffect, useState } from 'react';
import '../pages/WardenDashboard.css';
import WingManagement from '../components/WingManagement';
import ComplaintManagement from '../components/ComplaintManagement';
import BoarderList from '../components/BoarderList';
import RoomManagement from '../components/RoomManagement';
import PrefectManagement from '../components/PrefectManagement'; // ✅ NEW Import
import axios from 'axios';

const role = 'warden'



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
    const [studentsByRoom, setStudentsByRoom] = useState({});

    useEffect(() => {
        // axios.get('/api/students')
        //     .then(res => setStudents(res.data))
        //     .catch(err => console.error('Error loading students', err));

        axios.get('http://localhost:5000/api/complaints', {
            params: { role: 'warden' } // Sending role as query parameter
        })
            .then(res => setComplaints(res.data))
            .catch(err => console.error('Error loading complaints', err));
    }, []);

    useEffect(() => {
        axios.get('/api/wings')
            .then(res => setWings(res.data))
            .catch(err => console.error('Error loading wings', err));
    }, []);

    useEffect(() => {
        const fetchBoarders = async () => {
            const res = await axios.get('http://localhost:5000/api/boarders/rooms-with-boarders');
            console.log('firing room-with boarder');

            console.log(res.data);

            setStudentsByRoom(res.data);
        };
        fetchBoarders();
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
            await axios({
                method,
                url,
                headers: { 'Content-Type': 'application/json' },
                data: newWing
            });

            const updated = await axios.get('/api/wings');
            setWings(updated.data);

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

    const handleAddBoarder = async (boarder) => {
        try {
            await axios.post('/api/boarders/add', boarder);
            const updated = await axios.get('/api/students');
            setStudents(updated.data);
        } catch (err) {
            console.error('Error adding boarder:', err);
        }
    };

    const handleRemoveBoarder = async (student_id) => {
        try {
            await axios.delete(`/api/boarders/remove/${student_id}`);
            setStudents(prev => prev.filter(b => b.student_id !== student_id));
        } catch (err) {
            console.error('Error removing boarder:', err);
        }
    };

    const handleUpdateBoarder = async (student_id) => {
        const updatedData = prompt("Enter updated boarder data (JSON format)");
        try {
            const data = JSON.parse(updatedData);
            await axios.put(`/api/boarders/update/${student_id}`, data);
            setStudents(prev =>
                prev.map(b => (b.student_id === student_id ? { ...b, ...data } : b))
            );
        } catch (err) {
            alert('Invalid data or failed to update boarder');
        }
    };

    const handleUploadSheet = async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            await axios.post('/api/boarders/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            const updated = await axios.get('/api/students');
            setStudents(updated.data);
        } catch (err) {
            console.error('Error uploading spreadsheet:', err);
        }
    };

    return (
        <div className="warden-dashboard">
            <h2>Welcome, Warden!</h2>

            <nav className="dashboard-nav">
                <button onClick={() => setActiveSection('complaints')}>Complaint Management</button>
                <button onClick={() => setActiveSection('rooms')}>Room Management</button>
                <button onClick={() => setActiveSection('boarders')}>Boarders List</button>
                <button onClick={() => setActiveSection('wings')}>Wing Management</button>
                <button onClick={() => setActiveSection('prefects')}>Prefect Management</button> {/* ✅ Added */}
            </nav>

            <div className="dashboard-content">
                {activeSection === 'complaints' && (
                    <ComplaintManagement complaints={complaints} />
                )}

                {activeSection === 'rooms' && <RoomManagement />}

                {activeSection === 'boarders' && (
                    <BoarderList
                        students={studentsByRoom}
                        onAdd={handleAddBoarder}
                        onRemove={handleRemoveBoarder}
                        onUpdate={handleUpdateBoarder}
                        onUpload={handleUploadSheet}
                    />
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

                {activeSection === 'prefects' && (
                    <PrefectManagement />
                )}
            </div>
        </div>
    );
};

export default WardenDashboard;
