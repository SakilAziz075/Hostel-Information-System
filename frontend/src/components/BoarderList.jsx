import React, { useEffect, useState } from 'react';

const API_BASE = 'http://localhost:5000/api/boarders';

const BoarderList = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [newBoarder, setNewBoarder] = useState({
    student_id: '',
    name: '',
    email: '',
  });

  // Helper: Group flat list of boarders by room with students array
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

      // If the item has a student, add to students array
      if (item.student_id) {
        roomsMap[roomNumber].students.push({
          student_id: item.student_id,
          name: item.name,
          email: item.email,
        });
        roomsMap[roomNumber].current_occupants++;
      }
    });

    // Return as array of rooms
    return Object.values(roomsMap);
  };

  // Fetch rooms with boarders
  const fetchRooms = async () => {
    try {
      const res = await fetch(`${API_BASE}/rooms-with-boarders`);
      const data = await res.json();

      const groupedRooms = groupRoomsWithStudents(data);
      setRooms(groupedRooms);
    } catch (error) {
      console.error('Failed to fetch rooms:', error);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // Open modal for a room
  const openModal = (room) => {
    setSelectedRoom(room);
    setNewBoarder({ student_id: '', name: '', email: '' });
  };

  // Close modal
  const closeModal = () => {
    setSelectedRoom(null);
  };

  // Handle input change for new boarder form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBoarder((prev) => ({ ...prev, [name]: value }));
  };

  // Add new boarder
  const handleAddBoarder = async () => {
    if (!newBoarder.student_id || !newBoarder.name || !newBoarder.email) {
      alert('Please fill in all fields');
      return;
    }

    const payload = {
      student_id: newBoarder.student_id,
      name: newBoarder.name,
      email: newBoarder.email,
      room_id: selectedRoom.room_number, // assuming backend uses room_number as id
    };

    try {
      const res = await fetch(`${API_BASE}/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to add boarder');

      await fetchRooms();
      // Refresh selected room data with updated info
      const updatedRoom = rooms.find(r => r.room_number === selectedRoom.room_number);
      setSelectedRoom(updatedRoom);
      setNewBoarder({ student_id: '', name: '', email: '' });
    } catch (error) {
      alert(error.message);
    }
  };

  // Remove boarder
  const handleRemoveBoarder = async (student_id) => {
    if (!window.confirm('Are you sure you want to remove this boarder?')) return;

    try {
      const res = await fetch(`${API_BASE}/remove/${student_id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to remove boarder');

      await fetchRooms();
      // Refresh selected room data with updated info
      const updatedRoom = rooms.find(r => r.room_number === selectedRoom.room_number);
      setSelectedRoom(updatedRoom);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div>
      <h2>Rooms</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        {rooms.map(room => {
          const isFull = room.current_occupants >= room.capacity;
          return (
            <div
              key={room.room_number}
              onClick={() => openModal(room)}
              style={{
                cursor: 'pointer',
                backgroundColor: isFull ? 'red' : 'green',
                color: 'white',
                padding: '15px',
                borderRadius: '8px',
                width: '140px',
                textAlign: 'center',
                userSelect: 'none',
              }}
              title={`Room ${room.room_number} - ${room.current_occupants}/${room.capacity} occupants`}
            >
              <div style={{ fontWeight: 'bold', fontSize: '18px' }}>
                Room {room.room_number}
              </div>
              <div>{room.current_occupants} / {room.capacity}</div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {selectedRoom && (
        <div
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
          }}
          onClick={closeModal}
        >
          <div
            style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '10px',
              width: '400px',
              maxHeight: '80vh',
              overflowY: 'auto',
            }}
            onClick={e => e.stopPropagation()} // Prevent modal close on inner click
          >
            <h3>Room {selectedRoom.room_number}</h3>

            {/* List of students */}
            {selectedRoom.students && selectedRoom.students.length > 0 ? (
              <ul>
                {selectedRoom.students.map(student => (
                  <li key={student.student_id} style={{ marginBottom: '8px' }}>
                    <strong>{student.name}</strong> ({student.student_id})<br />
                    <small>{student.email}</small><br />
                    <button
                      onClick={() => handleRemoveBoarder(student.student_id)}
                      style={{ marginTop: '5px' }}
                    >
                      Remove Boarder
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No students in this room.</p>
            )}

            {/* Add boarder form only if room not full */}
            {selectedRoom.current_occupants < selectedRoom.capacity && (
              <div style={{ marginTop: '20px' }}>
                <h4>Add New Boarder</h4>
                <input
                  type="text"
                  name="student_id"
                  placeholder="Student ID"
                  value={newBoarder.student_id}
                  onChange={handleInputChange}
                  style={{ width: '100%', marginBottom: '8px', padding: '6px' }}
                />
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={newBoarder.name}
                  onChange={handleInputChange}
                  style={{ width: '100%', marginBottom: '8px', padding: '6px' }}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={newBoarder.email}
                  onChange={handleInputChange}
                  style={{ width: '100%', marginBottom: '8px', padding: '6px' }}
                />
                <button onClick={handleAddBoarder} style={{ padding: '8px 15px' }}>
                  Add Boarder
                </button>
              </div>
            )}

            <button
              onClick={closeModal}
              style={{ marginTop: '15px', padding: '6px 12px', backgroundColor: '#ccc', border: 'none', borderRadius: '5px' }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BoarderList;
