import { hash, compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import db from '../config/db'; // mysql2 pool

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

async function register({ name, email, contact_number, password, role = 'student' }) {
    const [existing] = await db.query('SELECT student_id FROM students WHERE email = ?', [email]);
    if (existing.length) {
        const err = new Error('Email already registered');
        err.status = 409;
        throw err;
    }

    const password_hash = await hash(password, SALT_ROUNDS);
    const [result] = await db.query(
        'INSERT INTO students (name, email, contact_number, password_hash, role) VALUES (?,?,?,?,?)',
        [name, email, contact_number, password_hash, role]
    );
    return { id: result.insertId, name, email, role };
}

async function login({ email, password, role }) {
    const [rows] = await db.query('SELECT student_id, password_hash, role FROM students WHERE email = ?', [email]);
    if (!rows.length) {
        const err = new Error('Invalid credentials');
        err.status = 401;
        throw err;
    }

    const user = rows[0];



    const match = await compare(password, user.password_hash);
    if (!match) {
        const err = new Error('Invalid credentials');
        err.status = 401;
        throw err;
    }

    // Check if role matches
    if (user.role !== role) {
        const err = new Error('Role mismatch');
        err.status = 403;
        throw err;
    }

    const token = sign({ sub: user.student_id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    return { token, expiresIn: JWT_EXPIRES_IN };
}

export default { register, login };