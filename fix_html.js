const fs = require('fs');
// const path = require('path');

const dir = 'c:\\Users\\tcori\\telemedicine';

function fixHtmlFile(filePath) {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // 1. Fix missing button types
    content = content.replace(/<button(?![^>]*type=["'](?:button|submit|reset)["'])([^>]*)>/gi, '<button type="button"$1>');

    // 2. Fix unencoded & (only match " & " surrounded by spaces to avoid URLs and HTML entities)
    content = content.replace(/ & /g, ' &amp; ');
    
    // Also cover "Health & IoT"
    content = content.replace(/([a-zA-Z])&([a-zA-Z])/g, '$1&amp;$2'); // e.g., M&A, but usually it's " & "

    // 3. Fix typo in login.html
    if (filePath.endsWith('login.html')) {
        content = content.replace('Twu-Factor', 'Two-Factor');
    }

    if (content !== original) {
        // eslint-disable-next-line security/detect-non-literal-fs-filename
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Fixed ${filePath}`);
    }
}

function walk(dirPath) {
    let results = [];
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const list = fs.readdirSync(dirPath);
    list.forEach(function(file) {
        if (file === 'node_modules' || file === 'dist' || file.startsWith('.')) return;
        file = dirPath + '\\' + file;
        // eslint-disable-next-line security/detect-non-literal-fs-filename
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if (file.endsWith('.html')) {
                results.push(file);
            }
        }
    });
    return results;
}

const htmlFiles = walk(dir);
htmlFiles.forEach(fixHtmlFile);
console.log('Done fixing HTML files.');
