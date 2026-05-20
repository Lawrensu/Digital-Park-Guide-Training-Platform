import { api } from '../services/api';

export const iotAlertsApi = {
	getAll: (params) => api.get('/iot-alerts', params),

	getOne: (id) => api.get(`/iot-alerts/${id}`),

	getEvidenceUrl: (id) => api.get(`/iot-alerts/${id}/evidence-url`),

	flag: (id, status) => api.patch(`/iot-alerts/${id}/flag`, { status }),
};
