import { register, login } from '../services/auth-service';

export async function register(req, res, next) {
  try {
    const user = await register(req.body);
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const data = await login(req.body);
    res.json({ message: 'Login successful', ...data });
  } catch (err) {
    next(err);
  }
}