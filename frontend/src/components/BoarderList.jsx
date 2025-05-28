import React, { useEffect, useState } from 'react';
import './BoarderList.css';

const API_BASE = 'http://localhost:5000/api/boarders';

const BoarderList = () => {
  const [rooms, setRooms] = useState([]);
  const [originalRooms, setOriginalRooms] = useState([]); // keep original order
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [newBoarder, setNewBoarder] = useState({
    student_id: '',
    name: '',
    email: '',
  });
  const [isSorted, setIsSorted] = useState(false);

  // Group flat list of boarders by room with students array
  const groupRoomsWithStudents = (flatData) => {
    const roomsMap = {};

    flatData.forEach(item => {
      const roomNumber = item.room_number;

      if (!roomsMap[roomNumber]) {
        roomsMap[roomNumber] = {
          room_number: roomNumber,
          capacity: item.capacity,
          current_occupants: 0,
          students: [],
        };
      }

      if (item.student_id) {
        roomsMap[roomNumber].students.push({
          student_id: item.student_id,
          name: item.name,
          email: item.email,
        });
        roomsMap[roomNumber].current_occupants++;
      }
    });

    return Object.values(roomsMap);
  };

  const fetchRooms = async () => {
    try {
      const res = await fetch(`${API_BASE}/rooms-with-boarders`);
      const data = await res.json();

      const groupedRooms = groupRoomsWithStudents(data);

      setRooms(groupedRooms);
      setOriginalRooms(groupedRooms);
      setIsSorted(false);
    } catch (error) {
      console.error('Failed to fetch rooms:', error);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const toggleSort = () => {
    if (isSorted) {
      // undo sorting, revert to original order
      setRooms(originalRooms);
      setIsSorted(false);
    } else {
      // sort ascending by current occupants
      const sortedRooms = [...rooms].sort(
        (a, b) => a.current_occupants - b.current_occupants
      );
      setRooms(sortedRooms);
      setIsSorted(true);
    }
  };

  const openModal = (room) => {
    setSelectedRoom(room);
    setNewBoarder({ student_id: '', name: '', email: '' });
  };

  const closeModal = () => setSelectedRoom(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBoarder(prev => ({ ...prev, [name]: value }));
  };

  const handleAddBoarder = async () => {
    if (!newBoarder.student_id || !newBoarder.name || !newBoarder.email) {
      alert('Please fill in all fields');
      return;
    }

    const payload = {
      student_id: newBoarder.student_id,
      name: newBoarder.name,
      email: newBoarder.email,
      room_id: selectedRoom.room_number,
    };

    try {
      const res = await fetch(`${API_BASE}/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to add boarder');

      await fetchRooms();
      const updatedRoom = rooms.find(r => r.room_number === selectedRoom.room_number);
      setSelectedRoom(updatedRoom);
      setNewBoarder({ student_id: '', name: '', email: '' });
    } catch (error) {
      alert(error.message);
    }
  };

  const handleRemoveBoarder = async (student_id) => {
    if (!window.confirm('Are you sure you want to remove this boarder?')) return;

    try {
      const res = await fetch(`${API_BASE}/remove/${student_id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to remove boarder');

      await fetchRooms();
      const updatedRoom = rooms.find(r => r.room_number === selectedRoom.room_number);
      setSelectedRoom(updatedRoom);
    } catch (error) {
      alert(error.message);
    }
  };

  const getRoomClass = (room) => {
    if (room.current_occupants === 0) return 'room-box empty';
    if (room.current_occupants === 1) return 'room-box half-full';
    return 'room-box full';
  };

  return (
    <div>
      <h2>Rooms</h2>
      <button onClick={toggleSort} className="sort-toggle-btn">
        {isSorted ? 'Undo Sort' : 'Sort by Occupants ↑'}
      </button>
      <div className="rooms-container">
        {rooms.map(room => (
          <div
            key={room.room_number}
            onClick={() => openModal(room)}
            className={getRoomClass(room)}
            title={`Room ${room.room_number} - ${room.current_occupants}/${room.capacity} occupants`}
          >
            <div>Room {room.room_number}</div>
            <div>{room.current_occupants} / {room.capacity}</div>
          </div>
        ))}
      </div>

      {selectedRoom && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Room {selectedRoom.room_number}</h3>

            {selectedRoom.students && selectedRoom.students.length > 0 ? (
              <ul>
                {selectedRoom.students.map(student => (
                  <li key={student.student_id} className="student-item">
                    <strong>{student.name}</strong> ({student.student_id})<br />
                    <small>{student.email}</small><br />
                    <button
                      className="remove-btn"
                      onClick={() => handleRemoveBoarder(student.student_id)}
                    >
                      Remove Boarder
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No students in this room.</p>
            )}

            {selectedRoom.current_occupants < selectedRoom.capacity && (
              <div className="add-boarder-form">
                <h4>Add New Boarder</h4>
                <input
                  type="text"
                  name="student_id"
                  placeholder="Student ID"
                  value={newBoarder.student_id}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={newBoarder.name}
                  onChange={handleInputChange}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={newBoarder.email}
                  onChange={handleInputChange}
                />
                <button className="add-btn" onClick={handleAddBoarder}>Add Boarder</button>
              </div>
            )}

            <button className="close-btn" onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BoarderList;
