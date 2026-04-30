import axios from 'axios'
import api from './client.js'


export const login = (username, password) =>
	axios.post('/api/auth/login', { username, password }, { withCredentials: true })

export const logout = () =>
	api.post('/auth/logout')

export const refresh = () =>
	axios.post('/api/auth/refresh', {}, { withCredentials: true })

export const setPassword = (token, password) =>
	axios.post('/api/auth/set-password', { token, password })

export const resendActivation = (email) =>
	axios.post('/api/auth/resend-activation', { email })

export const forgotPassword = (email) =>
	axios.post('/api/auth/forgot-password', { email })

export const resetPassword = (token, password) =>
	axios.post('/api/auth/reset-password', { token, password })
