import { api } from '../services/api';

export const notificationsApi = {
	getMine: (params) => api.get('/notifications/me', params),

	markRead: (id) => api.patch(`/notifications/${id}/read`),

	markAllRead: () => api.patch('/notifications/me/read-all'),

	sendCustom: (data) => api.post('/notifications/custom', data),
};
