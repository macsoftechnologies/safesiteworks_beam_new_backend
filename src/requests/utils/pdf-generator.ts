import PDFDocument = require('pdfkit');

/**
 * Generates a structured PDF for the permit data on the backend using pdfkit.
 */
export function buildPermitPdf(data: any): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 40, size: 'A4' });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', (err) => reject(err));

      // Color Theme
      const primaryColor = '#222a45';
      const secondaryColor = '#edc510';
      const darkText = '#333333';
      const greyText = '#666666';

      // Header Title
      doc.fillColor(primaryColor).fontSize(18).text(`ACTIVITY PERMIT NO: ${data.PermitNo || '-'}`, { align: 'center' });
      doc.strokeColor(secondaryColor).lineWidth(2).moveTo(40, doc.y + 8).lineTo(550, doc.y + 8).stroke();
      doc.moveDown(1.5);

      // Status
      doc.fillColor(darkText).fontSize(10);
      doc.text(`Status: `, { continued: true }).fillColor(primaryColor).text(data.Request_status || 'Draft', { underline: true });
      doc.moveDown(0.5);

      // Section: Metadata Details
      doc.fillColor(primaryColor).fontSize(12).text('1. Permit Metadata & Location', { underline: true });
      doc.moveDown(0.5);

      doc.fillColor(darkText).fontSize(9);
      const startY = doc.y;

      // Col 1
      doc.text(`Request Date: ${data.Request_Date || '-'}`, 40, startY);
      doc.text(`Project Name: ${data.Company_Name || '-'}`, 40, doc.y + 5);
      doc.text(`Contractor: ${data.subContractorName || '-'}`, 40, doc.y + 5);
      doc.text(`Subcontractor: ${data.new_sub_contractor || '-'}`, 40, doc.y + 5);
      doc.text(`Foreman: ${data.Foreman || '-'}`, 40, doc.y + 5);
      doc.text(`Foreman Phone: ${data.Foreman_Phone_Number || '-'}`, 40, doc.y + 5);
      doc.text(`Activity: ${data.Activity || '-'}`, 40, doc.y + 5);

      // Col 2
      doc.text(`Working Date: ${data.Working_Date || '-'}`, 300, startY);
      doc.text(`Working Hours: ${data.Start_Time || '-'} - ${data.End_Time || '-'}`, 300, doc.y + 5);
      doc.text(`Site / Building: ${data.building_name || '-'}`, 300, doc.y + 5);
      doc.text(`Floor / Level: ${data.Room_Type || '-'}`, 300, doc.y + 5);
      doc.text(`Room / Area: ${data.Room_Nos || '-'}`, 300, doc.y + 5);
      doc.text(`Night Shift: ${Number(data.night_shift) === 1 ? 'Yes' : 'No'}`, 300, doc.y + 5);
      doc.text(`Type of Activity: ${data.activityName || '-'}`, 300, doc.y + 5);

      doc.moveDown(1.5);

      // Description of Activity
      doc.x = 40;
      doc.fillColor(primaryColor).fontSize(10).text('Description of Activity:', { continued: true })
         .fillColor(darkText).fontSize(9).text(` ${data.description_of_activity || '-'}`);
      doc.moveDown(1);

      // Tools & Machinery
      doc.fillColor(primaryColor).fontSize(10).text('Tools / Machinery Used:', { continued: true })
         .fillColor(darkText).fontSize(9).text(` Tools: ${data.Tools || '-'} | Machinery: ${data.Machinery || '-'}`);
      doc.moveDown(1.5);

      // Helper to draw checklist table
      const drawChecklistTable = (title: string, questions: { q: string; val: any }[]) => {
        // Check page overflow
        if (doc.y > 650) doc.addPage();

        doc.fillColor(primaryColor).fontSize(12).text(title, { underline: true });
        doc.moveDown(0.5);

        // Header Row
        const tableY = doc.y;
        doc.fillColor('#e9ecef').rect(40, tableY, 510, 16).fill();
        doc.fillColor(primaryColor).fontSize(8).text('Question', 45, tableY + 4);
        doc.text('Yes', 450, tableY + 4);
        doc.text('No', 485, tableY + 4);
        doc.text('N/A', 520, tableY + 4);

        doc.y = tableY + 18;

        for (const item of questions) {
          if (doc.y > 750) {
            doc.addPage();
            // Redraw small header on new page
            const newY = doc.y;
            doc.fillColor('#e9ecef').rect(40, newY, 510, 16).fill();
            doc.fillColor(primaryColor).fontSize(8).text('Question', 45, newY + 4);
            doc.text('Yes', 450, newY + 4);
            doc.text('No', 485, newY + 4);
            doc.text('N/A', 520, newY + 4);
            doc.y = newY + 18;
          }

          const currentY = doc.y;
          doc.fillColor(darkText).fontSize(8).text(item.q, 45, currentY, { width: 390 });
          
          const valNum = item.val !== undefined && item.val !== null ? Number(item.val) : -1;
          if (valNum === 1) doc.fillColor(primaryColor).text('X', 455, currentY);
          if (valNum === 0) doc.fillColor(primaryColor).text('X', 490, currentY);
          if (valNum === 2) doc.fillColor(primaryColor).text('X', 525, currentY);

          // Draw underline separator
          const nextY = Math.max(doc.y, currentY + 12);
          doc.strokeColor('#e9ecef').lineWidth(0.5).moveTo(40, nextY + 3).lineTo(550, nextY + 3).stroke();
          doc.y = nextY + 8;
        }
        doc.moveDown(1);
      };

      // 1. General Safety Checklist
      const generalQs = [
        { q: 'Work not affecting other contractors in the area?', val: data.affecting_other_contractors },
        { q: 'Other conditions to take into account?', val: data.other_conditions },
        { q: 'Sufficient work lighting available?', val: data.lighting_begin_work },
        { q: 'Team informed about specific risks? (RAMS/Toolbox talk)', val: data.specific_risks },
        { q: 'Work environment safely ensured and signs placed?', val: data.environment_ensured },
        { q: 'Team informed about emergency procedures?', val: data.course_of_actions || data.course_of_action }
      ];
      drawChecklistTable('2. General Safety Checklist', generalQs);

      // 2. Hotwork Checklist
      if (Number(data.Hot_work) === 1) {
        const hotworkQs = [
          { q: 'Are there other tasks in progress in the area?', val: data.tasks_in_progress_in_the_area },
          { q: 'Considered alternative cold methods?', val: data.lighting_sufficiently },
          { q: 'Team informed about specific risks?', val: data.spesific_risks_based_on_task },
          { q: 'Work environment safety ensured?', val: data.work_environment_safety_ensured },
          { q: 'Team informed of actions in emergencies?', val: data.course_of_action_in_emergencies },
          { q: 'Fire watch established?', val: data.fire_watch_establish },
          { q: 'Flammable materials removed?', val: data.combustible_material },
          { q: 'Safety measures implemented to stop sparks?', val: data.safety_measures },
          { q: 'Fire extinguishers and blanket ready for use?', val: data.extinguishers_and_fire_blanket }
        ];
        drawChecklistTable('3. Hotwork Safety Checklist', hotworkQs);
      }

      // 3. Electrical Checklist
      if (Number(data.working_on_electrical_system) === 1) {
        const electricalQs = [
          { q: 'Is the area responsible person informed?', val: data.responsible_for_the_informed },
          { q: 'Check if the board is de-energized?', val: data.de_energized },
          { q: 'Risk assessment done RAMS?', val: data.do_risk_assessment },
          { q: 'Secure against reconnection using LOTO?', val: data.if_no_loto },
          { q: 'Do electrical appliances/devices have insulation?', val: data.electricity_have_isulation }
        ];
        drawChecklistTable('4. Electrical Systems Checklist', electricalQs);
      }

      // 4. Confined Space Checklist
      if (Number(data.working_confined_spaces) === 1) {
        const confinedQs = [
          { q: 'Is tank/container cleaned to mitigate vapour/gas risk?', val: data.vapours_gases },
          { q: 'Oxygen and LEL measurement done?', val: data.lel_measurement },
          { q: 'Container and all equipment secured?', val: data.all_equipment },
          { q: 'Safe entry and exit conditions present?', val: data.exit_conditions },
          { q: 'Communication for emergency rescue determined?', val: data.communication_emergency },
          { q: 'Rescue equipment ready in place?', val: data.rescue_equipments },
          { q: 'Space and ventilation adequate?', val: data.space_ventilation },
          { q: 'Oxygen meter provided?', val: data.oxygen_meter }
        ];
        drawChecklistTable('5. Confined Space Checklist', confinedQs);
      }

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Generates a structured PDF for the log timeline on the backend.
 */
export function buildLogsPdf(permitNo: string, logs: any[]): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 40, size: 'A4' });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', (err) => reject(err));

      const primaryColor = '#222a45';
      const secondaryColor = '#edc510';
      const darkText = '#333333';

      // Header Title
      doc.fillColor(primaryColor).fontSize(16).text(`PERMIT LOGS TIMELINE: ${permitNo}`, { align: 'center' });
      doc.strokeColor(secondaryColor).lineWidth(2).moveTo(40, doc.y + 8).lineTo(550, doc.y + 8).stroke();
      doc.moveDown(1.5);

      // Log Entries Loop
      for (const log of logs) {
        if (doc.y > 680) doc.addPage();

        const timeStr = log.createdTime ? new Date(log.createdTime).toLocaleString() : '-';
        const type = log.requestType || 'Created';

        doc.fillColor(primaryColor).fontSize(10).text(`[${timeStr}] - Status Changed to `, { continued: true });
        doc.font('Helvetica-Bold').fillColor('#dc3545').text(type);
        doc.font('Helvetica');

        // User info
        let usertype = log.user?.userType || '';
        if (log.system === 1) {
          usertype = 'System Auto Cancel';
        } else {
          const uLower = usertype.toLowerCase().trim();
          if (uLower === 'department') usertype = 'ConM/HSE';
          else if (uLower === 'department1') usertype = 'C&Q';
          else if (uLower === 'subcontractor') usertype = 'Contractor';
        }
        const username = log.system === 1 ? 'System' : (log.user?.username || 'User');
        doc.fillColor(darkText).fontSize(9).text(`Performed By: ${username} (${usertype})`);

        if (log.changes && log.changes.length > 0) {
          doc.moveDown(0.2);
          doc.fillColor('#666666').fontSize(8).text('Field Changes:');

          for (const chg of log.changes) {
            if (doc.y > 740) doc.addPage();
            const prev = chg.previous === null || chg.previous === '' ? 'Empty' : chg.previous;
            const pres = chg.present === null || chg.present === '' ? 'Empty' : chg.present;
            doc.fillColor(darkText).fontSize(8).text(`  • ${chg.fieldName}: `, { continued: true })
               .fillColor('#dc3545').text(`"${prev}"`, { continued: true })
               .fillColor(darkText).text(' ➔ ', { continued: true })
               .fillColor('#28a745').text(`"${pres}"`);
          }
        }

        // Draw separator
        doc.moveDown(0.8);
        doc.strokeColor('#dee2e6').lineWidth(0.5).moveTo(40, doc.y).lineTo(550, doc.y).stroke();
        doc.moveDown(0.5);
      }

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}
