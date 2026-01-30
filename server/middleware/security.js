const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');

const setupSecurity = (app) => {
    // 1. Manually Set Security Headers (Replacing Helmet for stability)
    app.use((req, res, next) => {
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('X-Frame-Options', 'SAMEORIGIN');
        res.setHeader('X-XSS-Protection', '1; mode=block');
        res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        next();
    });

    // 2. Prevent HTTP Parameter Pollution
    app.use(hpp());

    // 3. Rate Limiting (DDoS Protection)
    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // Limit each IP to 100 requests per windowMs
        message: 'Too many requests from this IP, please try again after 15 minutes'
    });
    app.use('/api', limiter);

    // 4. CORS (Cross-Origin Resource Sharing) - Permissive for Dev
    const corsOptions = {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: false
    };
    app.use(cors(corsOptions));
};

module.exports = setupSecurity;
