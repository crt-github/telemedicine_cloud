const fs = require('fs');

function fixScheduling() {
    let p = 'c:\\Users\\tcori\\telemedicine\\scheduling.html';
    let c = fs.readFileSync(p, 'utf8');
    c = c.replace('<button type="button" onclick="bookAppointment()', '<button type="submit" onclick="bookAppointment()');
    c = c.replace(/&details=Telemedicine\+Consultation&location=/g, '&amp;details=Telemedicine+Consultation&amp;location=');
    c = c.replace(/text=Appointment\+with\+\$\{encodeURIComponent\(appt\.patient\)\}&dates=/g, 'text=Appointment+with+${encodeURIComponent(appt.patient)}&amp;dates=');
    fs.writeFileSync(p, c);
}

function fixTools() {
    let p = 'c:\\Users\\tcori\\telemedicine\\tools.html';
    let c = fs.readFileSync(p, 'utf8');
    c = c.replace('style="color:#f59e0b; border-color:#f59e0b;"', '');
    fs.writeFileSync(p, c);
}

function fixVideoCall() {
    let p = 'c:\\Users\\tcori\\telemedicine\\video-call.html';
    let c = fs.readFileSync(p, 'utf8');
    // Fix <div> inside <button> that wasn't caught
    c = c.replace(/<button class="control-btn" style="[^"]*"><div class="text-xs mt-1">Chat<\/div><\/button>/g, '<button type="button" class="control-btn"><span class="text-xs mt-1">Chat</span></button>');
    c = c.replace(/<button type="button" class="control-btn"><div class="text-xs mt-1">/g, '<button type="button" class="control-btn"><span class="text-xs mt-1">');
    c = c.replace(/<\/div><\/button>/g, '</span></button>');
    c = c.replace(/style="background-color: var\(--surface\); color: white;"/g, '');
    c = c.replace(/style="background:rgba\(0,0,0,0.5\); border-radius:12px; border:1px solid rgba\(255,255,255,0.1\);"/g, '');
    c = c.replace(/style="background:rgba\(255,255,255,0.1\);"/g, '');
    c = c.replace(/style="padding:0.5rem 1rem;"/g, '');
    c = c.replace(/style="padding:1rem;"/g, '');
    fs.writeFileSync(p, c);
}

function fixAiAssistant() {
    let p = 'c:\\Users\\tcori\\telemedicine\\ai-assistant.html';
    let c = fs.readFileSync(p, 'utf8');
    c = c.replace(/<nav class="sidebar-nav">/g, '<nav aria-label="Main navigation" class="sidebar-nav">');
    // For aside...
    c = c.replace(/<aside class="sidebar">/g, '<aside aria-label="Sidebar" class="sidebar">');
    c = c.replace(/<aside class="ai-context-panel">/g, '<aside aria-label="Context Panel" class="ai-context-panel">');
    
    // Replace divs in buttons that were missed
    c = c.replace(/<button type="button" class="ai-suggestion-chip">\s+<div class="font-semibold mb-1">/g, '<button type="button" class="ai-suggestion-chip"><span class="font-semibold mb-1 block">');
    c = c.replace(/<\/div>\s+<div class="text-xs text-muted">/g, '</span><span class="text-xs text-muted block">');
    c = c.replace(/<\/div>\s+<\/button>/g, '</span></button>');

    c = c.replace(/<button type="button" class="btn btn-icon-circle" aria-label="Microphone">/g, '<button type="button" class="btn btn-icon-circle" aria-label="Microphone Voice Input">');
    c = c.replace(/aria-label="Upload Document"/g, 'aria-label="Upload Document or File"');

    c = c.replace(/style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1rem;"/g, '');
    c = c.replace(/style="border-top:1px solid var\(--glass-border\); padding-top:1rem; margin-top:1.5rem;"/g, '');
    c = c.replace(/style="background:rgba\(16, 185, 129, 0.1\); color:#10b981; padding:0.25rem 0.5rem; border-radius:4px; font-size:0.75rem;"/g, '');
    c = c.replace(/style="background:rgba\(37, 99, 235, 0.1\); padding:1rem; border-radius:8px; border:1px solid var\(--glass-border\); margin-bottom:1rem;"/g, '');
    c = c.replace(/style="display:flex; align-items:flex-start; gap:1rem; margin-top:1rem;"/g, '');
    c = c.replace(/style="width:30px; height:30px; border-radius:50%; background:var\(--primary\); display:flex; align-items:center; justify-content:center; flex-shrink:0; font-size:0.8rem;"/g, '');
    c = c.replace(/style="background:rgba\(30, 41, 59, 0.5\); padding:1rem; border-radius:8px; border:1px solid var\(--glass-border\); border-top-left-radius:0;"/g, '');

    fs.writeFileSync(p, c);
}

fixScheduling();
fixTools();
fixVideoCall();
fixAiAssistant();
console.log('Fixed remaining HTML validation errors.');
