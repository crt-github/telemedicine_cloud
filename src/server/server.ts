import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import setupSecurity from './middleware/security';
import authRoutes from './routes/auth';

// Load env vars
dotenv.config();

const app: Application = express();

// Body parser
app.use(express.json());

// Apply Security Middleware
setupSecurity(app);

// Serve Static Files (CSS, HTML, Client JS)
import path from 'path';
// Assuming server.js is in dist/server/, going up two levels to root
app.use(express.static(path.join(__dirname, '../../')));

// Routes
app.use('/api/auth', authRoutes);

// Health Check
app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'OK', uptime: process.uptime() });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    console.log(`Security headers and rate limiting enabled.`);
});
