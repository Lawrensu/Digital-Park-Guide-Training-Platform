import { api } from '../services/api';

export const modulesApi = {
	getAll: (params) => api.get('/modules', params),

	getOne: (id) => api.get(`/modules/${id}`),

	create: (data) => api.post('/modules', data),

	update: (id, data) => api.patch(`/modules/${id}`, data),

	setStatus: (id, status) => api.patch(`/modules/${id}/status`, { status }),

	remove: (id) => api.delete(`/modules/${id}`),
};
