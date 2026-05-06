import api from './client.js'


export const getAll = (params) =>
	api.get('/modules', { params })

export const getOne = (id) =>
	api.get(`/modules/${id}`)

export const create = (data) =>
	api.post('/modules', data)

export const update = (id, data) =>
	api.patch(`/modules/${id}`, data)

export const updateStatus = (id, status) =>
	api.patch(`/modules/${id}/status`, { status })

export const remove = (id) =>
	api.delete(`/modules/${id}`)

export const getContent = (id) =>
	api.get(`/modules/${id}/content-items`)

export const addContent = (id, data) =>
	api.post(`/modules/${id}/content-items`, data)

export const reorderContent = (id, orderedIds) =>
	api.patch(`/modules/${id}/content-items/reorder`, {
		items: orderedIds.map((itemId, index) => ({ id: itemId, order: index })),
	})
