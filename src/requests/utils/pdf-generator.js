"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildPermitPdf = buildPermitPdf;
exports.buildLogsPdf = buildLogsPdf;
exports.generatePermitPdf = generatePermitPdf;
var pdfkit_1 = require("pdfkit");
var path_1 = require("path");
var fs_1 = require("fs");
var puppeteer_1 = require("puppeteer");
var permit_html_template_1 = require("./permit-html-template");
// ─── Colour palette ──────────────────────────────────────────────────────────
var C = {
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
var PAGE_W = 595;
var PAGE_H = 842; // Standard A4 page height
var MARGIN = 20;
var CONTENT_W = PAGE_W - MARGIN * 2;
var BOTTOM = PAGE_H - MARGIN - 10; // Allow bottom margin of 30 points
// ═════════════════════════════════════════════════════════════════════════════
// UTILITY HELPERS
// ═════════════════════════════════════════════════════════════════════════════
function safeVal(v, fallback) {
    if (fallback === void 0) { fallback = '-'; }
    if (v === undefined || v === null || v === '')
        return fallback;
    return String(v);
}
function yesNo(v) {
    return Number(v) === 1 ? 'Yes' : 'No';
}
/** Add a new page only when there is not enough vertical space left. */
function ensureSpace(doc, needed) {
    if (doc.y + needed > BOTTOM) {
        doc.addPage();
        doc.y = MARGIN;
    }
}
/** Horizontal rule — does NOT use doc.text so it never moves doc.y unexpectedly */
function rule(doc, y, color, lw) {
    if (color === void 0) { color = C.yellow; }
    if (lw === void 0) { lw = 2; }
    doc.strokeColor(color).lineWidth(lw)
        .moveTo(MARGIN, y).lineTo(PAGE_W - MARGIN, y).stroke();
}
/** Coloured section-title bar.
 *  Uses absolute coordinates so doc.y is always set explicitly after. */
function sectionBar(doc, title, yesNoVal, bgColor, textColor, logoName) {
    if (bgColor === void 0) { bgColor = C.primary; }
    if (textColor === void 0) { textColor = C.white; }
    ensureSpace(doc, 32);
    var y = doc.y;
    var BAR_H = 26;
    // Background rectangle
    doc.fillColor(bgColor).rect(MARGIN, y, CONTENT_W, BAR_H).fill();
    var textX = MARGIN + 8;
    if (logoName) {
        var logoPath = (0, path_1.join)(process.cwd(), './src/images/logos', logoName);
        if ((0, fs_1.existsSync)(logoPath)) {
            try {
                doc.image(logoPath, MARGIN + 8, y + 4, { height: 18 });
                textX = MARGIN + 32;
            }
            catch (err) {
                console.error("Error drawing logo ".concat(logoName, " in PDF:"), err);
            }
        }
    }
    // Title text — set position explicitly
    doc.fillColor(textColor).fontSize(10).font('Helvetica-Bold')
        .text(title, textX, y + 8, { width: CONTENT_W - 110, lineBreak: false });
    // Yes / No radio indicators
    if (yesNoVal !== undefined) {
        var rx = PAGE_W - MARGIN - 95;
        var cy = y + BAR_H / 2;
        var yesChecked = Number(yesNoVal) === 1;
        var noChecked = Number(yesNoVal) === 0;
        doc.lineWidth(1).strokeColor(textColor);
        doc.circle(rx, cy, 5).stroke();
        doc.circle(rx + 48, cy, 5).stroke();
        if (yesChecked)
            doc.fillColor(textColor).circle(rx, cy, 3).fill();
        if (noChecked)
            doc.fillColor(textColor).circle(rx + 48, cy, 3).fill();
        doc.fillColor(textColor).fontSize(8).font('Helvetica')
            .text('Yes', rx + 8, y + 9, { lineBreak: false })
            .text('No', rx + 8 + 48, y + 9, { lineBreak: false });
    }
    // Advance doc.y past the bar
    doc.y = y + BAR_H + 6;
}
/** Two-column label + value pair */
function twoCol(doc, left, right) {
    ensureSpace(doc, 30);
    var startY = doc.y;
    var colW = CONTENT_W / 2 - 8;
    doc.fillColor(C.primary).fontSize(8).font('Helvetica-Bold')
        .text(left[0], MARGIN, startY, { width: colW, lineBreak: false });
    doc.fillColor(C.primary).fontSize(8).font('Helvetica-Bold')
        .text(right[0], MARGIN + CONTENT_W / 2, startY, { width: colW, lineBreak: false });
    var valY = startY + 12;
    doc.fillColor(C.dark).fontSize(9).font('Helvetica')
        .text(safeVal(left[1]), MARGIN, valY, { width: colW });
    var afterLeft = doc.y;
    doc.y = valY;
    doc.fillColor(C.dark).fontSize(9).font('Helvetica')
        .text(safeVal(right[1]), MARGIN + CONTENT_W / 2, valY, { width: colW });
    var afterRight = doc.y;
    doc.y = Math.max(afterLeft, afterRight) + 4;
}
/** Single full-width label + value */
function oneRow(doc, label, value) {
    ensureSpace(doc, 28);
    doc.fillColor(C.primary).fontSize(8).font('Helvetica-Bold')
        .text(label, MARGIN, doc.y, { width: CONTENT_W });
    doc.fillColor(C.dark).fontSize(9).font('Helvetica')
        .text(safeVal(value), MARGIN, doc.y + 1, { width: CONTENT_W });
    doc.moveDown(0.5);
}
/** Thin separator */
function separator(doc) {
    var y = doc.y;
    doc.strokeColor(C.lightGrey).lineWidth(0.4)
        .moveTo(MARGIN, y).lineTo(PAGE_W - MARGIN, y).stroke();
    doc.y = y + 5;
}
// ─── Check mark ───────────────────────────────────────────────────────────────
// IMPORTANT: doc.text() always moves doc.y even with lineBreak:false.
// We must save and restore doc.y around the tick-text call, otherwise the row
// cursor gets corrupted and subsequent rows render on blank pages.
function checkMark(doc, v, target, cx, cy) {
    if (v === undefined || v === null || Number(v) !== target)
        return;
    // Draw filled circle
    doc.fillColor(C.primary).circle(cx, cy, 7).fill();
    // Draw tick — save doc.y before, restore after, so cursor is unaffected
    var savedY = doc.y;
    doc.fillColor(C.white).fontSize(8).font('Helvetica-Bold')
        .text('✓', cx - 4, cy - 5, { lineBreak: false, width: 12 });
    doc.y = savedY;
    // Restore fill colour so subsequent drawing isn't white
    doc.fillColor(C.dark);
}
function drawChecklistTable(doc, items) {
    var COL_Q = MARGIN;
    var Q_WIDTH = CONTENT_W - 120;
    var COL_YES = MARGIN + Q_WIDTH + 10;
    var COL_NO = COL_YES + 36;
    var COL_NA = COL_NO + 36;
    var HDR_H = 20;
    var MIN_ROW = 20;
    // ── Header row ──
    ensureSpace(doc, HDR_H + MIN_ROW);
    var hy = doc.y;
    doc.fillColor(C.rowHeader).rect(MARGIN, hy, CONTENT_W, HDR_H).fill();
    doc.fillColor(C.primary).fontSize(8).font('Helvetica-Bold')
        .text('Question', COL_Q + 4, hy + 6, { width: Q_WIDTH, lineBreak: false })
        .text('Yes', COL_YES, hy + 6, { lineBreak: false })
        .text('No', COL_NO, hy + 6, { lineBreak: false })
        .text('N/A', COL_NA, hy + 6, { lineBreak: false });
    doc.y = hy + HDR_H + 2;
    items.forEach(function (item, i) {
        // Measure row height BEFORE drawing
        doc.fontSize(8);
        var textH = doc.heightOfString(item.q, { width: Q_WIDTH - 8 });
        var rowH = Math.max(MIN_ROW, textH + 8);
        // Page break if needed — re-draw header on new page
        if (doc.y + rowH > BOTTOM) {
            doc.addPage();
            doc.y = MARGIN;
            hy = doc.y;
            doc.fillColor(C.rowHeader).rect(MARGIN, hy, CONTENT_W, HDR_H).fill();
            doc.fillColor(C.primary).fontSize(8).font('Helvetica-Bold')
                .text('Question', COL_Q + 4, hy + 6, { width: Q_WIDTH, lineBreak: false })
                .text('Yes', COL_YES, hy + 6, { lineBreak: false })
                .text('No', COL_NO, hy + 6, { lineBreak: false })
                .text('N/A', COL_NA, hy + 6, { lineBreak: false });
            doc.y = hy + HDR_H + 2;
        }
        var ry = doc.y;
        // Alternating row shading
        if (i % 2 === 1) {
            doc.fillColor(C.rowEven).rect(MARGIN, ry, CONTENT_W, rowH).fill();
        }
        // Question text
        doc.fillColor(C.dark).fontSize(8).font('Helvetica')
            .text(item.q, COL_Q + 4, ry + 4, { width: Q_WIDTH - 8 });
        // Check marks (no save/restore)
        var markY = ry + rowH / 2;
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
function drawNotesTable(doc, notes) {
    if (!notes || notes.length === 0) {
        doc.fillColor(C.grey).fontSize(9).font('Helvetica')
            .text('No notes found.', MARGIN, doc.y, { width: CONTENT_W });
        doc.moveDown(0.5);
        return;
    }
    var NAME_W = 150;
    var NOTE_W = CONTENT_W - NAME_W - 8;
    ensureSpace(doc, 22);
    var hy = doc.y;
    doc.fillColor(C.rowHeader).rect(MARGIN, hy, CONTENT_W, 20).fill();
    doc.fillColor(C.primary).fontSize(8).font('Helvetica-Bold')
        .text('User Name', MARGIN + 4, hy + 6, { width: NAME_W, lineBreak: false })
        .text('Note', MARGIN + NAME_W + 8, hy + 6, { width: NOTE_W, lineBreak: false });
    doc.y = hy + 22;
    notes.forEach(function (n, i) {
        var noteText = safeVal(n.note);
        doc.fontSize(8);
        var noteH = Math.max(18, doc.heightOfString(noteText, { width: NOTE_W }) + 8);
        ensureSpace(doc, noteH + 2);
        var ry = doc.y;
        if (i % 2 === 1)
            doc.fillColor(C.rowEven).rect(MARGIN, ry, CONTENT_W, noteH).fill();
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
// STATUS BADGE
// ═════════════════════════════════════════════════════════════════════════════
function statusBadge(doc, text) {
    ensureSpace(doc, 28);
    var y = doc.y;
    doc.fillColor('#1f2d77').rect(MARGIN, y, 170, 22).fill();
    doc.fillColor(C.white).fontSize(9).font('Helvetica-Bold')
        .text("Status: ".concat(text), MARGIN + 6, y + 7, { width: 158, lineBreak: false });
    doc.y = y + 28;
}
// ═════════════════════════════════════════════════════════════════════════════
// CHECK-IN / CHECK-OUT CARDS
// ═════════════════════════════════════════════════════════════════════════════
function checkinCards(doc, data) {
    var hasIn = !!data.check_in_time;
    var hasOut = data.Request_status === 'Closed' && !!data.check_out_time;
    if (!hasIn && !hasOut)
        return;
    var formatDT = function (s) {
        if (!s)
            return '-';
        try {
            var d = new Date(s);
            var mo = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            var h = d.getHours();
            var m = String(d.getMinutes()).padStart(2, '0');
            var ap = h >= 12 ? 'PM' : 'AM';
            h = h % 12 || 12;
            return "".concat(String(d.getDate()).padStart(2, '0'), "-").concat(mo[d.getMonth()], "-").concat(d.getFullYear(), " ").concat(String(h).padStart(2, '0'), ":").concat(m, " ").concat(ap);
        }
        catch (_a) {
            return String(s);
        }
    };
    ensureSpace(doc, 50);
    var y = doc.y;
    var half = (CONTENT_W - 10) / 2;
    if (hasIn) {
        doc.fillColor('#28a745').rect(MARGIN, y, hasOut ? half : CONTENT_W, 44).fill();
        doc.fillColor(C.white).fontSize(8).font('Helvetica-Bold')
            .text('Check-in Date', MARGIN + 6, y + 4, { lineBreak: false });
        doc.fillColor(C.white).fontSize(8).font('Helvetica-Bold')
            .text('User Name', MARGIN + half / 2 + 6, y + 4, { lineBreak: false });
        doc.fillColor(C.white).fontSize(9).font('Helvetica')
            .text(formatDT(data.check_in_time), MARGIN + 6, y + 18, { width: half / 2 - 10, lineBreak: false });
        doc.fillColor(C.white).fontSize(9).font('Helvetica')
            .text(safeVal(data.check_in_user), MARGIN + half / 2 + 6, y + 18, { width: half / 2 - 10, lineBreak: false });
    }
    if (hasOut) {
        var ox = hasIn ? MARGIN + half + 10 : MARGIN;
        doc.fillColor('#dc3545').rect(ox, y, half, 44).fill();
        doc.fillColor(C.white).fontSize(8).font('Helvetica-Bold')
            .text('Check-out Date', ox + 6, y + 4, { lineBreak: false });
        doc.fillColor(C.white).fontSize(8).font('Helvetica-Bold')
            .text('User Name', ox + half / 2 + 6, y + 4, { lineBreak: false });
        doc.fillColor(C.white).fontSize(9).font('Helvetica')
            .text(formatDT(data.check_out_time), ox + 6, y + 18, { width: half / 2 - 10, lineBreak: false });
        doc.fillColor(C.white).fontSize(9).font('Helvetica')
            .text(safeVal(data.check_out_user), ox + half / 2 + 6, y + 18, { width: half / 2 - 10, lineBreak: false });
    }
    doc.y = y + 50;
}
// ═════════════════════════════════════════════════════════════════════════════
// SIGNATURES SECTION
// ═════════════════════════════════════════════════════════════════════════════
function signaturesSection(doc, data) {
    sectionBar(doc, '— Signatures & Closing Details —');
    var pType = data.permit_type;
    var pUnder = data.permit_under;
    if (pType === 'Construction' && pUnder === 'Construction') {
        oneRow(doc, 'ConM Initials', safeVal(data.ConM_initials));
    }
    else if (pType === 'Construction' && pUnder === 'Commissioning') {
        oneRow(doc, 'ConM Initials', safeVal(data.ConM_initials));
        oneRow(doc, 'C&Q Initials', safeVal(data.CoMM_initials));
    }
    else if (pType === 'Commissioning' && pUnder === 'Construction') {
        oneRow(doc, 'C&Q Initials', safeVal(data.CoMM_initials));
        oneRow(doc, 'ConM Initials', safeVal(data.ConM_initials));
    }
    else if (pType === 'Commissioning' && pUnder === 'Commissioning') {
        oneRow(doc, 'C&Q Initials', safeVal(data.CoMM_initials));
    }
    else {
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
function buildPermitPdf(data) {
    return new Promise(function (resolve, reject) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v;
        try {
            var doc_1 = new pdfkit_1.default({ margin: 0, size: [PAGE_W, PAGE_H], autoFirstPage: true });
            var chunks_1 = [];
            doc_1.on('data', function (c) { return chunks_1.push(c); });
            doc_1.on('end', function () { return resolve(Buffer.concat(chunks_1)); });
            doc_1.on('error', reject);
            // ── Date / time helpers ──────────────────────────────────────────────
            var fmtDate = function (s) {
                if (!s)
                    return '-';
                try {
                    var d = new Date(s);
                    if (isNaN(d.getTime()))
                        return String(s);
                    var mo = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    return "".concat(String(d.getDate()).padStart(2, '0'), "-").concat(mo[d.getMonth()], "-").concat(d.getFullYear());
                }
                catch (_a) {
                    return String(s);
                }
            };
            var fmtTime = function (s) {
                if (!s)
                    return '-';
                try {
                    if (typeof s === 'string' && s.includes(':')) {
                        var _a = s.split(':'), h = _a[0], m = _a[1];
                        var hh = parseInt(h, 10);
                        var ap = hh >= 12 ? 'PM' : 'AM';
                        hh = hh % 12 || 12;
                        return "".concat(String(hh).padStart(2, '0'), ":").concat(m, " ").concat(ap);
                    }
                    var d = new Date(s);
                    if (!isNaN(d.getTime())) {
                        var hh = d.getHours();
                        var mm = String(d.getMinutes()).padStart(2, '0');
                        var ap = hh >= 12 ? 'PM' : 'AM';
                        hh = hh % 12 || 12;
                        return "".concat(String(hh).padStart(2, '0'), ":").concat(mm, " ").concat(ap);
                    }
                }
                catch (_b) { }
                return String(s);
            };
            var getStatus = function () {
                if (data.cancel_reason === 'Permit not opened so system cancelled automatically')
                    return 'Auto-Cancelled';
                return safeVal(data.Request_status, 'Draft');
            };
            // ════════════════════════════════════════════════════════════════════
            // PAGE 1 — HEADER  (draw everything with explicit y coordinates)
            // ════════════════════════════════════════════════════════════════════
            var HDR_Y = MARGIN;
            var HDR_H = 38;
            // Navy title bar
            doc_1.fillColor(C.primary).rect(MARGIN, HDR_Y, CONTENT_W, HDR_H).fill();
            doc_1.fillColor(C.white).fontSize(15).font('Helvetica-Bold')
                .text("ACTIVITY PERMIT NO: ".concat(safeVal(data.PermitNo)), MARGIN, HDR_Y + 12, { width: CONTENT_W, align: 'center', lineBreak: false });
            // Yellow rule below header
            var ruleY = HDR_Y + HDR_H + 4;
            rule(doc_1, ruleY, C.yellow, 2);
            // Advance cursor past header
            doc_1.y = ruleY + 10;
            // Check-in / check-out cards
            checkinCards(doc_1, data);
            doc_1.moveDown(0.3);
            // Status badge
            statusBadge(doc_1, getStatus());
            doc_1.moveDown(0.5);
            // ── Section 1: Metadata ──────────────────────────────────────────────
            sectionBar(doc_1, '1. Permit Metadata & Location');
            twoCol(doc_1, ['Request Date', fmtDate(data.Request_Date)], ['Project Name', safeVal(data.Company_Name)]);
            separator(doc_1);
            twoCol(doc_1, ['Contractor', safeVal(data.subContractorName)], ['Subcontractor', safeVal(data.new_sub_contractor)]);
            separator(doc_1);
            twoCol(doc_1, ['Foreman / Supervision', safeVal(data.Foreman)], ['Foreman Phone', safeVal(data.Foreman_Phone_Number)]);
            separator(doc_1);
            twoCol(doc_1, ['Activity', safeVal(data.Activity)], ['Type of Activity', safeVal(data.activityName)]);
            separator(doc_1);
            oneRow(doc_1, 'RAMS Number', (data.rams_number && data.rams_number !== 'undefined') ? data.rams_number : '-');
            separator(doc_1);
            twoCol(doc_1, ['Permit Type', safeVal(data.permit_type)], ['Permit Under', safeVal(data.permit_under, 'Construction')]);
            separator(doc_1);
            // ── Section 2: Description ───────────────────────────────────────────
            sectionBar(doc_1, '2. Description of Activity');
            doc_1.fillColor(C.dark).fontSize(9).font('Helvetica')
                .text(safeVal(data.description_of_activity), MARGIN, doc_1.y, { width: CONTENT_W });
            doc_1.moveDown(0.8);
            // ── Section 3: Schedule & Location ──────────────────────────────────
            sectionBar(doc_1, '3. Schedule & Location');
            twoCol(doc_1, ['Working Date', fmtDate(data.Working_Date)], ['Night Shift', yesNo(data.night_shift)]);
            separator(doc_1);
            twoCol(doc_1, ['Start Time', fmtTime(data.Start_Time)], ['End Time', fmtTime(data.End_Time)]);
            separator(doc_1);
            if (data.new_date || data.new_end_time) {
                twoCol(doc_1, ['New Date', fmtDate(data.new_date)], ['New End Time', fmtTime(data.new_end_time)]);
                separator(doc_1);
            }
            twoCol(doc_1, ['Site / Project', safeVal(data.Company_Name)], ['Building', safeVal(data.building_name)]);
            separator(doc_1);
            twoCol(doc_1, ['Floor / Level', safeVal(data.Room_Type)], ['Zone', safeVal(data.zone_name)]);
            separator(doc_1);
            oneRow(doc_1, 'Specific Rooms', safeVal(data.room_names || data.Room_Nos));
            separator(doc_1);
            // ── Section 4: Tools & Workers ───────────────────────────────────────
            sectionBar(doc_1, '4. Tools & Machinery');
            twoCol(doc_1, ['Tools Used', safeVal(data.Tools)], ['Machinery Used', safeVal(data.Machinery)]);
            separator(doc_1);
            oneRow(doc_1, 'Number of Workers Involved', safeVal(data.Number_Of_Workers, 'N/A'));
            // ════════════════════════════════════════════════════════════════════
            // 5. GENERAL SAFETY CHECKLIST
            // ════════════════════════════════════════════════════════════════════
            sectionBar(doc_1, '5. General Safety Checklist');
            drawChecklistTable(doc_1, [
                { q: 'Can you confirm that your work is not affecting other contractors working in this area before starting?', val: data.affecting_other_contractors },
                { q: 'Are there other conditions that must be taken into account during the work? If Yes, note in "Other conditions".', val: data.other_conditions },
                { q: 'Can you confirm that there will be enough work lighting to begin the work?', val: data.lighting_begin_work },
                { q: 'Have the team been informed about the specific risks based on task? (RAMS/Toolbox talk etc.)', val: data.specific_risks },
                { q: 'Is the work environment safely ensured? Have the necessary warning signs been placed?', val: data.environment_ensured },
                { q: 'Have the team been informed about the course of action in any emergency situation?', val: (_a = data.course_of_action) !== null && _a !== void 0 ? _a : data.course_of_actions },
            ]);
            if (Number(data.other_conditions) === 1 && data.other_conditions_input) {
                ensureSpace(doc_1, 20);
                doc_1.fillColor(C.red).fontSize(8).font('Helvetica-Bold')
                    .text('Note — Other Conditions: ', MARGIN, doc_1.y, { continued: true })
                    .fillColor(C.dark).font('Helvetica')
                    .text(safeVal(data.other_conditions_input), { width: CONTENT_W });
                doc_1.moveDown(0.5);
            }
            // ════════════════════════════════════════════════════════════════════
            // 6. HOTWORK
            // ════════════════════════════════════════════════════════════════════
            var isHotWorkActive = Number(data.Hot_work) === 1;
            sectionBar(doc_1, '6. Hotwork', (_b = data.Hot_work) !== null && _b !== void 0 ? _b : 0, C.hotwork, C.white, 'HotWorks.png');
            drawChecklistTable(doc_1, [
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
            var isWeldingActive = isHotWorkActive && Number(data.welding_activitiy) === 1;
            oneRow(doc_1, 'Is there any welding activity?', yesNo(isHotWorkActive ? data.welding_activitiy : 0));
            drawChecklistTable(doc_1, [
                { q: 'The people who will do heat treatment had welder certificates?', val: isWeldingActive ? data.heat_treatment : 0 },
                { q: 'Should air extraction be established? (Welding fumes directly led to open air)', val: isWeldingActive ? data.air_extraction_be_established : 0 },
            ]);
            twoCol(doc_1, ['Is it a low risk hotwork?', yesNo(isHotWorkActive ? data.low_risk_hotwork : 0)], ['Is it a high risk hotwork?', yesNo(isHotWorkActive ? data.high_risk_hotwork : 0)]);
            twoCol(doc_1, ['Hot work checklist filled in?', yesNo(isHotWorkActive ? data.hot_work_checklist_filled : 0)], ['Fire guard present?', yesNo(isHotWorkActive ? data.fire_guard_present : 0)]);
            sectionBar(doc_1, 'Hotwork — Post Work Checks', undefined, C.hotwork, C.white, 'HotWorks.png');
            drawChecklistTable(doc_1, [
                { q: 'Has the work area been inspected for smoldering materials or residual heat?', val: isHotWorkActive ? data.h_heat_source : 0 },
                { q: 'Have all tools and hot work equipment been safely removed from the work area?', val: isHotWorkActive ? data.h_workplace_check : 0 },
                { q: 'Has the area been cleaned and restored to its original safe condition?', val: isHotWorkActive ? data.h_fire_detectors : 0 },
            ]);
            twoCol(doc_1, ['1hr Check Time', (isHotWorkActive && data.h_start_time && !String(data.h_start_time).startsWith('1970')) ? data.h_start_time : 'N/A'], ['3hrs Check Time', (isHotWorkActive && data.h_end_time && !String(data.h_end_time).startsWith('1970')) ? data.h_end_time : 'N/A']);
            // ════════════════════════════════════════════════════════════════════
            // 7. ELECTRICAL SYSTEMS
            // ════════════════════════════════════════════════════════════════════
            var isElecActive = Number(data.working_on_electrical_system) === 1;
            sectionBar(doc_1, '7. Working on Site Temporary Electrical Systems', (_c = data.working_on_electrical_system) !== null && _c !== void 0 ? _c : 0, C.primary, C.yellow, 'ElectricalSystems.png');
            drawChecklistTable(doc_1, [
                { q: 'Is the responsible person for the area informed?', val: isElecActive ? data.responsible_for_the_informed : 0 },
                { q: 'Check if the board is de-energized — is it de-energized?', val: isElecActive ? data.de_energized : 0 },
                { q: 'Do you have risk assessment done (RAMS)?', val: isElecActive ? data.do_risk_assessment : 0 },
                { q: 'Secure the area against reconnection using LOTO (Lock-out/Tag-out) with at least a craftsman\'s padlock.', val: isElecActive ? data.if_no_loto : 0 },
                { q: 'Do appliances/devices that run on electricity have insulation?', val: isElecActive ? data.electricity_have_isulation : 0 },
            ]);
            // ════════════════════════════════════════════════════════════════════
            // 8. HAZARDOUS SUBSTANCES
            // ════════════════════════════════════════════════════════════════════
            var isChemActive = Number(data.working_hazardious_substen) === 1;
            sectionBar(doc_1, '8. Working with Hazardous Substances / Chemicals', (_d = data.working_hazardious_substen) !== null && _d !== void 0 ? _d : 0, '#7a6000', C.white, 'substanceChemical.png');
            drawChecklistTable(doc_1, [
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
                var isPressureActive = Number(data.pressure_testing_of_equipment) === 1;
                sectionBar(doc_1, '9. Pressure Testing of Equipment', (_e = data.pressure_testing_of_equipment) !== null && _e !== void 0 ? _e : 0, '#3ba9fd', C.white, 'testingequipment.png');
                drawChecklistTable(doc_1, [
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
                    oneRow(doc_1, 'Pressure of Pneumatic Test', "".concat(safeVal(data.pressure_pneumatic), " BarG"));
                if (Number(data.pressure_of_the_test) === 1)
                    oneRow(doc_1, 'Pressure of Hydrostatic Test', "".concat(safeVal(data.pressure_hydrostatic), " BarG"));
            }
            // ════════════════════════════════════════════════════════════════════
            // 10. WORKING AT HEIGHT
            // ════════════════════════════════════════════════════════════════════
            var isHeightActive = Number(data.working_at_height) === 1;
            sectionBar(doc_1, '10. Working at Height', (_f = data.working_at_height) !== null && _f !== void 0 ? _f : 0, C.height, C.white, 'WorkingAtHight.png');
            drawChecklistTable(doc_1, [
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
            var isConfinedActive = Number(data.working_confined_spaces) === 1;
            sectionBar(doc_1, '11. Working in Confined Space', (_g = data.working_confined_spaces) !== null && _g !== void 0 ? _g : 0, C.confined, C.white, 'ConfinedSpace.png');
            drawChecklistTable(doc_1, [
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
            var isExcavationActive = Number(data.excavation_works) === 1;
            sectionBar(doc_1, '12. Excavation Works', (_h = data.excavation_works) !== null && _h !== void 0 ? _h : 0, C.excavation, C.white, 'ExcavationWorks.png');
            drawChecklistTable(doc_1, [
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
            var isLiftingActive = Number(data.using_cranes_or_lifting) === 1;
            sectionBar(doc_1, '13. Using Crane or Lifting', (_j = data.using_cranes_or_lifting) !== null && _j !== void 0 ? _j : 0, C.crane, C.white, 'Craneslifting.png');
            drawChecklistTable(doc_1, [
                { q: 'Is there an appointed person in charge of the lifting/crane operation?', val: isLiftingActive ? data.appointed_person : 0 },
                { q: 'Are the details of load (dimensions, SWL) and loading/unloading requirements provided by vendor or supplier?', val: isLiftingActive ? ((_k = data.vendor_supplier) !== null && _k !== void 0 ? _k : data.vendor_supplies) : 0 },
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
                var isPowerActive = Number(data.power_on) === 1;
                sectionBar(doc_1, '14. Energising, Isolating & Working on Live Electrical Systems', (_l = data.power_on) !== null && _l !== void 0 ? _l : 0, C.poweron, C.white, 'electrical_works.png');
                var isEnergisingActive = isPowerActive && Number(data.energising_equipment) === 1;
                sectionBar(doc_1, '14a. Energising Electrical Equipment', (_m = data.energising_equipment) !== null && _m !== void 0 ? _m : 0, C.poweron, C.white, 'electrical_works.png');
                drawChecklistTable(doc_1, [
                    { q: 'Is the responsible person for the area informed?', val: isEnergisingActive ? data.responsible_for_the_area : 0 },
                    { q: 'Do you have a risk assessment done?', val: isEnergisingActive ? data.risk_assessment_done : 0 },
                    { q: 'Barriers & Signage in place?', val: isEnergisingActive ? data.barriers_signage : 0 },
                    { q: 'Arc flash boundary and PPE evaluated?', val: isEnergisingActive ? data.arc_flash : 0 },
                    { q: 'Have all the cables that need to be energized been tested?', val: isEnergisingActive ? data.energized_been_tested : 0 },
                    { q: 'Have all punches been closed?', val: isEnergisingActive ? data.punches_been_closed : 0 },
                    { q: 'Is Electrical Checklist completed?', val: isEnergisingActive ? data.toct_checklist : 0 },
                    { q: 'Have you informed and aligned with EL LOTO team and provided an energisation request form?', val: isEnergisingActive ? data.informed_aligned : 0 },
                ]);
                var isIsolatingActive = isPowerActive && Number(data.isolating_live) === 1;
                sectionBar(doc_1, '14b. Isolating Live Electrical Systems for Maintenance or Modification', (_o = data.isolating_live) !== null && _o !== void 0 ? _o : 0, C.poweron, C.white, 'electrical_works.png');
                drawChecklistTable(doc_1, [
                    { q: 'Is the responsible person for the area informed?', val: isIsolatingActive ? ((_p = data.isolating_resposible) !== null && _p !== void 0 ? _p : data.isolating_responsible) : 0 },
                    { q: 'Has a Risk Assessment been completed?', val: isIsolatingActive ? data.isolating_risk_assessment : 0 },
                    { q: 'Have C&Q LOTO been informed and tasks co-ordinated for shutdown work?', val: isIsolatingActive ? data.cq_informed : 0 },
                    { q: 'Have C&Q LOTO been provided marked up single line diagrams/electrical drawings?', val: isIsolatingActive ? data.cq_provided : 0 },
                    { q: 'Has a De-Energisation Request form and supporting documentation been provided to C&Q LOTO?', val: isIsolatingActive ? data.de_energisation_request : 0 },
                    { q: 'Are all barriers, signage and PPE prepared for the task?', val: isIsolatingActive ? data.ppe_prepared : 0 },
                    { q: 'Has absence of voltage been verified and proven dead?', val: isIsolatingActive ? data.absence_of_voltage : 0 },
                    { q: 'Has stored energy been discharged?', val: isIsolatingActive ? data.stored_energy : 0 },
                    { q: 'Have any secondary or back up power supplies been confirmed and accounted for?', val: isIsolatingActive ? data.backup_power : 0 },
                ]);
                var isWorkingNearLiveActive = isPowerActive && Number(data.working_near_live) === 1;
                sectionBar(doc_1, '14c. Working on OR near Live Electrical Systems', (_q = data.working_near_live) !== null && _q !== void 0 ? _q : 0, C.poweron, C.white, 'electrical_works.png');
                drawChecklistTable(doc_1, [
                    { q: 'Live work is unavoidable and justified?', val: isWorkingNearLiveActive ? data.unavoidable : 0 },
                    { q: 'De-energisation is not reasonably practicable?', val: isWorkingNearLiveActive ? data.reasonably_practicable : 0 },
                    { q: 'Live work authorised by electrical responsible person?', val: isWorkingNearLiveActive ? data.work_authorised : 0 },
                    { q: 'Risk assessment has been completed?', val: isWorkingNearLiveActive ? data.working_risk_assessment : 0 },
                    { q: 'Arc flash boundary and PPE evaluated?', val: isWorkingNearLiveActive ? data.working_arc_boundary : 0 },
                    { q: 'Barriers and Signage in place?', val: isWorkingNearLiveActive ? data.working_barriers : 0 },
                    { q: 'Insulated tools and approved test equipment to be used?', val: isWorkingNearLiveActive ? data.insulated_tools : 0 },
                    { q: 'Work will always be carried out with a second person to assist in the event of an emergency?', val: isWorkingNearLiveActive ? data.event_of_emergency : 0 },
                ]);
                var isPressurizeActive = Number(data.pressurization) === 1;
                sectionBar(doc_1, '15. Energization of Mechanical Equipment', (_r = data.pressurization) !== null && _r !== void 0 ? _r : 0, C.pressurize, C.primary, 'mechanical1.png');
                drawChecklistTable(doc_1, [
                    { q: 'Pressure test performed and approved?', val: isPressurizeActive ? data.performed_approved : 0 },
                    { q: 'Flushing approved?', val: isPressurizeActive ? data.flushing_approved : 0 },
                    { q: 'MC approved?', val: isPressurizeActive ? data.mc_approved : 0 },
                    { q: 'Walkdown with Visual inspection performed?', val: isPressurizeActive ? data.visual_inspection : 0 },
                    { q: 'LOTO plan approved and installed by LOTO officer?', val: isPressurizeActive ? data.loto_plan_approved : 0 },
                    { q: 'Ensure Safety Valves follow Media Code?', val: isPressurizeActive ? data.follow_media_code : 0 },
                    { q: 'C&Q Safety signs are in place?', val: isPressurizeActive ? data.cq_safety_signs : 0 },
                ]);
                if (Number(data.mc_approved) === 1)
                    oneRow(doc_1, 'MC Number', safeVal(data.mc_number_text));
                if (data.work_type) {
                    sectionBar(doc_1, 'Type of Work');
                    oneRow(doc_1, 'Work Type', safeVal(data.work_type));
                    if (data.work_type === 'Mechanical Works' && ((_s = data.resolvedMechanicalWorks) === null || _s === void 0 ? void 0 : _s.length))
                        oneRow(doc_1, 'Module Numbers', data.resolvedMechanicalWorks.join(', '));
                    if (data.work_type === 'Electrical Works') {
                        if ((_t = data.resolvedPanelNumbers) === null || _t === void 0 ? void 0 : _t.length)
                            oneRow(doc_1, 'Panel Numbers', data.resolvedPanelNumbers.join(', '));
                        if ((_u = data.resolvedSystemNumbers) === null || _u === void 0 ? void 0 : _u.length)
                            oneRow(doc_1, 'System Numbers', data.resolvedSystemNumbers.join(', '));
                    }
                }
            }
            // ════════════════════════════════════════════════════════════════════
            // PPE
            // ════════════════════════════════════════════════════════════════════
            sectionBar(doc_1, 'PPE Requirements');
            [
                { label: 'Eye Protection', val: data.eye_protection },
                { label: 'Fall Protection', val: data.fall_protection },
                { label: 'Hearing Protection', val: data.hearing_protection },
                { label: 'Respiratory Protection', val: data.respiratory_protection },
            ].forEach(function (p) {
                var req = Number(p.val) === 1;
                doc_1.fillColor(req ? C.primary : C.grey).fontSize(9).font('Helvetica')
                    .text("".concat(req ? '✓' : '✗', "  ").concat(p.label), MARGIN + 10, doc_1.y, { width: CONTENT_W / 2 });
            });
            doc_1.moveDown(0.3);
            oneRow(doc_1, 'Other PPE', safeVal(data.other_ppe, 'N/A'));
            // ════════════════════════════════════════════════════════════════════
            // SAFETY PRECAUTIONS
            // ════════════════════════════════════════════════════════════════════
            sectionBar(doc_1, 'Safety Precautions');
            if ((_v = data.resolvedPrecautions) === null || _v === void 0 ? void 0 : _v.length) {
                data.resolvedPrecautions.forEach(function (p) {
                    ensureSpace(doc_1, 18);
                    doc_1.fillColor(C.dark).fontSize(9).font('Helvetica')
                        .text("\u2022 ".concat(p), MARGIN + 6, doc_1.y, { width: CONTENT_W - 12 });
                });
            }
            else {
                doc_1.fillColor(C.grey).fontSize(9).font('Helvetica')
                    .text('No precautions assigned.', MARGIN, doc_1.y, { width: CONTENT_W });
            }
            doc_1.moveDown(0.8);
            // ════════════════════════════════════════════════════════════════════
            // NOTES
            // ════════════════════════════════════════════════════════════════════
            sectionBar(doc_1, 'Notes');
            drawNotesTable(doc_1, data.note);
            // ════════════════════════════════════════════════════════════════════
            // SIGNATURES
            // ════════════════════════════════════════════════════════════════════
            signaturesSection(doc_1, data);
            doc_1.end();
        }
        catch (err) {
            reject(err);
        }
    });
}
// ═════════════════════════════════════════════════════════════════════════════
// buildLogsPdf
// ═════════════════════════════════════════════════════════════════════════════
function buildLogsPdf(permitNo, logs) {
    return new Promise(function (resolve, reject) {
        try {
            var doc_2 = new pdfkit_1.default({ margin: 0, size: [PAGE_W, PAGE_H], autoFirstPage: true });
            var chunks_2 = [];
            doc_2.on('data', function (c) { return chunks_2.push(c); });
            doc_2.on('end', function () { return resolve(Buffer.concat(chunks_2)); });
            doc_2.on('error', reject);
            // Title bar
            var HDR_H = 38;
            doc_2.fillColor(C.primary).rect(MARGIN, MARGIN, CONTENT_W, HDR_H).fill();
            doc_2.fillColor(C.white).fontSize(14).font('Helvetica-Bold')
                .text("PERMIT LOGS TIMELINE: ".concat(permitNo), MARGIN, MARGIN + 12, { width: CONTENT_W, align: 'center', lineBreak: false });
            var ruleY = MARGIN + HDR_H + 4;
            rule(doc_2, ruleY, C.yellow, 2);
            doc_2.y = ruleY + 14;
            if (!logs || logs.length === 0) {
                doc_2.fillColor(C.grey).fontSize(10).font('Helvetica')
                    .text('No log entries found.', MARGIN, doc_2.y, { width: CONTENT_W });
                doc_2.end();
                return;
            }
            logs.forEach(function (log, idx) {
                var _a, _b, _c;
                ensureSpace(doc_2, 60);
                var startY = doc_2.y;
                // Timeline dot
                var dotX = MARGIN + 8;
                var dotY = startY + 8;
                doc_2.fillColor(C.primary).circle(dotX, dotY, 5).fill();
                // Connector line to next entry
                if (idx < logs.length - 1) {
                    doc_2.strokeColor(C.lightGrey).lineWidth(1)
                        .moveTo(dotX, dotY + 5).lineTo(dotX, startY + 65).stroke();
                }
                var textX = MARGIN + 22;
                var textW = CONTENT_W - 22;
                var timeStr = log.createdTime
                    ? new Date(log.createdTime).toLocaleString('en-GB', {
                        day: '2-digit', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit', hour12: true,
                    })
                    : '-';
                var type = log.requestType || 'Created';
                // Timestamp line
                doc_2.fillColor(C.primary).fontSize(10).font('Helvetica-Bold')
                    .text("[".concat(timeStr, "]"), textX, startY, { continued: true, lineBreak: false });
                doc_2.fillColor(C.dark).font('Helvetica')
                    .text('  Status changed to  ', { continued: true, lineBreak: false });
                doc_2.fillColor(C.red).font('Helvetica-Bold')
                    .text(type, { lineBreak: false });
                // Fix cursor after inline text chain
                doc_2.y = startY + 14;
                // Performed by
                var usertype = ((_a = log.user) === null || _a === void 0 ? void 0 : _a.userType) || '';
                if (log.system === 1) {
                    usertype = 'System Auto Cancel';
                }
                else {
                    var ul = usertype.toLowerCase().trim();
                    if (ul === 'department')
                        usertype = 'ConM/HSE';
                    else if (ul === 'department1')
                        usertype = 'C&Q';
                    else if (ul === 'subcontractor')
                        usertype = 'Contractor';
                }
                var username = log.system === 1 ? 'System' : safeVal((_b = log.user) === null || _b === void 0 ? void 0 : _b.username, 'User');
                doc_2.fillColor(C.grey).fontSize(8).font('Helvetica')
                    .text("Performed by: ".concat(username, " (").concat(usertype, ")"), textX, doc_2.y + 2, { width: textW });
                // Field changes
                if (((_c = log.changes) === null || _c === void 0 ? void 0 : _c.length) > 0) {
                    doc_2.moveDown(0.3);
                    doc_2.fillColor(C.grey).fontSize(8).font('Helvetica-Bold')
                        .text('Field changes:', textX, doc_2.y, { width: textW });
                    log.changes.forEach(function (chg) {
                        ensureSpace(doc_2, 14);
                        var prev = (chg.previous === null || chg.previous === '') ? 'Empty' : String(chg.previous);
                        var pres = (chg.present === null || chg.present === '') ? 'Empty' : String(chg.present);
                        doc_2.fillColor(C.dark).fontSize(8).font('Helvetica')
                            .text("  \u2022 ".concat(chg.fieldName, ": "), textX, doc_2.y, { continued: true });
                        doc_2.fillColor(C.red).text("\"".concat(prev, "\""), { continued: true });
                        doc_2.fillColor(C.dark).text(' → ', { continued: true });
                        doc_2.fillColor(C.green).text("\"".concat(pres, "\""));
                    });
                }
                doc_2.moveDown(0.5);
                var sepY = doc_2.y;
                doc_2.strokeColor(C.lightGrey).lineWidth(0.5)
                    .moveTo(MARGIN, sepY).lineTo(PAGE_W - MARGIN, sepY).stroke();
                doc_2.y = sepY + 6;
            });
            doc_2.end();
        }
        catch (err) {
            reject(err);
        }
    });
}
function generatePermitPdf(data) {
    return __awaiter(this, void 0, void 0, function () {
        var html, browser, page, pdfBuffer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    html = (0, permit_html_template_1.generatePermitHtml)(data);
                    return [4 /*yield*/, puppeteer_1.default.launch({
                            headless: true,
                            args: ['--no-sandbox', '--disable-setuid-sandbox']
                        })];
                case 1:
                    browser = _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, , 6, 8]);
                    return [4 /*yield*/, browser.newPage()];
                case 3:
                    page = _a.sent();
                    return [4 /*yield*/, page.setContent(html, { waitUntil: 'networkidle0' })];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, page.pdf({
                            format: undefined,
                            width: '330mm',
                            height: '483mm',
                            printBackground: true,
                            margin: { top: '15mm', bottom: '15mm', left: '5mm', right: '5mm' },
                            preferCSSPageSize: false,
                        })];
                case 5:
                    pdfBuffer = _a.sent();
                    return [2 /*return*/, pdfBuffer];
                case 6: return [4 /*yield*/, browser.close()];
                case 7:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    });
}
