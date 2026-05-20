import * as SQLite from 'expo-sqlite';

let db = null;


// ─── INITIALISATION ───────────────────────────────────────────────────────────

export async function initDatabase() {
	db = await SQLite.openDatabaseAsync('parkguide_offline.db');

	await db.execAsync(`
		PRAGMA journal_mode = WAL;

		CREATE TABLE IF NOT EXISTS cache (
			key       TEXT PRIMARY KEY,
			value     TEXT NOT NULL,
			cached_at TEXT NOT NULL
		);

		CREATE TABLE IF NOT EXISTS quiz_outbox (
			client_id      TEXT PRIMARY KEY,
			quiz_id        TEXT NOT NULL,
			module_id      TEXT NOT NULL,
			module_title   TEXT NOT NULL,
			quiz_title     TEXT NOT NULL,
			attempt_number INTEGER NOT NULL DEFAULT 1,
			submitted_at   TEXT NOT NULL,
			responses      TEXT NOT NULL,
			status         TEXT NOT NULL DEFAULT 'pending',
			retry_count    INTEGER NOT NULL DEFAULT 0,
			last_error     TEXT,
			created_at     TEXT NOT NULL
		);

		CREATE TABLE IF NOT EXISTS progress_outbox (
			content_item_id TEXT PRIMARY KEY,
			module_id       TEXT NOT NULL,
			queued_at       TEXT NOT NULL,
			status          TEXT NOT NULL DEFAULT 'pending'
		);

		UPDATE quiz_outbox SET status = 'pending' WHERE status = 'syncing';
	`);
}


// ─── CACHE READ ───────────────────────────────────────────────────────────────

export async function getCachedEnrolments() {
	try {
		const row = await db.getFirstAsync('SELECT value FROM cache WHERE key = ?', ['enrolments']);
		if (!row) return [];
		try { return JSON.parse(row.value); } catch { return []; }
	} catch (err) {
		console.warn('db.getCachedEnrolments error:', err);
		return [];
	}
}


export async function getCachedModuleDetail(moduleId) {
	try {
		const row = await db.getFirstAsync('SELECT value FROM cache WHERE key = ?', [`module_${moduleId}`]);
		if (!row) return null;
		try { return JSON.parse(row.value); } catch { return null; }
	} catch (err) {
		console.warn('db.getCachedModuleDetail error:', err);
		return null;
	}
}


export async function getCachedContentItems(moduleId) {
	try {
		const row = await db.getFirstAsync('SELECT value FROM cache WHERE key = ?', [`items_${moduleId}`]);
		if (!row) return [];
		try { return JSON.parse(row.value); } catch { return []; }
	} catch (err) {
		console.warn('db.getCachedContentItems error:', err);
		return [];
	}
}


export async function getCachedQuiz(quizId) {
	try {
		const row = await db.getFirstAsync('SELECT value FROM cache WHERE key = ?', [`quiz_${quizId}`]);
		if (!row) return null;
		try { return JSON.parse(row.value); } catch { return null; }
	} catch (err) {
		console.warn('db.getCachedQuiz error:', err);
		return null;
	}
}


export async function getCachedCertCount() {
	try {
		const row = await db.getFirstAsync('SELECT value FROM cache WHERE key = ?', ['cert_count']);
		if (!row) return 0;
		try { return JSON.parse(row.value); } catch { return 0; }
	} catch (err) {
		console.warn('db.getCachedCertCount error:', err);
		return 0;
	}
}


// ─── CACHE WRITE ──────────────────────────────────────────────────────────────

export async function setCachedEnrolments(enrolments) {
	try {
		await db.runAsync(
			'INSERT OR REPLACE INTO cache (key, value, cached_at) VALUES (?, ?, ?)',
			['enrolments', JSON.stringify(enrolments), new Date().toISOString()]
		);
	} catch (err) {
		console.warn('db.setCachedEnrolments error:', err);
	}
}


export async function setCachedModuleDetail(moduleId, module) {
	try {
		await db.runAsync(
			'INSERT OR REPLACE INTO cache (key, value, cached_at) VALUES (?, ?, ?)',
			[`module_${moduleId}`, JSON.stringify(module), new Date().toISOString()]
		);
	} catch (err) {
		console.warn('db.setCachedModuleDetail error:', err);
	}
}


export async function setCachedContentItems(moduleId, items) {
	try {
		await db.runAsync(
			'INSERT OR REPLACE INTO cache (key, value, cached_at) VALUES (?, ?, ?)',
			[`items_${moduleId}`, JSON.stringify(items), new Date().toISOString()]
		);
	} catch (err) {
		console.warn('db.setCachedContentItems error:', err);
	}
}


export async function setCachedQuiz(quizId, quiz) {
	try {
		await db.runAsync(
			'INSERT OR REPLACE INTO cache (key, value, cached_at) VALUES (?, ?, ?)',
			[`quiz_${quizId}`, JSON.stringify(quiz), new Date().toISOString()]
		);
	} catch (err) {
		console.warn('db.setCachedQuiz error:', err);
	}
}


export async function setCachedCertCount(count) {
	try {
		await db.runAsync(
			'INSERT OR REPLACE INTO cache (key, value, cached_at) VALUES (?, ?, ?)',
			['cert_count', JSON.stringify(count), new Date().toISOString()]
		);
	} catch (err) {
		console.warn('db.setCachedCertCount error:', err);
	}
}


export async function setCacheTime() {
	try {
		await db.runAsync(
			'INSERT OR REPLACE INTO cache (key, value, cached_at) VALUES (?, ?, ?)',
			['cache_time', JSON.stringify(new Date().toISOString()), new Date().toISOString()]
		);
	} catch (err) {
		console.warn('db.setCacheTime error:', err);
	}
}


// ─── QUIZ OUTBOX ──────────────────────────────────────────────────────────────

export async function getQuizOutbox() {
	try {
		const rows = await db.getAllAsync(
			"SELECT * FROM quiz_outbox WHERE status = 'pending' ORDER BY created_at ASC",
			[]
		);
		return rows.map((r) => {
			try { r.responses = JSON.parse(r.responses); } catch { r.responses = []; }
			return r;
		});
	} catch (err) {
		console.warn('db.getQuizOutbox error:', err);
		return [];
	}
}


export async function addToQuizOutbox(attempt) {
	try {
		await db.runAsync(
			`INSERT OR IGNORE INTO quiz_outbox
			 (client_id, quiz_id, module_id, module_title, quiz_title, attempt_number, submitted_at, responses, status, retry_count, created_at)
			 VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', 0, ?)`,
			[
				attempt.clientId,
				attempt.quizId,
				attempt.moduleId,
				attempt.moduleTitle,
				attempt.quizTitle,
				attempt.attemptNumber ?? 1,
				attempt.submittedAt,
				JSON.stringify(attempt.responses),
				new Date().toISOString(),
			]
		);
	} catch (err) {
		console.warn('db.addToQuizOutbox error:', err);
	}
}


export async function removeFromQuizOutbox(clientIds) {
	if (!clientIds || clientIds.length === 0) return;
	try {
		await db.withTransactionAsync(async () => {
			for (const id of clientIds) {
				await db.runAsync('DELETE FROM quiz_outbox WHERE client_id = ?', [id]);
			}
		});
	} catch (err) {
		console.warn('db.removeFromQuizOutbox error:', err);
	}
}


export async function markQuizOutboxSyncing(clientId) {
	try {
		await db.runAsync(
			"UPDATE quiz_outbox SET status = 'syncing' WHERE client_id = ?",
			[clientId]
		);
	} catch (err) {
		console.warn('db.markQuizOutboxSyncing error:', err);
	}
}


export async function markQuizOutboxFailed(clientId, errorMessage) {
	try {
		await db.runAsync(
			`UPDATE quiz_outbox
			 SET status = 'pending', retry_count = retry_count + 1, last_error = ?
			 WHERE client_id = ?`,
			[errorMessage ?? 'Unknown error', clientId]
		);
	} catch (err) {
		console.warn('db.markQuizOutboxFailed error:', err);
	}
}


// ─── PROGRESS OUTBOX ──────────────────────────────────────────────────────────

export async function getProgressOutbox() {
	try {
		return await db.getAllAsync(
			"SELECT * FROM progress_outbox WHERE status = 'pending' ORDER BY queued_at ASC",
			[]
		);
	} catch (err) {
		console.warn('db.getProgressOutbox error:', err);
		return [];
	}
}


export async function addToProgressOutbox(contentItemId, moduleId) {
	try {
		await db.runAsync(
			`INSERT OR IGNORE INTO progress_outbox (content_item_id, module_id, queued_at, status)
			 VALUES (?, ?, ?, 'pending')`,
			[contentItemId, moduleId, new Date().toISOString()]
		);
	} catch (err) {
		console.warn('db.addToProgressOutbox error:', err);
	}
}


export async function removeFromProgressOutbox(contentItemIds) {
	if (!contentItemIds || contentItemIds.length === 0) return;
	try {
		await db.withTransactionAsync(async () => {
			for (const id of contentItemIds) {
				await db.runAsync('DELETE FROM progress_outbox WHERE content_item_id = ?', [id]);
			}
		});
	} catch (err) {
		console.warn('db.removeFromProgressOutbox error:', err);
	}
}


// ─── UTILITY ──────────────────────────────────────────────────────────────────

export async function clearAllCache() {
	try {
		await db.withTransactionAsync(async () => {
			await db.runAsync('DELETE FROM cache', []);
			await db.runAsync('DELETE FROM quiz_outbox', []);
			await db.runAsync('DELETE FROM progress_outbox', []);
		});
	} catch (err) {
		console.warn('db.clearAllCache error:', err);
	}
}
