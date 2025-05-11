import db from '../config/db.js';

export function getAllWings(req, res) {
    db.query('SELECT * FROM wings')
        .then(([results]) => {
            res.json(results);
        })
        .catch(err => {
            console.error("Error fetching wings:", err);
            res.status(500).json({ error: err.message });
        });
}

export function createWing(req, res) {
    let { wing_name, representative_id, room_start, room_end } = req.body;

    console.log("Received data:", { wing_name, representative_id, room_start, room_end });

    // Convert empty string to null for representative_id
    if (representative_id === '') {
        representative_id = null;
    }

    db.query(
        'INSERT INTO wings (wing_name, representative_id, room_start, room_end) VALUES (?, ?, ?, ?)',
        [wing_name, representative_id, room_start, room_end]
    )
    .then(([result]) => {
        console.log("Wing created with wing_id:", result.insertId);

        const roomsToAdd = [];
        for (let i = parseInt(room_start); i <= parseInt(room_end); i++) {
            roomsToAdd.push([String(i), 2]);  // room_number as VARCHAR
        }

        return db.query('INSERT INTO rooms (room_number, capacity) VALUES ?', [roomsToAdd]);
    })
    .then(() => {
        res.status(201).json({ message: 'Wing and rooms created successfully' });
    })
    .catch(err => {
        console.error("Error creating wing:", err);
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
            console.error("Error updating wing:", err);
            res.status(500).json({ error: err.message });
        });
}
