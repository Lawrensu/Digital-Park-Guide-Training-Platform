import jwt from 'jsonwebtoken';

// attaches req.user = { id, role } on success
// always put this before requireRole in a route chain
const requireAuth = (req, res, next) => {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            error: { code: 'UNAUTHENTICATED', message: 'Missing token' },
        });
    }
    try {
        const token = header.split(' ')[1];
        req.user = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        next();
    } catch {
        return res.status(401).json({
            success: false,
            error: { code: 'UNAUTHENTICATED', message: 'Invalid or expired token' },
        });
    }
};

export default requireAuth;
