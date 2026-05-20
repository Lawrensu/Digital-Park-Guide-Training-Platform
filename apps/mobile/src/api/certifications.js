import { api } from '../services/api';

export const certificationsApi = {
	getMine: () => api.get('/certifications'),

	getAll: (params) => api.get('/certifications', params),

	getOne: (id) => api.get(`/certifications/${id}`),

	getDownloadUrl: (id) => api.get(`/certifications/${id}/download`),

	issue: (data) => api.post('/certifications', data),
};
