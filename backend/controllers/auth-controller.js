import authService from '../services/auth-service.js';

export async function registerController(req, res, next) {
  try {
    const user = await authService.register(req.body);
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (err) {
    next(err);
  }
}

export async function loginController(req, res, next) {
  try {
    console.log(req.body)

    const data = await authService.login(req.body); // ✅ Corrected here
    res.json({ message: 'Login successful', ...data });
  } catch (err) {
    next(err);
  }
}
