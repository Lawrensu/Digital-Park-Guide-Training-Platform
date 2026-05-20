import { api } from '../services/api';

export const stationsApi = {
	getAll: (params) => api.get('/stations', params),

	getOne: (id) => api.get(`/stations/${id}`),
};
