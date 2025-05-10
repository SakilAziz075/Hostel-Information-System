import db from '../config/db.js';

export function getAllWings(req, res) {
    db.query('SELECT * FROM wings')
        .then(([results]) => {
            res.json(results);
        })
        .catch(err => {
            console.error("Error fetching wings:", err);  // Add detailed logging
            res.status(500).json({ error: err.message });
        });
}

export function createWing(req, res) {
    const { wing_name, representative_id, room_start, room_end } = req.body;

    console.log("Received data:", { wing_name, representative_id, room_start, room_end });  // Add data logging

    // First, insert the new wing into the wings table
    db.query('INSERT INTO wings (wing_name, representative_id, room_start, room_end) VALUES (?, ?, ?, ?)',
        [wing_name, representative_id, room_start, room_end])
        .then(([result]) => {
            const wing_id = result.insertId;
            console.log("Wing created with wing_id:", wing_id);  // Log the wing_id

            // Once the wing is added, we update the rooms table
            // Create an array of rooms with wing_id, room_number, and capacity
            const roomsToAdd = [];
            for (let i = parseInt(room_start); i <= parseInt(room_end); i++) {
                roomsToAdd.push([wing_id, i, 2]);  // Assuming capacity = 2 for all rooms
            }

            // Insert rooms into the rooms table with capacity
            return db.query('INSERT INTO rooms (wing_id, room_number, capacity) VALUES ?', [roomsToAdd]);


            // Insert rooms into the rooms table
            return db.query('INSERT INTO rooms (wing_id, room_number) VALUES ?', [roomsToAdd]);
        })
        .then(() => {
            res.status(201).json({ message: 'Wing and rooms created successfully' });
        })
        .catch(err => {
            console.error("Error creating wing:", err);  // Add error logging
            res.status(500).json({ error: err.message });
        });
}

export function updateWing(req, res) {
    const { id } = req.params;
    const { wing_name, representative_id, room_start, room_end } = req.body;

    db.query('UPDATE wings SET wing_name=?, representative_id=?, room_start=?, room_end=? WHERE wing_id=?',
        [wing_name, representative_id, room_start, room_end, id])
        .then(() => {
            res.json({ message: 'Wing updated successfully' });
        })
        .catch(err => {
            console.error("Error updating wing:", err);  // Add error logging
            res.status(500).json({ error: err.message });
        });
}
