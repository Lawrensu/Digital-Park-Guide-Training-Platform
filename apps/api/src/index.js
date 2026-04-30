import 'dotenv/config';
import http from 'http';
import jwt from 'jsonwebtoken';
import { Server as SocketServer } from 'socket.io';
import app from './app.js';

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

const io = new SocketServer(server, {
	cors: { origin: process.env.WEB_URL, credentials: true },
});

// JWT handshake: clients pass the access token as auth.token
io.use((socket, next) => {
	try {
		const token = socket.handshake.auth?.token;
		if (!token) return next(new Error('UNAUTHENTICATED'));
		const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
		socket.data.user = payload;
		next();
	} catch {
		next(new Error('UNAUTHENTICATED'));
	}
});

io.on('connection', (socket) => {
	const { id, role } = socket.data.user;
	socket.join(`user:${id}`);
	if (role === 'ADMIN') socket.join('admins');
});

app.set('io', io);

server.listen(PORT, () => {
	console.log(`API running on port ${PORT}`);
});
