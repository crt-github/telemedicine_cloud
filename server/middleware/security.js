const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');

const setupSecurity = (app) => {
    // 1. Set Security Headers
    app.use(helmet());

    // 2. Prevent XSS Attacks
    app.use(xss());

    // 3. Prevent HTTP Parameter Pollution
    app.use(hpp());

    // 4. Rate Limiting (DDoS Protection)
    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // Limit each IP to 100 requests per windowMs
        message: 'Too many requests from this IP, please try again after 15 minutes'
    });
    app.use('/api', limiter);

    // 5. CORS (Cross-Origin Resource Sharing) - Strict
    const corsOptions = {
        origin: 'http://localhost:3000', // Update this to your frontend URL in production
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true
    };
    app.use(cors(corsOptions));
};

module.exports = setupSecurity;
