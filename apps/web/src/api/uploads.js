import axios from 'axios'
import api from './client.js'


export const presign = (fileName, fileType, folder) =>
	api.post('/uploads/presign', { fileName, fileType, folder })

export const uploadToS3 = (uploadUrl, file) =>
	axios.put(uploadUrl, file, {
		headers: { 'Content-Type': file.type },
	})
