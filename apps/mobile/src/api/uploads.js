import { api } from '../services/api';

export const uploadsApi = {
	presign: (purpose, contentType, extension) =>
		api.post('/uploads/presign', { purpose, contentType, extension }),

	uploadToS3: async (url, file) => {
		const res = await fetch(url, {
			method: 'PUT',
			headers: { 'Content-Type': file.type || 'application/octet-stream' },
			body: file,
		});
		if (!res.ok) throw new Error(`S3 upload failed: ${res.status}`);
	},
};
