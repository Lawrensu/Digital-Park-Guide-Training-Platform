import axios from 'axios'
import api from './client.js'


export const presign = (purpose, contentType, extension) =>
	api.post('/uploads/presign', { purpose, contentType, extension })

export const uploadToS3 = (url, file) =>
	axios.put(url, file, {
		headers: { 'Content-Type': file.type },
	})
