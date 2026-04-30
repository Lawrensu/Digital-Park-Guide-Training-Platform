// guards internal only routes for IoT ingest
// checks the internal secret header against process.env.INTERNAL_SECRET
const requireInternalSecret = (req, res, next) => {
    const provided = req.headers['x-internal-secret'];
    if (!provided || provided !== process.env.INTERNAL_SECRET) {
        return res.status(401).json({
            success: false,
            error: { code: 'UNAUTHENTICATED', message: 'Invalid internal secret' },
        });
    }
    next();
};

export default requireInternalSecret;
