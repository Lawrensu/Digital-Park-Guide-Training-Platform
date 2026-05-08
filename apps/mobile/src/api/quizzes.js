import { api } from '../services/api';

export const quizzesApi = {
	getAll: (params) => api.get('/quizzes', params),

	getOne: (id) => api.get(`/quizzes/${id}`),

	create: (data) => api.post('/quizzes', data),

	update: (id, data) => api.patch(`/quizzes/${id}`, data),

	remove: (id) => api.delete(`/quizzes/${id}`),

	addQuestion: (quizId, data) => api.post(`/quizzes/${quizId}/questions`, data),

	updateQuestion: (quizId, questionId, data) =>
		api.patch(`/quizzes/${quizId}/questions/${questionId}`, data),

	removeQuestion: (quizId, questionId) =>
		api.delete(`/quizzes/${quizId}/questions/${questionId}`),
};
