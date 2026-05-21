import RateLimit from 'express-rate-limit';

const rateLimit = (options = {}) => {
	const {
		windowMs = 15 * 60 * 1000,
		max = 10,
		message = 'Too many requests from this IP, please try again later',
		skipSuccessfulRequests = false,
	} = options;

	const limiter = RateLimit({
		windowMs,
		max,
		message,
		skipSuccessfulRequests,
		keyGenerator: (req) => req.ip || req.connection.remoteAddress,
		handler: (req, res) => {
			return res.status(429).json({
				success: false,
				error: {
					code: 'RATE_LIMIT_EXCEEDED',
					message: 'Too many requests, please try again later',
				},
			});
		},
		standardHeaders: false,
		legacyHeaders: false,
	});

	return limiter;
};

export default rateLimit;
