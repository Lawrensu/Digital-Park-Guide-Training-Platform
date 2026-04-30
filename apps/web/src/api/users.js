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
	api.get(`/users/${id}/enrolments`)

export const getQuizAttempts = (id) =>
	api.get(`/users/${id}/quiz-attempts`)

export const getCertifications = (id) =>
	api.get(`/users/${id}/certifications`)

export const getBadges = (id) =>
	api.get(`/users/${id}/badges`)
