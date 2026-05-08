import { api } from '../services/api';

export const enrolmentsApi = {
	enrol: (moduleId) =>
		api.post('/enrolments/me', { moduleId }),

	getMyEnrolments: (params) => api.get('/enrolments', params),

	getMyEnrolmentForModule: async (moduleId) => {
		const data = await api.get('/enrolments', { moduleId });
		return Array.isArray(data) ? data[0] ?? null : null;
	},

	markProgress: (contentItemId) =>
		api.post('/enrolments/me/progress', { contentItemId }),

	getAll: (params) => api.get('/enrolments', params),
};
