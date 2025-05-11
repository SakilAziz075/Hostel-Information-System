import React, { useState } from 'react';

const BoarderList = ({ students, onAdd, onUpdate, onRemove, onUpload }) => {
    const [newBoarder, setNewBoarder] = useState({
        student_id: '',
        name: '',
        email: '',
        room_id: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewBoarder(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleAddBoarder = () => {
        onAdd(newBoarder);
        setNewBoarder({ student_id: '', name: '', email: '', room_id: '' });
    };

    const handleUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            onUpload(file);
        }
    };

    return (
        <section>
            <h3>Boarders List</h3>
            <ul>
                {students.map(student => (
                    <li key={student.student_id}>
                        {student.name} - {student.email} (Room ID: {student.room_number})
                        <button onClick={() => onRemove(student.student_id)}>Remove</button>
                        <button onClick={() => onUpdate(student.student_id)}>Update</button>
                    </li>
                ))}
            </ul>

            <h4>Add New Boarder</h4>
            <input
                type="text"
                name="student_id"
                value={newBoarder.student_id}
                onChange={handleInputChange}
                placeholder="Student ID (Roll No)"
            />
            <input
                type="text"
                name="name"
                value={newBoarder.name}
                onChange={handleInputChange}
                placeholder="Name"
            />
            <input
                type="email"
                name="email"
                value={newBoarder.email}
                onChange={handleInputChange}
                placeholder="Email"
            />
            <input
                type="text"
                name="room_id"
                value={newBoarder.room_id}
                onChange={handleInputChange}
                placeholder="Room ID"
            />
            <button onClick={handleAddBoarder}>Add Boarder</button>

            <h4>Upload Boarders Spreadsheet</h4>
            <input type="file" accept=".csv, .xlsx" onChange={handleUpload} />
        </section>
    );
};

export default BoarderList;
