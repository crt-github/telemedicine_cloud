[Ideal Telemedicine Stack Recommendation]

# Core Stack
- **Frontend**: React.js / Next.js (Better for dynamic dashboards than vanilla HTML/JS)
- **Backend**: Node.js + Express (Scalable, huge ecosystem)
- **Database**: PostgreSQL (Relational data is better for strict medical records) + MongoDB (Images/Unstructured logs)

# Security & Privacy Layer (Critical)
- **Identity Provider (IdP)**: Auth0 or AWS Cognito (Don't roll your own auth for HIPAA if you can avoid it)
- **Data Encryption**: AES-256 for data at rest. TLS 1.3 for data in transit.
- **Audit Logs**: Store every access event (Who viewed What and When) in an immutable log.
- **Compliance**: HIPAA-compliant hosting (AWS HealthLake or Azure Healthcare APIs).

# Current Missing Parts Implemented in Simulation:
1. **API Gateway**: Initialized Express server with security headers via `helmet`.
2. **Rate Limiting**: Added `express-rate-limit` to prevent DDoS.
3. **Authentication**: Added JWT-based structure in `server/middleware/auth.js`.
4. **Input Sanitization**: Added `xss-clean` and `hpp` to prevent injections.

To run the secure backend:
`node server/server.js`
