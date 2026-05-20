import { api } from '../services/api';

export const authApi = {
	forgotPassword: (email) =>
		api.post('/auth/forgot-password', { email }),

	resetPassword: (token, password) =>
		api.post('/auth/reset-password', { token, password }),

	setPassword: (token, password) =>
		api.post('/auth/set-password', { token, password }),

	resendActivation: (email) =>
		api.post('/auth/resend-activation', { email }),
};
