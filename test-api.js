
const API_URL = 'http://localhost:3001/api';

async function runTests() {
    console.log('--- Starting Verification Tests ---');

    // 1. Test Settings API
    try {
        console.log('Testing GET /settings...');
        const settingsRes = await fetch(`${API_URL}/settings`);
        if (!settingsRes.ok) throw new Error(`Status: ${settingsRes.status}`);
        const settings = await settingsRes.json();
        if (settings.siteNameEn) {
            console.log('✅ GET /settings passed');
        } else {
            console.error('❌ GET /settings failed: Missing siteNameEn');
        }
    } catch (e) {
        console.error('❌ GET /settings error:', e.message);
    }

    // 2. Test AI Chat (Mock)
    try {
        console.log('Testing POST /ai/chat (Mock)...');
        const aiRes = await fetch(`${API_URL}/ai/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question: 'Hello', language: 'en' })
        });
        const aiData = await aiRes.json();
        if (aiData) {
            console.log('✅ POST /ai/chat responded');
        }
    } catch (e) {
        console.error('❌ POST /ai/chat error:', e.message);
    }

    console.log('--- Tests Completed ---');
}

runTests();
