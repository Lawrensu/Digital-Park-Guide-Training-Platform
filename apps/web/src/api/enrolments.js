import api from './client.js'


export const enrol = (moduleId) =>
	api.post('/enrolments/me', { moduleId })

export const getMyEnrolments = (params) =>
	api.get('/enrolments', { params })

export const getMyEnrolmentForModule = (moduleId) =>
	api.get('/enrolments', { params: { moduleId } })

export const getAll = (params) =>
	api.get('/enrolments', { params })

export const setDueDate = (enrolmentId, dueAt) =>
	api.patch(`/enrolments/${enrolmentId}`, { dueAt })

export const remove = (enrolmentId) =>
	api.delete(`/enrolments/${enrolmentId}`)
