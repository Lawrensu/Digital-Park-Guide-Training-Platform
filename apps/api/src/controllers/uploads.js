import crypto from 'crypto';
import { getPresignedUploadUrl } from '../lib/s3.js';


const PURPOSE_PREFIX = {
	cv: 'cv',
	'content-image': 'content',
	'badge-image': 'badges',
	'iot-evidence': 'iot-evidence',
};



export const presign = async (req, res) => {
	try {
		const { purpose, contentType, extension } = req.body;

		// cv uploads are public (part of registration). everything else requires auth.
		if (purpose !== 'cv' && !req.user) {
			return res.status(401).json({ success: false, error: { code: 'UNAUTHENTICATED', message: 'Auth required for this upload type' } });
		}

		// admin only purposes
		if ((purpose === 'content-image' || purpose === 'badge-image') && req.user?.role !== 'ADMIN') {
			return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'Insufficient permissions' } });
		}

		const prefix = PURPOSE_PREFIX[purpose];
		const key = `${prefix}/${crypto.randomUUID()}.${extension.replace(/^\./, '')}`;

		const { url } = await getPresignedUploadUrl(key, contentType, 300);
		return res.status(200).json({ success: true, data: { url, key } });
	} catch (err) {
		return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
	}
};
