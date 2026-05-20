import * as SecureStore from 'expo-secure-store';
import { API_BASE } from '../config';

const REFRESH_KEY = 'parkguide_refresh_token';
const USER_KEY = 'parkguide_user';

let _accessToken = null;
let _onLogout = null;

export const setAccessToken = (token) => { _accessToken = token; };
export const clearAccessToken = () => { _accessToken = null; };
export const setLogoutCallback = (fn) => { _onLogout = fn; };

export const tokenStorage = {
	saveRefresh: (token) => SecureStore.setItemAsync(REFRESH_KEY, token),
	loadRefresh: () => SecureStore.getItemAsync(REFRESH_KEY),
	clearRefresh: () => SecureStore.deleteItemAsync(REFRESH_KEY),
	saveUser: (user) => SecureStore.setItemAsync(USER_KEY, JSON.stringify(user)),
	loadUser: async () => {
		const raw = await SecureStore.getItemAsync(USER_KEY);
		return raw ? JSON.parse(raw) : null;
	},
	clearUser: () => SecureStore.deleteItemAsync(USER_KEY),
};

const buildQuery = (params) => {
	if (!params) return '';
	const q = Object.entries(params)
		.filter(([, v]) => v !== undefined && v !== null)
		.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
		.join('&');
	return q ? `?${q}` : '';
};

const attemptRefresh = async () => {
	const refreshToken = await tokenStorage.loadRefresh();
	if (!refreshToken) throw new Error('NO_REFRESH_TOKEN');

	const res = await fetch(`${API_BASE}/auth/refresh`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ refreshToken }),
	});

	if (!res.ok) {
		await tokenStorage.clearRefresh();
		await tokenStorage.clearUser();
		throw new Error('REFRESH_FAILED');
	}

	const json = await res.json();
	setAccessToken(json.data.accessToken);
};

const request = async (method, path, body, _retrying = false) => {
	const headers = { 'Content-Type': 'application/json' };
	if (_accessToken) headers['Authorization'] = `Bearer ${_accessToken}`;

	const options = { method, headers };
	if (body !== undefined) options.body = JSON.stringify(body);

	const res = await fetch(`${API_BASE}${path}`, options);

	if (res.status === 401 && !_retrying) {
		try {
			await attemptRefresh();
			return request(method, path, body, true);
		} catch {
			if (_onLogout) _onLogout();
			const err = new Error('SESSION_EXPIRED');
			err.status = 401;
			throw err;
		}
	}

	if (res.status === 204) return null;

	const json = await res.json();

	if (!json.success) {
		const err = new Error(json.error?.message || 'Request failed');
		err.status = res.status;
		err.code = json.error?.code;
		err.details = json.error?.details;
		throw err;
	}

	return json.data;
};

export const api = {
	get:    (path, params) => request('GET', path + buildQuery(params)),
	post:   (path, body)   => request('POST',   path, body),
	patch:  (path, body)   => request('PATCH',  path, body),
	delete: (path)         => request('DELETE', path),
};
