import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import db, { initDb } from './db';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '../.env.local') });

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increased limit for base64 images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve the built frontend (production)
const distPath = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
}

// Initialize DB
initDb();

// Root Route
app.get('/', (req, res) => {
    const indexPath = path.join(distPath, 'index.html');
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.send(`
            <h1>Backend is Running! 🚀</h1>
            <p>This is the API server. It does not have a frontend interface.</p>
            <p>Please open the frontend at: <a href="http://localhost:5173">http://localhost:5173</a></p>
        `);
    }
});

// --- API ROUTES ---

// 1. Settings
app.get('/api/settings', (req, res) => {
    const settings = db.prepare('SELECT * FROM settings WHERE id = 1').get();
    res.json(settings);
});

app.post('/api/settings', (req, res) => {
    const s = req.body;
    const current = db.prepare('SELECT totalVisits FROM settings WHERE id = 1').get() as { totalVisits: number } | undefined;
    const totalVisits = typeof s.totalVisits === 'number' ? s.totalVisits : (current?.totalVisits ?? 100);
    db.prepare(`
        UPDATE settings SET 
        siteNameEn = ?, siteNameAr = ?, fullNameEn = ?, fullNameAr = ?, profileImage = ?, primaryColorRGB = ?, contactPhone = ?, aiContext = ?,
        logoImage = ?, heroSubtitleEn = ?, heroSubtitleAr = ?, siteSubtitleEn = ?, siteSubtitleAr = ?, 
        aboutTextEn = ?, aboutTextAr = ?, copyrightOwnerName = ?, contactEmail = ?, totalVisits = ?
        WHERE id = 1
    `).run(
        s.siteNameEn, s.siteNameAr, s.fullNameEn, s.fullNameAr, s.profileImage, s.primaryColorRGB, s.contactPhone, s.aiContext,
        s.logoImage, s.heroSubtitleEn, s.heroSubtitleAr, s.siteSubtitleEn, s.siteSubtitleAr,
        s.aboutTextEn, s.aboutTextAr, s.copyrightOwnerName, s.contactEmail, totalVisits
    );
    res.json({ success: true });
});

// Visits counter
app.get('/api/visits', (req, res) => {
    const row = db.prepare('SELECT totalVisits FROM settings WHERE id = 1').get() as { totalVisits: number };
    res.json({ totalVisits: row?.totalVisits ?? 100 });
});

app.post('/api/visits/increment', (req, res) => {
    const current = db.prepare('SELECT totalVisits FROM settings WHERE id = 1').get() as { totalVisits: number };
    const next = (current?.totalVisits ?? 100) + 1;
    db.prepare('UPDATE settings SET totalVisits = ? WHERE id = 1').run(next);
    res.json({ totalVisits: next });
});

// 2. Social Links
app.get('/api/socials', (req, res) => {
    const rows = db.prepare('SELECT * FROM social_links').all();
    res.json(rows);
});

app.post('/api/socials', (req, res) => {
    const links = req.body; // Expecting array
    // Full replace approach for simplicity
    const deleteStmt = db.prepare('DELETE FROM social_links');
    const insertStmt = db.prepare('INSERT INTO social_links (id, platform, url, customIcon, isActive) VALUES (?, ?, ?, ?, ?)');

    db.transaction(() => {
        deleteStmt.run();
        for (const link of links) {
            insertStmt.run(link.id, link.platform, link.url, link.customIcon, link.isActive ? 1 : 0);
        }
    })();
    res.json({ success: true });
});

// 3. Skills
app.get('/api/skills', (req, res) => {
    const rows = db.prepare('SELECT * FROM skills').all();
    res.json(rows);
});

app.post('/api/skills', (req, res) => {
    const items = req.body;
    const deleteStmt = db.prepare('DELETE FROM skills');
    const insertStmt = db.prepare('INSERT INTO skills (id, iconName, titleEn, titleAr, descEn, descAr, detailsEn, detailsAr, price, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');

    db.transaction(() => {
        deleteStmt.run();
        for (const item of items) {
            insertStmt.run(item.id, item.iconName, item.titleEn, item.titleAr, item.descEn, item.descAr, item.detailsEn, item.detailsAr, item.price, item.image);
        }
    })();
    res.json({ success: true });
});

// 4. Certifications
app.get('/api/certifications', (req, res) => {
    const rows = db.prepare('SELECT * FROM certifications').all();
    res.json(rows);
});

app.post('/api/certifications', (req, res) => {
    const items = req.body;
    const deleteStmt = db.prepare('DELETE FROM certifications');
    const insertStmt = db.prepare('INSERT INTO certifications (id, name, org, date, descEn, descAr, imageUrl, issuerLogo, orderNum, featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');

    db.transaction(() => {
        deleteStmt.run();
        for (const item of items) {
            insertStmt.run(item.id, item.name, item.org, item.date, item.descEn, item.descAr, item.imageUrl || '', item.issuerLogo || '', item.orderNum || 0, item.featured ? 1 : 0);
        }
    })();
    res.json({ success: true });
});

// 5. Projects
app.get('/api/projects', (req, res) => {
    const rows = db.prepare('SELECT * FROM projects').all();
    const parsedRows = rows.map((r: any) => ({
        ...r,
        tags: JSON.parse(r.tags || '[]'),
        galleryImages: JSON.parse(r.galleryImages || '[]')
    }));
    res.json(parsedRows);
});

app.post('/api/projects', (req, res) => {
    const items = req.body;
    const deleteStmt = db.prepare('DELETE FROM projects');
    const insertStmt = db.prepare('INSERT INTO projects (id, titleEn, titleAr, descEn, descAr, longDescEn, longDescAr, mainImage, pdfUrl, tags, galleryImages, orderNum, featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');

    db.transaction(() => {
        deleteStmt.run();
        for (const item of items) {
            insertStmt.run(
                item.id, item.titleEn, item.titleAr, item.descEn, item.descAr,
                item.longDescEn, item.longDescAr, item.mainImage, item.pdfUrl,
                JSON.stringify(item.tags), JSON.stringify(item.galleryImages),
                item.orderNum || 0, item.featured ? 1 : 0
            );
        }
    })();
    res.json({ success: true });
});

// 6. Blogs
app.get('/api/blogs', (req, res) => {
    const rows = db.prepare('SELECT * FROM blogs').all();
    res.json(rows);
});

app.post('/api/blogs', (req, res) => {
    const { id, titleEn, titleAr, excerptEn, excerptAr, contentEn, contentAr, date, views, author } = req.body;
    // Upsert
    const existing = db.prepare('SELECT id FROM blogs WHERE id = ?').get(id);
    if (existing) {
        db.prepare(`UPDATE blogs SET titleEn=?, titleAr=?, excerptEn=?, excerptAr=?, contentEn=?, contentAr=?, date=?, views=?, author=? WHERE id=?`)
            .run(titleEn, titleAr, excerptEn, excerptAr, contentEn, contentAr, date, views, author, id);
    } else {
        db.prepare(`INSERT INTO blogs (id, titleEn, titleAr, excerptEn, excerptAr, contentEn, contentAr, date, views, author) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
            .run(id, titleEn, titleAr, excerptEn, excerptAr, contentEn, contentAr, date, views, author);
    }
    res.json({ success: true });
});

app.delete('/api/blogs/:id', (req, res) => {
    db.prepare('DELETE FROM blogs WHERE id = ?').run(req.params.id);
    res.json({ success: true });
});

// 7. Education
app.get('/api/education', (req, res) => {
    const rows = db.prepare('SELECT * FROM education').all();
    res.json(rows);
});

app.post('/api/education', (req, res) => {
    const { id, degreeEn, degreeAr, institutionEn, institutionAr, date, gradeEn, gradeAr, institutionLogo, descriptionEn, descriptionAr, degreeImage } = req.body;
    const existing = db.prepare('SELECT id FROM education WHERE id = ?').get(id);
    if (existing) {
        db.prepare(`UPDATE education SET degreeEn=?, degreeAr=?, institutionEn=?, institutionAr=?, date=?, gradeEn=?, gradeAr=?, institutionLogo=?, descriptionEn=?, descriptionAr=?, degreeImage=? WHERE id=?`)
            .run(degreeEn, degreeAr, institutionEn, institutionAr, date, gradeEn, gradeAr, institutionLogo, descriptionEn, descriptionAr, degreeImage, id);
    } else {
        db.prepare(`INSERT INTO education (id, degreeEn, degreeAr, institutionEn, institutionAr, date, gradeEn, gradeAr, institutionLogo, descriptionEn, descriptionAr, degreeImage) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
            .run(id, degreeEn, degreeAr, institutionEn, institutionAr, date, gradeEn, gradeAr, institutionLogo, descriptionEn, descriptionAr, degreeImage);
    }
    res.json({ success: true });
});

app.delete('/api/education/:id', (req, res) => {
    db.prepare('DELETE FROM education WHERE id = ?').run(req.params.id);
    res.json({ success: true });
});

// 8. Languages
app.get('/api/languages', (req, res) => {
    const rows = db.prepare('SELECT * FROM languages').all();
    res.json(rows);
});

app.post('/api/languages', (req, res) => {
    const items = req.body;
    const deleteStmt = db.prepare('DELETE FROM languages');
    const insertStmt = db.prepare('INSERT INTO languages (id, nameEn, nameAr, levelEn, levelAr, percentage) VALUES (?, ?, ?, ?, ?, ?)');

    db.transaction(() => {
        deleteStmt.run();
        for (const item of items) {
            insertStmt.run(item.id, item.nameEn, item.nameAr, item.levelEn, item.levelAr, item.percentage);
        }
    })();
    res.json({ success: true });
});

// 9. Notifications
app.get('/api/notifications', (req, res) => {
    const rows = db.prepare('SELECT * FROM notifications').all();
    res.json(rows);
});

app.post('/api/notifications', (req, res) => {
    const { id, type, content, date, read, relatedId } = req.body;
    db.prepare('INSERT INTO notifications (id, type, content, date, read, relatedId) VALUES (?, ?, ?, ?, ?, ?)').run(id, type, content, date, read ? 1 : 0, relatedId);
    res.json({ success: true });
});

app.put('/api/notifications/:id/read', (req, res) => {
    db.prepare('UPDATE notifications SET read = 1 WHERE id = ?').run(req.params.id);
    res.json({ success: true });
});

app.delete('/api/notifications/:id', (req, res) => {
    db.prepare('DELETE FROM notifications WHERE id = ?').run(req.params.id);
    res.json({ success: true });
});

// 10. Testimonials
app.get('/api/testimonials', (req, res) => {
    const rows = db.prepare('SELECT * FROM testimonials').all();
    res.json(rows);
});

app.post('/api/testimonials', (req, res) => {
    // Accept all bilingual fields directly from the client - no AI translation
    const { id, nameEn, nameAr, titleEn, titleAr, companyEn, companyAr, countryEn, countryAr, textEn, textAr, linkedin, image, approved } = req.body;

    db.prepare(`INSERT INTO testimonials
        (id, name, nameEn, nameAr, title, titleEn, titleAr, companyEn, companyAr, countryEn, countryAr, textEn, textAr, image, linkedin, approved)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
        id,
        nameEn || '',
        nameEn || '',
        nameAr || '',
        titleEn || '',
        titleEn || '',
        titleAr || '',
        companyEn || '',
        companyAr || '',
        countryEn || '',
        countryAr || '',
        textEn || '',
        textAr || '',
        image || '',
        linkedin || '',
        approved ? 1 : 0
    );
    res.json({ success: true });
});

app.put('/api/testimonials/:id/approve', (req, res) => {
    db.prepare('UPDATE testimonials SET approved = 1 WHERE id = ?').run(req.params.id);
    res.json({ success: true });
});

app.delete('/api/testimonials/:id', (req, res) => {
    db.prepare('DELETE FROM testimonials WHERE id = ?').run(req.params.id);
    res.json({ success: true });
});

// 11. Knowledge Base
app.get('/api/knowledge', (req, res) => {
    const rows = db.prepare('SELECT * FROM knowledge_base').all();
    res.json(rows);
});

app.post('/api/knowledge', (req, res) => {
    const { id, question, answer } = req.body;
    db.prepare('INSERT INTO knowledge_base (id, question, answer) VALUES (?, ?, ?)').run(id, question, answer);
    res.json({ success: true });
});

// 12. Experience Categories
app.get('/api/experience-categories', (req, res) => {
    const rows = db.prepare('SELECT * FROM experience_categories').all();
    res.json(rows);
});

app.post('/api/experience-categories', (req, res) => {
    const items = req.body;
    const deleteStmt = db.prepare('DELETE FROM experience_categories');
    const insertStmt = db.prepare('INSERT INTO experience_categories (id, titleEn, titleAr) VALUES (?, ?, ?)');

    db.transaction(() => {
        deleteStmt.run();
        for (const item of items) {
            insertStmt.run(item.id, item.titleEn, item.titleAr);
        }
    })();
    res.json({ success: true });
});

// 13. Experience Items
app.get('/api/experience-items', (req, res) => {
    const rows = db.prepare('SELECT * FROM experience_items').all();
    res.json(rows);
});

app.post('/api/experience-items', (req, res) => {
    const items = req.body;
    const deleteStmt = db.prepare('DELETE FROM experience_items');
    const insertStmt = db.prepare('INSERT INTO experience_items (id, categoryId, company, logo, titleEn, titleAr, duration, country, descEn, descAr, orderNum, featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');

    db.transaction(() => {
        deleteStmt.run();
        for (const item of items) {
            insertStmt.run(item.id, item.categoryId, item.company, item.logo, item.titleEn, item.titleAr, item.duration, item.country, item.descEn, item.descAr, item.orderNum || 0, item.featured ? 1 : 0);
        }
    })();
    res.json({ success: true });
});

// --- AI ENDPOINT ---
app.post('/api/ai/chat', async (req, res) => {
    const { question, language, context } = req.body;
    const apiKey = process.env.VITE_GEMINI_API_KEY || process.env.API_KEY || process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.json({ text: language === 'ar' ? 'مفتاح API غير متوفر.' : 'API Key missing.', confidence: false });
    }

    // Fetch Knowledge Base
    const kb = db.prepare('SELECT * FROM knowledge_base').all() as { question: string, answer: string }[];
    const kbString = kb.map(k => `Q: ${k.question}\nA: ${k.answer}`).join('\n\n');

    const systemPrompt = `
    You are the AI Assistant for Malk (Eng. Malk Khalid All Banna), a professional Cybersecurity Engineer.
    Your tone should be professional, elegant, and concise.
    Current Language: ${language === 'ar' ? 'Arabic' : 'English'}.
    
    SOURCE MATERIAL:
    ${context ? `[UPLOADED RESUME/CONTEXT]:\n${context}\n` : ''}
    
    [KNOWLEDGE BASE]:
    ${kbString}
    
    INSTRUCTIONS:
    1. Use the SOURCE MATERIAL and KNOWLEDGE BASE to answer the user's question.
    2. If the answer is found in the source material, answer clearly in the requested language.
    3. If the answer is NOT in the source material, you MUST reply exactly with the specific fallback phrase: "I_DO_NOT_KNOW_THIS_INFO".
    4. Do not make up facts about Malk.
    5. If the user greets you, greet back politely.
  `;

    try {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: {
                role: 'user',
                parts: [{ text: question }]
            },
            config: {
                systemInstruction: systemPrompt,
                temperature: 0.3,
            }
        });

        const text = response.text || '';

        if (text.includes("I_DO_NOT_KNOW_THIS_INFO")) {
            // Create a notification for the admin
            const notifId = Date.now().toString();
            db.prepare('INSERT INTO notifications (id, type, content, date, read, relatedId) VALUES (?, ?, ?, ?, ?, ?)')
                .run(notifId, 'question', `New unknown question: ${question}`, new Date().toISOString().split('T')[0], 0, notifId);

            return res.json({ text: '', confidence: false });
        }

        res.json({ text, confidence: true });

    } catch (error) {
        console.error("Gemini Error:", error);
        res.json({ text: language === 'ar' ? 'حدث خطأ في الاتصال.' : 'Connection error occurred.', confidence: false });
    }
});

// SPA fallback: serve index.html for any non-API route (React Router handles the rest)
if (fs.existsSync(distPath)) {
    app.use((req, res, next) => {
        if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
            return next();
        }
        res.sendFile(path.join(distPath, 'index.html'));
    });
}

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
