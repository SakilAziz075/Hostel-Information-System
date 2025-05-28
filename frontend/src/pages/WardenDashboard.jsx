import React, { useEffect, useState } from 'react';
import '../pages/WardenDashboard.css';
import WingManagement from '../components/WingManagement';
import ComplaintManagement from '../components/ComplaintManagement';
import BoarderList from '../components/BoarderList';
import RoomManagement from '../components/RoomManagement';
import PrefectManagement from '../components/PrefectManagement';
import axios from 'axios';

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

    // Notice upload state (added title)
    const [noticeTitle, setNoticeTitle] = useState('');
    const [noticeDescription, setNoticeDescription] = useState('');
    const [noticeFile, setNoticeFile] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:5000/api/complaints', {
            params: { role: 'warden' }
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

    const handleNoticeUpload = async (e) => {
        e.preventDefault();
        if (!noticeFile || !noticeDescription || !noticeTitle) {
            alert('Please provide a title, a PDF file, and a description.');
            return;
        }

        const formData = new FormData();
        formData.append('title', noticeTitle);
        formData.append('description', noticeDescription);
        formData.append('pdf', noticeFile);

        try {
            const response = await axios.post('http://localhost:5000/api/notices/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            console.log('Upload success response:', response.data);
            alert('Notice uploaded successfully');
            setNoticeTitle('');
            setNoticeDescription('');
            setNoticeFile(null);
        } catch (err) {
            console.error('Failed to upload notice:', err);
            alert('Upload failed.');
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
                <button onClick={() => setActiveSection('prefects')}>Prefect Management</button>
                <button onClick={() => setActiveSection('notices')}>Upload Notice</button>
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

                {activeSection === 'prefects' && <PrefectManagement />}

                {activeSection === 'notices' && (
                    <div className="notice-upload-section">
                        <h3>Upload Notice</h3>
                        <form onSubmit={handleNoticeUpload} className="notice-form">
                            <input
                                type="text"
                                placeholder="Enter notice title"
                                value={noticeTitle}
                                onChange={(e) => setNoticeTitle(e.target.value)}
                                required
                            />
                            <textarea
                                placeholder="Enter notice description"
                                value={noticeDescription}
                                onChange={(e) => setNoticeDescription(e.target.value)}
                                rows="3"
                                required
                            />
                            <input
                                type="file"
                                accept="application/pdf"
                                onChange={(e) => setNoticeFile(e.target.files[0])}
                                required
                            />
                            <button type="submit">Upload</button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WardenDashboard;
