import { verify } from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET;

export function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) 
    {
        return res.status(401).json({ message: 'Missing or malformed token' });
    }

    const token = authHeader.split(' ')[1];
    try 
    {
        const payload = verify(token, JWT_SECRET);
        req.user = payload;
        next();
    } 
    catch (err) 
    {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
}

export function authorize(...roles) { return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Forbidden: insufficient rights' });
    }
    next();
};     }