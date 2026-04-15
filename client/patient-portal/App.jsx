// client/patient-portal/App.js (Mock)
import React, { useState } from 'react';

export default function PatientDashboard() {
    const [appointments] = useState([
        { id: 'apt-123', doctor: 'Dr. Smith', time: '2023-11-25 10:00', status: 'scheduled' }
    ]);

    return (
        <div className="patient-app">
            <header>
                <h1>MyHealth Swiss Account</h1>
            </header>

            <main>
                <section className="upcoming">
                    <h2>Your Appointments</h2>
                    {appointments.map(apt => (
                        <div key={apt.id} className="card">
                            <p><strong>{apt.doctor}</strong></p>
                            <p>{apt.time}</p>
                            <button>Join Secure Video</button>
                        </div>
                    ))}
                </section>

                <section className="upload-iot">
                    <h2>Upload Health Data</h2>
                    <p>Sync your smartwatch or glucose monitor data here.</p>
                    <button>Connect Device (Bluetooth/Audio)</button>
                </section>
            </main>
        </div>
    );
}
