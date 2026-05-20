const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');
const fs = require('fs');

const monorepoRoot = path.resolve(__dirname, '../..');

// pnpm virtual store: packages are at .pnpm/<name>@<ver>/node_modules/<name>
// Metro cannot find them because it only looks in flat node_modules directories.
// This resolver intercepts failed resolutions and retries from the pnpm shared store.
const pnpmSharedStore = path.join(monorepoRoot, 'node_modules', '.pnpm', 'node_modules');

function resolvePnpmPackage(packageName) {
    const candidate = path.join(pnpmSharedStore, packageName);
    try {
        if (fs.existsSync(candidate)) return candidate;
    } catch {}
    return null;
}

const config = getDefaultConfig(__dirname);

const originalResolve = config.resolver?.resolveRequest;
config.resolver = config.resolver ?? {};
config.resolver.resolveRequest = (context, moduleName, platform) => {
    // First try the original resolver (works for direct deps).
    try {
        if (originalResolve) {
            return originalResolve(context, moduleName, platform);
        }
        return context.resolveRequest(context, moduleName, platform);
    } catch (originalErr) {
        // Resolve failed: try the pnpm shared virtual store as a fallback.
        // Extract the package name (handles scoped packages like @babel/runtime).
        const parts = moduleName.split('/');
        const packageName = moduleName.startsWith('@') ? `${parts[0]}/${parts[1]}` : parts[0];
        const pnpmPath = resolvePnpmPackage(packageName);
        if (pnpmPath) {
            const subPath = moduleName.slice(packageName.length);
            const resolved = pnpmPath + subPath;
            return { type: 'sourceFile', filePath: require.resolve(resolved) };
        }
        throw originalErr;
    }
};

module.exports = withNativeWind(config, { input: './global.css' });
