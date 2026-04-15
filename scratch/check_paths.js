const fs = require('fs');
const path = require('path');

const privateDir = path.join(__dirname, '../private');
const files = [
    'dashboard.html',
    'medical-forms.html',
    'scheduling.html',
    'knowledge.html'
];

console.log(`Checking path: ${privateDir}`);
files.forEach(f => {
    const full = path.join(privateDir, f);
    console.log(`- ${f}: ${fs.existsSync(full) ? 'EXISTS' : 'MISSING'} (${full})`);
});
