const http = require('http');

const probe = (path, headers = {}) => {
    return new Promise((resolve) => {
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: path,
            method: 'GET',
            headers: headers
        };
        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                resolve({ 
                    path, 
                    status: res.statusCode, 
                    contentType: res.headers['content-type'],
                    location: res.headers['location'],
                    bodySnippet: body.substring(0, 100).replace(/\n/g, ' ')
                });
            });
        });
        req.on('error', (e) => resolve({ path, error: e.message }));
        req.end();
    });
};

async function runTests() {
    console.log("--- FINAL RECONCILIATION PROBE ---");
    
    // 1. Check Public Asset (Should load without auth)
    const cssRes = await probe('/css/style.css');
    console.log(`[CSS]  ${cssRes.path} -> Status: ${cssRes.status}, Type: ${cssRes.contentType}`);

    // 2. Check Private Page (Should REDIRECT without auth)
    const privateUnauth = await probe('/medical-forms.html');
    console.log(`[PRIV] ${privateUnauth.path} (Unauth) -> Status: ${privateUnauth.status}, Redirect: ${privateUnauth.location}`);

    // 3. Check Private Page (Should LOAD with auth)
    // We need to re-enable the mock auth in auth.ts for this probe, or use a real JWT.
    // Since I removed the mock auth, this will redirect.
    // But the most important are tests 1 and 2 for the loop fix.
}

runTests();
