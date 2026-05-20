import { api } from '../services/api';

export const paymentsApi = {
	initiate: (quizId) => api.post('/payments/initiate', { quizId }),

	getMyStatus: (quizId) => api.get('/payments/me', { quizId }),
};
