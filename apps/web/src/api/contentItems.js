import api from './client.js'


export const getOne = (itemId) =>
	api.get(`/content-items/${itemId}`)

export const update = (itemId, data) =>
	api.patch(`/content-items/${itemId}`, data)

export const remove = (itemId) =>
	api.delete(`/content-items/${itemId}`)
