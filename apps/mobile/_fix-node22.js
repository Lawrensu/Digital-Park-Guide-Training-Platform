// Node.js 22 enforces package exports fields strictly.
// Metro 0.83.x has internal subpath imports not listed in its exports.
// This preload patches Module._resolveFilename to fall back to direct
// file resolution when ERR_PACKAGE_PATH_NOT_EXPORTED is thrown.
'use strict';
const Module = require('module');
const path = require('path');

const _orig = Module._resolveFilename;

Module._resolveFilename = function (request, parent, isMain, options) {
	try {
		return _orig.call(this, request, parent, isMain, options);
	} catch (err) {
		if (err.code !== 'ERR_PACKAGE_PATH_NOT_EXPORTED') throw err;

		// Derive the absolute path from the package specifier directly.
		// e.g. "metro-cache/src/stores/FileStore" → find metro-cache root, then append the subpath.
		const parts = request.split('/');
		const pkgName = request.startsWith('@') ? parts.slice(0, 2).join('/') : parts[0];
		const subpath = request.startsWith('@') ? parts.slice(2).join('/') : parts.slice(1).join('/');

		if (!subpath) throw err;

		const basePaths = parent?.filename
			? [path.dirname(parent.filename)]
			: [process.cwd()];

		let pkgDir;
		try {
			pkgDir = path.dirname(require.resolve(pkgName + '/package.json', { paths: basePaths }));
		} catch {
			throw err;
		}

		const candidates = [
			path.join(pkgDir, subpath),
			path.join(pkgDir, subpath + '.js'),
			path.join(pkgDir, subpath + '.cjs'),
			path.join(pkgDir, subpath, 'index.js'),
		];

		for (const candidate of candidates) {
			try {
				return _orig.call(this, candidate, parent, isMain, options);
			} catch {
				// try next candidate
			}
		}

		throw err;
	}
};
