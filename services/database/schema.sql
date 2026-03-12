-- services/database/schema.sql

-- 1. Encrypted Patient Data (Sensitive - Hosted in Secure Swiss Zone)
CREATE TABLE patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    encrypted_identity_blob TEXT NOT NULL, -- Name, DOB, Address (AES-256 Encrypted application side)
    swiss_social_security_hash TEXT UNIQUE, -- Hashed for lookup, never stored raw
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE medical_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(id),
    doctor_id UUID NOT NULL,
    record_type VARCHAR(50), -- 'diagnosis', 'prescription', 'lab_result'
    encrypted_data_blob TEXT NOT NULL, -- The actual medical content
    access_log_id UUID, -- Link to audit trail
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Public / Shared Data (Non-Sensitive - Reference Data)
CREATE TABLE doctors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    public_name VARCHAR(100),
    specialization VARCHAR(100),
    spoken_languages TEXT[],
    license_number VARCHAR(50) UNIQUE
);

CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    doctor_id UUID REFERENCES doctors(id),
    patient_id UUID REFERENCES patients(id), -- Only the ID, no names here
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(20) DEFAULT 'scheduled' -- 'scheduled', 'completed', 'cancelled'
);

-- 3. Audit Log (Immutable - Critical for Compliance)
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    action VARCHAR(50) NOT NULL, -- 'VIEW_RECORD', 'UPDATE_DOSSIER'
    resource_id UUID NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address INET,
    access_reason TEXT
);
