import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Mock User Database (Replace with PostgreSQL/MongoDB in production)
const adminPassword = process.env.ADMIN_PASSWORD || 'password123';
const adminHash = bcrypt.hashSync(adminPassword, 10);

const users = [
    {
        id: 1,
        email: 'doctor@hospital.com',
        password: adminHash,
        role: 'doctor',
        name: 'Dr. Smith'
    }
];

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // Simulate DB user lookup
    // In production: const user = await User.findOne({ email });
    const user = users.find(u => u.email === email);

    if (user) {
        // Compare the provided password against the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token = jwt.sign(
                { id: user.id, role: user.role },
                process.env.JWT_SECRET as string,
                { expiresIn: '30d' }
            );

            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token
            });
            return;
        }
    }

    res.status(401).json({ message: 'Invalid email or password' });
});

export default router;
