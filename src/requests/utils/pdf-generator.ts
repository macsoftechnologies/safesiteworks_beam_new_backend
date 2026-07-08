// import PDFDocument = require('pdfkit');

// /**
//  * Generates a structured PDF for the permit data on the backend using pdfkit.
//  */
// export function buildPermitPdf(data: any): Promise<Buffer> {
//   return new Promise((resolve, reject) => {
//     try {
//       const doc = new PDFDocument({ margin: 40, size: 'A4' });
//       const chunks: Buffer[] = [];

//       doc.on('data', (chunk) => chunks.push(chunk));
//       doc.on('end', () => resolve(Buffer.concat(chunks)));
//       doc.on('error', (err) => reject(err));

//       // Color Theme
//       const primaryColor = '#222a45';
//       const secondaryColor = '#edc510';
//       const darkText = '#333333';
//       const greyText = '#666666';

//       // Header Title
//       doc.fillColor(primaryColor).fontSize(18).text(`ACTIVITY PERMIT NO: ${data.PermitNo || '-'}`, { align: 'center' });
//       doc.strokeColor(secondaryColor).lineWidth(2).moveTo(40, doc.y + 8).lineTo(550, doc.y + 8).stroke();
//       doc.moveDown(1.5);

//       // Status
//       doc.fillColor(darkText).fontSize(10);
//       doc.text(`Status: `, { continued: true }).fillColor(primaryColor).text(data.Request_status || 'Draft', { underline: true });
//       doc.moveDown(0.5);

//       // Section: Metadata Details
//       doc.fillColor(primaryColor).fontSize(12).text('1. Permit Metadata & Location', { underline: true });
//       doc.moveDown(0.5);

//       doc.fillColor(darkText).fontSize(9);
//       const startY = doc.y;

//       // Col 1
//       doc.text(`Request Date: ${data.Request_Date || '-'}`, 40, startY);
//       doc.text(`Project Name: ${data.Company_Name || '-'}`, 40, doc.y + 5);
//       doc.text(`Contractor: ${data.subContractorName || '-'}`, 40, doc.y + 5);
//       doc.text(`Subcontractor: ${data.new_sub_contractor || '-'}`, 40, doc.y + 5);
//       doc.text(`Foreman: ${data.Foreman || '-'}`, 40, doc.y + 5);
//       doc.text(`Foreman Phone: ${data.Foreman_Phone_Number || '-'}`, 40, doc.y + 5);
//       doc.text(`Activity: ${data.Activity || '-'}`, 40, doc.y + 5);

//       // Col 2
//       doc.text(`Working Date: ${data.Working_Date || '-'}`, 300, startY);
//       doc.text(`Working Hours: ${data.Start_Time || '-'} - ${data.End_Time || '-'}`, 300, doc.y + 5);
//       doc.text(`Site / Building: ${data.building_name || '-'}`, 300, doc.y + 5);
//       doc.text(`Floor / Level: ${data.Room_Type || '-'}`, 300, doc.y + 5);
//       doc.text(`Room / Area: ${data.Room_Nos || '-'}`, 300, doc.y + 5);
//       doc.text(`Night Shift: ${Number(data.night_shift) === 1 ? 'Yes' : 'No'}`, 300, doc.y + 5);
//       doc.text(`Type of Activity: ${data.activityName || '-'}`, 300, doc.y + 5);

//       doc.moveDown(1.5);

//       // Description of Activity
//       doc.x = 40;
//       doc.fillColor(primaryColor).fontSize(10).text('Description of Activity:', { continued: true })
//          .fillColor(darkText).fontSize(9).text(` ${data.description_of_activity || '-'}`);
//       doc.moveDown(1);

//       // Tools & Machinery
//       doc.fillColor(primaryColor).fontSize(10).text('Tools / Machinery Used:', { continued: true })
//          .fillColor(darkText).fontSize(9).text(` Tools: ${data.Tools || '-'} | Machinery: ${data.Machinery || '-'}`);
//       doc.moveDown(1.5);

//       // Helper to draw checklist table
//       const drawChecklistTable = (title: string, questions: { q: string; val: any }[]) => {
//         // Check page overflow
//         if (doc.y > 650) doc.addPage();

//         doc.fillColor(primaryColor).fontSize(12).text(title, { underline: true });
//         doc.moveDown(0.5);

//         // Header Row
//         const tableY = doc.y;
//         doc.fillColor('#e9ecef').rect(40, tableY, 510, 16).fill();
//         doc.fillColor(primaryColor).fontSize(8).text('Question', 45, tableY + 4);
//         doc.text('Yes', 450, tableY + 4);
//         doc.text('No', 485, tableY + 4);
//         doc.text('N/A', 520, tableY + 4);

//         doc.y = tableY + 18;

//         for (const item of questions) {
//           if (doc.y > 750) {
//             doc.addPage();
//             // Redraw small header on new page
//             const newY = doc.y;
//             doc.fillColor('#e9ecef').rect(40, newY, 510, 16).fill();
//             doc.fillColor(primaryColor).fontSize(8).text('Question', 45, newY + 4);
//             doc.text('Yes', 450, newY + 4);
//             doc.text('No', 485, newY + 4);
//             doc.text('N/A', 520, newY + 4);
//             doc.y = newY + 18;
//           }

//           const currentY = doc.y;
//           doc.fillColor(darkText).fontSize(8).text(item.q, 45, currentY, { width: 390 });

//           const valNum = item.val !== undefined && item.val !== null ? Number(item.val) : -1;
//           if (valNum === 1) doc.fillColor(primaryColor).text('X', 455, currentY);
//           if (valNum === 0) doc.fillColor(primaryColor).text('X', 490, currentY);
//           if (valNum === 2) doc.fillColor(primaryColor).text('X', 525, currentY);

//           // Draw underline separator
//           const nextY = Math.max(doc.y, currentY + 12);
//           doc.strokeColor('#e9ecef').lineWidth(0.5).moveTo(40, nextY + 3).lineTo(550, nextY + 3).stroke();
//           doc.y = nextY + 8;
//         }
//         doc.moveDown(1);
//       };

//       // 1. General Safety Checklist
//       const generalQs = [
//         { q: 'Work not affecting other contractors in the area?', val: data.affecting_other_contractors },
//         { q: 'Other conditions to take into account?', val: data.other_conditions },
//         { q: 'Sufficient work lighting available?', val: data.lighting_begin_work },
//         { q: 'Team informed about specific risks? (RAMS/Toolbox talk)', val: data.specific_risks },
//         { q: 'Work environment safely ensured and signs placed?', val: data.environment_ensured },
//         { q: 'Team informed about emergency procedures?', val: data.course_of_actions || data.course_of_action }
//       ];
//       drawChecklistTable('2. General Safety Checklist', generalQs);

//       // 2. Hotwork Checklist
//       if (Number(data.Hot_work) === 1) {
//         const hotworkQs = [
//           { q: 'Are there other tasks in progress in the area?', val: data.tasks_in_progress_in_the_area },
//           { q: 'Considered alternative cold methods?', val: data.lighting_sufficiently },
//           { q: 'Team informed about specific risks?', val: data.spesific_risks_based_on_task },
//           { q: 'Work environment safety ensured?', val: data.work_environment_safety_ensured },
//           { q: 'Team informed of actions in emergencies?', val: data.course_of_action_in_emergencies },
//           { q: 'Fire watch established?', val: data.fire_watch_establish },
//           { q: 'Flammable materials removed?', val: data.combustible_material },
//           { q: 'Safety measures implemented to stop sparks?', val: data.safety_measures },
//           { q: 'Fire extinguishers and blanket ready for use?', val: data.extinguishers_and_fire_blanket }
//         ];
//         drawChecklistTable('3. Hotwork Safety Checklist', hotworkQs);
//       }

//       // 3. Electrical Checklist
//       if (Number(data.working_on_electrical_system) === 1) {
//         const electricalQs = [
//           { q: 'Is the area responsible person informed?', val: data.responsible_for_the_informed },
//           { q: 'Check if the board is de-energized?', val: data.de_energized },
//           { q: 'Risk assessment done RAMS?', val: data.do_risk_assessment },
//           { q: 'Secure against reconnection using LOTO?', val: data.if_no_loto },
//           { q: 'Do electrical appliances/devices have insulation?', val: data.electricity_have_isulation }
//         ];
//         drawChecklistTable('4. Electrical Systems Checklist', electricalQs);
//       }

//       // 4. Confined Space Checklist
//       if (Number(data.working_confined_spaces) === 1) {
//         const confinedQs = [
//           { q: 'Is tank/container cleaned to mitigate vapour/gas risk?', val: data.vapours_gases },
//           { q: 'Oxygen and LEL measurement done?', val: data.lel_measurement },
//           { q: 'Container and all equipment secured?', val: data.all_equipment },
//           { q: 'Safe entry and exit conditions present?', val: data.exit_conditions },
//           { q: 'Communication for emergency rescue determined?', val: data.communication_emergency },
//           { q: 'Rescue equipment ready in place?', val: data.rescue_equipments },
//           { q: 'Space and ventilation adequate?', val: data.space_ventilation },
//           { q: 'Oxygen meter provided?', val: data.oxygen_meter }
//         ];
//         drawChecklistTable('5. Confined Space Checklist', confinedQs);
//       }

//       doc.end();
//     } catch (err) {
//       reject(err);
//     }
//   });
// }

// /**
//  * Generates a structured PDF for the log timeline on the backend.
//  */
// export function buildLogsPdf(permitNo: string, logs: any[]): Promise<Buffer> {
//   return new Promise((resolve, reject) => {
//     try {
//       const doc = new PDFDocument({ margin: 40, size: 'A4' });
//       const chunks: Buffer[] = [];

//       doc.on('data', (chunk) => chunks.push(chunk));
//       doc.on('end', () => resolve(Buffer.concat(chunks)));
//       doc.on('error', (err) => reject(err));

//       const primaryColor = '#222a45';
//       const secondaryColor = '#edc510';
//       const darkText = '#333333';

//       // Header Title
//       doc.fillColor(primaryColor).fontSize(16).text(`PERMIT LOGS TIMELINE: ${permitNo}`, { align: 'center' });
//       doc.strokeColor(secondaryColor).lineWidth(2).moveTo(40, doc.y + 8).lineTo(550, doc.y + 8).stroke();
//       doc.moveDown(1.5);

//       // Log Entries Loop
//       for (const log of logs) {
//         if (doc.y > 680) doc.addPage();

//         const timeStr = log.createdTime ? new Date(log.createdTime).toLocaleString() : '-';
//         const type = log.requestType || 'Created';

//         doc.fillColor(primaryColor).fontSize(10).text(`[${timeStr}] - Status Changed to `, { continued: true });
//         doc.font('Helvetica-Bold').fillColor('#dc3545').text(type);
//         doc.font('Helvetica');

//         // User info
//         let usertype = log.user?.userType || '';
//         if (log.system === 1) {
//           usertype = 'System Auto Cancel';
//         } else {
//           const uLower = usertype.toLowerCase().trim();
//           if (uLower === 'department') usertype = 'ConM/HSE';
//           else if (uLower === 'department1') usertype = 'C&Q';
//           else if (uLower === 'subcontractor') usertype = 'Contractor';
//         }
//         const username = log.system === 1 ? 'System' : (log.user?.username || 'User');
//         doc.fillColor(darkText).fontSize(9).text(`Performed By: ${username} (${usertype})`);

//         if (log.changes && log.changes.length > 0) {
//           doc.moveDown(0.2);
//           doc.fillColor('#666666').fontSize(8).text('Field Changes:');

//           for (const chg of log.changes) {
//             if (doc.y > 740) doc.addPage();
//             const prev = chg.previous === null || chg.previous === '' ? 'Empty' : chg.previous;
//             const pres = chg.present === null || chg.present === '' ? 'Empty' : chg.present;
//             doc.fillColor(darkText).fontSize(8).text(`  • ${chg.fieldName}: `, { continued: true })
//                .fillColor('#dc3545').text(`"${prev}"`, { continued: true })
//                .fillColor(darkText).text(' ➔ ', { continued: true })
//                .fillColor('#28a745').text(`"${pres}"`);
//           }
//         }

//         // Draw separator
//         doc.moveDown(0.8);
//         doc.strokeColor('#dee2e6').lineWidth(0.5).moveTo(40, doc.y).lineTo(550, doc.y).stroke();
//         doc.moveDown(0.5);
//       }

//       doc.end();
//     } catch (err) {
//       reject(err);
//     }
//   });
// }


import PDFDocument from 'pdfkit';
import { join } from 'path';
import { existsSync } from 'fs';

// ─── Colour palette ──────────────────────────────────────────────────────────
const C = {
  primary: '#222a45',
  yellow: '#edc510',
  dark: '#333333',
  grey: '#666666',
  lightGrey: '#dee2e6',
  rowEven: '#f8f9fa',
  rowHeader: '#e9ecef',
  red: '#dc3545',
  green: '#28a745',
  white: '#ffffff',
  hotwork: '#fe001b',
  electrical: '#fed55a',
  height: '#005f8b',
  confined: '#fe8149',
  excavation: '#007334',
  crane: '#f1543f',
  poweron: '#4ebabd',
  pressurize: '#ffcc00',
};

// ─── Page geometry ────────────────────────────────────────────────────────────
const PAGE_W = 595;
const PAGE_H = 6000;   // fit-content: one tall page, no page breaks
const MARGIN = 20;
const CONTENT_W = PAGE_W - MARGIN * 2;
const BOTTOM = PAGE_H - 10;   // effectively infinite — ensureSpace never adds a page

// ═════════════════════════════════════════════════════════════════════════════
// UTILITY HELPERS
// ═════════════════════════════════════════════════════════════════════════════

function safeVal(v: any, fallback = '-'): string {
  if (v === undefined || v === null || v === '') return fallback;
  return String(v);
}

function yesNo(v: any): string {
  return Number(v) === 1 ? 'Yes' : 'No';
}

/** Add a new page only when there is not enough vertical space left. */
function ensureSpace(doc: PDFKit.PDFDocument, needed: number) {
  if (doc.y + needed > BOTTOM) doc.addPage();
}

/** Horizontal rule — does NOT use doc.text so it never moves doc.y unexpectedly */
function rule(doc: PDFKit.PDFDocument, y: number, color = C.yellow, lw = 2) {
  doc.strokeColor(color).lineWidth(lw)
    .moveTo(MARGIN, y).lineTo(PAGE_W - MARGIN, y).stroke();
}

/** Coloured section-title bar.
 *  Uses absolute coordinates so doc.y is always set explicitly after. */
function sectionBar(
  doc: PDFKit.PDFDocument,
  title: string,
  yesNoVal?: any,
  bgColor = C.primary,
  textColor = C.white,
  logoName?: string,
) {
  ensureSpace(doc, 32);
  const y = doc.y;
  const BAR_H = 26;

  // Background rectangle
  doc.fillColor(bgColor).rect(MARGIN, y, CONTENT_W, BAR_H).fill();

  let textX = MARGIN + 8;
  if (logoName) {
    const logoPath = join(process.cwd(), './src/images/logos', logoName);
    if (existsSync(logoPath)) {
      try {
        doc.image(logoPath, MARGIN + 8, y + 4, { height: 18 });
        textX = MARGIN + 32;
      } catch (err) {
        console.error(`Error drawing logo ${logoName} in PDF:`, err);
      }
    }
  }

  // Title text — set position explicitly
  doc.fillColor(textColor).fontSize(10).font('Helvetica-Bold')
    .text(title, textX, y + 8, { width: CONTENT_W - 110, lineBreak: false });

  // Yes / No radio indicators
  if (yesNoVal !== undefined) {
    const rx = PAGE_W - MARGIN - 95;
    const cy = y + BAR_H / 2;
    const yesChecked = Number(yesNoVal) === 1;
    const noChecked = Number(yesNoVal) === 0;

    doc.lineWidth(1).strokeColor(textColor);
    doc.circle(rx, cy, 5).stroke();
    doc.circle(rx + 48, cy, 5).stroke();
    if (yesChecked) doc.fillColor(textColor).circle(rx, cy, 3).fill();
    if (noChecked) doc.fillColor(textColor).circle(rx + 48, cy, 3).fill();

    doc.fillColor(textColor).fontSize(8).font('Helvetica')
      .text('Yes', rx + 8, y + 9, { lineBreak: false })
      .text('No', rx + 8 + 48, y + 9, { lineBreak: false });
  }

  // Advance doc.y past the bar
  doc.y = y + BAR_H + 6;
}

/** Two-column label + value pair */
function twoCol(
  doc: PDFKit.PDFDocument,
  left: [string, string],
  right: [string, string],
) {
  ensureSpace(doc, 30);
  const startY = doc.y;
  const colW = CONTENT_W / 2 - 8;

  doc.fillColor(C.primary).fontSize(8).font('Helvetica-Bold')
    .text(left[0], MARGIN, startY, { width: colW, lineBreak: false });
  doc.fillColor(C.primary).fontSize(8).font('Helvetica-Bold')
    .text(right[0], MARGIN + CONTENT_W / 2, startY, { width: colW, lineBreak: false });

  const valY = startY + 12;
  doc.fillColor(C.dark).fontSize(9).font('Helvetica')
    .text(safeVal(left[1]), MARGIN, valY, { width: colW });
  const afterLeft = doc.y;

  doc.y = valY;
  doc.fillColor(C.dark).fontSize(9).font('Helvetica')
    .text(safeVal(right[1]), MARGIN + CONTENT_W / 2, valY, { width: colW });
  const afterRight = doc.y;

  doc.y = Math.max(afterLeft, afterRight) + 4;
}

/** Single full-width label + value */
function oneRow(doc: PDFKit.PDFDocument, label: string, value: string) {
  ensureSpace(doc, 28);
  doc.fillColor(C.primary).fontSize(8).font('Helvetica-Bold')
    .text(label, MARGIN, doc.y, { width: CONTENT_W });
  doc.fillColor(C.dark).fontSize(9).font('Helvetica')
    .text(safeVal(value), MARGIN, doc.y + 1, { width: CONTENT_W });
  doc.moveDown(0.5);
}

/** Thin separator */
function separator(doc: PDFKit.PDFDocument) {
  const y = doc.y;
  doc.strokeColor(C.lightGrey).lineWidth(0.4)
    .moveTo(MARGIN, y).lineTo(PAGE_W - MARGIN, y).stroke();
  doc.y = y + 5;
}

// ─── Check mark ───────────────────────────────────────────────────────────────
// IMPORTANT: doc.text() always moves doc.y even with lineBreak:false.
// We must save and restore doc.y around the tick-text call, otherwise the row
// cursor gets corrupted and subsequent rows render on blank pages.
function checkMark(doc: PDFKit.PDFDocument, v: any, target: number, cx: number, cy: number) {
  if (v === undefined || v === null || Number(v) !== target) return;

  // Draw filled circle
  doc.fillColor(C.primary).circle(cx, cy, 7).fill();

  // Draw tick — save doc.y before, restore after, so cursor is unaffected
  const savedY = doc.y;
  doc.fillColor(C.white).fontSize(8).font('Helvetica-Bold')
    .text('✓', cx - 4, cy - 5, { lineBreak: false, width: 12 });
  doc.y = savedY;

  // Restore fill colour so subsequent drawing isn't white
  doc.fillColor(C.dark);
}

// ═════════════════════════════════════════════════════════════════════════════
// CHECKLIST TABLE
// ═════════════════════════════════════════════════════════════════════════════
interface CheckItem { q: string; val: any }

function drawChecklistTable(doc: PDFKit.PDFDocument, items: CheckItem[]) {
  const COL_Q = MARGIN;
  const Q_WIDTH = CONTENT_W - 120;
  const COL_YES = MARGIN + Q_WIDTH + 10;
  const COL_NO = COL_YES + 36;
  const COL_NA = COL_NO + 36;
  const HDR_H = 20;
  const MIN_ROW = 20;

  // ── Header row ──
  ensureSpace(doc, HDR_H + MIN_ROW);
  let hy = doc.y;
  doc.fillColor(C.rowHeader).rect(MARGIN, hy, CONTENT_W, HDR_H).fill();
  doc.fillColor(C.primary).fontSize(8).font('Helvetica-Bold')
    .text('Question', COL_Q + 4, hy + 6, { width: Q_WIDTH, lineBreak: false })
    .text('Yes', COL_YES, hy + 6, { lineBreak: false })
    .text('No', COL_NO, hy + 6, { lineBreak: false })
    .text('N/A', COL_NA, hy + 6, { lineBreak: false });
  doc.y = hy + HDR_H + 2;

  items.forEach((item, i) => {
    // Measure row height BEFORE drawing
    doc.fontSize(8);
    const textH = doc.heightOfString(item.q, { width: Q_WIDTH - 8 });
    const rowH = Math.max(MIN_ROW, textH + 8);

    // Page break if needed — re-draw header on new page
    if (doc.y + rowH > BOTTOM) {
      doc.addPage();
      hy = doc.y;
      doc.fillColor(C.rowHeader).rect(MARGIN, hy, CONTENT_W, HDR_H).fill();
      doc.fillColor(C.primary).fontSize(8).font('Helvetica-Bold')
        .text('Question', COL_Q + 4, hy + 6, { width: Q_WIDTH, lineBreak: false })
        .text('Yes', COL_YES, hy + 6, { lineBreak: false })
        .text('No', COL_NO, hy + 6, { lineBreak: false })
        .text('N/A', COL_NA, hy + 6, { lineBreak: false });
      doc.y = hy + HDR_H + 2;
    }

    const ry = doc.y;

    // Alternating row shading
    if (i % 2 === 1) {
      doc.fillColor(C.rowEven).rect(MARGIN, ry, CONTENT_W, rowH).fill();
    }

    // Question text
    doc.fillColor(C.dark).fontSize(8).font('Helvetica')
      .text(item.q, COL_Q + 4, ry + 4, { width: Q_WIDTH - 8 });

    // Check marks (no save/restore)
    const markY = ry + rowH / 2;
    checkMark(doc, item.val, 1, COL_YES + 6, markY);
    checkMark(doc, item.val, 0, COL_NO + 6, markY);
    checkMark(doc, item.val, 2, COL_NA + 6, markY);

    // Bottom border
    doc.strokeColor(C.lightGrey).lineWidth(0.4)
      .moveTo(MARGIN, ry + rowH).lineTo(PAGE_W - MARGIN, ry + rowH).stroke();

    doc.y = ry + rowH + 2;
  });

  doc.moveDown(0.6);
}

// ═════════════════════════════════════════════════════════════════════════════
// NOTES TABLE
// ═════════════════════════════════════════════════════════════════════════════
function drawNotesTable(doc: PDFKit.PDFDocument, notes: any[]) {
  if (!notes || notes.length === 0) {
    doc.fillColor(C.grey).fontSize(9).font('Helvetica')
      .text('No notes found.', MARGIN, doc.y, { width: CONTENT_W });
    doc.moveDown(0.5);
    return;
  }
  const NAME_W = 150;
  const NOTE_W = CONTENT_W - NAME_W - 8;

  ensureSpace(doc, 22);
  let hy = doc.y;
  doc.fillColor(C.rowHeader).rect(MARGIN, hy, CONTENT_W, 20).fill();
  doc.fillColor(C.primary).fontSize(8).font('Helvetica-Bold')
    .text('User Name', MARGIN + 4, hy + 6, { width: NAME_W, lineBreak: false })
    .text('Note', MARGIN + NAME_W + 8, hy + 6, { width: NOTE_W, lineBreak: false });
  doc.y = hy + 22;

  notes.forEach((n: any, i: number) => {
    const noteText = safeVal(n.note);
    doc.fontSize(8);
    const noteH = Math.max(18, doc.heightOfString(noteText, { width: NOTE_W }) + 8);
    ensureSpace(doc, noteH + 2);
    const ry = doc.y;

    if (i % 2 === 1) doc.fillColor(C.rowEven).rect(MARGIN, ry, CONTENT_W, noteH).fill();

    doc.fillColor(C.dark).fontSize(8).font('Helvetica')
      .text(safeVal(n.username, 'System'), MARGIN + 4, ry + 4, { width: NAME_W });
    doc.y = ry + 4;
    doc.fillColor(C.dark).fontSize(8).font('Helvetica')
      .text(noteText, MARGIN + NAME_W + 8, ry + 4, { width: NOTE_W });
    doc.y = ry + noteH + 2;
  });
  doc.moveDown(0.6);
}

// ═════════════════════════════════════════════════════════════════════════════
// TOOLBOX TALK SIGNATURE TABLE
// ═════════════════════════════════════════════════════════════════════════════
function drawToolboxTable(doc: PDFKit.PDFDocument) {
  const colW = CONTENT_W / 2;
  ensureSpace(doc, 22);
  // Date / Conducted-by header
  let ry = doc.y;
  doc.fillColor(C.rowEven).rect(MARGIN, ry, CONTENT_W, 20).fill();
  doc.fillColor(C.primary).fontSize(8).font('Helvetica-Bold')
    .text('Date / Time:', MARGIN + 4, ry + 6, { width: colW - 8, lineBreak: false })
    .text('Toolbox Conducted by:', MARGIN + colW + 4, ry + 6, { width: colW - 8, lineBreak: false });
  doc.y = ry + 22;

  for (let i = 0; i < 12; i++) {
    ensureSpace(doc, 20);
    ry = doc.y;
    if (i % 2 === 1) doc.fillColor(C.rowEven).rect(MARGIN, ry, CONTENT_W, 20).fill();
    doc.strokeColor(C.lightGrey).lineWidth(0.4)
      .moveTo(MARGIN, ry + 20).lineTo(PAGE_W - MARGIN, ry + 20).stroke()
      .moveTo(MARGIN + colW, ry).lineTo(MARGIN + colW, ry + 20).stroke();
    doc.fillColor(C.grey).fontSize(8).font('Helvetica')
      .text('Name:', MARGIN + 4, ry + 6, { lineBreak: false });
    doc.y = ry + 22;
  }
}

// ═════════════════════════════════════════════════════════════════════════════
// STATUS BADGE
// ═════════════════════════════════════════════════════════════════════════════
function statusBadge(doc: PDFKit.PDFDocument, text: string) {
  ensureSpace(doc, 28);
  const y = doc.y;
  doc.fillColor('#1f2d77').rect(MARGIN, y, 170, 22).fill();
  doc.fillColor(C.white).fontSize(9).font('Helvetica-Bold')
    .text(`Status: ${text}`, MARGIN + 6, y + 7, { width: 158, lineBreak: false });
  doc.y = y + 28;
}

// ═════════════════════════════════════════════════════════════════════════════
// CHECK-IN / CHECK-OUT CARDS
// ═════════════════════════════════════════════════════════════════════════════
function checkinCards(doc: PDFKit.PDFDocument, data: any) {
  const hasIn = !!data.check_in_time;
  const hasOut = data.Request_status === 'Closed' && !!data.check_out_time;
  if (!hasIn && !hasOut) return;

  const formatDT = (s: any) => {
    if (!s) return '-';
    try {
      const d = new Date(s);
      const mo = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      let h = d.getHours();
      const m = String(d.getMinutes()).padStart(2, '0');
      const ap = h >= 12 ? 'PM' : 'AM';
      h = h % 12 || 12;
      return `${String(d.getDate()).padStart(2, '0')}-${mo[d.getMonth()]}-${d.getFullYear()} ${String(h).padStart(2, '0')}:${m} ${ap}`;
    } catch { return String(s); }
  };

  ensureSpace(doc, 50);
  const y = doc.y;
  const half = (CONTENT_W - 10) / 2;

  if (hasIn) {
    doc.fillColor('#28a745').rect(MARGIN, y, hasOut ? half : CONTENT_W, 44).fill();
    doc.fillColor(C.white).fontSize(8).font('Helvetica-Bold')
      .text('Check-in Date', MARGIN + 6, y + 4, { lineBreak: false });
    doc.fillColor(C.white).fontSize(8).font('Helvetica-Bold')
      .text('User Name', MARGIN + half / 2 + 6, y + 4, { lineBreak: false });
    doc.fillColor(C.white).fontSize(9).font('Helvetica')
      .text(formatDT(data.check_in_time), MARGIN + 6, y + 18,
        { width: half / 2 - 10, lineBreak: false });
    doc.fillColor(C.white).fontSize(9).font('Helvetica')
      .text(safeVal(data.check_in_user), MARGIN + half / 2 + 6, y + 18,
        { width: half / 2 - 10, lineBreak: false });
  }

  if (hasOut) {
    const ox = hasIn ? MARGIN + half + 10 : MARGIN;
    doc.fillColor('#dc3545').rect(ox, y, half, 44).fill();
    doc.fillColor(C.white).fontSize(8).font('Helvetica-Bold')
      .text('Check-out Date', ox + 6, y + 4, { lineBreak: false });
    doc.fillColor(C.white).fontSize(8).font('Helvetica-Bold')
      .text('User Name', ox + half / 2 + 6, y + 4, { lineBreak: false });
    doc.fillColor(C.white).fontSize(9).font('Helvetica')
      .text(formatDT(data.check_out_time), ox + 6, y + 18,
        { width: half / 2 - 10, lineBreak: false });
    doc.fillColor(C.white).fontSize(9).font('Helvetica')
      .text(safeVal(data.check_out_user), ox + half / 2 + 6, y + 18,
        { width: half / 2 - 10, lineBreak: false });
  }

  doc.y = y + 50;
}

// ═════════════════════════════════════════════════════════════════════════════
// SIGNATURES SECTION
// ═════════════════════════════════════════════════════════════════════════════
function signaturesSection(doc: PDFKit.PDFDocument, data: any) {
  sectionBar(doc, '— Signatures & Closing Details —');
  const pType = data.permit_type;
  const pUnder = data.permit_under;

  if (pType === 'Construction' && pUnder === 'Construction') {
    oneRow(doc, 'ConM Initials', safeVal(data.ConM_initials));
  } else if (pType === 'Construction' && pUnder === 'Commissioning') {
    oneRow(doc, 'ConM Initials', safeVal(data.ConM_initials));
    oneRow(doc, 'C&Q Initials', safeVal(data.CoMM_initials));
  } else if (pType === 'Commissioning' && pUnder === 'Construction') {
    oneRow(doc, 'C&Q Initials', safeVal(data.CoMM_initials));
    oneRow(doc, 'ConM Initials', safeVal(data.ConM_initials));
  } else if (pType === 'Commissioning' && pUnder === 'Commissioning') {
    oneRow(doc, 'C&Q Initials', safeVal(data.CoMM_initials));
  } else {
    oneRow(doc, 'ConM Initials', safeVal(data.ConM_initials));
  }

  oneRow(doc, 'Person Responsible for This Work', safeVal(data.ConM_initials1));
  oneRow(doc, 'Reject Reason', safeVal(data.reject_reason));
  oneRow(doc, 'Cancel Reason', safeVal(data.cancel_reason));
  oneRow(doc, 'Close Note', safeVal(data.close_note));
}

// ═════════════════════════════════════════════════════════════════════════════
// MAIN: buildPermitPdf
// ═════════════════════════════════════════════════════════════════════════════
export function buildPermitPdf(data: any): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 0, size: [PAGE_W, PAGE_H], autoFirstPage: true });
      const chunks: Buffer[] = [];
      doc.on('data', c => chunks.push(c));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // ── Date / time helpers ──────────────────────────────────────────────
      const fmtDate = (s: any) => {
        if (!s) return '-';
        try {
          const d = new Date(s);
          if (isNaN(d.getTime())) return String(s);
          const mo = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          return `${String(d.getDate()).padStart(2, '0')}-${mo[d.getMonth()]}-${d.getFullYear()}`;
        } catch { return String(s); }
      };

      const fmtTime = (s: any) => {
        if (!s) return '-';
        try {
          if (typeof s === 'string' && s.includes(':')) {
            const [h, m] = s.split(':');
            let hh = parseInt(h, 10);
            const ap = hh >= 12 ? 'PM' : 'AM';
            hh = hh % 12 || 12;
            return `${String(hh).padStart(2, '0')}:${m} ${ap}`;
          }
          const d = new Date(s);
          if (!isNaN(d.getTime())) {
            let hh = d.getHours();
            const mm = String(d.getMinutes()).padStart(2, '0');
            const ap = hh >= 12 ? 'PM' : 'AM';
            hh = hh % 12 || 12;
            return `${String(hh).padStart(2, '0')}:${mm} ${ap}`;
          }
        } catch { }
        return String(s);
      };

      const getStatus = () => {
        if (data.cancel_reason === 'Permit not opened so system cancelled automatically')
          return 'Auto-Cancel';
        return safeVal(data.Request_status, 'Draft');
      };

      // ════════════════════════════════════════════════════════════════════
      // PAGE 1 — HEADER  (draw everything with explicit y coordinates)
      // ════════════════════════════════════════════════════════════════════
      const HDR_Y = MARGIN;
      const HDR_H = 38;

      // Navy title bar
      doc.fillColor(C.primary).rect(MARGIN, HDR_Y, CONTENT_W, HDR_H).fill();
      doc.fillColor(C.white).fontSize(15).font('Helvetica-Bold')
        .text(
          `ACTIVITY PERMIT NO: ${safeVal(data.PermitNo)}`,
          MARGIN, HDR_Y + 12,
          { width: CONTENT_W, align: 'center', lineBreak: false },
        );

      // Yellow rule below header
      const ruleY = HDR_Y + HDR_H + 4;
      rule(doc, ruleY, C.yellow, 2);

      // Advance cursor past header
      doc.y = ruleY + 10;

      // Check-in / check-out cards
      checkinCards(doc, data);
      doc.moveDown(0.3);

      // Status badge
      statusBadge(doc, getStatus());
      doc.moveDown(0.5);

      // ── Section 1: Metadata ──────────────────────────────────────────────
      sectionBar(doc, '1. Permit Metadata & Location');
      twoCol(doc, ['Request Date', fmtDate(data.Request_Date)], ['Project Name', safeVal(data.Company_Name)]);
      separator(doc);
      twoCol(doc, ['Contractor', safeVal(data.subContractorName)], ['Subcontractor', safeVal(data.new_sub_contractor)]);
      separator(doc);
      twoCol(doc, ['Foreman / Supervision', safeVal(data.Foreman)], ['Foreman Phone', safeVal(data.Foreman_Phone_Number)]);
      separator(doc);
      twoCol(doc, ['Activity', safeVal(data.Activity)], ['Type of Activity', safeVal(data.activityName)]);
      separator(doc);
      oneRow(doc, 'RAMS Number', (data.rams_number && data.rams_number !== 'undefined') ? data.rams_number : '-');
      separator(doc);
      twoCol(doc, ['Permit Type', safeVal(data.permit_type)], ['Permit Under', safeVal(data.permit_under, 'Construction')]);
      separator(doc);

      // ── Section 2: Description ───────────────────────────────────────────
      sectionBar(doc, '2. Description of Activity');
      doc.fillColor(C.dark).fontSize(9).font('Helvetica')
        .text(safeVal(data.description_of_activity), MARGIN, doc.y, { width: CONTENT_W });
      doc.moveDown(0.8);

      // ── Section 3: Schedule & Location ──────────────────────────────────
      sectionBar(doc, '3. Schedule & Location');
      twoCol(doc, ['Working Date', fmtDate(data.Working_Date)], ['Night Shift', yesNo(data.night_shift)]);
      separator(doc);
      twoCol(doc, ['Start Time', fmtTime(data.Start_Time)], ['End Time', fmtTime(data.End_Time)]);
      separator(doc);
      if (data.new_date || data.new_end_time) {
        twoCol(doc, ['New Date', fmtDate(data.new_date)], ['New End Time', fmtTime(data.new_end_time)]);
        separator(doc);
      }
      twoCol(doc, ['Site / Project', safeVal(data.Company_Name)], ['Building', safeVal(data.building_name)]);
      separator(doc);
      twoCol(doc, ['Floor / Level', safeVal(data.Room_Type)], ['Zone', safeVal(data.zone_name)]);
      separator(doc);
      oneRow(doc, 'Specific Rooms', safeVal(data.room_names || data.Room_Nos));
      separator(doc);

      // ── Section 4: Tools & Workers ───────────────────────────────────────
      sectionBar(doc, '4. Tools & Machinery');
      twoCol(doc, ['Tools Used', safeVal(data.Tools)], ['Machinery Used', safeVal(data.Machinery)]);
      separator(doc);
      oneRow(doc, 'Number of Workers Involved', safeVal(data.Number_Of_Workers, 'N/A'));

      // ════════════════════════════════════════════════════════════════════
      // 5. GENERAL SAFETY CHECKLIST
      // ════════════════════════════════════════════════════════════════════
      sectionBar(doc, '5. General Safety Checklist');
      drawChecklistTable(doc, [
        { q: 'Can you confirm that your work is not affecting other contractors working in this area before starting?', val: data.affecting_other_contractors },
        { q: 'Are there other conditions that must be taken into account during the work? If Yes, note in "Other conditions".', val: data.other_conditions },
        { q: 'Can you confirm that there will be enough work lighting to begin the work?', val: data.lighting_begin_work },
        { q: 'Have the team been informed about the specific risks based on task? (RAMS/Toolbox talk etc.)', val: data.specific_risks },
        { q: 'Is the work environment safely ensured? Have the necessary warning signs been placed?', val: data.environment_ensured },
        { q: 'Have the team been informed about the course of action in any emergency situation?', val: data.course_of_action ?? data.course_of_actions },
      ]);
      if (Number(data.other_conditions) === 1 && data.other_conditions_input) {
        ensureSpace(doc, 20);
        doc.fillColor(C.red).fontSize(8).font('Helvetica-Bold')
          .text('Note — Other Conditions: ', MARGIN, doc.y, { continued: true })
          .fillColor(C.dark).font('Helvetica')
          .text(safeVal(data.other_conditions_input), { width: CONTENT_W });
        doc.moveDown(0.5);
      }

      // ════════════════════════════════════════════════════════════════════
      // 6. HOTWORK
      // ════════════════════════════════════════════════════════════════════
      const isHotWorkActive = Number(data.Hot_work) === 1;
      sectionBar(doc, '6. Hotwork', data.Hot_work ?? 0, C.hotwork, C.white, 'HotWorks.png');
      drawChecklistTable(doc, [
        { q: 'Are there other tasks in progress in the area?', val: isHotWorkActive ? data.tasks_in_progress_in_the_area : 0 },
        { q: 'Have you considered any alternative cold methods? (e.g. hydraulic cutters vs. angle grinder)', val: isHotWorkActive ? data.lighting_sufficiently : 0 },
        { q: 'Have the team been informed about the specific risks based on task? (RAMS/Toolbox talk etc.)', val: isHotWorkActive ? data.spesific_risks_based_on_task : 0 },
        { q: 'Is the work environment safely ensured? Have the necessary warning signs been placed?', val: isHotWorkActive ? data.work_environment_safety_ensured : 0 },
        { q: 'Have the team been informed about the course of action in emergencies?', val: isHotWorkActive ? data.course_of_action_in_emergencies : 0 },
        { q: 'Should a fire watch be established?', val: isHotWorkActive ? data.fire_watch_establish : 0 },
        { q: 'Can you confirm that the flammable materials are removed from the work area?', val: isHotWorkActive ? data.combustible_material : 0 },
        { q: 'Should safety measures be implemented to stop sparks from splattering on flooring or other surfaces?', val: isHotWorkActive ? data.safety_measures : 0 },
        { q: 'Are fire extinguishers and fire blanket ready for use in the area?', val: isHotWorkActive ? data.extinguishers_and_fire_blanket : 0 },
      ]);
      const isWeldingActive = isHotWorkActive && Number(data.welding_activitiy) === 1;
      oneRow(doc, 'Is there any welding activity?', yesNo(isHotWorkActive ? data.welding_activitiy : 0));
      drawChecklistTable(doc, [
        { q: 'The people who will do heat treatment had welder certificates?', val: isWeldingActive ? data.heat_treatment : 0 },
        { q: 'Should air extraction be established? (Welding fumes directly led to open air)', val: isWeldingActive ? data.air_extraction_be_established : 0 },
      ]);
      twoCol(doc, ['Is it a low risk hotwork?', yesNo(isHotWorkActive ? data.low_risk_hotwork : 0)], ['Is it a high risk hotwork?', yesNo(isHotWorkActive ? data.high_risk_hotwork : 0)]);
      twoCol(doc, ['Hot work checklist filled in?', yesNo(isHotWorkActive ? data.hot_work_checklist_filled : 0)], ['Fire guard present?', yesNo(isHotWorkActive ? data.fire_guard_present : 0)]);

      sectionBar(doc, 'Hotwork — Post Work Checks', undefined, C.hotwork, C.white, 'HotWorks.png');
      drawChecklistTable(doc, [
        { q: 'Has the work area been inspected for smoldering materials or residual heat?', val: isHotWorkActive ? data.h_heat_source : 0 },
        { q: 'Have all tools and hot work equipment been safely removed from the work area?', val: isHotWorkActive ? data.h_workplace_check : 0 },
        { q: 'Has the area been cleaned and restored to its original safe condition?', val: isHotWorkActive ? data.h_fire_detectors : 0 },
      ]);
      twoCol(doc,
        ['1hr Check Time', (isHotWorkActive && data.h_start_time && !String(data.h_start_time).startsWith('1970')) ? data.h_start_time : 'N/A'],
        ['3hrs Check Time', (isHotWorkActive && data.h_end_time && !String(data.h_end_time).startsWith('1970')) ? data.h_end_time : 'N/A']);

      // ════════════════════════════════════════════════════════════════════
      // 7. ELECTRICAL SYSTEMS
      // ════════════════════════════════════════════════════════════════════
      const isElecActive = Number(data.working_on_electrical_system) === 1;
      sectionBar(doc, '7. Working on Site Temporary Electrical Systems', data.working_on_electrical_system ?? 0, C.primary, C.yellow, 'ElectricalSystems.png');
      drawChecklistTable(doc, [
        { q: 'Is the responsible person for the area informed?', val: isElecActive ? data.responsible_for_the_informed : 0 },
        { q: 'Check if the board is de-energized — is it de-energized?', val: isElecActive ? data.de_energized : 0 },
        { q: 'Do you have risk assessment done (RAMS)?', val: isElecActive ? data.do_risk_assessment : 0 },
        { q: 'Secure the area against reconnection using LOTO (Lock-out/Tag-out) with at least a craftsman\'s padlock.', val: isElecActive ? data.if_no_loto : 0 },
        { q: 'Do appliances/devices that run on electricity have insulation?', val: isElecActive ? data.electricity_have_isulation : 0 },
      ]);

      // ════════════════════════════════════════════════════════════════════
      // 8. HAZARDOUS SUBSTANCES
      // ════════════════════════════════════════════════════════════════════
      const isChemActive = Number(data.working_hazardious_substen) === 1;
      sectionBar(doc, '8. Working with Hazardous Substances / Chemicals', data.working_hazardious_substen ?? 0, '#7a6000', C.white, 'substanceChemical.png');
      drawChecklistTable(doc, [
        { q: 'Relevant MAL-codes and safety datasheets for hazardous media have been presented?', val: isChemActive ? data.relevant_mal : 0 },
        { q: 'Is MSDS (Material Safety Data Sheet) submitted?', val: isChemActive ? data.msds : 0 },
        { q: 'Has the use of protective equipment been taken into account — and are they present?', val: isChemActive ? data.equipment_taken_account : 0 },
        { q: 'Has the use of ventilation been taken into account?', val: isChemActive ? data.ventilation : 0 },
        { q: 'Will the hazardous substances affect people outside the working area? (fumes)', val: isChemActive ? data.hazardaus_substances : 0 },
        { q: 'Are there means for safe storage and disposal? Is it mapped on the site plan?', val: isChemActive ? data.storage_and_disposal : 0 },
        { q: 'Are the spill kits in place and reachable in case of a leak or spill?', val: isChemActive ? data.reachable_case : 0 },
        { q: 'Is RAMS covering chemicals risk assessment for working with the substance?', val: isChemActive ? data.checical_risk_assessment : 0 },
      ]);

      // ════════════════════════════════════════════════════════════════════
      // 9. PRESSURE TESTING (Commissioning only)
      // ════════════════════════════════════════════════════════════════════
      if (data.permit_type === 'Commissioning') {
        const isPressureActive = Number(data.pressure_testing_of_equipment) === 1;
        sectionBar(doc, '9. Pressure Testing of Equipment', data.pressure_testing_of_equipment ?? 0, '#3ba9fd', C.white, 'testingequipment.png');
        drawChecklistTable(doc, [
          { q: 'Linewalk of the pipework/equipment done?', val: isPressureActive ? data.line_walk : 0 },
          { q: 'Pressure test is coordinated with NNE C&Q?', val: isPressureActive ? data.pressure_test_coordinated : 0 },
          { q: 'Is the pipework/equipment MIC (Mechanical Installation Complete)?', val: isPressureActive ? data.pipework_mic : 0 },
          { q: 'LOTO plan attached to the work permit?', val: isPressureActive ? data.loto_plan_attached : 0 },
          { q: 'Is the exclusion zone calculated and layout attached to work permit?', val: isPressureActive ? data.exclusion_zone_calculated : 0 },
          { q: 'Pneumatic test?', val: isPressureActive ? data.pneumatic_hydrostatic : 0 },
          { q: 'Hydrostatic test?', val: isPressureActive ? data.pressure_of_the_test : 0 },
          { q: 'Safety Valves are calibrated and attached to the Pressure testing rig?', val: isPressureActive ? data.safety_valves_calibrated : 0 },
        ]);
        if (Number(data.pneumatic_hydrostatic) === 1)
          oneRow(doc, 'Pressure of Pneumatic Test', `${safeVal(data.pressure_pneumatic)} BarG`);
        if (Number(data.pressure_of_the_test) === 1)
          oneRow(doc, 'Pressure of Hydrostatic Test', `${safeVal(data.pressure_hydrostatic)} BarG`);
      }

      // ════════════════════════════════════════════════════════════════════
      // 10. WORKING AT HEIGHT
      // ════════════════════════════════════════════════════════════════════
      const isHeightActive = Number(data.working_at_height) === 1;
      sectionBar(doc, '10. Working at Height', data.working_at_height ?? 0, C.height, C.white, 'WorkingAtHight.png');
      drawChecklistTable(doc, [
        { q: 'Has the working area been segregated or demarcated with hand barriers?', val: isHeightActive ? data.segragated_demarkated : 0 },
        { q: 'Are suitable anchor points in place for lanyard attachments?', val: isHeightActive ? data.lanyard_attachments : 0 },
        { q: 'In case of emergency is there a rescue plan in place?', val: isHeightActive ? data.rescue_plan : 0 },
        { q: 'Has the work been planned to avoid hazards like falling objects, machine interference etc.?', val: isHeightActive ? data.avoid_hazards : 0 },
        { q: 'Has the team had certified working at height training?', val: isHeightActive ? data.height_training : 0 },
        { q: 'Will work be carried out under supervision of personnel with Working at Height training?', val: isHeightActive ? data.supervision : 0 },
        { q: 'Full body harness with fall-preventing system deployed & twin lanyard provided?', val: isHeightActive ? data.shock_absorbing : 0 },
        { q: 'Are working at height equipment (harness and lanyard) inspected and suitable?', val: isHeightActive ? data.height_equipments : 0 },
        { q: 'Horizontal or vertical life line systems in place?', val: isHeightActive ? data.vertical_life : 0 },
        { q: 'Are all tools secured from falling from height?', val: isHeightActive ? data.secured_falling : 0 },
        { q: 'Have protective measures for dropped objects been established? (lanyards, nets, demarcation)', val: isHeightActive ? data.dropped_objects : 0 },
        { q: 'Has proper and safe access and egress been ensured?', val: isHeightActive ? data.safe_acces : 0 },
        { q: 'Are the weather conditions acceptable?', val: isHeightActive ? data.weather_acceptable : 0 },
      ]);

      // ════════════════════════════════════════════════════════════════════
      // 11. CONFINED SPACE
      // ════════════════════════════════════════════════════════════════════
      const isConfinedActive = Number(data.working_confined_spaces) === 1;
      sectionBar(doc, '11. Working in Confined Space', data.working_confined_spaces ?? 0, C.confined, C.white, 'ConfinedSpace.png');
      drawChecklistTable(doc, [
        { q: 'Is the tank/container cleaned so the task can take place without risk from vapours, gases etc.?', val: isConfinedActive ? data.vapours_gases : 0 },
        { q: 'Are oxygen measurement and LEL measurement done before starting the work?', val: isConfinedActive ? data.lel_measurement : 0 },
        { q: 'Are the container and all equipment on the container (including agitator) properly secured?', val: isConfinedActive ? data.all_equipment : 0 },
        { q: 'Are there safe entry and exit conditions? (e.g. ladder)', val: isConfinedActive ? data.exit_conditions : 0 },
        { q: 'Are means of communication for emergency rescue determined? (Siren, radio or telephone)', val: isConfinedActive ? data.communication_emergency : 0 },
        { q: 'Are rescue equipments for use in place and ready?', val: isConfinedActive ? data.rescue_equipments : 0 },
        { q: 'Are space and ventilation adequate?', val: isConfinedActive ? data.space_ventilation : 0 },
        { q: 'Is an oxygen meter provided for the work?', val: isConfinedActive ? data.oxygen_meter : 0 },
      ]);

      // ════════════════════════════════════════════════════════════════════
      // 12. EXCAVATION WORKS
      // ════════════════════════════════════════════════════════════════════
      const isExcavationActive = Number(data.excavation_works) === 1;
      sectionBar(doc, '12. Excavation Works', data.excavation_works ?? 0, C.excavation, C.white, 'ExcavationWorks.png');
      drawChecklistTable(doc, [
        { q: 'Is the excavation area segregated (1m from edge with hard barriers or 2m with soft barriers) before work begins?', val: isExcavationActive ? data.excavation_segregated : 0 },
        { q: 'Has the digging permit been obtained in accordance with Danish regulations and NN standards?', val: isExcavationActive ? data.nn_standards : 0 },
        { q: 'Does excavation require shoring?', val: isExcavationActive ? data.excavation_shoring : 0 },
        { q: 'Is the sloping correct in relation to the depth of the dig as per Danish regulations?', val: isExcavationActive ? data.danish_regulation : 0 },
        { q: 'Have proper and safe access and egress been provided?', val: isExcavationActive ? data.safe_access_and_egress : 0 },
        { q: 'Are correctly positioned ladders or correctly sloped stairways accessible?', val: isExcavationActive ? data.correctly_sloped : 0 },
        { q: 'Does all machinery have valid inspection dates?', val: isExcavationActive ? data.inspection_dates : 0 },
        { q: 'Have clearly marked drawings been submitted?', val: isExcavationActive ? data.marked_drawings : 0 },
        { q: 'Are the underground areas cleared from all electrical, piping and other services?', val: isExcavationActive ? data.underground_areas_cleared : 0 },
      ]);

      // ════════════════════════════════════════════════════════════════════
      // 13. CRANE & LIFTING
      // ════════════════════════════════════════════════════════════════════
      const isLiftingActive = Number(data.using_cranes_or_lifting) === 1;
      sectionBar(doc, '13. Using Crane or Lifting', data.using_cranes_or_lifting ?? 0, C.crane, C.white, 'Craneslifting.png');
      drawChecklistTable(doc, [
        { q: 'Is there an appointed person in charge of the lifting/crane operation?', val: isLiftingActive ? data.appointed_person : 0 },
        { q: 'Are the details of load (dimensions, SWL) and loading/unloading requirements provided by vendor or supplier?', val: isLiftingActive ? (data.vendor_supplier ?? data.vendor_supplies) : 0 },
        { q: 'Is lift plan submitted?', val: isLiftingActive ? data.lift_plan : 0 },
        { q: 'Has the correct crane/lifting equipment as stated in the lift plan been supplied and inspected?', val: isLiftingActive ? data.supplied_and_inspected : 0 },
        { q: 'Do the crane operators have the legally required certificates?', val: isLiftingActive ? data.legal_required_certificates : 0 },
        { q: 'Is laydown area suitable and prepared for lifting?', val: isLiftingActive ? data.prapared_lifting : 0 },
        { q: 'Is the entire area of the lifting task fenced off?', val: isLiftingActive ? data.lifting_task_fenced : 0 },
        { q: 'Have all overhead risks (cables, adjacent structures etc.) been identified and precautions implemented?', val: isLiftingActive ? data.overhead_risks : 0 },
      ]);

      // ════════════════════════════════════════════════════════════════════
      // COMMISSIONING-ONLY SECTIONS
      // ════════════════════════════════════════════════════════════════════
      if (data.permit_type === 'Commissioning') {
        const isPowerActive = Number(data.power_on) === 1;
        sectionBar(doc, '14. Energising, Isolating & Working on Live Electrical Systems', data.power_on ?? 0, C.poweron, C.white, 'electrical_works.png');

        const isEnergisingActive = isPowerActive && Number(data.energising_equipment) === 1;
        sectionBar(doc, '14a. Energising Electrical Equipment', data.energising_equipment ?? 0, C.poweron, C.white, 'electrical_works.png');
        drawChecklistTable(doc, [
          { q: 'Is the responsible person for the area informed?', val: isEnergisingActive ? data.responsible_for_the_area : 0 },
          { q: 'Do you have a risk assessment done?', val: isEnergisingActive ? data.risk_assessment_done : 0 },
          { q: 'Barriers & Signage in place?', val: isEnergisingActive ? data.barriers_signage : 0 },
          { q: 'Arc flash boundary and PPE evaluated?', val: isEnergisingActive ? data.arc_flash : 0 },
          { q: 'Have all the cables that need to be energized been tested?', val: isEnergisingActive ? data.energized_been_tested : 0 },
          { q: 'Have all punches been closed?', val: isEnergisingActive ? data.punches_been_closed : 0 },
          { q: 'Is Electrical Checklist completed?', val: isEnergisingActive ? data.toct_checklist : 0 },
          { q: 'Have you informed and aligned with EL LOTO team and provided an energisation request form?', val: isEnergisingActive ? data.informed_aligned : 0 },
        ]);

        const isIsolatingActive = isPowerActive && Number(data.isolating_live) === 1;
        sectionBar(doc, '14b. Isolating Live Electrical Systems for Maintenance or Modification', data.isolating_live ?? 0, C.poweron, C.white, 'electrical_works.png');
        drawChecklistTable(doc, [
          { q: 'Is the responsible person for the area informed?', val: isIsolatingActive ? (data.isolating_resposible ?? data.isolating_responsible) : 0 },
          { q: 'Has a Risk Assessment been completed?', val: isIsolatingActive ? data.isolating_risk_assessment : 0 },
          { q: 'Have C&Q LOTO been informed and tasks co-ordinated for shutdown work?', val: isIsolatingActive ? data.cq_informed : 0 },
          { q: 'Have C&Q LOTO been provided marked up single line diagrams/electrical drawings?', val: isIsolatingActive ? data.cq_provided : 0 },
          { q: 'Has a De-Energisation Request form and supporting documentation been provided to C&Q LOTO?', val: isIsolatingActive ? data.de_energisation_request : 0 },
          { q: 'Are all barriers, signage and PPE prepared for the task?', val: isIsolatingActive ? data.ppe_prepared : 0 },
          { q: 'Has absence of voltage been verified and proven dead?', val: isIsolatingActive ? data.absence_of_voltage : 0 },
          { q: 'Has stored energy been discharged?', val: isIsolatingActive ? data.stored_energy : 0 },
          { q: 'Have any secondary or back up power supplies been confirmed and accounted for?', val: isIsolatingActive ? data.backup_power : 0 },
        ]);

        const isWorkingNearLiveActive = isPowerActive && Number(data.working_near_live) === 1;
        sectionBar(doc, '14c. Working on OR near Live Electrical Systems', data.working_near_live ?? 0, C.poweron, C.white, 'electrical_works.png');
        drawChecklistTable(doc, [
          { q: 'Live work is unavoidable and justified?', val: isWorkingNearLiveActive ? data.unavoidable : 0 },
          { q: 'De-energisation is not reasonably practicable?', val: isWorkingNearLiveActive ? data.reasonably_practicable : 0 },
          { q: 'Live work authorised by electrical responsible person?', val: isWorkingNearLiveActive ? data.work_authorised : 0 },
          { q: 'Risk assessment has been completed?', val: isWorkingNearLiveActive ? data.working_risk_assessment : 0 },
          { q: 'Arc flash boundary and PPE evaluated?', val: isWorkingNearLiveActive ? data.working_arc_boundary : 0 },
          { q: 'Barriers and Signage in place?', val: isWorkingNearLiveActive ? data.working_barriers : 0 },
          { q: 'Insulated tools and approved test equipment to be used?', val: isWorkingNearLiveActive ? data.insulated_tools : 0 },
          { q: 'Work will always be carried out with a second person to assist in the event of an emergency?', val: isWorkingNearLiveActive ? data.event_of_emergency : 0 },
        ]);

        const isPressurizeActive = Number(data.pressurization) === 1;
        sectionBar(doc, '15. Energization of Mechanical Equipment', data.pressurization ?? 0, C.pressurize, C.primary, 'mechanical1.png');
        drawChecklistTable(doc, [
          { q: 'Pressure test performed and approved?', val: isPressurizeActive ? data.performed_approved : 0 },
          { q: 'Flushing approved?', val: isPressurizeActive ? data.flushing_approved : 0 },
          { q: 'MC approved?', val: isPressurizeActive ? data.mc_approved : 0 },
          { q: 'Walkdown with Visual inspection performed?', val: isPressurizeActive ? data.visual_inspection : 0 },
          { q: 'LOTO plan approved and installed by LOTO officer?', val: isPressurizeActive ? data.loto_plan_approved : 0 },
          { q: 'Ensure Safety Valves follow Media Code?', val: isPressurizeActive ? data.follow_media_code : 0 },
          { q: 'C&Q Safety signs are in place?', val: isPressurizeActive ? data.cq_safety_signs : 0 },
        ]);
        if (Number(data.mc_approved) === 1)
          oneRow(doc, 'MC Number', safeVal(data.mc_number_text));

        if (data.work_type) {
          sectionBar(doc, 'Type of Work');
          oneRow(doc, 'Work Type', safeVal(data.work_type));
          if (data.work_type === 'Mechanical Works' && data.resolvedMechanicalWorks?.length)
            oneRow(doc, 'Module Numbers', data.resolvedMechanicalWorks.join(', '));
          if (data.work_type === 'Electrical Works') {
            if (data.resolvedPanelNumbers?.length)
              oneRow(doc, 'Panel Numbers', data.resolvedPanelNumbers.join(', '));
            if (data.resolvedSystemNumbers?.length)
              oneRow(doc, 'System Numbers', data.resolvedSystemNumbers.join(', '));
          }
        }
      }

      // ════════════════════════════════════════════════════════════════════
      // PPE
      // ════════════════════════════════════════════════════════════════════
      sectionBar(doc, 'PPE Requirements');

      [
        { label: 'Eye Protection', val: data.eye_protection },
        { label: 'Fall Protection', val: data.fall_protection },
        { label: 'Hearing Protection', val: data.hearing_protection },
        { label: 'Respiratory Protection', val: data.respiratory_protection },
      ].forEach(p => {
        const req = Number(p.val) === 1;
        doc.fillColor(req ? C.primary : C.grey).fontSize(9).font('Helvetica')
          .text(`${req ? '✓' : '✗'}  ${p.label}`, MARGIN + 10, doc.y, { width: CONTENT_W / 2 });
      });
      doc.moveDown(0.3);
      oneRow(doc, 'Other PPE', safeVal(data.other_ppe, 'N/A'));

      // ════════════════════════════════════════════════════════════════════
      // SAFETY PRECAUTIONS
      // ════════════════════════════════════════════════════════════════════
      sectionBar(doc, 'Safety Precautions');
      if (data.resolvedPrecautions?.length) {
        data.resolvedPrecautions.forEach((p: string) => {
          ensureSpace(doc, 18);
          doc.fillColor(C.dark).fontSize(9).font('Helvetica')
            .text(`• ${p}`, MARGIN + 6, doc.y, { width: CONTENT_W - 12 });
        });
      } else {
        doc.fillColor(C.grey).fontSize(9).font('Helvetica')
          .text('No precautions assigned.', MARGIN, doc.y, { width: CONTENT_W });
      }
      doc.moveDown(0.8);

      // ════════════════════════════════════════════════════════════════════
      // NOTES
      // ════════════════════════════════════════════════════════════════════
      sectionBar(doc, 'Notes');
      drawNotesTable(doc, data.note);

      // ════════════════════════════════════════════════════════════════════
      // SIGNATURES
      // ════════════════════════════════════════════════════════════════════
      signaturesSection(doc, data);

      // ════════════════════════════════════════════════════════════════════
      // TOOLBOX TALK
      // ════════════════════════════════════════════════════════════════════
      sectionBar(doc, 'Details of Persons Attending Toolbox Talk');
      drawToolboxTable(doc);

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

// ═════════════════════════════════════════════════════════════════════════════
// buildLogsPdf
// ═════════════════════════════════════════════════════════════════════════════
export function buildLogsPdf(permitNo: string, logs: any[]): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 0, size: [PAGE_W, PAGE_H], autoFirstPage: true });
      const chunks: Buffer[] = [];
      doc.on('data', c => chunks.push(c));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Title bar
      const HDR_H = 38;
      doc.fillColor(C.primary).rect(MARGIN, MARGIN, CONTENT_W, HDR_H).fill();
      doc.fillColor(C.white).fontSize(14).font('Helvetica-Bold')
        .text(`PERMIT LOGS TIMELINE: ${permitNo}`,
          MARGIN, MARGIN + 12,
          { width: CONTENT_W, align: 'center', lineBreak: false });

      const ruleY = MARGIN + HDR_H + 4;
      rule(doc, ruleY, C.yellow, 2);
      doc.y = ruleY + 14;

      if (!logs || logs.length === 0) {
        doc.fillColor(C.grey).fontSize(10).font('Helvetica')
          .text('No log entries found.', MARGIN, doc.y, { width: CONTENT_W });
        doc.end();
        return;
      }

      logs.forEach((log, idx) => {
        ensureSpace(doc, 60);
        const startY = doc.y;

        // Timeline dot
        const dotX = MARGIN + 8;
        const dotY = startY + 8;
        doc.fillColor(C.primary).circle(dotX, dotY, 5).fill();

        // Connector line to next entry
        if (idx < logs.length - 1) {
          doc.strokeColor(C.lightGrey).lineWidth(1)
            .moveTo(dotX, dotY + 5).lineTo(dotX, startY + 65).stroke();
        }

        const textX = MARGIN + 22;
        const textW = CONTENT_W - 22;

        const timeStr = log.createdTime
          ? new Date(log.createdTime).toLocaleString('en-GB', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit', hour12: true,
          })
          : '-';
        const type = log.requestType || 'Created';

        // Timestamp line
        doc.fillColor(C.primary).fontSize(10).font('Helvetica-Bold')
          .text(`[${timeStr}]`, textX, startY, { continued: true, lineBreak: false });
        doc.fillColor(C.dark).font('Helvetica')
          .text('  Status changed to  ', { continued: true, lineBreak: false });
        doc.fillColor(C.red).font('Helvetica-Bold')
          .text(type, { lineBreak: false });

        // Fix cursor after inline text chain
        doc.y = startY + 14;

        // Performed by
        let usertype = log.user?.userType || '';
        if (log.system === 1) {
          usertype = 'System Auto Cancel';
        } else {
          const ul = usertype.toLowerCase().trim();
          if (ul === 'department') usertype = 'ConM/HSE';
          else if (ul === 'department1') usertype = 'C&Q';
          else if (ul === 'subcontractor') usertype = 'Contractor';
        }
        const username = log.system === 1 ? 'System' : safeVal(log.user?.username, 'User');
        doc.fillColor(C.grey).fontSize(8).font('Helvetica')
          .text(`Performed by: ${username} (${usertype})`, textX, doc.y + 2, { width: textW });

        // Field changes
        if (log.changes?.length > 0) {
          doc.moveDown(0.3);
          doc.fillColor(C.grey).fontSize(8).font('Helvetica-Bold')
            .text('Field changes:', textX, doc.y, { width: textW });
          log.changes.forEach((chg: any) => {
            ensureSpace(doc, 14);
            const prev = (chg.previous === null || chg.previous === '') ? 'Empty' : String(chg.previous);
            const pres = (chg.present === null || chg.present === '') ? 'Empty' : String(chg.present);
            doc.fillColor(C.dark).fontSize(8).font('Helvetica')
              .text(`  • ${chg.fieldName}: `, textX, doc.y, { continued: true });
            doc.fillColor(C.red).text(`"${prev}"`, { continued: true });
            doc.fillColor(C.dark).text(' → ', { continued: true });
            doc.fillColor(C.green).text(`"${pres}"`);
          });
        }

        doc.moveDown(0.5);
        const sepY = doc.y;
        doc.strokeColor(C.lightGrey).lineWidth(0.5)
          .moveTo(MARGIN, sepY).lineTo(PAGE_W - MARGIN, sepY).stroke();
        doc.y = sepY + 6;
      });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}