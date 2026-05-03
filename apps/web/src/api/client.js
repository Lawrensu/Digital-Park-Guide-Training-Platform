import axios from 'axios'


let accessToken = null
let onAuthFailure = null


export const setAccessToken = (token) => { accessToken = token }
export const getAccessToken = () => accessToken
export const clearAccessToken = () => { accessToken = null }

export const setOnAuthFailure = (callback) => { onAuthFailure = callback }


const api = axios.create({
	baseURL: '/api',
	withCredentials: true,
})


api.interceptors.request.use((config) => {
	if (accessToken) {
		config.headers.Authorization = `Bearer ${accessToken}`
	}
	return config
})


let isRefreshing = false
let pendingQueue = []

const processQueue = (error, token = null) => {
	pendingQueue.forEach((p) => {
		if (error) {
			p.reject(error)
		} else {
			p.resolve(token)
		}
	})
	pendingQueue = []
}

api.interceptors.response.use(
	(response) => response,
	async (error) => {
		const original = error.config

		if (error.response?.status !== 401 || original._retry) {
			return Promise.reject(error)
		}

		if (isRefreshing) {
			return new Promise((resolve, reject) => {
				pendingQueue.push({ resolve, reject })
			}).then((token) => {
				original.headers.Authorization = `Bearer ${token}`
				return api(original)
			})
		}

		original._retry = true
		isRefreshing = true

		try {
			const { data } = await axios.post('/api/auth/refresh', {}, { withCredentials: true })
			const newToken = data.data.accessToken
			setAccessToken(newToken)
			processQueue(null, newToken)
			original.headers.Authorization = `Bearer ${newToken}`
			return api(original)
		} catch (refreshError) {
			processQueue(refreshError, null)
			clearAccessToken()
			onAuthFailure?.()
			return Promise.reject(refreshError)
		} finally {
			isRefreshing = false
		}
	}
)


export default api
