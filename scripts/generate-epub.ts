/**
 * Generates public/libro/7-pasos-para-cambiar-tu-vida.epub
 * Run: npx tsx scripts/generate-epub.ts
 */

import JSZip from 'jszip';
import fs from 'fs';
import path from 'path';
import { stepsContent, introContent, cierreContent, type StepSection } from '../src/data/steps-content';

const BOOK_ID = 'urn:uuid:7pasos-gabi-uccello-2025';
const BOOK_TITLE = '7 Pasos para Cambiar tu Vida';
const BOOK_AUTHOR = 'Gabi Uccello';
const BOOK_LANG = 'es';
const BOOK_PUBLISHER = 'gabiuccello.com';

// ─── HTML helpers ─────────────────────────────────────────────────────────────

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function sectionsToHtml(sections: StepSection[]): string {
  return sections.map((s) => {
    switch (s.type) {
      case 'heading':
        return `<h2>${esc(s.content)}</h2>`;
      case 'quote':
        return `<blockquote><p>${esc(s.content)}</p></blockquote>`;
      case 'paragraph':
        return `<p>${esc(s.content)}</p>`;
      case 'list':
        return `<p>${esc(s.content)}</p><ul>${(s.items ?? []).map((i) => `<li>${esc(i)}</li>`).join('')}</ul>`;
      case 'table':
        return `<table><thead><tr><th>Período</th><th>Acción</th><th>Meta</th></tr></thead><tbody>${(s.rows ?? []).map((r) => `<tr><td>${esc(r.col1)}</td><td>${esc(r.col2)}</td><td>${esc(r.col3)}</td></tr>`).join('')}</tbody></table>`;
      case 'exercise':
        return `<div class="exercise"><p>${esc(s.content)}</p></div>`;
      default:
        return `<p>${esc(s.content)}</p>`;
    }
  }).join('\n');
}

function chapterHtml(id: string, title: string, subtitle: string, body: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="${BOOK_LANG}">
<head>
  <meta charset="UTF-8"/>
  <title>${esc(title)}</title>
  <link rel="stylesheet" type="text/css" href="../styles/main.css"/>
</head>
<body>
  <div class="chapter" id="${id}">
    <h1>${esc(title)}</h1>
    ${subtitle ? `<p class="subtitle">${esc(subtitle)}</p>` : ''}
    ${body}
  </div>
</body>
</html>`;
}

// ─── CSS ──────────────────────────────────────────────────────────────────────

const CSS = `
body { font-family: Georgia, serif; font-size: 1em; line-height: 1.6; margin: 1em 1.5em; color: #1a1a1a; background: #fff; }
h1 { font-size: 1.8em; font-weight: bold; margin-top: 2em; margin-bottom: 0.3em; line-height: 1.2; }
h2 { font-size: 1.3em; font-weight: bold; margin-top: 1.8em; margin-bottom: 0.5em; border-bottom: 1px solid #e0e0e0; padding-bottom: 0.2em; }
p { margin: 0.8em 0; text-align: justify; }
p.subtitle { font-style: italic; color: #555; font-size: 1.1em; margin-bottom: 1.5em; }
blockquote { border-left: 3px solid #f97316; margin: 1.5em 0; padding: 0.5em 1em; background: #fff8f5; font-style: italic; }
blockquote p { margin: 0; }
ul { margin: 0.8em 0 0.8em 1.5em; padding: 0; }
li { margin: 0.4em 0; }
table { width: 100%; border-collapse: collapse; margin: 1.2em 0; font-size: 0.9em; }
th, td { border: 1px solid #ddd; padding: 0.5em 0.8em; text-align: left; }
th { background: #f5f5f5; font-weight: bold; }
.exercise { background: #f0fdf4; border: 1px solid #86efac; border-radius: 4px; padding: 1em; margin: 1.2em 0; }
.closing-quote { text-align: center; font-size: 1.1em; font-style: italic; margin: 2em 1em; padding: 1em; border-top: 1px solid #e0e0e0; border-bottom: 1px solid #e0e0e0; color: #444; }
.step-exercise { background: #fefce8; border: 1px solid #fde047; border-radius: 4px; padding: 1em; margin: 1.2em 0; }
.step-exercise h3 { margin-top: 0; font-size: 1.1em; }
`;

// ─── Cover ────────────────────────────────────────────────────────────────────

const COVER_HTML = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="es">
<head>
  <meta charset="UTF-8"/>
  <title>${esc(BOOK_TITLE)}</title>
  <link rel="stylesheet" type="text/css" href="styles/main.css"/>
  <style>
    body { margin: 0; padding: 0; background: #0a0a0a; color: #fafaf5; text-align: center; }
    .cover { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 3em 2em; box-sizing: border-box; }
    .cover-tag { font-family: monospace; font-size: 0.75em; letter-spacing: 0.3em; color: #f97316; text-transform: uppercase; margin-bottom: 2em; }
    .cover h1 { font-size: 2.4em; font-weight: bold; line-height: 1.1; margin: 0 0 0.3em; color: #fafaf5; }
    .cover h2 { font-size: 1.1em; font-weight: normal; color: #d4d4cf; margin: 0 0 2em; }
    .cover-author { font-size: 1em; color: #8b8b85; margin-top: 2em; }
    .cover-days { font-size: 3em; font-weight: bold; color: #f97316; margin: 1em 0 0.2em; }
    .cover-line { width: 3em; height: 3px; background: #f97316; margin: 1.5em auto; }
  </style>
</head>
<body>
  <div class="cover">
    <div class="cover-tag">El método de 180 días</div>
    <h1>${esc(BOOK_TITLE)}</h1>
    <h2>Micro-decisiones · Oxitocina · Disciplina progresiva</h2>
    <div class="cover-line"></div>
    <div class="cover-days">180</div>
    <p style="color:#8b8b85;margin:0;">días para transformar tu vida</p>
    <div class="cover-author">por ${esc(BOOK_AUTHOR)}</div>
  </div>
</body>
</html>`;

// ─── Build chapters ───────────────────────────────────────────────────────────

interface Chapter {
  id: string;
  filename: string;
  title: string;
  html: string;
}

function buildChapters(): Chapter[] {
  const chapters: Chapter[] = [];

  // Cover (special)
  chapters.push({ id: 'cover', filename: 'cover.xhtml', title: 'Portada', html: COVER_HTML });

  // Intro
  const introBody = sectionsToHtml(introContent.sections) +
    `\n<p class="closing-quote">${esc(introContent.closingQuote)}</p>`;
  chapters.push({
    id: 'intro',
    filename: 'Text/intro.xhtml',
    title: introContent.title,
    html: chapterHtml('intro', introContent.title, introContent.subtitle, introBody),
  });

  // 7 Steps
  for (const step of stepsContent) {
    const exerciseHtml = `
<div class="step-exercise">
  <h3>Ejercicio: ${esc(step.exercise.title)}</h3>
  <p>${esc(step.exercise.description)}</p>
  <ul>${step.exercise.weeks.map((w) => `<li>${esc(w)}</li>`).join('')}</ul>
</div>`;
    const body = sectionsToHtml(step.sections) +
      exerciseHtml +
      `\n<p class="closing-quote">${esc(step.closingQuote)}</p>` +
      (step.connectionText ? `\n<p style="color:#666;font-style:italic">${esc(step.connectionText)}</p>` : '');
    chapters.push({
      id: `paso-${step.number}`,
      filename: `Text/paso-${step.number}.xhtml`,
      title: `Paso ${step.number}: ${step.title}`,
      html: chapterHtml(`paso-${step.number}`, `Paso ${step.number}: ${step.title}`, step.subtitle, body),
    });
  }

  // Cierre
  const cierreBody = sectionsToHtml(cierreContent.sections) +
    `\n<p class="closing-quote">${esc(cierreContent.closingQuote)}</p>`;
  chapters.push({
    id: 'cierre',
    filename: 'Text/cierre.xhtml',
    title: cierreContent.title,
    html: chapterHtml('cierre', cierreContent.title, cierreContent.subtitle, cierreBody),
  });

  return chapters;
}

// ─── OPF manifest ─────────────────────────────────────────────────────────────

function buildOpf(chapters: Chapter[]): string {
  const now = new Date().toISOString().split('T')[0];
  const manifestItems = chapters.map((c) =>
    `<item id="${c.id}" href="${c.filename}" media-type="application/xhtml+xml"/>`
  ).join('\n    ');
  const manifestCss = `<item id="css" href="styles/main.css" media-type="text/css"/>`;
  const spineItems = chapters.map((c) => `<itemref idref="${c.id}"/>`).join('\n    ');

  return `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" unique-identifier="book-id" version="3.0">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:identifier id="book-id">${BOOK_ID}</dc:identifier>
    <dc:title>${esc(BOOK_TITLE)}</dc:title>
    <dc:creator>${esc(BOOK_AUTHOR)}</dc:creator>
    <dc:language>${BOOK_LANG}</dc:language>
    <dc:publisher>${esc(BOOK_PUBLISHER)}</dc:publisher>
    <dc:date>${now}</dc:date>
    <dc:rights>© ${new Date().getFullYear()} ${esc(BOOK_AUTHOR)}. Todos los derechos reservados.</dc:rights>
    <meta property="dcterms:modified">${new Date().toISOString().replace(/\.\d+Z$/, 'Z')}</meta>
  </metadata>
  <manifest>
    ${manifestCss}
    ${manifestItems}
    <item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>
    <item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>
  </manifest>
  <spine toc="ncx">
    ${spineItems}
  </spine>
</package>`;
}

// ─── Navigation ───────────────────────────────────────────────────────────────

function buildNav(chapters: Chapter[]): string {
  const items = chapters.map((c) =>
    `      <li><a href="${c.filename}">${esc(c.title)}</a></li>`
  ).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="${BOOK_LANG}">
<head><meta charset="UTF-8"/><title>Contenido</title></head>
<body>
  <nav epub:type="toc">
    <h1>Contenido</h1>
    <ol>
${items}
    </ol>
  </nav>
</body>
</html>`;
}

function buildNcx(chapters: Chapter[]): string {
  const navPoints = chapters.map((c, i) => `
    <navPoint id="navPoint-${i + 1}" playOrder="${i + 1}">
      <navLabel><text>${esc(c.title)}</text></navLabel>
      <content src="${c.filename}"/>
    </navPoint>`).join('');
  return `<?xml version="1.0" encoding="UTF-8"?>
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
  <head>
    <meta name="dtb:uid" content="${BOOK_ID}"/>
    <meta name="dtb:depth" content="1"/>
    <meta name="dtb:totalPageCount" content="0"/>
    <meta name="dtb:maxPageNumber" content="0"/>
  </head>
  <docTitle><text>${esc(BOOK_TITLE)}</text></docTitle>
  <navMap>${navPoints}
  </navMap>
</ncx>`;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const chapters = buildChapters();
  const zip = new JSZip();

  // mimetype MUST be first and uncompressed
  zip.file('mimetype', 'application/epub+zip', { compression: 'STORE' });

  // META-INF
  zip.file('META-INF/container.xml', `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`);

  // OEBPS structure
  zip.file('OEBPS/content.opf', buildOpf(chapters));
  zip.file('OEBPS/nav.xhtml', buildNav(chapters));
  zip.file('OEBPS/toc.ncx', buildNcx(chapters));
  zip.file('OEBPS/styles/main.css', CSS);

  // Chapters
  for (const chapter of chapters) {
    zip.file(`OEBPS/${chapter.filename}`, chapter.html);
  }

  const outPath = path.resolve('public/libro/7-pasos-para-cambiar-tu-vida.epub');
  const buffer = await zip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 },
  });

  fs.writeFileSync(outPath, buffer);
  const kb = Math.round(buffer.length / 1024);
  console.log(`✓ EPUB generado: ${outPath} (${kb} KB)`);
}

main().catch((err) => { console.error(err); process.exit(1); });
