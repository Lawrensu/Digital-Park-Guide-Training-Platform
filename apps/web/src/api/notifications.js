import api from './client.js'


export const getMine = (params) =>
	api.get('/notifications/me', { params })

export const markRead = (id) =>
	api.patch(`/notifications/${id}/read`)

export const markAllRead = () =>
	api.patch('/notifications/me/read-all')

export const sendCustom = (data) =>
	api.post('/notifications/custom', data)
