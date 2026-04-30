import api from './client.js'


export const getAll = (params) =>
	api.get('/modules', { params })

export const getOne = (id) =>
	api.get(`/modules/${id}`)

export const create = (data) =>
	api.post('/modules', data)

export const update = (id, data) =>
	api.patch(`/modules/${id}`, data)

export const remove = (id) =>
	api.delete(`/modules/${id}`)

export const getContent = (id) =>
	api.get(`/modules/${id}/content`)

export const addContent = (id, data) =>
	api.post(`/modules/${id}/content`, data)

export const reorderContent = (id, orderedIds) =>
	api.patch(`/modules/${id}/content/reorder`, { orderedIds })
