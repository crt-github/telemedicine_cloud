"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const router = express_1.default.Router();
// Mock User Database (Replace with PostgreSQL/MongoDB in production)
const adminPassword = process.env.ADMIN_PASSWORD || 'password123';
const adminHash = bcryptjs_1.default.hashSync(adminPassword, 10);
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
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    // Simulate DB user lookup
    // In production: const user = await User.findOne({ email });
    const user = users.find(u => u.email === email);
    if (user) {
        // Compare the provided password against the stored hashed password
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (isMatch) {
            const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '30d' });
            res.cookie('telemed_token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
            });
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
exports.default = router;
