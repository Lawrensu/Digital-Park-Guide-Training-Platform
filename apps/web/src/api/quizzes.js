import api from './client.js'


export const getOne = (quizId) =>
	api.get(`/quizzes/${quizId}`)

export const create = (data) =>
	api.post('/quizzes', data)

export const update = (quizId, data) =>
	api.patch(`/quizzes/${quizId}`, data)

export const remove = (quizId) =>
	api.delete(`/quizzes/${quizId}`)

export const addQuestion = (quizId, data) =>
	api.post(`/quizzes/${quizId}/questions`, data)

export const updateQuestion = (quizId, questionId, data) =>
	api.patch(`/quizzes/${quizId}/questions/${questionId}`, data)

export const removeQuestion = (quizId, questionId) =>
	api.delete(`/quizzes/${quizId}/questions/${questionId}`)
