import { join } from 'path';
import { getBase64Image } from './image-utils';

export function generatePermitHtml(data: any): string {
  const leftLogo = getBase64Image(join(process.cwd(), './newbeam1/images/left_side.jpeg'));
  const rightLogo = getBase64Image(join(process.cwd(), './newbeam1/images/right_side.jpeg'));
  const attachFileIcon = getBase64Image(join(process.cwd(), './newbeam1/images/attach-file.png'));

  const imgHardHat = getBase64Image(join(process.cwd(), './newbeam1/images/HardHat.png'));
  const imgSafetyShoes = getBase64Image(join(process.cwd(), './newbeam1/images/Safetyshoes.png'));
  const imgHighVisibility = getBase64Image(join(process.cwd(), './newbeam1/images/HighVisibility.png'));
  const imgLongPants = getBase64Image(join(process.cwd(), './newbeam1/images/Longpants.png'));
  const imgSpecificGloves = getBase64Image(join(process.cwd(), './newbeam1/images/SpecificGloves.png'));

  const imgEyeProtection = getBase64Image(join(process.cwd(), './newbeam1/images/Eyeprotection.png'));
  const imgFallProtection = getBase64Image(join(process.cwd(), './newbeam1/images/Fallprotection.png'));
  const imgHearingProtection = getBase64Image(join(process.cwd(), './newbeam1/images/Hearingprotection.png'));
  const imgRespiratoryProtection = getBase64Image(join(process.cwd(), './newbeam1/images/Respiratoryprotection.png'));

  const imgHotWorks = getBase64Image(join(process.cwd(), './newbeam1/images/HotWorks.png'));
  const imgElectricalSystems = getBase64Image(join(process.cwd(), './newbeam1/images/ElectricalSystems.png'));
  const imgSubstanceChemical = getBase64Image(join(process.cwd(), './newbeam1/images/substanceChemical.png'));
  const imgTestingEquipment = getBase64Image(join(process.cwd(), './newbeam1/images/testingequipment.png'));
  const imgWorkingAtHight = getBase64Image(join(process.cwd(), './newbeam1/images/WorkingAtHight.png'));
  const imgConfinedSpace = getBase64Image(join(process.cwd(), './newbeam1/images/ConfinedSpace.png'));
  const imgExcavationWorks = getBase64Image(join(process.cwd(), './newbeam1/images/ExcavationWorks.png'));
  const imgCranesLifting = getBase64Image(join(process.cwd(), './newbeam1/images/Craneslifting.png'));
  const imgElectricalWorks = getBase64Image(join(process.cwd(), './newbeam1/images/electrical_works.png'));
  const imgMechanicalWorks = getBase64Image(join(process.cwd(), './newbeam1/images/mechanical1.png'));

  // Format Helper for Date
  const formatDateOnly = (dateStr: any) => {
    if (!dateStr) return '-';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return String(dateStr);
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${String(d.getDate()).padStart(2, '0')}-${months[d.getMonth()]}-${d.getFullYear()}`;
    } catch {
      return String(dateStr);
    }
  };

  // Format Helper for Date + Time
  const formatDateTime = (dateStr: any) => {
    if (!dateStr) return '-';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return String(dateStr);
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const day = String(d.getDate()).padStart(2, '0');
      const month = months[d.getMonth()];
      const year = d.getFullYear();
      let hours = d.getHours();
      const minutes = String(d.getMinutes()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      return `${day}-${month}-${year} ${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
    } catch {
      return String(dateStr);
    }
  };

  const formatTimeOnly = (timeStr: any) => {
    if (!timeStr) return '-';
    try {
      if (typeof timeStr === 'string' && timeStr.includes(':')) {
        const parts = timeStr.split(':');
        let hours = parseInt(parts[0], 10);
        const minutes = parts[1];
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        return `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
      }
      const d = new Date(timeStr);
      if (!isNaN(d.getTime())) {
        let hours = d.getHours();
        const minutes = String(d.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        return `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
      }
      return String(timeStr);
    } catch {
      return String(timeStr);
    }
  };

  const renderCheck = (value: any, target: number) => {
    if (value !== undefined && value !== null && Number(value) === target) {
      return '<span class="confirm-pg-checkmark">✓</span>';
    }
    return '';
  };

  const renderPpeCheck = (value: any) => {
    return Number(value) === 1 ? '✓' : 'X';
  };

  const getFireImageUrl = (imageVal: string) => {
    if (!imageVal) return '';
    if (imageVal.startsWith('data:')) {
      return imageVal;
    }
    if (/^[A-Za-z0-9+/=]+$/.test(imageVal) && imageVal.length > 100) {
      return `data:image/png;base64,${imageVal}`;
    }
    if (imageVal.startsWith('http://') || imageVal.startsWith('https://')) {
      return imageVal;
    }
    const filename = imageVal.split('/').pop() || imageVal;
    return `/requests/${filename}`;
  };

  const getCheckImageSrc = (imageVal: string) => {
    if (!imageVal) return '';
    if (imageVal.startsWith('data:')) {
      return imageVal;
    }
    if (/^[A-Za-z0-9+/=]+$/.test(imageVal) && imageVal.length > 100) {
      return `data:image/png;base64,${imageVal}`;
    }
    if (imageVal.startsWith('http://') || imageVal.startsWith('https://')) {
      return imageVal;
    }
    const filename = imageVal.split('/').pop() || imageVal;
    return `/requests/${filename}`;
  };

  const getStatusText = () => {
    if (data.cancel_reason === 'Permit not opened so system cancelled automatically') {
      return 'Auto-Cancel';
    }
    return data.Request_status || 'Draft';
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Activity Permit Details</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css">
  <link href="https://fonts.googleapis.com/css2?family=Mulish:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    body {
      background-color: #f8f9fa;
      margin: 0;
      padding: 0;
      font-family: 'Mulish', sans-serif;
    }
    .confirm-pg-container {
      background: #fff;
      padding: 60px;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
      border-radius: 15px;
      margin: 20px auto;
      max-width: 1200px;
    }
    .confirm-pg-header {
      background: #fff;
      padding: 2.5rem;
      position: relative;
      border-radius: 25px;
      border: 3px solid transparent;
      background-origin: border-box;
      background-clip: padding-box, border-box;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
      margin-bottom: 30px;
      border: 3px solid #222a45;
    }
    .confirm-pg-logoshead {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .confirm-pg-logo {
      max-width: 200px;
      height: auto;
    }
    .confirm-pg-head {
      align-content: center;
      background: #222a45;
      padding: 20px;
      border-radius: 8px;
    }
    .confirm-pg-title {
      color: #fff;
      font-size: 24px;
      font-weight: 700;
      text-align: center;
      margin: 0;
    }
    .confirm-pg-section {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
      border-left: 4px solid #222a45;
    }
    .confirm-pg-label {
      color: #222a45;
      font-weight: 600;
      margin-bottom: 5px;
      font-size: 1.1rem;
      letter-spacing: 0.5px;
    }
    .confirm-pg-value {
      color: #444;
      margin-bottom: 15px;
      word-wrap: break-word;
      overflow-wrap: break-word;
      word-break: break-word;
      font-size: 1.05rem;
    }
    .confirm-pg-table {
      margin: 0px 0px 30px 0px;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
      width: 100%;
    }
    .confirm-pg-table-header {
      border-radius: 8px;
      color: #fff;
      padding: 15px;
      font-weight: 600;
      font-size: 1.4rem;
      margin-bottom: 10px;
    }
    .confirm-bg-howtowork { background: #fe001b; }
    .confirm-bg-ElectricalSystems { background: #fed55a; }
    .confirm-bg-hazardous { background: #ffe501; }
    .confirm-bg-testingequipment { background: #3ba9fd; }
    .confirm-bg-WorkingAtHight { background: #005f8b; }
    .confirm-bg-ConfinedSpace { background: #fe8149; }
    .confirm-bg-ATEXarea { background: #f1ce40; }
    .confirm-bg-SecuringFacilities { background: #c91e21; }
    .confirm-bg-ExcavationWorks { background: #007334; }
    .confirm-bg-Craneslifting { background: linear-gradient(to top, #f1543f 20%, #fd8469 124%); }
    .confirm-bg-poweron { background: #4ebabd; }
    .confirm-bg-pressurization { background: #ffcc00; }
    .confirm-bg-text { color: #000; font-weight: 700; font-size: 1.1rem; }
    
    .confirm-pg-table table {
      width: 100%;
      border-collapse: collapse;
      background: #fff;
    }
    .confirm-pg-table th, .confirm-pg-table td {
      padding: 12px 15px;
      border: 1px solid #dee2e6;
    }
    .confirm-pg-table th {
      background: #f8f9fa;
      color: #222a45;
      font-weight: 700;
      font-size: 13px;
    }
    .confirm-pg-table tr:nth-child(even) {
      background: #f8f9fa;
    }
    .confirm-pg-question-cell {
      text-align: left;
      min-width: 300px;
    }
    .confirm-pg-answer-cell {
      text-align: center;
      width: 100px;
    }
    .confirm-pg-checkmark {
      background: #222a45;
      color: #fff;
      width: 25px;
      height: 25px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto;
    }
    .confirm-pg-cards-container {
      margin: 30px 0;
    }
    .confirm-pg-card {
      background: #fff;
      border-radius: 15px;
      padding: 25px;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
      margin-bottom: 30px;
    }
    .confirm-pg-card-header {
      color: #222a45;
      font-size: 18px;
      font-weight: 600;
      text-align: center;
      margin-bottom: 25px;
      padding-bottom: 15px;
      border-bottom: 2px solid #edc510;
    }
    .confirm-pg-image-container {
      text-align: center;
      margin-bottom: 20px;
    }
    .confirm-pg-image-wrapper {
      width: 110px;
      height: 110px;
      margin: 0 auto 15px;
      position: relative;
    }
    .confirm-pg-circular-image {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
      border: 3px solid #222a45;
    }
    .confirm-pg-work-image {
      height: 60px;
      border-radius: 8px;
      margin-right: 15px;
    }
    .confirm-pg-image-title {
      color: #222a45;
      font-weight: 600;
      font-size: 13px;
      margin-bottom: 10px;
    }
    .confirm-pg-download-container {
      text-align: center;
      margin: 30px 0;
    }
    .confirm-pg-download-btn {
      background: #222a45;
      color: #fff;
      padding: 12px 35px;
      border-radius: 8px;
      border: none;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .confirm-pg-download-btn:hover {
      background: #2c365a;
      transform: translateY(-2px);
      box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
    }
    .confirm-pg-attach-wrapper {
      background-color: #f8f9fa;
      cursor: pointer;
      transition: background-color 0.2s;
      border: 1px solid #dee2e6;
      border-radius: 8px;
      padding: 15px;
      display: inline-block;
      text-align: center;
      margin: 10px;
      width: 100%;
      max-width: 250px;
    }
    .confirm-pg-attach-wrapper:hover {
      background-color: #e9ecef;
    }
    .confirm-pg-attach-img {
      width: 40px;
      height: 40px;
      object-fit: contain;
    }
    .confirm-pg-attach-text {
      color: #666;
      font-size: 14px;
      display: block;
      margin-top: 5px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .modern-table {
      width: 100%;
      border-collapse: collapse;
      box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
      border-radius: 8px;
      margin: 20px 0;
    }
    .modern-table td {
      padding: 12px 15px;
      border: 1px solid #e0e0e0;
    }
    .modern-table tr:nth-child(even) {
      background-color: #f8f9fa;
    }
    .page-break {
      page-break-before: always;
    }
    .green-card {
      background-color: green;
      color: #fff;
    }
    .red-card {
      background-color: red;
      color: #fff;
    }
    .pink-card {
      background-color: #1f2d77;
      color: #fff;
      padding: 10px;
      border-radius: 8px;
      text-align: center;
      display: inline-block;
      min-width: 200px;
    }
    .text-white {
      color: #fff !important;
    }
    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }
    .header-left {
      display: flex;
      align-items: center;
    }
    .header-radio-group {
      display: flex;
      gap: 20px;
    }
    .custom-radio {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .radiomark {
      height: 30px;
      width: 30px;
      background-color: #fff;
      border-radius: 4px;
      display: inline-block;
      position: relative;
      border: 1px solid #ccc;
    }
    .custom-radio input:checked ~ .radiomark:after {
      content: "";
      position: absolute;
      left: 10px;
      top: 5px;
      width: 8px;
      height: 16px;
      border: solid #fe001b;
      border-width: 0 3px 3px 0;
      transform: rotate(45deg);
    }
    .radio-label {
      color: #000;
      font-size: 1rem;
      font-weight: 700;
    }
    .confirm-otherconditions {
      color: rgb(221, 32, 32);
      font-weight: 700;
    }
    .img-grid-gallery {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 20px;
      margin-top: 15px;
    }
    .img-grid-gallery img {
      max-width: 100%;
      height: 150px;
      object-fit: cover;
      border-radius: 8px;
      border: 1px solid #dee2e6;
    }
  </style>
</head>
<body>

  <div class="container confirm-pg-container" id="root">
    <div class="content">
      <!-- Header Section -->
      <div class="confirm-pg-header">
        <div class="text-center confirm-pg-logoshead">
          ${leftLogo ? `<img src="${leftLogo}" alt="Logo Left" class="confirm-pg-logo">` : ''}
          <div class="confirm-pg-head">
            <h1 class="confirm-pg-title">ACTIVITY PERMIT NO: ${data.PermitNo || '-'}</h1>
          </div>
          ${rightLogo ? `<img src="${rightLogo}" alt="Logo Right" class="confirm-pg-logo">` : ''}
        </div>
      </div>

      <!-- Check-in / Check-out status -->
      <div class="container mb-4 mt-4">
        <div class="row">
          ${data.check_in_time ? `
          <div class="col-md-6 mb-3 mb-md-0">
            <div class="card green-card">
              <div class="card-body">
                <div class="row">
                  <div class="col-md-6">
                    <h6 class="card-subtitle mb-2 text-white">Check-in Date</h6>
                    <p class="card-text">${formatDateTime(data.check_in_time)}</p>
                  </div>
                  <div class="col-md-6">
                    <h6 class="card-subtitle mb-2 text-white">User Name</h6>
                    <p class="card-text">${data.check_in_user || '-'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          ` : ''}

          ${data.Request_status === 'Closed' && data.check_out_time ? `
          <div class="col-md-6">
            <div class="card red-card">
              <div class="card-body">
                <div class="row">
                  <div class="col-md-6">
                    <h6 class="card-subtitle mb-2 text-white">Check-out Date</h6>
                    <p class="card-text">${formatDateTime(data.check_out_time)}</p>
                  </div>
                  <div class="col-md-6">
                    <h6 class="card-subtitle mb-2 text-white">User Name</h6>
                    <p class="card-text">${data.check_out_user || '-'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          ` : ''}
        </div>
      </div>

      <div class="col-md-3">
        <div class="card pink-card">
          <h6 class="text-white" style="text-align:center; margin:0;">Status: ${getStatusText()}</h6>
        </div>
      </div>
      <br>

      <!-- Request Metadata Details Section -->
      <div class="row">
        <div class="col-12">
          <div class="confirm-pg-section">
            <div class="row">
              <div class="col-md-6">
                <div class="confirm-pg-label">Request Date</div>
                <div class="confirm-pg-value">${formatDateOnly(data.Request_Date)}</div>
              </div>
              <div class="col-md-6">
                <div class="confirm-pg-label">Project Name</div>
                <div class="confirm-pg-value">${data.Company_Name || '-'}</div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <div class="confirm-pg-label">Contractor</div>
                <div class="confirm-pg-value">${data.subContractorName || '-'}</div>
              </div>
              <div class="col-md-6">
                <div class="confirm-pg-label">Subcontractor</div>
                <div class="confirm-pg-value">${data.new_sub_contractor || '-'}</div>
              </div>
            </div>
            <div class="row mt-4">
              <div class="col-md-6">
                <div class="confirm-pg-label">Foreman-Supervision</div>
                <div class="confirm-pg-value">${data.Foreman || '-'}</div>
              </div>
              <div class="col-md-6">
                <div class="confirm-pg-label">Foreman-Phone</div>
                <div class="confirm-pg-value">${data.Foreman_Phone_Number || '-'}</div>
              </div>
            </div>
            <div class="row mt-4">
              <div class="col-md-4">
                <div class="confirm-pg-label">Activity</div>
                <div class="confirm-pg-value">${data.Activity || '-'}</div>
              </div>
              <div class="col-md-4">
                <div class="confirm-pg-label">Type of Activity</div>
                <div class="confirm-pg-value">${data.activityName || '-'}</div>
              </div>
              <div class="col-md-4">
                <div class="confirm-pg-label">RAMS Number</div>
                <div class="confirm-pg-value">${data.rams_number && data.rams_number !== 'undefined' ? data.rams_number : '-'}</div>
              </div>
            </div>

            <!-- Attached Files (RAMS Files) -->
            <div class="col-md-12 mt-4 p-0">
              <div class="confirm-pg-label mb-2">Attached Files</div>
              ${data.files && data.files.length > 0 ? `
              <div class="row">
                ${data.files.map((file: any) => {
                  const filename = file.ramsFile ? file.ramsFile.split('/').pop() : 'Attachment';
                  return `
                  <div class="col-md-3">
                    <a href="/requests/files/${file.ramsFileId}" target="_blank" style="text-decoration:none;">
                      <div class="confirm-pg-attach-wrapper">
                        <div class="confirm-pg-attach-icon mb-2">
                          ${attachFileIcon ? `<img src="${attachFileIcon}" class="confirm-pg-attach-img">` : ''}
                        </div>
                        <span class="confirm-pg-attach-text">Download ${filename}</span>
                      </div>
                    </a>
                  </div>
                  `;
                }).join('')}
              </div>
              ` : '<p>No file found..</p>'}
            </div>

            <div class="row mt-4">
              <div class="col-md-3">
                <div class="confirm-pg-label">Permit Type</div>
                <div class="confirm-pg-value">${data.permit_type || '-'}</div>
              </div>
              <div class="col-md-3">
                <div class="confirm-pg-label">Permit Under</div>
                <div class="confirm-pg-value">${data.permit_under || 'Construction'}</div>
              </div>
            </div>
          </div>

          <!-- Description of Activity Section -->
          <div class="confirm-pg-section">
            <div class="row">
              <div class="col-md-12">
                <div class="confirm-pg-label">Description of activity</div>
                <div class="confirm-pg-value" style="white-space: pre-wrap;">${data.description_of_activity || '-'}</div>
              </div>
            </div>
          </div>

          <!-- Schedule and Locations Section -->
          <div class="confirm-pg-section">
            <div class="row">
              <div class="col-md-4">
                <div class="confirm-pg-label">Working Date</div>
                <div class="confirm-pg-value">${formatDateOnly(data.Working_Date)}</div>
              </div>
              <div class="col-md-4">
                <div class="confirm-pg-label">Start Time</div>
                <div class="confirm-pg-value">${formatTimeOnly(data.Start_Time)}</div>
              </div>
              <div class="col-md-4">
                <div class="confirm-pg-label">End Time</div>
                <div class="confirm-pg-value">${formatTimeOnly(data.End_Time)}</div>
              </div>
            </div>
            <div class="row mt-4">
              <div class="col-md-4">
                <div class="confirm-pg-label">Site</div>
                <div class="confirm-pg-value">${data.Company_Name || '-'}</div>
              </div>
              <div class="col-md-4">
                <div class="confirm-pg-label">Building</div>
                <div class="confirm-pg-value">${data.building_name || '-'}</div>
              </div>
              <div class="col-md-4">
                <div class="confirm-pg-label">Level</div>
                <div class="confirm-pg-value">${data.Room_Type || '-'}</div>
              </div>
            </div>
            <div class="row mt-4">
              <div class="col-md-12">
                <div class="confirm-pg-label">Area</div>
                <div class="confirm-pg-value">${data.Room_Nos || '-'}</div>
              </div>
              <div class="col-md-4">
                <div class="confirm-pg-label">Night Shift</div>
                <div class="confirm-pg-value">${Number(data.night_shift) === 1 ? 'YES' : 'No'}</div>
              </div>
              <div class="col-md-4">
                <div class="confirm-pg-label">New Date</div>
                <div class="confirm-pg-value">${data.new_date ? formatDateOnly(data.new_date) : '-'}</div>
              </div>
              <div class="col-md-4">
                <div class="confirm-pg-label">New End Time</div>
                <div class="confirm-pg-value">${data.new_end_time ? formatTimeOnly(data.new_end_time) : '-'}</div>
              </div>
            </div>
          </div>

          <!-- Tools and Machinery Section -->
          <div class="confirm-pg-section">
            <div class="row">
              <div class="col-md-6">
                <div class="confirm-pg-label">Tools Used</div>
                <div class="confirm-pg-value">${data.Tools || '-'}</div>
              </div>
              <div class="col-md-6">
                <div class="confirm-pg-label">Machinery used</div>
                <div class="confirm-pg-value">${data.Machinery || '-'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="page-break"></div>

      <!-- General Safety Checklist Table -->
      <section class="confirm-pg-table">
        <table>
          <thead>
            <tr>
              <th class="confirm-pg-question-cell">General Safety Questions</th>
              <th class="confirm-pg-answer-cell">Yes</th>
              <th class="confirm-pg-answer-cell">No</th>
              <th class="confirm-pg-answer-cell">N/A</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="confirm-pg-question-cell">Can you confirm that your work not affecting with other contractors working in this area before starting the work?</td>
              <td class="confirm-pg-answer-cell">${renderCheck(data.affecting_other_contractors, 1)}</td>
              <td class="confirm-pg-answer-cell">${renderCheck(data.affecting_other_contractors, 0)}</td>
              <td class="confirm-pg-answer-cell">${renderCheck(data.affecting_other_contractors, 2)}</td>
            </tr>
            <tr>
              <td class="confirm-pg-question-cell">Are there other conditions that must be taken into account during the work? If Yes, note in "Other conditions"</td>
              <td class="confirm-pg-answer-cell">${renderCheck(data.other_conditions, 1)}</td>
              <td class="confirm-pg-answer-cell">${renderCheck(data.other_conditions, 0)}</td>
              <td class="confirm-pg-answer-cell">${renderCheck(data.other_conditions, 2)}</td>
            </tr>
            ${Number(data.other_conditions) === 1 ? `
            <tr>
              <td colspan="4" class="confirm-pg-question-cell confirm-otherconditions">
                <strong>Note the Other Conditions:</strong> ${data.other_conditions_input || '-'}
              </td>
            </tr>
            ` : ''}
            <tr>
              <td class="confirm-pg-question-cell">Can you confirm that there will be enough work lighting to begin the work?</td>
              <td class="confirm-pg-answer-cell">${renderCheck(data.lighting_begin_work, 1)}</td>
              <td class="confirm-pg-answer-cell">${renderCheck(data.lighting_begin_work, 0)}</td>
              <td class="confirm-pg-answer-cell">${renderCheck(data.lighting_begin_work, 2)}</td>
            </tr>
            <tr>
              <td class="confirm-pg-question-cell">Have the team been informed about the specific risks based on task? (RAMS/Toolbox talk etc.)</td>
              <td class="confirm-pg-answer-cell">${renderCheck(data.specific_risks, 1)}</td>
              <td class="confirm-pg-answer-cell">${renderCheck(data.specific_risks, 0)}</td>
              <td class="confirm-pg-answer-cell">${renderCheck(data.specific_risks, 2)}</td>
            </tr>
            <tr>
              <td class="confirm-pg-question-cell">Is the work environment safely ensured? Have the necessary warning signs been placed?</td>
              <td class="confirm-pg-answer-cell">${renderCheck(data.environment_ensured, 1)}</td>
              <td class="confirm-pg-answer-cell">${renderCheck(data.environment_ensured, 0)}</td>
              <td class="confirm-pg-answer-cell">${renderCheck(data.environment_ensured, 2)}</td>
            </tr>
            <tr>
              <td class="confirm-pg-question-cell">Have the team been informed about the course of action in any emergency situation?</td>
              <td class="confirm-pg-answer-cell">${renderCheck(data.course_of_action || data.course_of_actions, 1)}</td>
              <td class="confirm-pg-answer-cell">${renderCheck(data.course_of_action || data.course_of_actions, 0)}</td>
              <td class="confirm-pg-answer-cell">${renderCheck(data.course_of_action || data.course_of_actions, 2)}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- Hotwork Checklist Section -->
      <section>
        <div class="confirm-pg-table-header confirm-bg-howtowork">
          <div class="header-content">
            <div class="header-left">
              ${imgHotWorks ? `<img src="${imgHotWorks}" alt="HotWorks" class="confirm-pg-work-image">` : ''}
              <span class="confirm-bg-text">Hotwork</span>
            </div>
            <div class="header-radio-group">
              <label class="custom-radio">
                <input type="radio" name="hheader-choice" ${Number(data.Hot_work) === 1 ? 'checked' : ''} disabled>
                <span class="radiomark"></span>
                <span class="radio-label">Yes</span>
              </label>
              <label class="custom-radio">
                <input type="radio" name="hheader-choice" ${Number(data.Hot_work) === 0 ? 'checked' : ''} disabled>
                <span class="radiomark"></span>
                <span class="radio-label">No</span>
              </label>
            </div>
          </div>
        </div>

        ${Number(data.Hot_work) === 1 ? `
        <div class="confirm-pg-table">
          <table>
            <thead>
              <tr>
                <th class="confirm-pg-question-cell"></th>
                <th class="confirm-pg-answer-cell">Yes</th>
                <th class="confirm-pg-answer-cell">No</th>
                <th class="confirm-pg-answer-cell">N/A</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="confirm-pg-question-cell">Are there other tasks in progress in the area?</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.tasks_in_progress_in_the_area, 1)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.tasks_in_progress_in_the_area, 0)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.tasks_in_progress_in_the_area, 2)}</td>
              </tr>
              <tr>
                <td class="confirm-pg-question-cell">Have you considered any alternative methods to the hot work method? (Ex.: replacing the angle grinder with hydraulic cutters or using prefab electronic orders for measurement)</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.lighting_sufficiently, 1)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.lighting_sufficiently, 0)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.lighting_sufficiently, 2)}</td>
              </tr>
              <tr>
                <td class="confirm-pg-question-cell">Have the team been informed about the specific risks based on task? (RAMS/Toolbox talk etc.)</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.spesific_risks_based_on_task, 1)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.spesific_risks_based_on_task, 0)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.spesific_risks_based_on_task, 2)}</td>
              </tr>
              <tr>
                <td class="confirm-pg-question-cell">Is the work environment safely ensured? Have the necessary warning signs been placed?</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.work_environment_safety_ensured, 1)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.work_environment_safety_ensured, 0)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.work_environment_safety_ensured, 2)}</td>
              </tr>
              <tr>
                <td class="confirm-pg-question-cell">Have the team been informed about the course of action in emergencies?</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.course_of_action_in_emergencies, 1)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.course_of_action_in_emergencies, 0)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.course_of_action_in_emergencies, 2)}</td>
              </tr>
              <tr>
                <td class="confirm-pg-question-cell">Should a fire watch be established?</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.fire_watch_establish, 1)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.fire_watch_establish, 0)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.fire_watch_establish, 2)}</td>
              </tr>
              <tr>
                <td class="confirm-pg-question-cell">Can you confirm that the flammable material are removed from the work area?</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.combustible_material, 1)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.combustible_material, 0)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.combustible_material, 2)}</td>
              </tr>
              <tr>
                <td class="confirm-pg-question-cell">Should safety measures implemented to stop sparks from splattering on a flooring or other surfaces?</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.safety_measures, 1)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.safety_measures, 0)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.safety_measures, 2)}</td>
              </tr>
              <tr>
                <td class="confirm-pg-question-cell">Are fire extinguishers and fire blanket ready for use in the area?</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.extinguishers_and_fire_blanket, 1)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.extinguishers_and_fire_blanket, 0)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.extinguishers_and_fire_blanket, 2)}</td>
              </tr>
            </tbody>
          </table>

          <div class="row mt-4">
            <div class="col-6">
              <div class="confirm-pg-section">
                <div class="confirm-pg-label">Is there any welding activity?</div>
                <div class="confirm-pg-value">${Number(data.welding_activitiy) === 1 ? 'Yes' : 'No'}</div>
              </div>
            </div>
            ${Number(data.welding_activitiy) === 1 ? `
            <div class="col-6">
              <table>
                <thead>
                  <tr>
                    <th class="confirm-pg-question-cell"></th>
                    <th class="confirm-pg-answer-cell">Yes</th>
                    <th class="confirm-pg-answer-cell">No</th>
                    <th class="confirm-pg-answer-cell">N/A</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="confirm-pg-question-cell">The people who will do heat treatment, had welder certificates?</td>
                    <td class="confirm-pg-answer-cell">${renderCheck(data.heat_treatment, 1)}</td>
                    <td class="confirm-pg-answer-cell">${renderCheck(data.heat_treatment, 0)}</td>
                    <td class="confirm-pg-answer-cell">${renderCheck(data.heat_treatment, 2)}</td>
                  </tr>
                  <tr>
                    <td class="confirm-pg-question-cell">Should air extraction be established? (Welding fumes directly led to open air)</td>
                    <td class="confirm-pg-answer-cell">${renderCheck(data.air_extraction_be_established, 1)}</td>
                    <td class="confirm-pg-answer-cell">${renderCheck(data.air_extraction_be_established, 0)}</td>
                    <td class="confirm-pg-answer-cell">${renderCheck(data.air_extraction_be_established, 2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            ` : ''}

            <div class="col-6">
              <div class="confirm-pg-section">
                <div class="confirm-pg-label">Is it a low risk hotwork?</div>
                <div class="confirm-pg-value">${Number(data.low_risk_hotwork) === 1 ? 'Yes' : 'No'}</div>
                <div class="confirm-pg-label">Is it a high risk hotwork?</div>
                <div class="confirm-pg-value">${Number(data.high_risk_hotwork) === 1 ? 'Yes' : 'No'}</div>
                <div class="confirm-pg-label">Is hot work checklist filled in?</div>
                <div class="confirm-pg-value">${Number(data.hot_work_checklist_filled) === 1 ? 'Yes' : 'No'}</div>
                <div class="confirm-pg-label">Is fire guard present?</div>
                <div class="confirm-pg-value">${Number(data.fire_guard_present) === 1 ? 'Yes' : 'No'}</div>
              </div>
            </div>
          </div>

          <div class="row mt-4">
            <div class="confirm-pg-section w-100">
              <table>
                <tbody>
                  <tr>
                    <td class="confirm-pg-question-cell"><b>Status</b></td>
                    <td class="confirm-pg-question-cell">${data.Request_status || '-'}</td>
                    <td rowspan="3" colspan="2" class="text-center">
                      ${data.fire_image ? `<img src="${getFireImageUrl(data.fire_image)}" style="max-width:110px; height:auto; border-radius:8px;">` : ''}
                    </td>
                  </tr>
                  <tr>
                    <td class="confirm-pg-question-cell">Has the work area been inspected for smoldering materials or residual heat?</td>
                    <td class="confirm-pg-answer-cell" colspan="3">
                      ${renderCheck(data.h_heat_source, 1)} Yes &nbsp;
                      ${renderCheck(data.h_heat_source, 0)} No &nbsp;
                      ${renderCheck(data.h_heat_source, 2)} N/A
                    </td>
                  </tr>
                  <tr>
                    <td class="confirm-pg-question-cell">Have all tools and hot work equipment been safely removed from the work area?</td>
                    <td class="confirm-pg-answer-cell" colspan="3">
                      ${renderCheck(data.h_workplace_check, 1)} Yes &nbsp;
                      ${renderCheck(data.h_workplace_check, 0)} No &nbsp;
                      ${renderCheck(data.h_workplace_check, 2)} N/A
                    </td>
                  </tr>
                  <tr>
                    <td class="confirm-pg-question-cell">Has the area been cleaned and restored to its original safe condition?</td>
                    <td class="confirm-pg-answer-cell" colspan="3">
                      ${renderCheck(data.h_fire_detectors, 1)} Yes &nbsp;
                      ${renderCheck(data.h_fire_detectors, 0)} No &nbsp;
                      ${renderCheck(data.h_fire_detectors, 2)} N/A
                    </td>
                  </tr>
                  <tr>
                    <td class="confirm-pg-question-cell">1hr Check time</td>
                    <td class="confirm-pg-answer-cell" colspan="3">${data.h_start_time && data.h_start_time !== '1970' ? data.h_start_time : 'N/A'}</td>
                  </tr>
                  <tr>
                    <td class="confirm-pg-question-cell">3hrs Check time</td>
                    <td class="confirm-pg-answer-cell" colspan="3">${data.h_end_time && data.h_end_time !== '1970' ? data.h_end_time : 'N/A'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="page-break"></div>
        ` : ''}
      </section>

      <!-- Temporary Site Electrical Systems -->
      <section>
        <div class="confirm-pg-table-header confirm-bg-ElectricalSystems">
          <div class="header-content">
            <div class="header-left">
              ${imgElectricalSystems ? `<img src="${imgElectricalSystems}" alt="ElectricalSystems" class="confirm-pg-work-image">` : ''}
              <span class="confirm-bg-text">Working on Site Temporary Electrical Systems</span>
            </div>
            <div class="header-radio-group">
              <label class="custom-radio">
                <input type="radio" name="wheader-choice" ${Number(data.working_on_electrical_system) === 1 ? 'checked' : ''} disabled>
                <span class="radiomark"></span>
                <span class="radio-label">Yes</span>
              </label>
              <label class="custom-radio">
                <input type="radio" name="wheader-choice" ${Number(data.working_on_electrical_system) === 0 ? 'checked' : ''} disabled>
                <span class="radiomark"></span>
                <span class="radio-label">No</span>
              </label>
            </div>
          </div>
        </div>

        ${Number(data.working_on_electrical_system) === 1 ? `
        <div class="confirm-pg-table content">
          <table>
            <thead>
              <tr>
                <th class="confirm-pg-question-cell"></th>
                <th class="confirm-pg-answer-cell">Yes</th>
                <th class="confirm-pg-answer-cell">No</th>
                <th class="confirm-pg-answer-cell">N/A</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="confirm-pg-question-cell">Is the responsible for the area informed?</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.responsible_for_the_informed, 1)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.responsible_for_the_informed, 0)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.responsible_for_the_informed, 2)}</td>
              </tr>
              <tr>
                <td class="confirm-pg-question-cell">Check if the board is de-energized - is it de-energized?</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.de_energized, 1)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.de_energized, 0)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.de_energized, 2)}</td>
              </tr>
              <tr>
                <td class="confirm-pg-question-cell">Do you have risk assessment done RAMS?</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.do_risk_assessment, 1)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.do_risk_assessment, 0)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.do_risk_assessment, 2)}</td>
              </tr>
              <tr>
                <td class="confirm-pg-question-cell">Secure the area against reconnection using LOTO (Lock-out/Tag-out) with at least a craftsman's padlock.</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.if_no_loto, 1)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.if_no_loto, 0)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.if_no_loto, 2)}</td>
              </tr>
              <tr>
                <td class="confirm-pg-question-cell">Do appliances/devices that run on electricity have insulation?</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.electricity_have_isulation, 1)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.electricity_have_isulation, 0)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.electricity_have_isulation, 2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="page-break"></div>
        ` : ''}
      </section>

      <!-- Working with Hazardous Substances/Chemicals -->
      <section>
        <div class="confirm-pg-table-header confirm-bg-hazardous">
          <div class="header-content">
            <div class="header-left">
              ${imgSubstanceChemical ? `<img src="${imgSubstanceChemical}" alt="Substances/Chemicals" class="confirm-pg-work-image">` : ''}
              <span class="confirm-bg-text">Working with Hazardous Substances/Chemicals</span>
            </div>
            <div class="header-radio-group">
              <label class="custom-radio">
                <input type="radio" name="whheader-choice" ${Number(data.working_hazardious_substen) === 1 ? 'checked' : ''} disabled>
                <span class="radiomark"></span>
                <span class="radio-label">Yes</span>
              </label>
              <label class="custom-radio">
                <input type="radio" name="whheader-choice" ${Number(data.working_hazardious_substen) === 0 ? 'checked' : ''} disabled>
                <span class="radiomark"></span>
                <span class="radio-label">No</span>
              </label>
            </div>
          </div>
        </div>

        ${Number(data.working_hazardious_substen) === 1 ? `
        <div class="confirm-pg-table content">
          <table>
            <thead>
              <tr>
                <th class="confirm-pg-question-cell"></th>
                <th class="confirm-pg-answer-cell">Yes</th>
                <th class="confirm-pg-answer-cell">No</th>
                <th class="confirm-pg-answer-cell">N/A</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="confirm-pg-question-cell">Relevant MAL-codes and safety datasheets for hazardous medias have been presented?</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.relevant_mal, 1)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.relevant_mal, 0)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.relevant_mal, 2)}</td>
              </tr>
              <tr>
                <td class="confirm-pg-question-cell">Is MSDS (Material Safety Data Sheet) submitted?</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.msds, 1)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.msds, 0)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.msds, 2)}</td>
              </tr>
              <tr>
                <td class="confirm-pg-question-cell">Has the use of protective equipment been taken into account - and are they present?</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.equipment_taken_account, 1)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.equipment_taken_account, 0)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.equipment_taken_account, 2)}</td>
              </tr>
              <tr>
                <td class="confirm-pg-question-cell">Has the use of ventilation been taken into account?</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.ventilation, 1)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.ventilation, 0)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.ventilation, 2)}</td>
              </tr>
              <tr>
                <td class="confirm-pg-question-cell">Will the hazardous substances affect people outside the working area? (fumes)</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.hazardaus_substances, 1)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.hazardaus_substances, 0)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.hazardaus_substances, 2)}</td>
              </tr>
              <tr>
                <td class="confirm-pg-question-cell">Are there means for safe storage and disposal? Is it mapped on the site plan (in case of large amount or long term storage)</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.storage_and_disposal, 1)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.storage_and_disposal, 0)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.storage_and_disposal, 2)}</td>
              </tr>
              <tr>
                <td class="confirm-pg-question-cell">Are the spill kits in place and reachable in case of a leak or spill?</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.reachable_case, 1)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.reachable_case, 0)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.reachable_case, 2)}</td>
              </tr>
              <tr>
                <td class="confirm-pg-question-cell">Is RAMS (Risk assessment and Method statement) covering chemicals risk assessment for working with the substance?</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.checical_risk_assessment, 1)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.checical_risk_assessment, 0)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.checical_risk_assessment, 2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="page-break"></div>
        ` : ''}
      </section>

      <!-- Pressure Testing of Equipment -->
      ${data.permit_type === 'Commissioning' ? `
      <section>
        <div class="confirm-pg-table-header confirm-bg-testingequipment">
          <div class="header-content">
            <div class="header-left">
              ${imgTestingEquipment ? `<img src="${imgTestingEquipment}" alt="Pressure testing of equipment" class="confirm-pg-work-image">` : ''}
              <span class="confirm-bg-text">Pressure testing of equipment</span>
            </div>
            <div class="header-radio-group">
              <label class="custom-radio">
                <input type="radio" name="prheader-choice" ${Number(data.pressure_testing_of_equipment) === 1 ? 'checked' : ''} disabled>
                <span class="radiomark"></span>
                <span class="radio-label">Yes</span>
              </label>
              <label class="custom-radio">
                <input type="radio" name="prheader-choice" ${Number(data.pressure_testing_of_equipment) === 0 ? 'checked' : ''} disabled>
                <span class="radiomark"></span>
                <span class="radio-label">No</span>
              </label>
            </div>
          </div>
        </div>

        ${Number(data.pressure_testing_of_equipment) === 1 ? `
        <div class="confirm-pg-table content">
          <table>
            <thead>
              <tr>
                <th class="confirm-pg-question-cell"></th>
                <th class="confirm-pg-answer-cell">Yes</th>
                <th class="confirm-pg-answer-cell">No</th>
                <th class="confirm-pg-answer-cell">N/A</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="confirm-pg-question-cell">Linewalk of the pipework/equipment done?</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.line_walk, 1)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.line_walk, 0)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.line_walk, 2)}</td>
              </tr>
              <tr>
                <td class="confirm-pg-question-cell">Pressure test is coordinated with NNE C&Q?</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.pressure_test_coordinated, 1)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.pressure_test_coordinated, 0)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.pressure_test_coordinated, 2)}</td>
              </tr>
              <tr>
                <td class="confirm-pg-question-cell">Is the pipework/equipment MIC? (Mechanical Installation Complete)?</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.pipework_mic, 1)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.pipework_mic, 0)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.pipework_mic, 2)}</td>
              </tr>
              <tr>
                <td class="confirm-pg-question-cell">LOTO plan attached to the work permit?</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.loto_plan_attached, 1)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.loto_plan_attached, 0)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.loto_plan_attached, 2)}</td>
              </tr>
              <tr>
                <td class="confirm-pg-question-cell">Is the exclusion zone calculated and layout attached to work permit?</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.exclusion_zone_calculated, 1)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.exclusion_zone_calculated, 0)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.exclusion_zone_calculated, 2)}</td>
              </tr>
              <tr>
                <td class="confirm-pg-question-cell">Pneumatic test?</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.pneumatic_hydrostatic, 1)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.pneumatic_hydrostatic, 0)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.pneumatic_hydrostatic, 2)}</td>
              </tr>
              ${Number(data.pneumatic_hydrostatic) === 1 ? `
              <tr>
                <td colspan="4" class="confirm-pg-question-cell">
                  Pressure of the test: ${data.pressure_pneumatic || '-'} BarG
                </td>
              </tr>
              ` : ''}
              <tr>
                <td class="confirm-pg-question-cell">Hydrostatic test?</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.pressure_of_the_test, 1)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.pressure_of_the_test, 0)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.pressure_of_the_test, 2)}</td>
              </tr>
              ${Number(data.pressure_of_the_test) === 1 ? `
              <tr>
                <td colspan="4" class="confirm-pg-question-cell">
                  Pressure of the test: ${data.pressure_hydrostatic || '-'} BarG
                </td>
              </tr>
              ` : ''}
              <tr>
                <td class="confirm-pg-question-cell">Safety Valves are calibrated and attached to the Pressure testing rig?</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.safety_valves_calibrated, 1)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.safety_valves_calibrated, 0)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.safety_valves_calibrated, 2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="page-break"></div>
        ` : ''}
      </section>
      ` : ''}

      <!-- Working at Height -->
      <section>
        <div class="confirm-pg-table-header confirm-bg-WorkingAtHight">
          <div class="header-content">
            <div class="header-left">
              ${imgWorkingAtHight ? `<img src="${imgWorkingAtHight}" alt="Working at Height" class="confirm-pg-work-image">` : ''}
              <span class="confirm-bg-text">Working at Height</span>
            </div>
            <div class="header-radio-group">
              <label class="custom-radio">
                <input type="radio" name="waheader-choice" ${Number(data.working_at_height) === 1 ? 'checked' : ''} disabled>
                <span class="radiomark"></span>
                <span class="radio-label">Yes</span>
              </label>
              <label class="custom-radio">
                <input type="radio" name="waheader-choice" ${Number(data.working_at_height) === 0 ? 'checked' : ''} disabled>
                <span class="radiomark"></span>
                <span class="radio-label">No</span>
              </label>
            </div>
          </div>
        </div>

        ${Number(data.working_at_height) === 1 ? `
        <div class="confirm-pg-table content">
          <table>
            <thead>
              <tr>
                <th class="confirm-pg-question-cell"></th>
                <th class="confirm-pg-answer-cell">Yes</th>
                <th class="confirm-pg-answer-cell">No</th>
                <th class="confirm-pg-answer-cell">N/A</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="confirm-pg-question-cell">Has the working area been segregated or demarcated with hand barriers?</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.segragated_demarkated, 1)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.segragated_demarkated, 0)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.segragated_demarkated, 2)}</td>
              </tr>
              <tr>
                <td class="confirm-pg-question-cell">Are suitable anchor points in place for lanyard attachments?</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.lanyard_attachments, 1)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.lanyard_attachments, 0)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.lanyard_attachments, 2)}</td>
              </tr>
              <tr>
                <td class="confirm-pg-question-cell">In case of emergency is there a rescue plan in place?</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.rescue_plan, 1)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.rescue_plan, 0)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.rescue_plan, 2)}</td>
              </tr>
              <tr>
                <td class="confirm-pg-question-cell">Has the work been planned and coordinated to avoid hazards like (falling objects/materials onto other workers, interference between the machines etc.)</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.avoid_hazards, 1)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.avoid_hazards, 0)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.avoid_hazards, 2)}</td>
              </tr>
              <tr>
                <td class="confirm-pg-question-cell">Has the team had certified working at height training?</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.height_training, 1)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.height_training, 0)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.height_training, 2)}</td>
              </tr>
              <tr>
                <td class="confirm-pg-question-cell">Will this work be carried out by, and under the supervision of personnel who have received 'Working at Height' training?</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.supervision, 1)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.supervision, 0)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.supervision, 2)}</td>
              </tr>
              <tr>
                <td class="confirm-pg-question-cell">Full body harness with fall-preventing system deployed & twin lanyard provided?</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.shock_absorbing, 1)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.shock_absorbing, 0)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.shock_absorbing, 2)}</td>
              </tr>
              <tr>
                <td class="confirm-pg-question-cell">Are the working at height equipments (Safety harness and lanyard) inspected and suitable to carry out the task?</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.height_equipments, 1)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.height_equipments, 0)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.height_equipments, 2)}</td>
              </tr>
              <tr>
                <td class="confirm-pg-question-cell">Horizontal or vertical life line systems in place?</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.vertical_life, 1)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.vertical_life, 0)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.vertical_life, 2)}</td>
              </tr>
              <tr>
                <td class="confirm-pg-question-cell">Are all tools secured from falling from height?</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.secured_falling, 1)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.secured_falling, 0)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.secured_falling, 2)}</td>
              </tr>
              <tr>
                <td class="confirm-pg-question-cell">Have protective measures for dropped objects been established? Eg. (lanyards, demarcated working area, nets)?</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.dropped_objects, 1)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.dropped_objects, 0)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.dropped_objects, 2)}</td>
              </tr>
              <tr>
                <td class="confirm-pg-question-cell">Has proper and safe access and egress been ensured?</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.safe_acces, 1)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.safe_acces, 0)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.safe_acces, 2)}</td>
              </tr>
              <tr>
                <td class="confirm-pg-question-cell">Are the weather conditions acceptable?</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.weather_acceptable, 1)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.weather_acceptable, 0)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.weather_acceptable, 2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="page-break"></div>
        ` : ''}
      </section>

      <!-- Working in Confined Space -->
      <section>
        <div class="confirm-pg-table-header confirm-bg-ConfinedSpace">
          <div class="header-content">
            <div class="header-left">
              ${imgConfinedSpace ? `<img src="${imgConfinedSpace}" alt="ConfinedSpace" class="confirm-pg-work-image">` : ''}
              <span class="confirm-bg-text">Working in Confined Space</span>
            </div>
            <div class="header-radio-group">
              <label class="custom-radio">
                <input type="radio" name="wcheader-choice" ${Number(data.working_confined_spaces) === 1 ? 'checked' : ''} disabled>
                <span class="radiomark"></span>
                <span class="radio-label">Yes</span>
              </label>
              <label class="custom-radio">
                <input type="radio" name="wcheader-choice" ${Number(data.working_confined_spaces) === 0 ? 'checked' : ''} disabled>
                <span class="radiomark"></span>
                <span class="radio-label">No</span>
              </label>
            </div>
          </div>
        </div>

        ${Number(data.working_confined_spaces) === 1 ? `
        <div class="confirm-pg-table content">
          <table>
            <thead>
              <tr>
                <th class="confirm-pg-question-cell"></th>
                <th class="confirm-pg-answer-cell">Yes</th>
                <th class="confirm-pg-answer-cell">No</th>
                <th class="confirm-pg-answer-cell">N/A</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="confirm-pg-question-cell">Is the tank/container cleaned so that the task can take place without risk from vapours, gases etc.?</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.vapours_gases, 1)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.vapours_gases, 0)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.vapours_gases, 2)}</td>
              </tr>
              <tr>
                <td class="confirm-pg-question-cell">Are oxygen measurement and LEL measurement done before starting the work?</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.lel_measurement, 1)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.lel_measurement, 0)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.lel_measurement, 2)}</td>
              </tr>
              <tr>
                <td class="confirm-pg-question-cell">Are the container and all equipment on the container, including agitator properly secured?</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.all_equipment, 1)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.all_equipment, 0)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.all_equipment, 2)}</td>
              </tr>
              <tr>
                <td class="confirm-pg-question-cell">Are there safe entry and exit conditions? (e.g. ladder)</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.exit_conditions, 1)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.exit_conditions, 0)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.exit_conditions, 2)}</td>
              </tr>
              <tr>
                <td class="confirm-pg-question-cell">Are means of communication for emergency rescue determined? (Siren, radio or telephone options)</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.communication_emergency, 1)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.communication_emergency, 0)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.communication_emergency, 2)}</td>
              </tr>
              <tr>
                <td class="confirm-pg-question-cell">Are rescue equipments for use in place and ready?</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.rescue_equipments, 1)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.rescue_equipments, 0)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.rescue_equipments, 2)}</td>
              </tr>
              <tr>
                <td class="confirm-pg-question-cell">Are space and ventilation adequate?</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.space_ventilation, 1)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.space_ventilation, 0)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.space_ventilation, 2)}</td>
              </tr>
              <tr>
                <td class="confirm-pg-question-cell">Is an oxygen meter provided for the work?</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.oxygen_meter, 1)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.oxygen_meter, 0)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.oxygen_meter, 2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="page-break"></div>
        ` : ''}
      </section>

      <!-- Excavation Works -->
      <section>
        <div class="confirm-pg-table-header confirm-bg-ExcavationWorks">
          <div class="header-content">
            <div class="header-left">
              ${imgExcavationWorks ? `<img src="${imgExcavationWorks}" alt="ExcavationWorks" class="confirm-pg-work-image">` : ''}
              <span class="confirm-bg-text">Excavation Works</span>
            </div>
            <div class="header-radio-group">
              <label class="custom-radio">
                <input type="radio" name="ewheader-choice" ${Number(data.excavation_works) === 1 ? 'checked' : ''} disabled>
                <span class="radiomark"></span>
                <span class="radio-label">Yes</span>
              </label>
              <label class="custom-radio">
                <input type="radio" name="ewheader-choice" ${Number(data.excavation_works) === 0 ? 'checked' : ''} disabled>
                <span class="radiomark"></span>
                <span class="radio-label">No</span>
              </label>
            </div>
          </div>
        </div>

        ${Number(data.excavation_works) === 1 ? `
        <div class="confirm-pg-table content">
          <table>
            <thead>
              <tr>
                <th class="confirm-pg-question-cell"></th>
                <th class="confirm-pg-answer-cell">Yes</th>
                <th class="confirm-pg-answer-cell">No</th>
                <th class="confirm-pg-answer-cell">N/A</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="confirm-pg-question-cell">Is the excavation area segregated (1 meter from edge with hard barriers or 2 meters with soft barriers) before the work begins?</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.excavation_segregated, 1)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.excavation_segregated, 0)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.excavation_segregated, 2)}</td>
              </tr>
              <tr>
                <td class="confirm-pg-question-cell">Has the digging permit been obtained in accordance with Danish regulations and NN standards?</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.nn_standards, 1)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.nn_standards, 0)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.nn_standards, 2)}</td>
              </tr>
              <tr>
                <td class="confirm-pg-question-cell">Does excavation require shoring?</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.excavation_shoring, 1)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.excavation_shoring, 0)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.excavation_shoring, 2)}</td>
              </tr>
              <tr>
                <td class="confirm-pg-question-cell">Is the sloping correct in relation to the depth of the dig as per Danish regulations?</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.danish_regulation, 1)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.danish_regulation, 0)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.danish_regulation, 2)}</td>
              </tr>
              <tr>
                <td class="confirm-pg-question-cell">Have proper and safe access and egress been provided?</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.safe_access_and_egress, 1)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.safe_access_and_egress, 0)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.safe_access_and_egress, 2)}</td>
              </tr>
              <tr>
                <td class="confirm-pg-question-cell">Are correctly positioned ladders or correctly sloped stairways accessible?</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.correctly_sloped, 1)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.correctly_sloped, 0)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.correctly_sloped, 2)}</td>
              </tr>
              <tr>
                <td class="confirm-pg-question-cell">Does all machines have valid inspection dates?</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.inspection_dates, 1)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.inspection_dates, 0)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.inspection_dates, 2)}</td>
              </tr>
              <tr>
                <td class="confirm-pg-question-cell">Have clearly marked drawings been submitted?</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.marked_drawings, 1)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.marked_drawings, 0)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.marked_drawings, 2)}</td>
              </tr>
              <tr>
                <td class="confirm-pg-question-cell">Are the underground areas cleared from all electrical, piping and other services?</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.underground_areas_cleared, 1)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.underground_areas_cleared, 0)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.underground_areas_cleared, 2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="page-break"></div>
        ` : ''}
      </section>

      <!-- Crane and Lifting Operations -->
      <section>
        <div class="confirm-pg-table-header confirm-bg-Craneslifting">
          <div class="header-content">
            <div class="header-left">
              ${imgCranesLifting ? `<img src="${imgCranesLifting}" alt="CranesLifting" class="confirm-pg-work-image">` : ''}
              <span class="confirm-bg-text">Using Crane or Lifting</span>
            </div>
            <div class="header-radio-group">
              <label class="custom-radio">
                <input type="radio" name="crheader-choice" ${Number(data.using_cranes_or_lifting) === 1 ? 'checked' : ''} disabled>
                <span class="radiomark"></span>
                <span class="radio-label">Yes</span>
              </label>
              <label class="custom-radio">
                <input type="radio" name="crheader-choice" ${Number(data.using_cranes_or_lifting) === 0 ? 'checked' : ''} disabled>
                <span class="radiomark"></span>
                <span class="radio-label">No</span>
              </label>
            </div>
          </div>
        </div>

        ${Number(data.using_cranes_or_lifting) === 1 ? `
        <div class="confirm-pg-table content">
          <table>
            <thead>
              <tr>
                <th class="confirm-pg-question-cell"></th>
                <th class="confirm-pg-answer-cell">Yes</th>
                <th class="confirm-pg-answer-cell">No</th>
                <th class="confirm-pg-answer-cell">N/A</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="confirm-pg-question-cell">Is there an appointed person in charge of the lifting/crane operation?</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.appointed_person, 1)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.appointed_person, 0)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.appointed_person, 2)}</td>
              </tr>
              <tr>
                <td class="confirm-pg-question-cell">Are the details of load (dimensions, SWL) and the loading/unloading requirements provided from vendor or supplier?</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.vendor_supplier || data.vendor_supplies, 1)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.vendor_supplier || data.vendor_supplies, 0)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.vendor_supplier || data.vendor_supplies, 2)}</td>
              </tr>
              <tr>
                <td class="confirm-pg-question-cell">Is lift plan submitted?</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.lift_plan, 1)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.lift_plan, 0)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.lift_plan, 2)}</td>
              </tr>
              <tr>
                <td class="confirm-pg-question-cell">Has the correct crane/lifting equipment as stated in the lift plan been supplied and inspected?</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.supplied_and_inspected, 1)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.supplied_and_inspected, 0)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.supplied_and_inspected, 2)}</td>
              </tr>
              <tr>
                <td class="confirm-pg-question-cell">Do the crane operators have the legal required certificates?</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.legal_required_certificates, 1)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.legal_required_certificates, 0)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.legal_required_certificates, 2)}</td>
              </tr>
              <tr>
                <td class="confirm-pg-question-cell">Is laydown area suitable and prepared for lifting?</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.prapared_lifting, 1)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.prapared_lifting, 0)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.prapared_lifting, 2)}</td>
              </tr>
              <tr>
                <td class="confirm-pg-question-cell">Is the entire area of the lifting task fenced off?</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.lifting_task_fenced, 1)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.lifting_task_fenced, 0)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.lifting_task_fenced, 2)}</td>
              </tr>
              <tr>
                <td class="confirm-pg-question-cell">Have all overhead risks (cables, adjacent structures etc) been identified and suitable precautions implemented?</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.overhead_risks, 1)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.overhead_risks, 0)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.overhead_risks, 2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="page-break"></div>
        ` : ''}
      </section>

      <!-- Energising, Isolating and Working on Live Electrical Systems -->
      ${data.permit_type === 'Commissioning' ? `
      <section>
        <div class="confirm-pg-table-header confirm-bg-poweron">
          <div class="header-content">
            <div class="header-left">
              ${imgElectricalWorks ? `<img src="${imgElectricalWorks}" alt="ElectricalWorks" class="confirm-pg-work-image">` : ''}
              <span class="confirm-bg-text">Energising, Isolating and Working on Live Electrical Systems</span>
            </div>
            <div class="header-radio-group">
              <label class="custom-radio">
                <input type="radio" name="powheader-choice" ${Number(data.power_on) === 1 ? 'checked' : ''} disabled>
                <span class="radiomark"></span>
                <span class="radio-label">Yes</span>
              </label>
              <label class="custom-radio">
                <input type="radio" name="powheader-choice" ${Number(data.power_on) === 0 ? 'checked' : ''} disabled>
                <span class="radiomark"></span>
                <span class="radio-label">No</span>
              </label>
            </div>
          </div>
        </div>

        ${Number(data.power_on) === 1 ? `
        <!-- Sub-section: Energising Electrical Equipment -->
        <div class="confirm-pg-table-header confirm-bg-poweron">
          <div class="header-content">
            <span class="confirm-bg-text">Energising Electrical Equipment</span>
            <div class="header-radio-group">
              <label class="custom-radio">
                <input type="radio" name="eeheader-choice" ${Number(data.energising_equipment) === 1 ? 'checked' : ''} disabled>
                <span class="radiomark"></span>
                <span class="radio-label">Yes</span>
              </label>
              <label class="custom-radio">
                <input type="radio" name="eeheader-choice" ${Number(data.energising_equipment) === 0 ? 'checked' : ''} disabled>
                <span class="radiomark"></span>
                <span class="radio-label">No</span>
              </label>
            </div>
          </div>
        </div>

        ${Number(data.energising_equipment) === 1 ? `
        <div class="confirm-pg-table content">
          <table>
            <thead>
              <tr>
                <th class="confirm-pg-question-cell"></th>
                <th class="confirm-pg-answer-cell">Yes</th>
                <th class="confirm-pg-answer-cell">No</th>
                <th class="confirm-pg-answer-cell">N/A</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="confirm-pg-question-cell">Is the responsible for the area informed?</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.responsible_for_the_area, 1)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.responsible_for_the_area, 0)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.responsible_for_the_area, 2)}</td>
              </tr>
              <tr>
                <td class="confirm-pg-question-cell">Do you have a risk assessment done?</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.risk_assessment_done, 1)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.risk_assessment_done, 0)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.risk_assessment_done, 2)}</td>
              </tr>
              <tr>
                <td class="confirm-pg-question-cell">Barriers & Signage in place?</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.barriers_signage, 1)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.barriers_signage, 0)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.barriers_signage, 2)}</td>
              </tr>
              <tr>
                <td class="confirm-pg-question-cell">Arc flash boundary and PPE evaluated?</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.arc_flash, 1)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.arc_flash, 0)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.arc_flash, 2)}</td>
              </tr>
              <tr>
                <td class="confirm-pg-question-cell">Have all the cables that need to be energized been tested?</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.energized_been_tested, 1)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.energized_been_tested, 0)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.energized_been_tested, 2)}</td>
              </tr>
              <tr>
                <td class="confirm-pg-question-cell">Have all punches been closed?</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.punches_been_closed, 1)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.punches_been_closed, 0)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.punches_been_closed, 2)}</td>
              </tr>
              <tr>
                <td class="confirm-pg-question-cell">Is Electrical Checklist completed?</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.toct_checklist, 1)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.toct_checklist, 0)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.toct_checklist, 2)}</td>
              </tr>
              <tr>
                <td class="confirm-pg-question-cell">Have you informed and aligned with EL LOTO team and provided them with an energisation request form?</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.informed_aligned, 1)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.informed_aligned, 0)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.informed_aligned, 2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        ` : ''}
        <div class="page-break"></div>

        <!-- Sub-section: Isolating Live Electrical Systems for Maintenance or Modification -->
        <div class="confirm-pg-table-header confirm-bg-poweron">
          <div class="header-content">
            <span class="confirm-bg-text">Isolating Live Electrical Systems for Maintenance or Modification</span>
            <div class="header-radio-group">
              <label class="custom-radio">
                <input type="radio" name="ilheader-choice" ${Number(data.isolating_live) === 1 ? 'checked' : ''} disabled>
                <span class="radiomark"></span>
                <span class="radio-label">Yes</span>
              </label>
              <label class="custom-radio">
                <input type="radio" name="ilheader-choice" ${Number(data.isolating_live) === 0 ? 'checked' : ''} disabled>
                <span class="radiomark"></span>
                <span class="radio-label">No</span>
              </label>
            </div>
          </div>
        </div>

        ${Number(data.isolating_live) === 1 ? `
        <div class="confirm-pg-table content">
          <table>
            <thead>
              <tr>
                <th class="confirm-pg-question-cell"></th>
                <th class="confirm-pg-answer-cell">Yes</th>
                <th class="confirm-pg-answer-cell">No</th>
                <th class="confirm-pg-answer-cell">N/A</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="confirm-pg-question-cell">Is the responsible for the area informed?</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.isolating_resposible || data.isolating_responsible, 1)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.isolating_resposible || data.isolating_responsible, 0)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.isolating_resposible || data.isolating_responsible, 2)}</td>
              </tr>
              <tr>
                <td class="confirm-pg-question-cell">Has a Risk Assessment been completed?</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.isolating_risk_assessment, 1)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.isolating_risk_assessment, 0)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.isolating_risk_assessment, 2)}</td>
              </tr>
              <tr>
                <td class="confirm-pg-question-cell">Have C&Q LOTO been informed and tasks co-ordinated for shutdown work?</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.cq_informed, 1)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.cq_informed, 0)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.cq_informed, 2)}</td>
              </tr>
              <tr>
                <td class="confirm-pg-question-cell">Have C&Q LOTO been provided marked up single line diagrams/electrical drawings?</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.cq_provided, 1)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.cq_provided, 0)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.cq_provided, 2)}</td>
              </tr>
              <tr>
                <td class="confirm-pg-question-cell">Has a De-Energisation Request form and supporting documentation been provided to C&Q LOTO?</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.de_energisation_request, 1)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.de_energisation_request, 0)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.de_energisation_request, 2)}</td>
              </tr>
              <tr>
                <td class="confirm-pg-question-cell">Are all barriers, signage and PPE prepared for the task?</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.ppe_prepared, 1)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.ppe_prepared, 0)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.ppe_prepared, 2)}</td>
              </tr>
              <tr>
                <td class="confirm-pg-question-cell">Has absence of voltage been verified and proven dead?</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.absence_of_voltage, 1)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.absence_of_voltage, 0)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.absence_of_voltage, 2)}</td>
              </tr>
              <tr>
                <td class="confirm-pg-question-cell">Has stored energy been discharged?</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.stored_energy, 1)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.stored_energy, 0)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.stored_energy, 2)}</td>
              </tr>
              <tr>
                <td class="confirm-pg-question-cell">Have any secondary or back up power supplies been confirmed and accounted for?</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.backup_power, 1)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.backup_power, 0)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.backup_power, 2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        ` : ''}
        <div class="page-break"></div>

        <!-- Sub-section: Working on OR near live electrical systems -->
        <div class="confirm-pg-table-header confirm-bg-poweron">
          <div class="header-content">
            <span class="confirm-bg-text">Working on OR near live electrical systems (Live testing, commissioning, fault finding, working inside live enclosures)</span>
            <div class="header-radio-group">
              <label class="custom-radio">
                <input type="radio" name="wlheader-choice" ${Number(data.working_near_live) === 1 ? 'checked' : ''} disabled>
                <span class="radiomark"></span>
                <span class="radio-label">Yes</span>
              </label>
              <label class="custom-radio">
                <input type="radio" name="wlheader-choice" ${Number(data.working_near_live) === 0 ? 'checked' : ''} disabled>
                <span class="radiomark"></span>
                <span class="radio-label">No</span>
              </label>
            </div>
          </div>
        </div>

        ${Number(data.working_near_live) === 1 ? `
        <div class="confirm-pg-table content">
          <table>
            <thead>
              <tr>
                <th class="confirm-pg-question-cell"></th>
                <th class="confirm-pg-answer-cell">Yes</th>
                <th class="confirm-pg-answer-cell">No</th>
                <th class="confirm-pg-answer-cell">N/A</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="confirm-pg-question-cell">Live work is unavoidable and justified?</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.unavoidable, 1)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.unavoidable, 0)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.unavoidable, 2)}</td>
              </tr>
              <tr>
                <td class="confirm-pg-question-cell">De-energisation is not reasonably practicable?</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.reasonably_practicable, 1)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.reasonably_practicable, 0)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.reasonably_practicable, 2)}</td>
              </tr>
              <tr>
                <td class="confirm-pg-question-cell">Live work authorised by electrical responsible person?</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.work_authorised, 1)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.work_authorised, 0)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.work_authorised, 2)}</td>
              </tr>
              <tr>
                <td class="confirm-pg-question-cell">Risk assessment has been completed?</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.working_risk_assessment, 1)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.working_risk_assessment, 0)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.working_risk_assessment, 2)}</td>
              </tr>
              <tr>
                <td class="confirm-pg-question-cell">Arc flash boundary and PPE evaluated?</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.working_arc_boundary, 1)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.working_arc_boundary, 0)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.working_arc_boundary, 2)}</td>
              </tr>
              <tr>
                <td class="confirm-pg-question-cell">Barriers and Signage in place?</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.working_barriers, 1)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.working_barriers, 0)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.working_barriers, 2)}</td>
              </tr>
              <tr>
                <td class="confirm-pg-question-cell">Insulated tools and approved test equipment to be used?</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.insulated_tools, 1)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.insulated_tools, 0)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.insulated_tools, 2)}</td>
              </tr>
              <tr>
                <td class="confirm-pg-question-cell">Work will always be carried out with a second person to assist in the event of an emergency?</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.event_of_emergency, 1)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.event_of_emergency, 0)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.event_of_emergency, 2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        ` : ''}
        <div class="page-break"></div>
        ` : ''}
      </section>
      ` : ''}

      <!-- Energization of Mechanical equipment -->
      ${data.permit_type === 'Commissioning' ? `
      <section>
        <div class="confirm-pg-table-header confirm-bg-pressurization">
          <div class="header-content">
            <div class="header-left">
              ${imgMechanicalWorks ? `<img src="${imgMechanicalWorks}" alt="MechanicalWorks" class="confirm-pg-work-image">` : ''}
              <span class="confirm-bg-text">Energization of Mechanical equipment</span>
            </div>
            <div class="header-radio-group">
              <label class="custom-radio">
                <input type="radio" name="mheader-choice" ${Number(data.pressurization) === 1 ? 'checked' : ''} disabled>
                <span class="radiomark"></span>
                <span class="radio-label">Yes</span>
              </label>
              <label class="custom-radio">
                <input type="radio" name="mheader-choice" ${Number(data.pressurization) === 0 ? 'checked' : ''} disabled>
                <span class="radiomark"></span>
                <span class="radio-label">No</span>
              </label>
            </div>
          </div>
        </div>

        ${Number(data.pressurization) === 1 ? `
        <div class="confirm-pg-table content">
          <table>
            <thead>
              <tr>
                <th class="confirm-pg-question-cell"></th>
                <th class="confirm-pg-answer-cell">Yes</th>
                <th class="confirm-pg-answer-cell">No</th>
                <th class="confirm-pg-answer-cell">N/A</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="confirm-pg-question-cell">Pressure test performed and approved?</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.performed_approved, 1)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.performed_approved, 0)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.performed_approved, 2)}</td>
              </tr>
              <tr>
                <td class="confirm-pg-question-cell">Flushing approved?</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.flushing_approved, 1)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.flushing_approved, 0)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.flushing_approved, 2)}</td>
              </tr>
              <tr>
                <td class="confirm-pg-question-cell">MC approved?</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.mc_approved, 1)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.mc_approved, 0)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.mc_approved, 2)}</td>
              </tr>
              ${Number(data.mc_approved) === 1 ? `
              <tr>
                <td colspan="4" class="confirm-pg-question-cell">
                  MC Number: ${data.mc_number_text || '-'}
                </td>
              </tr>
              ` : ''}
              <tr>
                <td class="confirm-pg-question-cell">Walkdown with Visual inspection performed?</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.visual_inspection, 1)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.visual_inspection, 0)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.visual_inspection, 2)}</td>
              </tr>
              <tr>
                <td class="confirm-pg-question-cell">LOTO plan approved and installed by LOTO officer?</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.loto_plan_approved, 1)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.loto_plan_approved, 0)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.loto_plan_approved, 2)}</td>
              </tr>
              <tr>
                <td class="confirm-pg-question-cell">Ensure Safety Valves follow Media Code?</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.follow_media_code, 1)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.follow_media_code, 0)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.follow_media_code, 2)}</td>
              </tr>
              <tr>
                <td class="confirm-pg-question-cell">C&Q Safety signs are in place?</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.cq_safety_signs, 1)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.cq_safety_signs, 0)}</td>
                <td class="confirm-pg-answer-cell">${renderCheck(data.cq_safety_signs, 2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="page-break"></div>
        ` : ''}
      </section>
      ` : ''}

      <!-- PPE Requirements Cards -->
      <div class="content">
        <div class="confirm-pg-cards-container">
          <div class="row">
            <!-- Mandatory PPE Card -->
            <div class="col-lg-4 col-md-12">
              <div class="confirm-pg-card">
                <div class="confirm-pg-card-header">Mandatory PPE Required:</div>
                <div class="row">
                  <div class="col-6 col-sm-6">
                    <div class="confirm-pg-image-container">
                      <div class="confirm-pg-image-wrapper">
                        ${imgHardHat ? `<img src="${imgHardHat}" alt="HardHat" class="confirm-pg-circular-image">` : ''}
                      </div>
                    </div>
                  </div>
                  <div class="col-6 col-sm-6">
                    <div class="confirm-pg-image-container">
                      <div class="confirm-pg-image-wrapper">
                        ${imgSafetyShoes ? `<img src="${imgSafetyShoes}" alt="Safetyshoes" class="confirm-pg-circular-image">` : ''}
                      </div>
                    </div>
                  </div>
                  <div class="col-6 col-sm-6 mt-4 mb-3">
                    <div class="confirm-pg-image-container">
                      <div class="confirm-pg-image-wrapper">
                        ${imgHighVisibility ? `<img src="${imgHighVisibility}" alt="HighVisibility" class="confirm-pg-circular-image">` : ''}
                      </div>
                    </div>
                  </div>
                  <div class="col-6 col-sm-6 mt-4 mb-3">
                    <div class="confirm-pg-image-container">
                      <div class="confirm-pg-image-wrapper">
                        ${imgLongPants ? `<img src="${imgLongPants}" alt="Longpants" class="confirm-pg-circular-image">` : ''}
                      </div>
                    </div>
                  </div>
                  <div class="col-6 col-sm-6 mt-4 mb-3 mx-auto">
                    <div class="confirm-pg-image-container">
                      <div class="confirm-pg-image-wrapper">
                        ${imgSpecificGloves ? `<img src="${imgSpecificGloves}" alt="SpecificGloves" class="confirm-pg-circular-image">` : ''}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Task Specific PPE Card -->
            <div class="col-lg-8 col-md-12">
              <div class="confirm-pg-card">
                <div class="confirm-pg-card-header">Task Specific PPE Required:</div>
                <div class="row confirm-pg-row">
                  <div class="col-6 col-sm-4 col-lg-3">
                    <div class="confirm-pg-image-container">
                      <div class="confirm-pg-image-wrapper">
                        ${imgEyeProtection ? `<img src="${imgEyeProtection}" alt="Eyeprotection" class="confirm-pg-circular-image">` : ''}
                      </div>
                      <div class="confirm-pg-image-title">Eye Protection</div>
                      <div class="confirm-pg-checkmark">${renderPpeCheck(data.eye_protection)}</div>
                    </div>
                  </div>
                  <div class="col-6 col-sm-4 col-lg-3">
                    <div class="confirm-pg-image-container">
                      <div class="confirm-pg-image-wrapper">
                        ${imgFallProtection ? `<img src="${imgFallProtection}" alt="Fallprotection" class="confirm-pg-circular-image">` : ''}
                      </div>
                      <div class="confirm-pg-image-title">Fall Protection</div>
                      <div class="confirm-pg-checkmark">${renderPpeCheck(data.fall_protection)}</div>
                    </div>
                  </div>
                  <div class="col-6 col-sm-4 col-lg-3">
                    <div class="confirm-pg-image-container">
                      <div class="confirm-pg-image-wrapper">
                        ${imgHearingProtection ? `<img src="${imgHearingProtection}" alt="Hearingprotection" class="confirm-pg-circular-image">` : ''}
                      </div>
                      <div class="confirm-pg-image-title">Hearing Protection</div>
                      <div class="confirm-pg-checkmark">${renderPpeCheck(data.hearing_protection)}</div>
                    </div>
                  </div>
                  <div class="col-6 col-sm-4 col-lg-3">
                    <div class="confirm-pg-image-container">
                      <div class="confirm-pg-image-wrapper">
                        ${imgRespiratoryProtection ? `<img src="${imgRespiratoryProtection}" alt="Respiratoryprotection" class="confirm-pg-circular-image">` : ''}
                      </div>
                      <div class="confirm-pg-image-title">Respiratory Protection</div>
                      <div class="confirm-pg-checkmark">${renderPpeCheck(data.respiratory_protection)}</div>
                    </div>
                  </div>
                </div>

                <div class="mt-2">
                  <div class="confirm-pg-label">Other PPE</div>
                  <div class="confirm-pg-value">${data.other_ppe || 'N/A'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="confirm-pg-section mt-5">
          <div class="confirm-pg-label">Number of workers involved</div>
          <div class="confirm-pg-value">${data.Number_Of_Workers || 'N/A'}</div>
        </div>

        <!-- Notes Section -->
        <div class="confirm-pg-section mt-5">
          <div class="confirm-pg-label">Notes</div>
          ${data.note && data.note.length > 0 ? `
          <div class="text-16 p-1 confirm-pg-table">
            <table>
              <thead>
                <tr>
                  <th>User Name</th>
                  <th>Note</th>
                </tr>
              </thead>
              <tbody>
                ${data.note.map((n: any) => `
                <tr>
                  <td>${n.username || 'System'}</td>
                  <td>${n.note || ''}</td>
                </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          ` : '<p>No notes found.</p>'}
        </div>

        <!-- Safety Precautions Section -->
        <div class="confirm-pg-section mt-5">
          <div class="confirm-pg-label">SAFETY PRECAUTIONS</div>
          ${data.resolvedPrecautions && data.resolvedPrecautions.length > 0 ? `
          <div class="text-16 p-1">
            <ul>
              ${data.resolvedPrecautions.map((p: string) => `<li>${p}</li>`).join('')}
            </ul>
          </div>
          ` : '<p>No precautions assigned.</p>'}
        </div>

        <!-- Commissioning Specifics (Work Type & Modules) -->
        ${data.permit_type === 'Commissioning' ? `
        <div class="confirm-pg-section mt-5">
          <div class="confirm-pg-label">Type of Work</div>
          <div class="confirm-pg-value">${data.work_type || 'N/A'}</div>

          ${data.work_type === 'Mechanical Works' && data.resolvedMechanicalWorks && data.resolvedMechanicalWorks.length > 0 ? `
          <div class="confirm-pg-label mt-4">Module Numbers</div>
          <div class="text-16 p-1">
            ${data.resolvedMechanicalWorks.map((mw: string) => `<p>${mw}</p>`).join('')}
          </div>
          ` : ''}

          ${data.work_type === 'Electrical Works' ? `
            ${data.resolvedPanelNumbers && data.resolvedPanelNumbers.length > 0 ? `
            <div class="confirm-pg-label mt-4">Panel Numbers</div>
            <div class="text-16 p-1">
              ${data.resolvedPanelNumbers.map((pn: string) => `<p>${pn}</p>`).join('')}
            </div>
            ` : ''}
            ${data.resolvedSystemNumbers && data.resolvedSystemNumbers.length > 0 ? `
            <div class="confirm-pg-label mt-4">System Numbers</div>
            <div class="text-16 p-1">
              ${data.resolvedSystemNumbers.map((sn: string) => `<p>${sn}</p>`).join('')}
            </div>
            ` : ''}
          ` : ''}
        </div>
        ` : ''}
      </div>

      <div class="page-break"></div>

      <!-- Signatures / Initials Section -->
      <div class="confirm-pg-section mt-5">
        ${(() => {
          const conm = data.ConM_initials || 'N/A';
          const comm = data.CoMM_initials || 'N/A';
          const pType = data.permit_type;
          const pUnder = data.permit_under;

          if (pType === 'Construction' && pUnder === 'Construction') {
            return `
            <div class="confirm-pg-label">ConM initials</div>
            <div class="confirm-pg-value">${conm}</div>
            `;
          } else if (pType === 'Construction' && pUnder === 'Commissioning') {
            return `
            <div class="confirm-pg-label">ConM initials</div>
            <div class="confirm-pg-value">${conm}</div>
            <div class="confirm-pg-label">C&Q initials</div>
            <div class="confirm-pg-value">${comm}</div>
            `;
          } else if (pType === 'Commissioning' && pUnder === 'Construction') {
            return `
            <div class="confirm-pg-label">C&Q initials</div>
            <div class="confirm-pg-value">${comm}</div>
            <div class="confirm-pg-label">ConM initials</div>
            <div class="confirm-pg-value">${conm}</div>
            `;
          } else if (pType === 'Commissioning' && pUnder === 'Commissioning') {
            return `
            <div class="confirm-pg-label">C&Q initials</div>
            <div class="confirm-pg-value">${comm}</div>
            `;
          } else {
            return `
            <div class="confirm-pg-label">ConM initials</div>
            <div class="confirm-pg-value">${conm}</div>
            `;
          }
        })()}

        <div class="confirm-pg-label">The person responsible for this work</div>
        <div class="confirm-pg-value">${data.ConM_initials1 || 'N/A'}</div>

        <div class="confirm-pg-label">Reject Reason</div>
        <div class="confirm-pg-value">${data.reject_reason || 'N/A'}</div>

        <div class="confirm-pg-label">Cancel Reason</div>
        <div class="confirm-pg-value">${data.cancel_reason || 'N/A'}</div>

        <div class="confirm-pg-label">Close Note</div>
        <div class="confirm-pg-value">${data.close_note || 'N/A'}</div>
      </div>

      <!-- Upload Images Section -->
      <div class="confirm-pg-section mt-5">
        <div class="confirm-pg-label">Upload Images</div>
        ${data.images && data.images.length > 0 ? `
        <div class="row">
          ${data.images.map((img: any, index: number) => `
          <div class="col-md-3 mb-3">
            <a href="#myModal${index}" class="btn p-0" data-toggle="modal">
              <img src="${getCheckImageSrc(img.imageName)}" class="img-thumbnail" style="width:100%; height:150px; object-fit:cover;">
            </a>
            
            <div class="modal fade" id="myModal${index}" tabindex="-1" role="dialog" aria-hidden="true">
              <div class="modal-dialog modal-lg">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title">Enlarged Picture</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                  </div>
                  <div class="modal-body text-center">
                    <img src="${getCheckImageSrc(img.imageName)}" style="max-width:100%; height:auto;">
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          `).join('')}
        </div>
        ` : '<p>No check-in/check-out pictures uploaded.</p>'}
      </div>

      <!-- Attending Toolbox Talk Signatures Table -->
      <div class="confirm-pg-section mt-5">
        <div class="confirm-pg-label">DETAILS OF PERSONS ATTENDING TOOLBOX TALK</div>
        <table class="table table-striped modern-table">
          <tbody>
            <tr>
              <td>Date/Time:</td>
              <td>Toolbox Conducted by:</td>
            </tr>
            ${Array.from({ length: 12 }).map(() => `
            <tr>
              <td>Name:</td>
              <td>Signature:</td>
            </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Download Button Section -->
    <div class="confirm-pg-download-container">
      <button class="confirm-pg-download-btn" onclick="test()">
        <i class="fas fa-download"></i> Download pdf
      </button>
    </div>
  </div>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
  <script>
    function test() {
      var element = document.getElementById('root');
      var name = "${data.PermitNo || 'Permit'}" + ".pdf";
      var opt = {
        margin: [15, 15, 15, 15],
        padding: [15, 15, 15, 15],
        filename: name,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: {
          unit: 'mm',
          format: [330, 483],
          orientation: 'portrait'
        }
      };
      html2pdf().set(opt).from(element).save();
    }
  </script>
</body>
</html>
  `;
}
