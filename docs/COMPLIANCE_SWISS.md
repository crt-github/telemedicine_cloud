# Swiss Telemedicine Compliance Framework

## 1. Regulatory Basis

This project strictly adheres to the following Swiss and European regulations:

- **FADP (Federal Act on Data Protection)**: Swiss data protection law.
- **GDPR (General Data Protection Regulation)**: EU privacy law (applicable to EU patients).
- **EU AI Act**: Regulation for high-risk AI systems in healthcare.
- **HRA (Human Research Act)**: If data is used for research.

## 2. Data Sovereignty & Residency

- [ ] **Hosting**: Data MUST be hosted on Swiss-owned infrastructure (e.g., cloudscale.ch, Safe Swiss Cloud).
- [ ] **Failover**: Backup locations must also be within Switzerland.
- [ ] **Cross-Border Transfer**: NO sensitive patient data (CID/PID) to be transferred outside CH/EU/EEA without explicit patient consent and anonymization.

## 3. Data Classification

| Data Type | Classification | Storage Requirement | Encryption |
|-----------|----------------|---------------------|------------|
| Patient Identity (Name, ID) | **Confidential / Secret** | `db-patient-secure` | AES-256 + Application Level |
| Medical Records (EHR) | **Confidential / Secret** | `db-ehr-encrypted` | AES-256 + Column Level |
| Images (DICOM/MRI) | **Confidential** | `obj-store-swiss` | AES-256 |
| Knowledge Base | **Public / Internal** | `db-knowledge` | TLS 1.3 (Transit) |
| Telemetry/Logs | **Internal** | `log-store-audit` | TLS 1.3 |

## 4. Security Controls (Technical & Organizational)

- [ ] **Encryption**:
  - Rest: AES-256 for all databases and object stores.
  - Transit: TLS 1.3 for all microservice communication.
- [ ] **IAM (Identity Access Management)**:
  - Role-Based Access Control (RBAC).
  - MFA (Multi-Factor Authentication) enforced for all doctor/admin access.
  - Biometric authentication (optional) for mobile apps.
- [ ] **Audit Trails**:
  - Immutable logs for ALL access to patient records (Who, What, When).
  - Retention: 10 years (or as per canton regulations).

## 5. AI Governance (EU AI Act)

- [ ] **Human-in-the-Loop**: AI diagnostic suggestions must be verified by a human doctor.
- [ ] **Transparency**: Patients must be informed when AI is used in their care.
- [ ] **Bias Monitoring**: Regular audits for algorithmic bias.
- [ ] **Quality Management System**: Documentation of model training and validation data.

## 6. Implementation Checklist

- [ ] Verify Cloud Provider Certification (ISO 27001, OCP).
- [ ] Implement Privacy by Design (PbD) principles in `auth-service`.
- [ ] Set up Data Processing Agreements (DPA) with 3rd parties.
