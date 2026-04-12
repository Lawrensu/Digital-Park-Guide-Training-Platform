// usage: requireRole('ADMIN') or requireRole('GUIDE')
// requireAuth must come before this in the route chain
const requireRole = (role) => (req, res, next) => {
    if (req.user?.role !== role) {
        return res.status(403).json({
            success: false,
            error: { code: 'FORBIDDEN', message: 'Insufficient permissions' },
        });
    }
    next();
};

export default requireRole;
