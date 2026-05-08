import api from './client.js'


export const getMe = () =>
	api.get('/users/me')

export const getAll = (params) =>
	api.get('/users', { params })

export const getOne = (id) =>
	api.get(`/users/${id}`)

export const update = (id, data) =>
	api.patch(`/users/${id}`, data)

export const updateStatus = (id, status) =>
	api.patch(`/users/${id}/status`, { status })

export const createAdmin = (data) =>
	api.post('/users/admins', data)

export const getEnrolments = (id) =>
	api.get('/enrolments', { params: { guideId: id } })

export const getQuizAttempts = (id) =>
	api.get('/quiz-attempts', { params: { guideId: id } })

export const getCertifications = (id) =>
	api.get('/certifications', { params: { guideId: id } })

export const getBadges = (id) =>
	api.get(`/badges/users/${id}`)
