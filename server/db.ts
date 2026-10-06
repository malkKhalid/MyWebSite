import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new Database(dbPath);

// Initialize Tables
export const initDb = () => {
    // Settings
    db.exec(`
        CREATE TABLE IF NOT EXISTS settings (
            id INTEGER PRIMARY KEY CHECK (id = 1),
            siteNameEn TEXT,
            siteNameAr TEXT,
            fullNameEn TEXT,
            fullNameAr TEXT,
            profileImage TEXT,
            primaryColorRGB TEXT,
            contactPhone TEXT,
            aiContext TEXT,
            logoImage TEXT,
            heroTitleEn TEXT,
            heroTitleAr TEXT,
            heroSubtitleEn TEXT,
            heroSubtitleAr TEXT,
            siteSubtitleEn TEXT,
            siteSubtitleAr TEXT,
            aboutTextEn TEXT,
            aboutTextAr TEXT,
            copyrightOwnerName TEXT,
            contactEmail TEXT,
            totalVisits INTEGER DEFAULT 100
        )
    `);

    // Migration for existing tables
    try {
        db.exec("ALTER TABLE settings ADD COLUMN logoImage TEXT");
    } catch (e) { }
    try {
        db.exec("ALTER TABLE settings ADD COLUMN heroTitleEn TEXT");
    } catch (e) { }
    try {
        db.exec("ALTER TABLE settings ADD COLUMN heroTitleAr TEXT");
    } catch (e) { }
    try {
        db.exec("ALTER TABLE settings ADD COLUMN heroSubtitleEn TEXT");
    } catch (e) { }
    try {
        db.exec("ALTER TABLE settings ADD COLUMN heroSubtitleAr TEXT");
    } catch (e) { }
    try {
        db.exec("ALTER TABLE settings ADD COLUMN siteSubtitleEn TEXT");
    } catch (e) { }
    try {
        db.exec("ALTER TABLE settings ADD COLUMN siteSubtitleAr TEXT");
    } catch (e) { }
    try {
        db.exec("ALTER TABLE settings ADD COLUMN aboutTextEn TEXT");
    } catch (e) { }
    try {
        db.exec("ALTER TABLE settings ADD COLUMN aboutTextAr TEXT");
    } catch (e) { }
    try {
        db.exec("ALTER TABLE settings ADD COLUMN copyrightOwnerName TEXT");
    } catch (e) { }
    try {
        db.exec("ALTER TABLE settings ADD COLUMN contactEmail TEXT");
    } catch (e) { }
    try {
        db.exec("ALTER TABLE settings ADD COLUMN fullNameEn TEXT");
    } catch (e) { }
    try {
        db.exec("ALTER TABLE settings ADD COLUMN fullNameAr TEXT");
    } catch (e) { }
    try {
        db.exec("ALTER TABLE settings ADD COLUMN totalVisits INTEGER DEFAULT 100");
    } catch (e) { }

    // Ensure default settings exist
    const stmt = db.prepare('SELECT count(*) as count FROM settings');
    const row = stmt.get() as { count: number };
    if (row.count === 0) {
        db.prepare(`
            INSERT INTO settings (id, siteNameEn, siteNameAr, fullNameEn, fullNameAr, profileImage, primaryColorRGB, contactPhone, aiContext, logoImage, heroTitleEn, heroTitleAr, heroSubtitleEn, heroSubtitleAr, siteSubtitleEn, siteSubtitleAr, aboutTextEn, aboutTextAr, copyrightOwnerName, contactEmail, totalVisits)
            VALUES (1, 'Malk All Banna', 'ملك البنا', 'Eng. Malk Khalid All Banna', 'م. ملك خالد البنا', '', '219 39 119', '', '', '', 'Security with Elegance', 'الأمان بلمسة من الأناقة', 'Information Security Engineer blending technical precision with intelligent solutions.', 'مهندس أمن معلومات يدمج بين الدقة التقنية والحلول الذكية.', '', '', 'I am Malk...', 'أنا ملك البنا...', 'Malk All Banna', 'malk@example.com', 100)
        `).run();
    } else {
        // Backfill heroTitle with the default hero title for older databases (keeps the currently displayed title)
        try {
            db.exec("UPDATE settings SET heroTitleEn = 'Security with Elegance' WHERE heroTitleEn IS NULL OR heroTitleEn = ''");
        } catch (e) { }
        try {
            db.exec("UPDATE settings SET heroTitleAr = 'الأمان بلمسة من الأناقة' WHERE heroTitleAr IS NULL OR heroTitleAr = ''");
        } catch (e) { }
    }

    // Social Links
    db.exec(`
        CREATE TABLE IF NOT EXISTS social_links (
            id TEXT PRIMARY KEY,
            platform TEXT,
            url TEXT,
            customIcon TEXT,
            name TEXT,
            org TEXT,
            date TEXT,
            descEn TEXT,
            descAr TEXT,
            imageUrl TEXT
        )
    `);

    // Projects
    db.exec(`
        CREATE TABLE IF NOT EXISTS projects (
            id TEXT PRIMARY KEY,
            titleEn TEXT,
            titleAr TEXT,
            descEn TEXT,
            descAr TEXT,
            longDescEn TEXT,
            longDescAr TEXT,
            mainImage TEXT,
            pdfUrl TEXT,
            tags TEXT, -- JSON string
            galleryImages TEXT, -- JSON string
            orderNum INTEGER DEFAULT 0,
            featured INTEGER DEFAULT 0
        )
    `);

    // Blogs
    db.exec(`
        CREATE TABLE IF NOT EXISTS blogs (
            id TEXT PRIMARY KEY,
            titleEn TEXT,
            titleAr TEXT,
            excerptEn TEXT,
            excerptAr TEXT,
            contentEn TEXT,
            contentAr TEXT,
            date TEXT,
            views INTEGER,
            author TEXT
        )
    `);

    // Education
    db.exec(`
        CREATE TABLE IF NOT EXISTS education (
            id TEXT PRIMARY KEY,
            degreeEn TEXT,
            degreeAr TEXT,
            institutionEn TEXT,
            institutionAr TEXT,
            date TEXT,
            gradeEn TEXT,
            gradeAr TEXT,
            institutionLogo TEXT,
            descriptionEn TEXT,
            descriptionAr TEXT,
            degreeImage TEXT
        )
    `);

    // Migration for Education
    try { db.exec("ALTER TABLE education ADD COLUMN institutionLogo TEXT"); } catch (e) { }
    try { db.exec("ALTER TABLE education ADD COLUMN descriptionEn TEXT"); } catch (e) { }
    try { db.exec("ALTER TABLE education ADD COLUMN descriptionAr TEXT"); } catch (e) { }
    try { db.exec("ALTER TABLE education ADD COLUMN degreeImage TEXT"); } catch (e) { }

    // Languages
    db.exec(`
        CREATE TABLE IF NOT EXISTS languages (
            id TEXT PRIMARY KEY,
            nameEn TEXT,
            nameAr TEXT,
            levelEn TEXT,
            levelAr TEXT,
            percentage INTEGER
        )
    `);

    // Testimonials / Reviews
    db.exec(`
        CREATE TABLE IF NOT EXISTS testimonials (
            id TEXT PRIMARY KEY,
            name TEXT,
            title TEXT,
            textEn TEXT,
            textAr TEXT,
            image TEXT,
            approved INTEGER DEFAULT 0,
            titleAr TEXT,
            titleEn TEXT,
            countryAr TEXT,
            countryEn TEXT,
            nameAr TEXT,
            nameEn TEXT
        )
    `);

    // Notifications
    db.exec(`
        CREATE TABLE IF NOT EXISTS notifications (
            id TEXT PRIMARY KEY,
            type TEXT,
            content TEXT,
            date TEXT,
            read INTEGER DEFAULT 0,
            relatedId TEXT
        )
    `);

    // Knowledge Base (AI)
    db.exec(`
        CREATE TABLE IF NOT EXISTS knowledge_base (
            id TEXT PRIMARY KEY,
            question TEXT,
            answer TEXT
        )
    `);

    // Experience Categories
    db.exec(`
        CREATE TABLE IF NOT EXISTS experience_categories (
            id TEXT PRIMARY KEY,
            titleEn TEXT,
            titleAr TEXT
        )
    `);

    // Experience Items
    db.exec(`
        CREATE TABLE IF NOT EXISTS experience_items (
            id TEXT PRIMARY KEY,
            categoryId TEXT,
            company TEXT,
            logo TEXT,
            titleEn TEXT,
            titleAr TEXT,
            duration TEXT,
            country TEXT,
            descEn TEXT,
            descAr TEXT,
            orderNum INTEGER DEFAULT 0,
            featured INTEGER DEFAULT 0
        )
    `);

    // Migrations for Ordering and Testimonials
    try { db.exec("ALTER TABLE certifications ADD COLUMN orderNum INTEGER DEFAULT 0"); } catch (e) { }
    try { db.exec("ALTER TABLE certifications ADD COLUMN featured INTEGER DEFAULT 0"); } catch (e) { }
    try { db.exec("ALTER TABLE projects ADD COLUMN orderNum INTEGER DEFAULT 0"); } catch (e) { }
    try { db.exec("ALTER TABLE projects ADD COLUMN featured INTEGER DEFAULT 0"); } catch (e) { }
    try { db.exec("ALTER TABLE experience_items ADD COLUMN orderNum INTEGER DEFAULT 0"); } catch (e) { }
    try { db.exec("ALTER TABLE experience_items ADD COLUMN featured INTEGER DEFAULT 0"); } catch (e) { }
    try { db.exec("ALTER TABLE education ADD COLUMN orderNum INTEGER DEFAULT 0"); } catch (e) { }
    try { db.exec("ALTER TABLE experience_categories ADD COLUMN orderNum INTEGER DEFAULT 0"); } catch (e) { }

    try { db.exec("ALTER TABLE testimonials ADD COLUMN titleAr TEXT"); } catch (e) { }
    try { db.exec("ALTER TABLE testimonials ADD COLUMN titleEn TEXT"); } catch (e) { }
    try { db.exec("ALTER TABLE testimonials ADD COLUMN countryAr TEXT"); } catch (e) { }
    try { db.exec("ALTER TABLE testimonials ADD COLUMN countryEn TEXT"); } catch (e) { }
    try { db.exec("ALTER TABLE testimonials ADD COLUMN nameAr TEXT"); } catch (e) { }
    try { db.exec("ALTER TABLE testimonials ADD COLUMN nameEn TEXT"); } catch (e) { }
    try { db.exec("ALTER TABLE testimonials ADD COLUMN companyAr TEXT"); } catch (e) { }
    try { db.exec("ALTER TABLE testimonials ADD COLUMN companyEn TEXT"); } catch (e) { }
    try { db.exec("ALTER TABLE testimonials ADD COLUMN linkedin TEXT"); } catch (e) { }
    try { db.exec("ALTER TABLE certifications ADD COLUMN issuerLogo TEXT"); } catch (e) { }

    console.log('Database initialized successfully.');
};

export default db;
