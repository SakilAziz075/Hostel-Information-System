import db from '../config/db.js'; 
import xlsx from 'xlsx';

// Service function to add a new boarder
export const addBoarder = async (student_id, name, email, room_id) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        await connection.query(
            'INSERT INTO students (student_id, name, email, room_number) VALUES (?, ?, ?, ?)',
            [student_id, name, email, room_id]
        );

        await connection.query(
            'UPDATE rooms SET current_occupants = current_occupants + 1 WHERE room_number = ?',
            [room_id]
        );

        await connection.commit();
    } catch (error) {
        await connection.rollback();
        throw new Error('Failed to add boarder');
    } finally {
        connection.release();
    }
};


// Service function to update an existing boarder
export const updateBoarder = async (student_id, name, email, new_room) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const [[existing]] = await connection.query(
            'SELECT room_number FROM students WHERE student_id = ?',
            [student_id]
        );

        const old_room = existing?.room_number;

        await connection.query(
            'UPDATE students SET name = ?, email = ?, room_number = ? WHERE student_id = ?',
            [name, email, new_room, student_id]
        );

        if (old_room && old_room !== new_room) {
            await connection.query(
                'UPDATE rooms SET current_occupants = current_occupants - 1 WHERE room_number = ?',
                [old_room]
            );
            await connection.query(
                'UPDATE rooms SET current_occupants = current_occupants + 1 WHERE room_number = ?',
                [new_room]
            );
        }

        await connection.commit();
    } catch (error) {
        await connection.rollback();
        throw new Error('Failed to update boarder');
    } finally {
        connection.release();
    }
};



// Service function to remove a boarder
export const removeBoarder = async (student_id) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const [[student]] = await connection.query(
            'SELECT room_number FROM students WHERE student_id = ?',
            [student_id]
        );

        await connection.query(
            'DELETE FROM students WHERE student_id = ?',
            [student_id]
        );

        if (student?.room_number) {
            await connection.query(
                'UPDATE rooms SET current_occupants = current_occupants - 1 WHERE room_number = ?',
                [student.room_number]
            );
        }

        await connection.commit();
    } catch (error) {
        await connection.rollback();
        throw new Error('Failed to remove boarder');
    } finally {
        connection.release();
    }
};


// Service function to handle the upload and processing of boarders from a spreadsheet
export const uploadBoarders = async (filePath) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(sheet);

        // Reset all occupancy to 0
        await connection.query('UPDATE rooms SET current_occupants = 0');

        // Keep a map to count new room assignments
        const roomCounts = {};

        for (const row of data) {
            const { student_id, name, email, room_id } = row;

            await connection.query(
                'INSERT INTO students (student_id, name, email, room_number) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE name = ?, email = ?, room_number = ?',
                [student_id, name, email, room_id, name, email, room_id]
            );

            // Increment room count
            if (!roomCounts[room_id]) {
                roomCounts[room_id] = 0;
            }
            roomCounts[room_id]++;
        }

        // Update room occupants based on counted values
        for (const [room_number, count] of Object.entries(roomCounts)) {
            await connection.query(
                'UPDATE rooms SET current_occupants = ? WHERE room_number = ?',
                [count, room_number]
            );
        }

        await connection.commit();
    } catch (error) {
        await connection.rollback();
        throw new Error('Failed to upload boarders');
    } finally {
        connection.release();
    }
};

// Service function to get room and boarder information
export const getBoardersByRoom = async () => {
    const connection = await db.getConnection();
    try {
        const [rows] = await connection.query(`
            SELECT 
                r.room_number,
                r.capacity,
                r.current_occupants,
                s.student_id,
                s.name,
                s.email
            FROM rooms r
            LEFT JOIN students s ON r.room_number = s.room_number
            ORDER BY r.room_number ASC, s.name ASC
        `);
        return rows;
    } catch (error) {
        throw new Error('Failed to fetch boarders by room');
    } finally {
        connection.release();
    }
};