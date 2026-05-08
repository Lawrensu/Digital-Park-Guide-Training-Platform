import { api } from '../services/api';

export const contentItemsApi = {
	getAll: (moduleId) => api.get(`/modules/${moduleId}/content-items`),

	create: (moduleId, data) => api.post(`/modules/${moduleId}/content-items`, data),

	update: (moduleId, itemId, data) =>
		api.patch(`/modules/${moduleId}/content-items/${itemId}`, data),

	remove: (moduleId, itemId) =>
		api.delete(`/modules/${moduleId}/content-items/${itemId}`),

	getImageUrl: (moduleId, itemId) =>
		api.get(`/modules/${moduleId}/content-items/${itemId}/image-url`),
};
