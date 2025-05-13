import { hash, compare } from 'bcrypt';
import jwt from 'jsonwebtoken';
const { sign } = jwt;

import db from '../config/db.js'; // mysql2 pool

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

async function register({ name, email, password, role = 'student' }) {
    const [existing] = await db.query('SELECT user_id FROM users WHERE email = ?', [email]);
    if (existing.length) {
        const err = new Error('Email already registered');
        err.status = 409;
        throw err;
    }

    const passwordHash = await hash(password, SALT_ROUNDS);
    const [result] = await db.query(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        [name, email, passwordHash, role]
    );
    return { id: result.insertId, name, email, role };
}

async function login({ email, password, role }) {
    const [rows] = await db.query('SELECT user_id, password, role FROM users WHERE email = ?', [email]);
    if (!rows.length) {
        const err = new Error('Invalid credentials');
        err.status = 401;
        throw err;
    }

    const user = rows[0];
    const match = await compare(password, user.password);
    if (!match) {
        const err = new Error('Invalid credentials');
        err.status = 401;
        throw err;
    }

    if (user.role !== role) {
        const err = new Error('Role mismatch');
        err.status = 403;
        throw err;
    }

    let student_id = null;
    if (role !== 'warden') {
        // Fetch student_id for complaint-related roles
        const [studentRows] = await db.query('SELECT student_id FROM students WHERE email = ?', [email]);
        if (!studentRows.length) {
            const err = new Error('Student record not found');
            err.status = 404;
            throw err;
        }
        student_id = studentRows[0].student_id;
    }

    const token = sign({ sub: user.user_id, role: user.role, student_id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    return { token, role: user.role, student_id, expiresIn: JWT_EXPIRES_IN };
}


export default { register, login };
