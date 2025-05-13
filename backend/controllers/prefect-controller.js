import db from '../config/db.js';
import { hash } from 'bcrypt';

const SALT_ROUNDS = 10;

// Get all prefects
export const getAllPrefects = async (req, res) => {
    try {
        const [prefects] = await db.query('SELECT * FROM users WHERE role = "prefect"');
        console.log('Prefect list:', prefects);
        return res.status(200).json(prefects);
    } catch (err) {
        console.error('Error fetching prefects:', err);
        return res.status(500).json({ error: 'Failed to fetch prefects' });
    }
};

// Add a new prefect
export const addPrefect = async (req, res) => {
    const { student_id } = req.body;

    console.log('Checking if student exists for student_id:', student_id);

    const cleanedStudentId = student_id.trim();

    try {
        // Check if the student exists
        const [studentResult] = await db.query('SELECT * FROM students WHERE student_id = ?', [cleanedStudentId]);

        if (studentResult.length === 0) {
            console.log('Student not found');
            return res.status(404).json({ error: 'Student not found' });
        }

        const { name: studentName, email: studentEmail } = studentResult[0];

        // Optional: Check if user already exists
        const [existingUser] = await db.query('SELECT * FROM users WHERE email = ?', [studentEmail]);
        if (existingUser.length > 0) {
            return res.status(409).json({ error: 'Student is already a user' });
        }

        // Hash default password
        const defaultPassword = '1234';
        const hashedPassword = await hash(defaultPassword, SALT_ROUNDS);

        // Insert into users table
        const [insertResult] = await db.query(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, "prefect")',
            [studentName, studentEmail, hashedPassword]
        );

        console.log('Prefect added successfully:', insertResult);
        return res.status(200).json({ message: 'Prefect added successfully' });

    } catch (err) {
        console.error('Error in addPrefect:', err);
        return res.status(500).json({ error: 'Failed to add prefect' });
    }
};



// Remove a prefect
export const removePrefect = (req, res) => {
    const { user_id } = req.params;

    db.query('UPDATE users SET role = NULL WHERE user_id = ?', [user_id], (err) => {
        if (err) {
            console.error('Error removing prefect:', err);
            return res.status(500).json({ error: 'Failed to remove prefect' });
        }
        res.status(200).json({ message: 'Prefect removed successfully' });
    });
};

// Update prefect details (optional, could be for updating a floor or additional info)
export const updatePrefect = (req, res) => {
    const { user_id } = req.params;
    const { floor } = req.body; // You may update more info if necessary

    db.query('UPDATE users SET floor = ? WHERE user_id = ?', [floor, user_id], (err) => {
        if (err) {
            console.error('Error updating prefect:', err);
            return res.status(500).json({ error: 'Failed to update prefect' });
        }
        res.status(200).json({ message: 'Prefect updated successfully' });
    });
};
