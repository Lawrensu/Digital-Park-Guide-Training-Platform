import { api } from './api';
import { modulesApi } from '../api/modules';
import { enrolmentsApi } from '../api/enrolments';
import { contentItemsApi } from '../api/contentItems';
import { quizzesApi } from '../api/quizzes';
import { quizAttemptsApi } from '../api/quizAttempts';
import {
	getCachedEnrolments, setCachedEnrolments,
	getCachedModuleDetail, setCachedModuleDetail,
	getCachedContentItems, setCachedContentItems,
	getCachedQuiz, setCachedQuiz,
	getQuizOutbox, addToQuizOutbox, removeFromQuizOutbox,
	markQuizOutboxSyncing, markQuizOutboxFailed,
	getProgressOutbox, addToProgressOutbox, removeFromProgressOutbox,
} from '../database/db';

// Connectivity flag: updated by App.js AppInner via setOnlineStatus(bool).
// syncService cannot use React hooks, so this module-level flag bridges the gap.
let _isOnline = true;

// Prevents concurrent flush calls (e.g. rapid foreground events).
let _flushing = false;


export function setOnlineStatus(online) {
	_isOnline = online;
}


// ─── LOAD FUNCTIONS ───────────────────────────────────────────────────────────

async function loadEnrolments() {
	if (_isOnline) {
		try {
			const [modules, enrolments] = await Promise.all([
				modulesApi.getAll({ status: 'PUBLISHED', limit: 100 }),
				enrolmentsApi.getMyEnrolments({ limit: 100 }),
			]);
			const modArr = Array.isArray(modules) ? modules : [];
			const enrArr = Array.isArray(enrolments) ? enrolments : [];
			await setCachedEnrolments(enrArr);
			return { modules: modArr, enrolments: enrArr };
		} catch (err) {
			console.warn('syncService.loadEnrolments online failed, falling back to cache:', err);
		}
	}
	// offline fallback: derive modules from the enrolments cache (only enrolled modules visible)
	const cached = await getCachedEnrolments();
	const modules = cached.map((e) => e.module).filter(Boolean);
	return { modules, enrolments: cached };
}


async function loadModuleDetail(moduleId) {
	if (_isOnline) {
		try {
			const module = await modulesApi.getOne(moduleId);
			await setCachedModuleDetail(moduleId, module);
			// look up enrolment from the already-cached enrolments list
			const cachedEnrolments = await getCachedEnrolments();
			const enrolment = cachedEnrolments.find((e) => e.moduleId === moduleId) ?? null;
			return { module, enrolment };
		} catch (err) {
			console.warn('syncService.loadModuleDetail online failed, falling back to cache:', err);
		}
	}
	const module = await getCachedModuleDetail(moduleId);
	const cachedEnrolments = await getCachedEnrolments();
	const enrolment = cachedEnrolments.find((e) => e.moduleId === moduleId) ?? null;
	return { module, enrolment };
}


async function loadContentItems(moduleId) {
	if (_isOnline) {
		try {
			const items = await contentItemsApi.getAll(moduleId);
			const arr = Array.isArray(items) ? items : [];
			await setCachedContentItems(moduleId, arr);
			return arr;
		} catch (err) {
			console.warn('syncService.loadContentItems online failed, falling back to cache:', err);
		}
	}
	return getCachedContentItems(moduleId);
}


async function loadQuiz(quizId) {
	if (_isOnline) {
		try {
			const quiz = await quizzesApi.getOne(quizId);
			await setCachedQuiz(quizId, quiz);
			return quiz;
		} catch (err) {
			console.warn('syncService.loadQuiz online failed, falling back to cache:', err);
		}
	}
	return getCachedQuiz(quizId);
}


// ─── PROGRESS ─────────────────────────────────────────────────────────────────

async function markProgress(contentItemId, moduleId) {
	if (_isOnline) {
		try {
			await enrolmentsApi.markProgress(contentItemId);
			return;
		} catch (err) {
			console.warn('syncService.markProgress online failed, queueing to outbox:', err);
		}
	}
	await addToProgressOutbox(contentItemId, moduleId);
}


// ─── QUIZ SUBMISSION ──────────────────────────────────────────────────────────

async function submitQuizAttempt({ quizId, moduleId, moduleTitle, quizTitle, responses }) {
	const clientId = Math.random().toString(36).slice(2) + Date.now().toString(36);
	const submittedAt = new Date().toISOString();

	if (_isOnline) {
		try {
			const attempt = await quizAttemptsApi.submit(quizId, responses);
			return attempt;
		} catch (err) {
			console.warn('syncService.submitQuizAttempt online failed, queueing to outbox:', err);
		}
	}

	await addToQuizOutbox({
		clientId, quizId, moduleId, moduleTitle, quizTitle,
		attemptNumber: 1, submittedAt, responses,
	});
	return { offline: true, clientId };
}


// ─── FLUSH ────────────────────────────────────────────────────────────────────

async function flushProgressOutbox() {
	const items = await getProgressOutbox();
	if (items.length === 0) return false;

	let anySynced = false;
	for (const item of items) {
		try {
			await enrolmentsApi.markProgress(item.content_item_id);
			await removeFromProgressOutbox([item.content_item_id]);
			anySynced = true;
		} catch (err) {
			if (err?.status === 400 || err?.status === 404) {
				// stale item: enrolment no longer exists, safe to discard rather than retry
				await removeFromProgressOutbox([item.content_item_id]);
			}
			// 5xx or network error: leave in outbox, retry on next flush
		}
	}
	return anySynced;
}


async function flushQuizOutbox() {
	const items = await getQuizOutbox();
	if (items.length === 0) return false;

	// mark all as syncing so a crash mid-flush is detectable on next initDatabase()
	for (const item of items) {
		await markQuizOutboxSyncing(item.client_id);
	}

	let anySynced = false;
	try {
		const payload = items.map((item) => ({
			clientId:      item.client_id,
			quizId:        item.quiz_id,
			moduleId:      item.module_id,
			moduleTitle:   item.module_title,
			quizTitle:     item.quiz_title,
			attemptNumber: item.attempt_number,
			submittedAt:   item.submitted_at,
			responses:     item.responses,
		}));

		// api.js strips the json.data wrapper — controller returns { data: { results } }
		// so syncService receives { results: [...] } here, not a flat array
		const response = await api.post('/sync', { attempts: payload });
		const results = response?.results ?? [];

		for (const result of results) {
			if (result.status === 'accepted') {
				await removeFromQuizOutbox([result.clientId]);
				anySynced = true;
			} else {
				await markQuizOutboxFailed(result.clientId, result.reason ?? 'Rejected by server');
			}
		}
	} catch (err) {
		// network error: roll all back to pending so they retry on next flush
		for (const item of items) {
			await markQuizOutboxFailed(item.client_id, err.message ?? 'Network error');
		}
	}
	return anySynced;
}


export async function flush() {
	if (!_isOnline || _flushing) return;
	_flushing = true;
	try {
		const quizSynced = await flushQuizOutbox();
		const progressSynced = await flushProgressOutbox();

		if (quizSynced || progressSynced) {
			// refresh enrolments cache so progressPct reflects what just synced
			try {
				const enrolments = await enrolmentsApi.getMyEnrolments({ limit: 100 });
				if (Array.isArray(enrolments)) {
					await setCachedEnrolments(enrolments);
				}
			} catch {
				// non-fatal: stale cache is preferable to no sync
			}
		}
	} catch (err) {
		console.warn('syncService.flush error:', err);
	} finally {
		_flushing = false;
	}
}


export const syncService = {
	setOnlineStatus,
	flush,
	loadEnrolments,
	loadModuleDetail,
	loadContentItems,
	loadQuiz,
	markProgress,
	submitQuizAttempt,
};
