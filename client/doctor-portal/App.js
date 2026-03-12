// client/doctor-portal/App.js (Mock)
import React, { useState, useEffect } from 'react';

// Mock Component for Video Consultation
const VideoRoom = ({ appointmentId }) => (
    <div className="video-container" style={{ border: '2px solid red', padding: '20px' }}>
        <h3>Secure Video Channel (WebRTC)</h3>
        <p>Connected to Appointment: {appointmentId}</p>
        <div className="video-placeholder">[Incoming Stream]</div>
        <button>End Encryption Session</button>
    </div>
);

// Mock Component for Patient Dossier
const PatientDossier = ({ patientId }) => {
    const [records, setRecords] = useState([]);

    useEffect(() => {
        // In production: fetch from /api/patients/:id/records
        setRecords([{ id: 'rec-1', type: 'Diagnosis', content: 'Hypertension - Stage 1' }]);
    }, [patientId]);

    return (
        <div className="dossier-panel">
            <h4>Patient Dossier (Confidential)</h4>
            <ul>
                {records.map(r => (
                    <li key={r.id}><strong>{r.type}:</strong> {r.content}</li>
                ))}
            </ul>
        </div>
    );
};

export default function DoctorDashboard() {
    const [activeAppointment, setActiveAppointment] = useState(null);

    return (
        <div className="dashboard">
            <header>
                <h1>SwissTeleMed - Doctor Portal</h1>
                <span className="badge">Swiss Cloud Secure</span>
            </header>

            <main style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <section>
                    <h2>Appointments</h2>
                    <button onClick={() => setActiveAppointment({ id: 'apt-123', patientId: 'p-456' })}>
                        Join Mrs. Mueller (10:00 AM)
                    </button>
                </section>

                {activeAppointment && (
                    <>
                        <section>
                            <VideoRoom appointmentId={activeAppointment.id} />
                        </section>
                        <section>
                            <PatientDossier patientId={activeAppointment.patientId} />
                        </section>
                    </>
                )}
            </main>
        </div>
    );
}
