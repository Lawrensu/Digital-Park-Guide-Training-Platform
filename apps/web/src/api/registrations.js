import api from './client.js'


export const submit = (data) =>
	api.post('/registrations', data)

export const getAll = (params) =>
	api.get('/registrations', { params })

export const getOne = (id) =>
	api.get(`/registrations/${id}`)

export const getCvUrl = (id) =>
	api.get(`/registrations/${id}/cv-url`)

export const approve = (id, data) =>
	api.patch(`/registrations/${id}/approve`, data)

export const reject = (id, data) =>
	api.patch(`/registrations/${id}/reject`, data)
