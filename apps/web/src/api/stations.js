import api from './client.js'


export const getAll = () =>
	api.get('/stations')

export const getOne = (id) =>
	api.get(`/stations/${id}`)

export const create = (data) =>
	api.post('/stations', data)

export const update = (id, data) =>
	api.patch(`/stations/${id}`, data)

export const remove = (id) =>
	api.delete(`/stations/${id}`)
