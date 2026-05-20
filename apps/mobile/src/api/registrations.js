import { api } from '../services/api';

export const registrationsApi = {
	submit: (data) => api.post('/registrations', data),

	getAll: (params) => api.get('/registrations', params),

	getOne: (id) => api.get(`/registrations/${id}`),

	approve: (id, stationId, startDate) =>
		api.patch(`/registrations/${id}/approve`, { stationId, startDate }),

	reject: (id, rejectionReason) =>
		api.patch(`/registrations/${id}/reject`, { rejectionReason }),

	getCvUrl: (id) => api.get(`/registrations/${id}/cv-url`),
};
