import api from './client.js'


export const submit = (data) =>
	api.post('/quiz-attempts', data)

export const getAll = (params) =>
	api.get('/quiz-attempts', { params })

export const getOne = (attemptId) =>
	api.get(`/quiz-attempts/${attemptId}`)

export const grade = (attemptId, scores) =>
	api.post(`/quiz-attempts/${attemptId}/grade`, { scores })
