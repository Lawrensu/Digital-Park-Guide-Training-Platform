import { io } from 'socket.io-client'
import { getAccessToken } from './client.js'


let socket = null


export const connectSocket = () => {
	if (socket?.connected) return socket

	socket = io('http://localhost:3000', {
		auth: { token: getAccessToken() },
		withCredentials: true,
		transports: ['websocket'],
	})

	return socket
}


export const disconnectSocket = () => {
	socket?.disconnect()
	socket = null
}


export const getSocket = () => socket
