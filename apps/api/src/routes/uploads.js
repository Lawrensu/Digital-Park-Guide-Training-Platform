import { Router } from 'express';
import jwt from 'jsonwebtoken';
import validate from '../middleware/validate.js';
import { presignUploadSchema } from '../schemas/uploads.js';
import * as controller from '../controllers/uploads.js';

const router = Router();

// optional auth middleware: unauthenticated requests receive req.user = null
// (used because CV uploads happen before the user has an account)
const optionalAuth = (req, _res, next) => {
	const header = req.headers.authorization;
	if (header?.startsWith('Bearer ')) {
		try {
			req.user = jwt.verify(header.split(' ')[1], process.env.JWT_ACCESS_SECRET);
		} catch {
			req.user = null;
		}
	} else {
		req.user = null;
	}
	next();
};

router.post('/presign', optionalAuth, validate(presignUploadSchema), controller.presign);

export default router;
