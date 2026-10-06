#!/usr/bin/env node
/*
 * One-time migration: move base64 blobs out of the SQLite database into
 * server/uploads/ so API responses stop shipping tens of MB of inline data.
 *
 *   node scripts/migrate_uploads.cjs extract   # decode base64 -> raw files + manifest
 *   node scripts/migrate_uploads.cjs apply     # DB columns -> /uploads/... URLs
 *
 * File names are sha1(original bytes).slice(0,24) + ext so `apply` can be run
 * against any copy of the database as long as the (possibly resized) files
 * with those names are present in the uploads dir.
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.join(__dirname, '..');
const SERVER_DIR = path.join(ROOT, 'server');
const D = require(path.join(SERVER_DIR, 'node_modules', 'better-sqlite3'));

const args = process.argv.slice(2);
const mode = args[0];
const opt = (name, dflt) => {
  const i = args.indexOf('--' + name);
  return i >= 0 && args[i + 1] ? args[i + 1] : dflt;
};
const DB_PATH = opt('db', path.join(SERVER_DIR, 'database.sqlite'));
const UPLOADS_DIR = opt('uploads', path.join(SERVER_DIR, 'uploads'));
const MANIFEST = opt('manifest', path.join(ROOT, 'scripts', 'uploads_manifest.json'));

// column -> output format + resize policy
const POLICY = {
  'settings.profileImage':     { kind: 'jpg', maxDim: 1200, quality: 84 },
  'settings.logoImage':        { kind: 'png', maxDim: 512 },
  'social_links.customIcon':   { kind: 'png', maxDim: 256 },
  'skills.image':              { kind: 'png', maxDim: 256 },
  'certifications.issuerLogo': { kind: 'png', maxDim: 256 },
  'certifications.imageUrl':   { kind: 'jpg', maxDim: 1600, quality: 84 },
  'projects.mainImage':        { kind: 'jpg', maxDim: 1600, quality: 84 },
  'projects.pdfUrl':           { kind: 'pdf' },
  'education.institutionLogo': { kind: 'png', maxDim: 384 },
  'education.degreeImage':     { kind: 'jpg', maxDim: 1600, quality: 84 },
  'testimonials.image':        { kind: 'jpg', maxDim: 512, quality: 85 },
  'experience_items.logo':     { kind: 'png', maxDim: 256 },
};

const TARGETS = [
  { table: 'settings', cols: ['profileImage', 'logoImage'] },
  { table: 'social_links', cols: ['customIcon'] },
  { table: 'skills', cols: ['image'] },
  { table: 'certifications', cols: ['imageUrl', 'issuerLogo'] },
  { table: 'projects', cols: ['mainImage', 'pdfUrl', 'galleryImages'] },
  { table: 'education', cols: ['institutionLogo', 'degreeImage'] },
  { table: 'testimonials', cols: ['image'] },
  { table: 'experience_items', cols: ['logo'] },
];

const parseDataUrl = (v) => {
  const m = /^data:([A-Za-z0-9/+.-]+);base64,([\s\S]*)$/.exec(v);
  if (!m) return null;
  return { mime: m[1], buf: Buffer.from(m[2], 'base64') };
};

const extFor = (table, col, mime) => {
  if (mime === 'application/pdf') return 'pdf';
  const p = POLICY[table + '.' + col];
  return p && p.kind === 'png' ? 'png' : 'jpg';
};

const fileNameFor = (table, col, parsed) =>
  crypto.createHash('sha1').update(parsed.buf).digest('hex').slice(0, 24) +
  '.' + extFor(table, col, parsed.mime);

const eachBlob = function* (row, table, cols) {
  for (const col of cols) {
    const v = row[col];
    if (!v) continue;
    if (col === 'galleryImages') {
      let arr;
      try { arr = JSON.parse(v); } catch { continue; }
      if (!Array.isArray(arr)) continue;
      for (let i = 0; i < arr.length; i++) {
        if (typeof arr[i] === 'string' && arr[i].startsWith('data:')) yield { col, index: i, value: arr[i] };
      }
    } else if (typeof v === 'string' && v.startsWith('data:')) {
      yield { col, value: v };
    }
  }
};

const db = new D(DB_PATH);
fs.mkdirSync(UPLOADS_DIR, { recursive: true });

if (mode === 'extract') {
  const manifest = [];
  let written = 0, skipped = 0;
  for (const t of TARGETS) {
    const rows = db.prepare(`SELECT * FROM "${t.table}"`).all();
    for (const row of rows) {
      for (const hit of eachBlob(row, t.table, t.cols)) {
        const parsed = parseDataUrl(hit.value);
        if (!parsed) { skipped++; continue; }
        const name = fileNameFor(t.table, hit.col, parsed);
        const out = path.join(UPLOADS_DIR, name);
        if (!fs.existsSync(out)) fs.writeFileSync(out, parsed.buf);
        const p = POLICY[t.table + '.' + hit.col] || { kind: 'jpg', maxDim: 1600, quality: 84 };
        const kind = parsed.mime === 'application/pdf' ? 'pdf' : p.kind;
        manifest.push({
          file: name, table: t.table, col: hit.col, index: hit.index,
          id: row.id, kind, maxDim: p.maxDim || 1600, quality: p.quality || 84,
          rawBytes: parsed.buf.length,
        });
        written++;
      }
    }
  }
  fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2));
  const totalRaw = manifest.reduce((s, m) => s + m.rawBytes, 0);
  console.log(`extract: ${written} blobs -> ${UPLOADS_DIR} (${(totalRaw / 1048576).toFixed(1)} MB raw), manifest: ${MANIFEST}`);
  process.exit(0);
}

if (mode === 'apply') {
  let converted = 0, missing = [], bytesBefore = 0, bytesAfter = 0;
  for (const t of TARGETS) {
    const update = (col, value, id) => db.prepare(`UPDATE "${t.table}" SET "${col}" = ? WHERE id = ?`).run(value, id);
    const rows = db.prepare(`SELECT * FROM "${t.table}"`).all();
    for (const row of rows) {
      for (const hit of eachBlob(row, t.table, t.cols)) {
        const parsed = parseDataUrl(hit.value);
        if (!parsed) continue;
        const name = fileNameFor(t.table, hit.col, parsed);
        const file = path.join(UPLOADS_DIR, name);
        if (!fs.existsSync(file)) { missing.push(`${t.table}.${hit.col}#${row.id} -> ${name}`); continue; }
        bytesBefore += parsed.buf.length;
        bytesAfter += fs.statSync(file).size;
        const url = '/uploads/' + name;
        if (hit.col === 'galleryImages') {
          const arr = JSON.parse(row.galleryImages);
          arr[hit.index] = url;
          update('galleryImages', JSON.stringify(arr), row.id);
        } else {
          update(hit.col, url, row.id);
        }
        converted++;
      }
    }
  }
  console.log(`apply: converted ${converted} blobs, ${(bytesBefore / 1048576).toFixed(1)} MB -> ${(bytesAfter / 1048576).toFixed(1)} MB`);
  if (missing.length) {
    console.error(`MISSING FILES (${missing.length}) - scp server/uploads first:`);
    missing.forEach(m => console.error('  ' + m));
    process.exit(1);
  }
  process.exit(0);
}

console.error('usage: migrate_uploads.cjs extract|apply [--db path] [--uploads dir] [--manifest path]');
process.exit(2);
