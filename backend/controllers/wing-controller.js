import db from '../config/db.js';
import { hash } from 'bcrypt';

const DEFAULT_PASSWORD = '1234';
const SALT_ROUNDS = 10;

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
export async function createWing(req, res) {
    let { wing_name, representative_id, room_start, room_end } = req.body;

    console.log("Received data:", { wing_name, representative_id, room_start, room_end });

    if (representative_id === '') {
        representative_id = null;
    }

    try {
        // 1. Check & add user if rep ID is provided
        if (representative_id) {
            const [userCheck] = await db.query(
                'SELECT * FROM users WHERE email = (SELECT email FROM students WHERE student_id = ?)',
                [representative_id]
            );

            if (!userCheck.length) {
                // Get name & email from students table
                const [studentRows] = await db.query(
                    'SELECT name, email FROM students WHERE student_id = ?',
                    [representative_id]
                );

                if (!studentRows.length) {
                    return res.status(400).json({ error: 'Representative student not found in students table' });
                }

                const { name, email } = studentRows[0];
                const hashedPassword = await hash(DEFAULT_PASSWORD, SALT_ROUNDS);

                await db.query(
                    'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
                    [name, email, hashedPassword, 'wing representatives']
                );
            }
        }

        // 2. Create the wing
        const [result] = await db.query(
            'INSERT INTO wings (wing_name, representative_id, room_start, room_end) VALUES (?, ?, ?, ?)',
            [wing_name, representative_id, room_start, room_end]
        );

        console.log("Wing created with wing_id:", result.insertId);

        // 3. Add rooms
        const roomsToAdd = [];
        for (let i = parseInt(room_start); i <= parseInt(room_end); i++) {
            roomsToAdd.push([String(i), 2]);
        }

        await db.query('INSERT INTO rooms (room_number, capacity) VALUES ?', [roomsToAdd]);

        res.status(201).json({ message: 'Wing, rooms, and representative account (if needed) created successfully' });

    } catch (err) {
        console.error("Error creating wing:", err);
        res.status(500).json({ error: err.message });
    }
}

export async function updateWing(req, res) {
    const { id } = req.params;
    let { wing_name, representative_id, room_start, room_end } = req.body;

    if (representative_id === '') {
        representative_id = null;
    }

    try {
        // 1. Check & add user if rep ID is provided
        if (representative_id) {
            const [userCheck] = await db.query(
                'SELECT * FROM users WHERE email = (SELECT email FROM students WHERE student_id = ?)',
                [representative_id]
            );

            if (!userCheck.length) {
                const [studentRows] = await db.query(
                    'SELECT name, email FROM students WHERE student_id = ?',
                    [representative_id]
                );

                if (!studentRows.length) {
                    return res.status(400).json({ error: 'Representative student not found in students table' });
                }

                const { name, email } = studentRows[0];
                const hashedPassword = await hash(DEFAULT_PASSWORD, SALT_ROUNDS);

                await db.query(
                    'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
                    [name, email, hashedPassword, 'wing representatives']
                );
            }
        }

        // 2. Update wing
        await db.query(
            'UPDATE wings SET wing_name=?, representative_id=?, room_start=?, room_end=? WHERE wing_id=?',
            [wing_name, representative_id, room_start, room_end, id]
        );

        res.json({ message: 'Wing updated successfully (and representative account handled)' });

    } catch (err) {
        console.error("Error updating wing:", err);
        res.status(500).json({ error: err.message });
    }
}
