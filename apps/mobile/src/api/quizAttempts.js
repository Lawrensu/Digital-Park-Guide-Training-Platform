import { api } from '../services/api';

export const quizAttemptsApi = {
	submit: (quizId, responses) =>
		api.post('/quiz-attempts', { quizId, responses }),

	getAll: (params) => api.get('/quiz-attempts', params),

	getOne: (id) => api.get(`/quiz-attempts/${id}`),

	grade: (id, grades) =>
		api.patch(`/quiz-attempts/${id}/grade`, { grades }),
};
