import api from './client.js'


export const getMine = (params) =>
	api.get('/notifications', { params })

export const markRead = (id) =>
	api.patch(`/notifications/${id}/read`)

export const markAllRead = () =>
	api.patch('/notifications/read-all')

export const sendCustom = (data) =>
	api.post('/notifications/custom', data)
