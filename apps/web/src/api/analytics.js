import api from './client.js'

export const getAdminTrainingAnalytics = () =>
	api.get('/analytics/admin-training')
