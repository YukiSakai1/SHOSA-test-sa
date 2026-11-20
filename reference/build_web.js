const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const outDir = path.join(rootDir, 'www');

// Clean and create www
if (fs.existsSync(outDir)) {
    fs.rmSync(outDir, { recursive: true, force: true });
}
fs.mkdirSync(outDir, { recursive: true });

function copyRecursive(src, dest) {
    const stat = fs.statSync(src);
    if (stat.isDirectory()) {
        fs.mkdirSync(dest, { recursive: true });
        for (const item of fs.readdirSync(src)) {
            // Ignore unused folders
            if (item === 'unused') continue;
            copyRecursive(path.join(src, item), path.join(dest, item));
        }
    } else {
        fs.copyFileSync(src, dest);
    }
}

// Copy index.html
fs.copyFileSync(path.join(rootDir, 'index.html'), path.join(outDir, 'index.html'));

// Copy css, js, assets
for (const dir of ['css', 'js', 'assets']) {
    const srcPath = path.join(rootDir, dir);
    if (fs.existsSync(srcPath)) {
        copyRecursive(srcPath, path.join(outDir, dir));
    }
}

console.log('Successfully prepared www directory for Capacitor!');
