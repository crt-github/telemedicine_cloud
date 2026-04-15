// client/swiss-portal/AiReview.js
import React, { useState } from 'react';

// Mock Data Source (In prod: Fetch from Swiss EHR Core)
const MOCK_ALERTS = [
    { id: 'alert-1', patient: 'Mrs. Mueller', finding: 'Risk of Hypertension', confidence: 0.92, source: 'AWS-Frankfurt-GPU' }
];

export default function AiReviewDashboard() {
    const [alerts, setAlerts] = useState(MOCK_ALERTS);

    const handleApprove = (id) => {
        console.log(`[AUDIT] Doctor approved finding ${id}`);
        // call POST /ehr/approve-finding
        setAlerts(alerts.filter(a => a.id !== id));
    };

    const handleReject = (id) => {
        console.log(`[AUDIT] Doctor rejected finding ${id}`);
        setAlerts(alerts.filter(a => a.id !== id));
    };

    return (
        <div className="swiss-secure-panel">
            <h2>AI Findings Review (Human-in-the-Loop)</h2>
            <div className="alert-list">
                {alerts.map(alert => (
                    <div key={alert.id} className="alert-card" style={{ border: '2px solid red' }}>
                        <h3>Patient: {alert.patient}</h3>
                        <p><strong>AI Finding:</strong> {alert.finding}</p>
                        <p>Confidence: {(alert.confidence * 100).toFixed(1)}%</p>
                        <p><small>Computed by: {alert.source}</small></p>

                        <div className="actions">
                            <button onClick={() => handleApprove(alert.id)}>Approve & Add to Record</button>
                            <button onClick={() => handleReject(alert.id)}>Reject (False Positive)</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
