"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const security_1 = __importDefault(require("./middleware/security"));
const auth_1 = __importDefault(require("./routes/auth"));
const patient_1 = __importDefault(require("./routes/patient"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const auth_2 = require("./middleware/auth");
const path_1 = __importDefault(require("path"));
// Load env vars
dotenv_1.default.config();
const app = (0, express_1.default)();
// Body & Cookie parsers
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// Apply Security Middleware
(0, security_1.default)(app);
// Serve Public Static Files (CSS, JS, Login, Index)
// Root level public files are served directly
app.use(express_1.default.static(path_1.default.join(__dirname, '../../public')));
// API Routes
app.use('/api/auth', auth_1.default);
app.use('/api/patient', auth_2.protect, patient_1.default); // Authenticated API
// Health Check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', uptime: process.uptime() });
});
// Root Redirect/Mapping
app.get('/', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../../public/index.html'));
});
// Explicitly handle protected static pages to ensure correct redirection and serving
app.get('/dashboard.html', auth_2.protect, (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../../private/dashboard.html'));
});
// Fallback for other private files
app.use('/private', auth_2.protect, express_1.default.static(path_1.default.join(__dirname, '../../private')));
// Serve Private Static Files as fallback if already protected
app.use(auth_2.protect);
app.use(express_1.default.static(path_1.default.join(__dirname, '../../private')));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    console.log(`Security headers and rate limiting enabled.`);
});
