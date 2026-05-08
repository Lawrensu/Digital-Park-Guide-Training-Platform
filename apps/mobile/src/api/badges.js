import { api } from '../services/api';

export const badgesApi = {
	getAll: () => api.get('/badges'),

	getEarned: (userId) => api.get(`/badges/users/${userId}`),
};
