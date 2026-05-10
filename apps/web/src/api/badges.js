import api from './client.js'


export const getAll = () =>
	api.get('/badges')

export const getOne = (id) =>
	api.get(`/badges/${id}`)

export const create = (data) =>
	api.post('/badges', data)

export const update = (id, data) =>
	api.patch(`/badges/${id}`, data)

export const remove = (id) =>
	api.delete(`/badges/${id}`)

export const getEarned = (userId) =>
	api.get(`/badges/users/${userId}`)
