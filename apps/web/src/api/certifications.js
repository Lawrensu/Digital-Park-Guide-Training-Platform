import api from './client.js'


export const issue = (data) =>
	api.post('/certifications', data)

export const getAll = (params) =>
	api.get('/certifications', { params })

export const getMine = () =>
	api.get('/certifications')

export const getOne = (id) =>
	api.get(`/certifications/${id}`)

export const getDownloadUrl = (id) =>
	api.get(`/certifications/${id}/download`)

export const verifyPublic = (id) =>
	api.get(`/certifications/verify/${id}`)
