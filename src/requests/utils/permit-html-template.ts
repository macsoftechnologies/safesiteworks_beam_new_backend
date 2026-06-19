import { join } from 'path';
import { getBase64Image } from './image-utils';

export function generatePermitHtml(data: any): string {
  const leftLogo = getBase64Image(join(process.cwd(), './newbeam1/images/left_side.jpeg'));
  const rightLogo = getBase64Image(join(process.cwd(), './newbeam1/images/right_side.jpeg'));

  const statusClass = data.Request_status === 'Approved' ? 'badge-approved' :
                      data.Request_status === 'Closed' ? 'badge-closed' :
                      data.Request_status === 'Opened' ? 'badge-opened' : 'badge-hold';

  // Helper to format checkmark
  const renderCheck = (value: any, target: number) => {
    if (value !== undefined && value !== null && Number(value) === target) {
      return '<span class="check-icon">✓</span>';
    }
    return '';
  };

  // Helper to format date
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  // Helper to format time
  const formatTime = (timeStr: string) => {
    if (!timeStr) return '-';
    return timeStr;
  };

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Activity Permit Details</title>
  <link href="https://fonts.googleapis.com/css2?family=Mulish:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary: #222a45;
      --accent: #edc510;
      --bg: #f5f7fb;
      --card-bg: #ffffff;
      --text: #333333;
      --text-muted: #6c757d;
      --success: #28a745;
      --danger: #dc3545;
      --warning: #ffc107;
      --info: #17a2b8;
    }

    * {
      box-sizing: border-box;
      font-family: 'Mulish', sans-serif;
    }

    body {
      background-color: var(--bg);
      color: var(--text);
      margin: 0;
      padding: 20px;
      line-height: 1.6;
    }

    .container {
      max-width: 1100px;
      margin: 0 auto;
      background: var(--card-bg);
      padding: 40px;
      border-radius: 16px;
      box-shadow: 0 10px 30px rgba(34, 42, 69, 0.06);
    }

    .header-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 3px solid var(--accent);
      padding-bottom: 25px;
      margin-bottom: 30px;
    }

    .logo-img {
      max-width: 150px;
      height: auto;
    }

    .title-box {
      text-align: center;
      background: var(--primary);
      color: #fff;
      padding: 15px 30px;
      border-radius: 8px;
      box-shadow: 0 4px 15px rgba(34, 42, 69, 0.15);
    }

    .title-box h1 {
      margin: 0;
      font-size: 22px;
      letter-spacing: 1px;
      font-weight: 700;
    }

    .status-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .card {
      background: #f8f9fa;
      border-radius: 12px;
      padding: 20px;
      border-left: 5px solid var(--primary);
      box-shadow: 0 4px 6px rgba(0,0,0,0.02);
      transition: transform 0.2s;
    }

    .card:hover {
      transform: translateY(-2px);
    }

    .card-title {
      font-size: 13px;
      text-transform: uppercase;
      color: var(--text-muted);
      font-weight: 700;
      margin-bottom: 8px;
    }

    .card-value {
      font-size: 16px;
      font-weight: 800;
      color: var(--primary);
    }

    .badge {
      display: inline-block;
      padding: 6px 16px;
      font-size: 14px;
      font-weight: 800;
      border-radius: 30px;
      text-transform: uppercase;
      color: white;
    }

    .badge-approved { background-color: var(--success); }
    .badge-closed { background-color: var(--danger); }
    .badge-opened { background-color: var(--info); }
    .badge-hold { background-color: var(--warning); color: #333; }

    .section-title {
      font-size: 18px;
      color: var(--primary);
      border-bottom: 2px solid #e9ecef;
      padding-bottom: 8px;
      margin-top: 40px;
      margin-bottom: 20px;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .grid-details {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      background: #fdfdfd;
      padding: 20px;
      border-radius: 12px;
      border: 1px solid #e9ecef;
    }

    .detail-item {
      display: flex;
      flex-direction: column;
    }

    .detail-label {
      font-size: 12px;
      color: var(--text-muted);
      text-transform: uppercase;
      font-weight: 700;
      margin-bottom: 4px;
    }

    .detail-val {
      font-size: 15px;
      font-weight: 600;
      color: var(--primary);
    }

    .full-width {
      grid-column: span 2;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 15px;
      background: #fff;
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid #dee2e6;
    }

    th, td {
      padding: 12px 15px;
      text-align: left;
      border-bottom: 1px solid #dee2e6;
    }

    th {
      background-color: var(--primary);
      color: #fff;
      font-size: 14px;
      font-weight: 700;
    }

    tr:nth-child(even) td {
      background-color: #f8f9fa;
    }

    .col-q {
      width: 70%;
    }

    .col-a {
      width: 10%;
      text-align: center;
    }

    .check-icon {
      display: inline-block;
      width: 24px;
      height: 24px;
      line-height: 24px;
      border-radius: 50%;
      background: var(--success);
      color: #fff;
      font-size: 13px;
      font-weight: bold;
      text-align: center;
    }

    .download-bar {
      margin-top: 40px;
      text-align: center;
    }

    .btn-download {
      background: var(--primary);
      color: #fff;
      border: none;
      padding: 12px 30px;
      border-radius: 30px;
      font-size: 15px;
      font-weight: 700;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      box-shadow: 0 4px 15px rgba(34, 42, 69, 0.2);
      transition: background 0.2s, transform 0.2s;
    }

    .btn-download:hover {
      background: #192035;
      transform: translateY(-2px);
    }

    /* Print Stylesheets */
    @media print {
      body {
        background-color: #fff;
        padding: 0;
      }
      .container {
        box-shadow: none;
        padding: 0;
      }
      .download-bar {
        display: none;
      }
      .page-break {
        page-break-before: always;
      }
    }
  </style>
</head>
<body>

<div class="container" id="root-content">
  <!-- Header -->
  <div class="header-section">
    <div>
      ${leftLogo ? `<img src="${leftLogo}" alt="Logo Left" class="logo-img">` : ''}
    </div>
    <div class="title-box">
      <h1 id="permit-no">ACTIVITY PERMIT NO: ${data.PermitNo || '-'}</h1>
    </div>
    <div>
      ${rightLogo ? `<img src="${rightLogo}" alt="Logo Right" class="logo-img">` : ''}
    </div>
  </div>

  <!-- Status Cards -->
  <div class="status-cards">
    <div class="card">
      <div class="card-title">Permit Status</div>
      <div class="card-value">
        <span class="badge ${statusClass}">${data.Request_status || 'Draft'}</span>
      </div>
    </div>
    ${data.check_in_time ? `
    <div class="card" style="border-left-color: var(--success);">
      <div class="card-title">Checked In</div>
      <div class="card-value">${formatDate(data.check_in_time)} ${formatTime(data.check_in_time)}</div>
      <div style="font-size: 12px; color: var(--text-muted); margin-top:4px;">By: ${data.check_in_user || 'N/A'}</div>
    </div>` : ''}
    ${data.check_out_time ? `
    <div class="card" style="border-left-color: var(--danger);">
      <div class="card-title">Checked Out</div>
      <div class="card-value">${formatDate(data.check_out_time)} ${formatTime(data.check_out_time)}</div>
      <div style="font-size: 12px; color: var(--text-muted); margin-top:4px;">By: ${data.check_out_user || 'N/A'}</div>
    </div>` : ''}
  </div>

  <!-- General Metadata Details -->
  <div class="section-title">Permit Metadata & Location</div>
  <div class="grid-details">
    <div class="detail-item">
      <span class="detail-label">Request Date</span>
      <span class="detail-val">${formatDate(data.Request_Date)}</span>
    </div>
    <div class="detail-item">
      <span class="detail-label">Project Name</span>
      <span class="detail-val">${data.Company_Name || '-'}</span>
    </div>
    <div class="detail-item">
      <span class="detail-label">Contractor</span>
      <span class="detail-val">${data.subContractorName || '-'}</span>
    </div>
    <div class="detail-item">
      <span class="detail-label">Subcontractor</span>
      <span class="detail-val">${data.new_sub_contractor || '-'}</span>
    </div>
    <div class="detail-item">
      <span class="detail-label">Foreman / Supervisor</span>
      <span class="detail-val">${data.Foreman || '-'}</span>
    </div>
    <div class="detail-item">
      <span class="detail-label">Foreman Phone</span>
      <span class="detail-val">${data.Foreman_Phone_Number || '-'}</span>
    </div>
    <div class="detail-item">
      <span class="detail-label">Activity</span>
      <span class="detail-val">${data.Activity || '-'}</span>
    </div>
    <div class="detail-item">
      <span class="detail-label">Type of Activity</span>
      <span class="detail-val">${data.activityName || '-'}</span>
    </div>
    <div class="detail-item">
      <span class="detail-label">RAMS Number</span>
      <span class="detail-val">${data.rams_number || '-'}</span>
    </div>
    <div class="detail-item">
      <span class="detail-label">Permit Type</span>
      <span class="detail-val">${data.permit_type || '-'}</span>
    </div>
    <div class="detail-item">
      <span class="detail-label">Permit Under</span>
      <span class="detail-val">${data.permit_under || 'Construction'}</span>
    </div>
    <div class="detail-item">
      <span class="detail-label">Night Shift</span>
      <span class="detail-val">${Number(data.night_shift) === 1 ? 'Yes' : 'No'}</span>
    </div>
    <div class="detail-item full-width">
      <span class="detail-label">Description of Activity</span>
      <span class="detail-val" style="white-space: pre-wrap;">${data.description_of_activity || '-'}</span>
    </div>
  </div>

  <div class="section-title">Schedule & Areas</div>
  <div class="grid-details">
    <div class="detail-item">
      <span class="detail-label">Working Date</span>
      <span class="detail-val">${formatDate(data.Working_Date)}</span>
    </div>
    <div class="detail-item">
      <span class="detail-label">Working Hours</span>
      <span class="detail-val">${formatTime(data.Start_Time)} - ${formatTime(data.End_Time)}</span>
    </div>
    <div class="detail-item">
      <span class="detail-label">Site / Building</span>
      <span class="detail-val">${data.building_name || '-'}</span>
    </div>
    <div class="detail-item">
      <span class="detail-label">Floor / Level</span>
      <span class="detail-val">${data.Room_Type || '-'}</span>
    </div>
    <div class="detail-item full-width">
      <span class="detail-label">Room / Area Numbers</span>
      <span class="detail-val">${data.Room_Nos || '-'}</span>
    </div>
  </div>

  <div class="section-title">Tools & Machinery</div>
  <div class="grid-details">
    <div class="detail-item">
      <span class="detail-label">Tools Used</span>
      <span class="detail-val">${data.Tools || '-'}</span>
    </div>
    <div class="detail-item">
      <span class="detail-label">Machinery Used</span>
      <span class="detail-val">${data.Machinery || '-'}</span>
    </div>
  </div>

  <!-- General Checklist Section -->
  <div class="section-title">General Safety Checklist</div>
  <table>
    <thead>
      <tr>
        <th class="col-q">Safety Question</th>
        <th class="col-a">Yes</th>
        <th class="col-a">No</th>
        <th class="col-a">N/A</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Can you confirm that your work is not affecting other contractors working in this area before starting?</td>
        <td class="col-a">${renderCheck(data.affecting_other_contractors, 1)}</td>
        <td class="col-a">${renderCheck(data.affecting_other_contractors, 0)}</td>
        <td class="col-a">${renderCheck(data.affecting_other_contractors, 2)}</td>
      </tr>
      <tr>
        <td>Are there other conditions that must be taken into account during the work?</td>
        <td class="col-a">${renderCheck(data.other_conditions, 1)}</td>
        <td class="col-a">${renderCheck(data.other_conditions, 0)}</td>
        <td class="col-a">${renderCheck(data.other_conditions, 2)}</td>
      </tr>
      ${Number(data.other_conditions) === 1 ? `
      <tr>
        <td colspan="4" style="background-color:#fff9db; color:#b07d00; font-weight:600;">
          Other Conditions Note: ${data.other_conditions_input || '-'}
        </td>
      </tr>` : ''}
      <tr>
        <td>Can you confirm that there will be enough work lighting to begin the work?</td>
        <td class="col-a">${renderCheck(data.lighting_begin_work, 1)}</td>
        <td class="col-a">${renderCheck(data.lighting_begin_work, 0)}</td>
        <td class="col-a">${renderCheck(data.lighting_begin_work, 2)}</td>
      </tr>
      <tr>
        <td>Have the team been informed about the specific risks based on the task? (RAMS / Toolbox talk, etc.)</td>
        <td class="col-a">${renderCheck(data.specific_risks, 1)}</td>
        <td class="col-a">${renderCheck(data.specific_risks, 0)}</td>
        <td class="col-a">${renderCheck(data.specific_risks, 2)}</td>
      </tr>
      <tr>
        <td>Is the work environment safely ensured? Have the necessary warning signs been placed?</td>
        <td class="col-a">${renderCheck(data.environment_ensured, 1)}</td>
        <td class="col-a">${renderCheck(data.environment_ensured, 0)}</td>
        <td class="col-a">${renderCheck(data.environment_ensured, 2)}</td>
      </tr>
      <tr>
        <td>Have the team been informed about the course of action in any emergency situation?</td>
        <td class="col-a">${renderCheck(data.course_of_actions || data.course_of_action, 1)}</td>
        <td class="col-a">${renderCheck(data.course_of_actions || data.course_of_action, 0)}</td>
        <td class="col-a">${renderCheck(data.course_of_actions || data.course_of_action, 2)}</td>
      </tr>
    </tbody>
  </table>

  <!-- Conditionally Rendered Checklist Sections -->
  
  <!-- Hotwork -->
  ${Number(data.Hot_work) === 1 ? `
  <div class="page-break"></div>
  <div class="section-title">Hotwork Safety Checklist</div>
  <table>
    <thead>
      <tr>
        <th class="col-q">Safety Question</th>
        <th class="col-a">Yes</th>
        <th class="col-a">No</th>
        <th class="col-a">N/A</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Are there other tasks in progress in the area?</td>
        <td class="col-a">${renderCheck(data.tasks_in_progress_in_the_area, 1)}</td>
        <td class="col-a">${renderCheck(data.tasks_in_progress_in_the_area, 0)}</td>
        <td class="col-a">${renderCheck(data.tasks_in_progress_in_the_area, 2)}</td>
      </tr>
      <tr>
        <td>Have you considered alternative methods to the hot work method? (e.g. cold cutting)</td>
        <td class="col-a">${renderCheck(data.lighting_sufficiently, 1)}</td>
        <td class="col-a">${renderCheck(data.lighting_sufficiently, 0)}</td>
        <td class="col-a">${renderCheck(data.lighting_sufficiently, 2)}</td>
      </tr>
      <tr>
        <td>Have the team been informed about the specific risks based on the task?</td>
        <td class="col-a">${renderCheck(data.specific_risks_based_on_task, 1)}</td>
        <td class="col-a">${renderCheck(data.specific_risks_based_on_task, 0)}</td>
        <td class="col-a">${renderCheck(data.specific_risks_based_on_task, 2)}</td>
      </tr>
      <tr>
        <td>Is the work environment safely ensured? Have warnings been placed?</td>
        <td class="col-a">${renderCheck(data.work_environment_safety_ensured, 1)}</td>
        <td class="col-a">${renderCheck(data.work_environment_safety_ensured, 0)}</td>
        <td class="col-a">${renderCheck(data.work_environment_safety_ensured, 2)}</td>
      </tr>
      <tr>
        <td>Have the team been informed about the course of action in emergencies?</td>
        <td class="col-a">${renderCheck(data.course_of_action_in_emergencies, 1)}</td>
        <td class="col-a">${renderCheck(data.course_of_action_in_emergencies, 0)}</td>
        <td class="col-a">${renderCheck(data.course_of_action_in_emergencies, 2)}</td>
      </tr>
      <tr>
        <td>Should a fire watch be established?</td>
        <td class="col-a">${renderCheck(data.fire_watch_establish, 1)}</td>
        <td class="col-a">${renderCheck(data.fire_watch_establish, 0)}</td>
        <td class="col-a">${renderCheck(data.fire_watch_establish, 2)}</td>
      </tr>
      <tr>
        <td>Can you confirm that flammable materials are removed from the work area?</td>
        <td class="col-a">${renderCheck(data.combustible_material, 1)}</td>
        <td class="col-a">${renderCheck(data.combustible_material, 0)}</td>
        <td class="col-a">${renderCheck(data.combustible_material, 2)}</td>
      </tr>
      <tr>
        <td>Should safety measures be implemented to stop sparks from splattering?</td>
        <td class="col-a">${renderCheck(data.safety_measures, 1)}</td>
        <td class="col-a">${renderCheck(data.safety_measures, 0)}</td>
        <td class="col-a">${renderCheck(data.safety_measures, 2)}</td>
      </tr>
      <tr>
        <td>Are fire extinguishers and fire blanket ready for use in the area?</td>
        <td class="col-a">${renderCheck(data.extinguishers_and_fire_blanket, 1)}</td>
        <td class="col-a">${renderCheck(data.extinguishers_and_fire_blanket, 0)}</td>
        <td class="col-a">${renderCheck(data.extinguishers_and_fire_blanket, 2)}</td>
      </tr>
    </tbody>
  </table>

  <div style="margin-top:20px; display:grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
    <div class="card">
      <div class="card-title">Welding Activity Details</div>
      <div class="card-value" style="font-size:14px;">
        <p>Welding Activity: <strong>${Number(data.welding_activity) === 1 ? 'Yes' : 'No'}</strong></p>
        <p>Welder Certificates Present: <strong>${Number(data.heat_treatment) === 1 ? 'Yes' : 'No'}</strong></p>
        <p>Air Extraction Established: <strong>${Number(data.air_extraction_be_established) === 1 ? 'Yes' : 'No'}</strong></p>
      </div>
    </div>
    <div class="card">
      <div class="card-title">Risk Assessment Parameters</div>
      <div class="card-value" style="font-size:14px;">
        <p>Low Risk Hotwork: <strong>${Number(data.low_risk_hotwork) === 1 ? 'Yes' : 'No'}</strong></p>
        <p>High Risk Hotwork: <strong>${Number(data.high_risk_hotwork) === 1 ? 'Yes' : 'No'}</strong></p>
        <p>Fire Guard Present: <strong>${Number(data.fire_guard_present) === 1 ? 'Yes' : 'No'}</strong></p>
        <p>Checklist Filled: <strong>${Number(data.hot_work_checklist_filled) === 1 ? 'Yes' : 'No'}</strong></p>
      </div>
    </div>
  </div>
  ` : ''}

  <!-- Electrical Systems -->
  ${Number(data.working_on_electrical_system) === 1 ? `
  <div class="page-break"></div>
  <div class="section-title">Electrical Systems Safety Checklist</div>
  <table>
    <thead>
      <tr>
        <th class="col-q">Safety Question</th>
        <th class="col-a">Yes</th>
        <th class="col-a">No</th>
        <th class="col-a">N/A</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Is the person responsible for the area informed?</td>
        <td class="col-a">${renderCheck(data.responsible_for_the_informed, 1)}</td>
        <td class="col-a">${renderCheck(data.responsible_for_the_informed, 0)}</td>
        <td class="col-a">${renderCheck(data.responsible_for_the_informed, 2)}</td>
      </tr>
      <tr>
        <td>Check if the board is de-energized - is it de-energized?</td>
        <td class="col-a">${renderCheck(data.de_energized, 1)}</td>
        <td class="col-a">${renderCheck(data.de_energized, 0)}</td>
        <td class="col-a">${renderCheck(data.de_energized, 2)}</td>
      </tr>
      <tr>
        <td>Do you have risk assessment done RAMS?</td>
        <td class="col-a">${renderCheck(data.do_risk_assessment, 1)}</td>
        <td class="col-a">${renderCheck(data.do_risk_assessment, 0)}</td>
        <td class="col-a">${renderCheck(data.do_risk_assessment, 2)}</td>
      </tr>
      <tr>
        <td>Secure the area against reconnection using LOTO with at least a craftsman's padlock.</td>
        <td class="col-a">${renderCheck(data.if_no_loto, 1)}</td>
        <td class="col-a">${renderCheck(data.if_no_loto, 0)}</td>
        <td class="col-a">${renderCheck(data.if_no_loto, 2)}</td>
      </tr>
      <tr>
        <td>Do appliances/devices that run on electricity have insulation?</td>
        <td class="col-a">${renderCheck(data.electricity_have_isulation, 1)}</td>
        <td class="col-a">${renderCheck(data.electricity_have_isulation, 0)}</td>
        <td class="col-a">${renderCheck(data.electricity_have_isulation, 2)}</td>
      </tr>
    </tbody>
  </table>
  ` : ''}

  <!-- Hazardous Substances -->
  ${Number(data.working_hazardious_substen) === 1 ? `
  <div class="page-break"></div>
  <div class="section-title">Hazardous Substances / Chemicals Checklist</div>
  <table>
    <thead>
      <tr>
        <th class="col-q">Safety Question</th>
        <th class="col-a">Yes</th>
        <th class="col-a">No</th>
        <th class="col-a">N/A</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Relevant MAL-codes and safety datasheets for hazardous media presented?</td>
        <td class="col-a">${renderCheck(data.relevant_mal, 1)}</td>
        <td class="col-a">${renderCheck(data.relevant_mal, 0)}</td>
        <td class="col-a">${renderCheck(data.relevant_mal, 2)}</td>
      </tr>
      <tr>
        <td>Is MSDS (Material Safety Data Sheet) submitted?</td>
        <td class="col-a">${renderCheck(data.msds, 1)}</td>
        <td class="col-a">${renderCheck(data.msds, 0)}</td>
        <td class="col-a">${renderCheck(data.msds, 2)}</td>
      </tr>
      <tr>
        <td>Has the use of protective equipment been considered and are they present?</td>
        <td class="col-a">${renderCheck(data.equipment_taken_account, 1)}</td>
        <td class="col-a">${renderCheck(data.equipment_taken_account, 0)}</td>
        <td class="col-a">${renderCheck(data.equipment_taken_account, 2)}</td>
      </tr>
      <tr>
        <td>Is ventilation/air extraction established?</td>
        <td class="col-a">${renderCheck(data.ventilation, 1)}</td>
        <td class="col-a">${renderCheck(data.ventilation, 0)}</td>
        <td class="col-a">${renderCheck(data.ventilation, 2)}</td>
      </tr>
      <tr>
        <td>Have the team been informed about the specific risks of the hazardous substances?</td>
        <td class="col-a">${renderCheck(data.hazardous_substances, 1)}</td>
        <td class="col-a">${renderCheck(data.hazardous_substances, 0)}</td>
        <td class="col-a">${renderCheck(data.hazardous_substances, 2)}</td>
      </tr>
      <tr>
        <td>Storage and disposal of hazardous waste handled in a safe manner?</td>
        <td class="col-a">${renderCheck(data.storage_and_disposal, 1)}</td>
        <td class="col-a">${renderCheck(data.storage_and_disposal, 0)}</td>
        <td class="col-a">${renderCheck(data.storage_and_disposal, 2)}</td>
      </tr>
      <tr>
        <td>Are eye-wash and emergency shower reachable in case of emergency?</td>
        <td class="col-a">${renderCheck(data.reachable_case, 1)}</td>
        <td class="col-a">${renderCheck(data.reachable_case, 0)}</td>
        <td class="col-a">${renderCheck(data.reachable_case, 2)}</td>
      </tr>
      <tr>
        <td>Chemical risk assessment done and submitted?</td>
        <td class="col-a">${renderCheck(data.checical_risk_assessment, 1)}</td>
        <td class="col-a">${renderCheck(data.checical_risk_assessment, 0)}</td>
        <td class="col-a">${renderCheck(data.checical_risk_assessment, 2)}</td>
      </tr>
    </tbody>
  </table>
  ` : ''}

  <!-- Working at Height -->
  ${Number(data.working_at_height) === 1 ? `
  <div class="page-break"></div>
  <div class="section-title">Working at Height Checklist</div>
  <table>
    <thead>
      <tr>
        <th class="col-q">Safety Question</th>
        <th class="col-a">Yes</th>
        <th class="col-a">No</th>
        <th class="col-a">N/A</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Has the working area been segregated or demarcated with barriers?</td>
        <td class="col-a">${renderCheck(data.segragated_demarkated, 1)}</td>
        <td class="col-a">${renderCheck(data.segragated_demarkated, 0)}</td>
        <td class="col-a">${renderCheck(data.segragated_demarkated, 2)}</td>
      </tr>
      <tr>
        <td>Are suitable anchor points in place for lanyard attachments?</td>
        <td class="col-a">${renderCheck(data.lanyard_attachments, 1)}</td>
        <td class="col-a">${renderCheck(data.lanyard_attachments, 0)}</td>
        <td class="col-a">${renderCheck(data.lanyard_attachments, 2)}</td>
      </tr>
      <tr>
        <td>In case of emergency, is there a rescue plan in place?</td>
        <td class="col-a">${renderCheck(data.rescue_plan, 1)}</td>
        <td class="col-a">${renderCheck(data.rescue_plan, 0)}</td>
        <td class="col-a">${renderCheck(data.rescue_plan, 2)}</td>
      </tr>
      <tr>
        <td>Has the work been planned and coordinated to avoid falling hazards?</td>
        <td class="col-a">${renderCheck(data.avoid_hazards, 1)}</td>
        <td class="col-a">${renderCheck(data.avoid_hazards, 0)}</td>
        <td class="col-a">${renderCheck(data.avoid_hazards, 2)}</td>
      </tr>
      <tr>
        <td>Has the team had certified working at height training?</td>
        <td class="col-a">${renderCheck(data.height_training, 1)}</td>
        <td class="col-a">${renderCheck(data.height_training, 0)}</td>
        <td class="col-a">${renderCheck(data.height_training, 2)}</td>
      </tr>
      <tr>
        <td>Is work carried out under supervision of personnel with Working at Height training?</td>
        <td class="col-a">${renderCheck(data.supervision, 1)}</td>
        <td class="col-a">${renderCheck(data.supervision, 0)}</td>
        <td class="col-a">${renderCheck(data.supervision, 2)}</td>
      </tr>
      <tr>
        <td>Full body harness with fall-preventing system deployed & twin lanyard provided?</td>
        <td class="col-a">${renderCheck(data.shock_absorbing, 1)}</td>
        <td class="col-a">${renderCheck(data.shock_absorbing, 0)}</td>
        <td class="col-a">${renderCheck(data.shock_absorbing, 2)}</td>
      </tr>
      <tr>
        <td>Are safety harness and lanyard inspected and suitable for the task?</td>
        <td class="col-a">${renderCheck(data.height_equipments, 1)}</td>
        <td class="col-a">${renderCheck(data.height_equipments, 0)}</td>
        <td class="col-a">${renderCheck(data.height_equipments, 2)}</td>
      </tr>
      <tr>
        <td>Horizontal or vertical lifeline systems in place?</td>
        <td class="col-a">${renderCheck(data.vertical_life, 1)}</td>
        <td class="col-a">${renderCheck(data.vertical_life, 0)}</td>
        <td class="col-a">${renderCheck(data.vertical_life, 2)}</td>
      </tr>
      <tr>
        <td>Are all tools secured from falling from height?</td>
        <td class="col-a">${renderCheck(data.secured_falling, 1)}</td>
        <td class="col-a">${renderCheck(data.secured_falling, 0)}</td>
        <td class="col-a">${renderCheck(data.secured_falling, 2)}</td>
      </tr>
      <tr>
        <td>Have protective measures for dropped objects been established?</td>
        <td class="col-a">${renderCheck(data.dropped_objects, 1)}</td>
        <td class="col-a">${renderCheck(data.dropped_objects, 0)}</td>
        <td class="col-a">${renderCheck(data.dropped_objects, 2)}</td>
      </tr>
      <tr>
        <td>Has proper and safe access and egress been ensured?</td>
        <td class="col-a">${renderCheck(data.safe_acces, 1)}</td>
        <td class="col-a">${renderCheck(data.safe_acces, 0)}</td>
        <td class="col-a">${renderCheck(data.safe_acces, 2)}</td>
      </tr>
      <tr>
        <td>Are the weather conditions acceptable?</td>
        <td class="col-a">${renderCheck(data.weather_acceptable, 1)}</td>
        <td class="col-a">${renderCheck(data.weather_acceptable, 0)}</td>
        <td class="col-a">${renderCheck(data.weather_acceptable, 2)}</td>
      </tr>
    </tbody>
  </table>
  ` : ''}

  <!-- Confined Spaces -->
  ${Number(data.working_confined_spaces) === 1 ? `
  <div class="page-break"></div>
  <div class="section-title">Confined Spaces Safety Checklist</div>
  <table>
    <thead>
      <tr>
        <th class="col-q">Safety Question</th>
        <th class="col-a">Yes</th>
        <th class="col-a">No</th>
        <th class="col-a">N/A</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Is the tank/container cleaned to mitigate risk from vapours/gases?</td>
        <td class="col-a">${renderCheck(data.vapours_gases, 1)}</td>
        <td class="col-a">${renderCheck(data.vapours_gases, 0)}</td>
        <td class="col-a">${renderCheck(data.vapours_gases, 2)}</td>
      </tr>
      <tr>
        <td>Are oxygen and LEL measurements done before starting?</td>
        <td class="col-a">${renderCheck(data.lel_measurement, 1)}</td>
        <td class="col-a">${renderCheck(data.lel_measurement, 0)}</td>
        <td class="col-a">${renderCheck(data.lel_measurement, 2)}</td>
      </tr>
      <tr>
        <td>Are container and equipment properly secured?</td>
        <td class="col-a">${renderCheck(data.all_equipment, 1)}</td>
        <td class="col-a">${renderCheck(data.all_equipment, 0)}</td>
        <td class="col-a">${renderCheck(data.all_equipment, 2)}</td>
      </tr>
      <tr>
        <td>Are entry/exit conditions safe? (e.g. ladder)</td>
        <td class="col-a">${renderCheck(data.exit_conditions, 1)}</td>
        <td class="col-a">${renderCheck(data.exit_conditions, 0)}</td>
        <td class="col-a">${renderCheck(data.exit_conditions, 2)}</td>
      </tr>
      <tr>
        <td>Are means of communication determined? (siren, radio, phone)</td>
        <td class="col-a">${renderCheck(data.communication_emergency, 1)}</td>
        <td class="col-a">${renderCheck(data.communication_emergency, 0)}</td>
        <td class="col-a">${renderCheck(data.communication_emergency, 2)}</td>
      </tr>
      <tr>
        <td>Are rescue equipments in place and ready?</td>
        <td class="col-a">${renderCheck(data.rescue_equipments, 1)}</td>
        <td class="col-a">${renderCheck(data.rescue_equipments, 0)}</td>
        <td class="col-a">${renderCheck(data.rescue_equipments, 2)}</td>
      </tr>
      <tr>
        <td>Are space and ventilation adequate?</td>
        <td class="col-a">${renderCheck(data.space_ventilation, 1)}</td>
        <td class="col-a">${renderCheck(data.space_ventilation, 0)}</td>
        <td class="col-a">${renderCheck(data.space_ventilation, 2)}</td>
      </tr>
      <tr>
        <td>Is an oxygen meter provided for the work?</td>
        <td class="col-a">${renderCheck(data.oxygen_meter, 1)}</td>
        <td class="col-a">${renderCheck(data.oxygen_meter, 0)}</td>
        <td class="col-a">${renderCheck(data.oxygen_meter, 2)}</td>
      </tr>
    </tbody>
  </table>
  ` : ''}

  <!-- Excavation Works -->
  ${Number(data.excavation_works) === 1 ? `
  <div class="page-break"></div>
  <div class="section-title">Excavation Safety Checklist</div>
  <table>
    <thead>
      <tr>
        <th class="col-q">Safety Question</th>
        <th class="col-a">Yes</th>
        <th class="col-a">No</th>
        <th class="col-a">N/A</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Is the excavation area segregated (1m edge with hard barriers, 2m with soft barriers)?</td>
        <td class="col-a">${renderCheck(data.excavation_segregated, 1)}</td>
        <td class="col-a">${renderCheck(data.excavation_segregated, 0)}</td>
        <td class="col-a">${renderCheck(data.excavation_segregated, 2)}</td>
      </tr>
      <tr>
        <td>Digging permit obtained in accordance with Danish regulations and NN standards?</td>
        <td class="col-a">${renderCheck(data.nn_standards, 1)}</td>
        <td class="col-a">${renderCheck(data.nn_standards, 0)}</td>
        <td class="col-a">${renderCheck(data.nn_standards, 2)}</td>
      </tr>
      <tr>
        <td>Does excavation require shoring?</td>
        <td class="col-a">${renderCheck(data.excavation_shoring, 1)}</td>
        <td class="col-a">${renderCheck(data.excavation_shoring, 0)}</td>
        <td class="col-a">${renderCheck(data.excavation_shoring, 2)}</td>
      </tr>
      <tr>
        <td>Danish regulations checked and followed?</td>
        <td class="col-a">${renderCheck(data.danish_regulation, 1)}</td>
        <td class="col-a">${renderCheck(data.danish_regulation, 0)}</td>
        <td class="col-a">${renderCheck(data.danish_regulation, 2)}</td>
      </tr>
      <tr>
        <td>Safe access and egress provided?</td>
        <td class="col-a">${renderCheck(data.safe_access_and_egress, 1)}</td>
        <td class="col-a">${renderCheck(data.safe_access_and_egress, 0)}</td>
        <td class="col-a">${renderCheck(data.safe_access_and_egress, 2)}</td>
      </tr>
      <tr>
        <td>Are excavation sides correctly sloped/battered?</td>
        <td class="col-a">${renderCheck(data.correctly_sloped, 1)}</td>
        <td class="col-a">${renderCheck(data.correctly_sloped, 0)}</td>
        <td class="col-a">${renderCheck(data.correctly_sloped, 2)}</td>
      </tr>
      <tr>
        <td>Are inspection dates verified?</td>
        <td class="col-a">${renderCheck(data.inspection_dates, 1)}</td>
        <td class="col-a">${renderCheck(data.inspection_dates, 0)}</td>
        <td class="col-a">${renderCheck(data.inspection_dates, 2)}</td>
      </tr>
      <tr>
        <td>Drawings marked for underground utilities present?</td>
        <td class="col-a">${renderCheck(data.marked_drawings, 1)}</td>
        <td class="col-a">${renderCheck(data.marked_drawings, 0)}</td>
        <td class="col-a">${renderCheck(data.marked_drawings, 2)}</td>
      </tr>
      <tr>
        <td>Underground services/pipes cleared before work?</td>
        <td class="col-a">${renderCheck(data.underground_areas_cleared, 1)}</td>
        <td class="col-a">${renderCheck(data.underground_areas_cleared, 0)}</td>
        <td class="col-a">${renderCheck(data.underground_areas_cleared, 2)}</td>
      </tr>
    </tbody>
  </table>
  ` : ''}

  <!-- Cranes and Lifting -->
  ${Number(data.using_cranes_or_lifting) === 1 ? `
  <div class="page-break"></div>
  <div class="section-title">Cranes & Lifting Operations Checklist</div>
  <table>
    <thead>
      <tr>
        <th class="col-q">Safety Question</th>
        <th class="col-a">Yes</th>
        <th class="col-a">No</th>
        <th class="col-a">N/A</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Is there an appointed person supervising the lift?</td>
        <td class="col-a">${renderCheck(data.appointed_person, 1)}</td>
        <td class="col-a">${renderCheck(data.appointed_person, 0)}</td>
        <td class="col-a">${renderCheck(data.appointed_person, 2)}</td>
      </tr>
      <tr>
        <td>Are vendor/supplier lifting assessments verified?</td>
        <td class="col-a">${renderCheck(data.vendor_supplies || data.vendor_supplier, 1)}</td>
        <td class="col-a">${renderCheck(data.vendor_supplies || data.vendor_supplier, 0)}</td>
        <td class="col-a">${renderCheck(data.vendor_supplies || data.vendor_supplier, 2)}</td>
      </tr>
      <tr>
        <td>Is a lifting plan documented and attached?</td>
        <td class="col-a">${renderCheck(data.lift_plan, 1)}</td>
        <td class="col-a">${renderCheck(data.lift_plan, 0)}</td>
        <td class="col-a">${renderCheck(data.lift_plan, 2)}</td>
      </tr>
      <tr>
        <td>Lifting equipment supplied and inspected?</td>
        <td class="col-a">${renderCheck(data.supplied_and_inspected, 1)}</td>
        <td class="col-a">${renderCheck(data.supplied_and_inspected, 0)}</td>
        <td class="col-a">${renderCheck(data.supplied_and_inspected, 2)}</td>
      </tr>
      <tr>
        <td>Legally required inspection certificates present?</td>
        <td class="col-a">${renderCheck(data.legal_required_certificates, 1)}</td>
        <td class="col-a">${renderCheck(data.legal_required_certificates, 0)}</td>
        <td class="col-a">${renderCheck(data.legal_required_certificates, 2)}</td>
      </tr>
      <tr>
        <td>Are operators prepared for the lifting task?</td>
        <td class="col-a">${renderCheck(data.prapared_lifting, 1)}</td>
        <td class="col-a">${renderCheck(data.prapared_lifting, 0)}</td>
        <td class="col-a">${renderCheck(data.prapared_lifting, 2)}</td>
      </tr>
      <tr>
        <td>Lifting task area fenced or barricaded?</td>
        <td class="col-a">${renderCheck(data.lifting_task_fenced, 1)}</td>
        <td class="col-a">${renderCheck(data.lifting_task_fenced, 0)}</td>
        <td class="col-a">${renderCheck(data.lifting_task_fenced, 2)}</td>
      </tr>
      <tr>
        <td>Overhead risks identified and addressed?</td>
        <td class="col-a">${renderCheck(data.overhead_risks, 1)}</td>
        <td class="col-a">${renderCheck(data.overhead_risks, 0)}</td>
        <td class="col-a">${renderCheck(data.overhead_risks, 2)}</td>
      </tr>
    </tbody>
  </table>
  ` : ''}

  <!-- Files Attachment -->
  ${data.files && data.files.length > 0 ? `
  <div class="section-title">Attached Files (RAMS/Drawings)</div>
  <div style="display: flex; gap: 15px; flex-wrap: wrap; margin-top:10px;">
    ${data.files.map((file: any) => `
    <div class="card" style="flex: 1 1 200px; padding: 15px; display: flex; align-items: center; justify-content: space-between;">
      <div style="font-size:13px; font-weight:600; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; max-width:150px;">
        ${file.ramsFile ? file.ramsFile.split('/').pop() : 'Attachment'}
      </div>
      <a href="/requests/files/${file.ramsFileId}" target="_blank" style="text-decoration:none; color:var(--primary); font-weight:700; font-size:12px; border:1px solid var(--primary); padding:4px 8px; border-radius:4px;">
        View
      </a>
    </div>
    `).join('')}
  </div>` : ''}

  <!-- Footer Actions / Download -->
  <div class="download-bar">
    <button type="button" class="btn-download" onclick="downloadPDF()">
      <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"></path>
      </svg>
      Download PDF
    </button>
  </div>
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
<script>
  function downloadPDF() {
    const element = document.getElementById('root-content');
    const name = "Permit_" + "${data.PermitNo || 'detail'}".trim() + ".pdf";
    const opt = {
      margin: 8,
      filename: name,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  }
</script>
</body>
</html>
  `;
}
