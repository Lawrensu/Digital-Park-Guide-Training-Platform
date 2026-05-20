import { api } from '../services/api';

export const usersApi = {
	getAll: (params) => api.get('/users', params),

	getOne: (id) => api.get(`/users/${id}`),

	update: (id, data) => api.patch(`/users/${id}`, data),

	updateStatus: (id, status) =>
		api.patch(`/users/${id}/status`, { status }),

	createAdmin: (data) => api.post('/users/admins', data),
};
