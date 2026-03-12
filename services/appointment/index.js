// services/appointment/index.js
const express = require('express');
const app = express();
app.use(express.json());

const PORT = 3004;

// Mock Appointments
let appointments = [];

app.post('/appointments', (req, res) => {
    const { doctorId, patientId, time } = req.body;

    // In a real implementation:
    // 1. Check Doctor Availability (call Doctor Service)
    // 2. Validate Patient (call Patient Service)

    const newAppointment = {
        id: 'apt-' + Date.now(),
        doctorId,
        patientId,
        time,
        status: 'scheduled'
    };
    appointments.push(newAppointment);
    res.status(201).json(newAppointment);
});

app.get('/appointments/doctor/:doctorId', (req, res) => {
    const docAppts = appointments.filter(a => a.doctorId === req.params.doctorId);
    res.json(docAppts);
});

app.listen(PORT, () => {
    console.log(`Appointment Service running on port ${PORT}`);
});
