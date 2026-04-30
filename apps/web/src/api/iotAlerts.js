import api from './client.js'


export const getAll = (params) =>
	api.get('/iot-alerts', { params })

export const getOne = (alertId) =>
	api.get(`/iot-alerts/${alertId}`)

export const getEvidenceUrl = (alertId) =>
	api.get(`/iot-alerts/${alertId}/evidence-url`)

export const flag = (alertId, status) =>
	api.patch(`/iot-alerts/${alertId}/flag`, { status })
