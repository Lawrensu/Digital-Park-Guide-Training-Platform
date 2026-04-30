import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import * as authApi from '../api/auth.js'
import { setAccessToken, clearAccessToken, setOnAuthFailure } from '../api/client.js'


const AuthContext = createContext(null)


export const AuthProvider = ({ children }) => {
	const [user, setUser]       = useState(null)
	const [loading, setLoading] = useState(false)
	const [booting, setBooting] = useState(true)
	const navigate = useNavigate()

	const logout = useCallback(async () => {
		try {
			await authApi.logout()
		} catch {
			// Ignore logout API errors; clear local state regardless
		}
		clearAccessToken()
		setUser(null)
		navigate('/')
	}, [navigate])

	useEffect(() => {
		setOnAuthFailure(() => {
			clearAccessToken()
			setUser(null)
			navigate('/')
		})
	}, [navigate])

	useEffect(() => {
		const silentRefresh = async () => {
			try {
				const { data } = await authApi.refresh()
				setAccessToken(data.data.accessToken)
				setUser(data.data.user)
			} catch {
				// No valid session; user stays null and sees login
			} finally {
				setBooting(false)
			}
		}
		silentRefresh()
	}, [])

	const login = async (username, password) => {
		setLoading(true)
		try {
			const { data } = await authApi.login(username, password)
			setAccessToken(data.data.accessToken)
			setUser(data.data.user)
			if (data.data.user.role === 'ADMIN') {
				navigate('/dashboard')
			} else {
				navigate('/guide/home')
			}
			return { success: true }
		} catch (err) {
			const message = err.response?.data?.error?.message ?? 'Invalid credentials'
			return { success: false, message }
		} finally {
			setLoading(false)
		}
	}

	if (booting) {
		return null
	}

	return (
		<AuthContext.Provider value={{
			user,
			login,
			logout,
			loading,
			isAuthenticated: !!user,
		}}>
			{children}
		</AuthContext.Provider>
	)
}


export const useAuth = () => useContext(AuthContext)
