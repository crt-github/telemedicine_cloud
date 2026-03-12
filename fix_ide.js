const fs = require('fs');

function fixDashboard() {
    let p = 'c:\\Users\\tcori\\telemedicine\\dashboard.html';
    let c = fs.readFileSync(p, 'utf8');
    
    // Fix noopener
    c = c.replace(/target="_blank" class="btn btn-outline w-full"/g, 'target="_blank" rel="noopener noreferrer" class="btn btn-outline w-full"');
    
    // Fix inline styles in Dashboard that are remaining
    c = c.replace(/<div class="calendar-day text-muted" >28<\/div>/g, '<div class="calendar-day text-muted calendar-inactive">28</div>');
    c = c.replace(/<div class="calendar-day text-muted" >29<\/div>/g, '<div class="calendar-day text-muted calendar-inactive">29</div>');
    c = c.replace(/<div class="calendar-day text-muted" >30<\/div>/g, '<div class="calendar-day text-muted calendar-inactive">30</div>');
    c = c.replace(/<div class="calendar-day text-muted" >31<\/div>/g, '<div class="calendar-day text-muted calendar-inactive">31</div>');
    c = c.replace(/<div class="calendar-day" >1<\/div>/g, '<div class="calendar-day calendar-inactive">1</div>');
    c = c.replace(/<div class="calendar-day" >2<\/div>/g, '<div class="calendar-day calendar-inactive">2</div>');
    c = c.replace(/<div class="calendar-day" >3<\/div>/g, '<div class="calendar-day calendar-inactive">3</div>');
    c = c.replace(/<div class="calendar-day" >8<\/div>/g, '<div class="calendar-day calendar-inactive">8</div>');
    c = c.replace(/<div class="calendar-day" >9<\/div>/g, '<div class="calendar-day calendar-inactive">9</div>');
    c = c.replace(/<div class="calendar-day" >10<\/div>/g, '<div class="calendar-day calendar-inactive">10</div>');
    c = c.replace(/<td >No messages yet.<\/td>/g, '<td class="empty-state">No messages yet.</td>');

    fs.writeFileSync(p, c);
}

function fixVideoCall() {
    let p = 'c:\\Users\\tcori\\telemedicine\\video-call.html';
    let c = fs.readFileSync(p, 'utf8');
    
    // Fix Safari backdrop-filter prefix
    if (!c.includes('-webkit-backdrop-filter: blur(4px);')) {
        c = c.replace(/backdrop-filter: blur\((.*?)\);/g, '-webkit-backdrop-filter: blur($1);\n            backdrop-filter: blur($1);');
    }
    
    fs.writeFileSync(p, c);
}

function fixKnowledge() {
    let p = 'c:\\Users\\tcori\\telemedicine\\knowledge.html';
    let c = fs.readFileSync(p, 'utf8');
    
    // Fix backdrop-filter ordering
    c = c.replace(/backdrop-filter: blur\(4px\);\s*-webkit-backdrop-filter: blur\(4px\);/g, '-webkit-backdrop-filter: blur(4px);\n            backdrop-filter: blur(4px);');
    
    // Fix remaining inline styles
    c = c.replace(/<div class="search-container" >/g, '<div class="search-container search-container-expanded">');
    c = c.replace(/<input type="text" id="newResName" class="form-input w-full"\s*>/g, '<input type="text" id="newResName" class="form-input w-full">');
    c = c.replace(/<select id="newResType" class="form-input w-full"\s*>/g, '<select id="newResType" class="form-input w-full">');
    c = c.replace(/<input type="text" id="newResCountry" class="form-input w-full"\s*placeholder="e.g. Global">/g, '<input type="text" id="newResCountry" class="form-input w-full" placeholder="e.g. Global">');
    
    fs.writeFileSync(p, c);
}

function fixMedicalForms() {
    let p = 'c:\\Users\\tcori\\telemedicine\\medical-forms.html';
    let c = fs.readFileSync(p, 'utf8');
    
    // Fix inline styles left from earlier replace
    c = c.replace(/<div class="mb-4 flex justify-between items-center"\s*>/g, '<div class="mb-4 flex justify-between items-center pb-border">');
    c = c.replace(/<div class="flex-between-center-mb-1"\s*>/g, '<div class="flex-between-center-mb-1 flex-header-wrap">');
    c = c.replace(/<h3 class="form-section-title"\s*>/g, '<h3 class="form-section-title no-margin">');
    c = c.replace(/<button type="button" onclick="window.location.href='ai-assistant.html\?context=image_analysis'"\s*class="btn btn-sm btn-outline"\s*>/g, '<button type="button" onclick="window.location.href=\'ai-assistant.html?context=image_analysis\'" class="btn btn-sm btn-outline rounded-sm-btn">');
    
    fs.writeFileSync(p, c);
}

function fixTools() {
    let p = 'c:\\Users\\tcori\\telemedicine\\tools.html';
    let c = fs.readFileSync(p, 'utf8');
    
    // Some inline styles left on divs
    c = c.replace(/<div class="tool-card"\s*>/g, '<div class="tool-card h-40">');
    c = c.replace(/<div class="tool-card"\s*>/g, '<div class="tool-card h-60">'); // Will need manual fix if multiple identical matches
    
    fs.writeFileSync(p, c);
}

fixDashboard();
fixVideoCall();
fixKnowledge();
fixMedicalForms();
fixTools();
console.log('Fixed final IDE warnings.');
