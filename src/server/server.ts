import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import cookieParser from 'cookie-parser';

import setupSecurity from './middleware/security';
import authRoutes from './routes/auth';
import patientRoutes from './routes/patient';
import { protect } from './middleware/auth';

// Load env vars
dotenv.config();

const app: Application = express();

// 1. Basic Middleware
app.use(express.json());
app.use(cookieParser());

// 2. Security (Helmet, Rate Limit, etc.)
setupSecurity(app);

// 3. Health Check (Always Public)
app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'OK', uptime: process.uptime() });
});

// 4. API Routes (Auth is public, Patient is protected)
app.use('/api/auth', authRoutes);
app.use('/api/patient', protect, patientRoutes);

// 5. PUBLIC ASSETS (CSS, JS, Images) - Served first, no protection
// This prevents MIME errors and redirect loops for style.css, etc.
app.use(express.static(path.resolve(process.cwd(), 'public')));

// 6. Explicit Landing & Login Routes
app.get(['/', '/index.html'], (req, res) => {
    res.sendFile(path.resolve(process.cwd(), 'public/index.html'));
});

app.get('/login.html', (req, res) => {
    res.sendFile(path.resolve(process.cwd(), 'public/login.html'));
});

// 7. PROTECTED PRIVATE FILES
// This middleware runs only for requests that didn't match public assets above.
app.use(protect);

// 8. Serve Private Static Files (HTML pages)
// They are now protected and accessible at root (e.g., /dashboard.html)
app.use(express.static(path.resolve(process.cwd(), 'private')));

// 9. Root Fallback for Authenticated Users
// If they hit / but are authenticated, they stick to index unless they go to /dashboard.html
// If they hit a missing private file, we redirect to dashboard.
app.get('/dashboard.html', (req, res) => {
    res.sendFile(path.resolve(process.cwd(), 'private/dashboard.html'));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    console.log(`Final reconciliation: Public assets unlocked, private data protected.`);
});
