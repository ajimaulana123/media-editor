const fs = require('fs');
const path = require('path');

const ffmpegBasePath = path.join('node_modules', '@ffmpeg', 'core', 'dist');
const files = [
    { src: 'ffmpeg-core.js', dest: 'ffmpeg-core.js' },
    { src: 'ffmpeg-core.wasm', dest: 'ffmpeg-core.wasm' }
];

const publicPath = path.join(process.cwd(), 'public', 'ffmpeg');
if (!fs.existsSync(publicPath)) {
    fs.mkdirSync(publicPath, { recursive: true });
}

files.forEach(({ src, dest }) => {
    const sourcePath = path.join(ffmpegBasePath, src);
    const destPath = path.join(publicPath, dest);

    try {
        if (fs.existsSync(sourcePath)) {
            fs.copyFileSync(sourcePath, destPath);
            console.log(`Copied ${src} to /ffmpeg successfully`);
        } else {
            console.warn(`Warning: Source file ${src} not found in ${sourcePath}`);
        }
    } catch (error) {
        console.error(`Error copying ${src}:`, error);
    }
}); 