import { join } from 'path';
import { getBase64Image } from './image-utils';

export function generateLogsHtml(permitNo: string, logs: any[], images: any[]): string {
  const leftLogo = getBase64Image(join(process.cwd(), './newbeam1/images/left_side.jpeg'));
  const rightLogo = getBase64Image(join(process.cwd(), './newbeam1/images/right_side.jpeg'));

  const formatDate = (dateStr: string | Date) => {
    if (!dateStr) return '-';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return String(dateStr);
      return d.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
      return String(dateStr);
    }
  };

  const formatDateTime = (dateStr: string | Date) => {
    if (!dateStr) return '-';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return String(dateStr);
      return d.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }) + ' ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    } catch {
      return String(dateStr);
    }
  };

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Activity Permit Logs - ${permitNo}</title>
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

    .section-title {
      font-size: 18px;
      color: var(--primary);
      border-bottom: 2px solid #e9ecef;
      padding-bottom: 8px;
      margin-top: 40px;
      margin-bottom: 20px;
      font-weight: 700;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 15px;
      background: #fff;
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid #dee2e6;
      box-shadow: 0 4px 6px rgba(0,0,0,0.01);
    }

    th, td {
      padding: 12px 15px;
      text-align: left;
      border-bottom: 1px solid #dee2e6;
      font-size: 14px;
    }

    th {
      background-color: var(--primary);
      color: var(--accent);
      font-size: 14px;
      font-weight: 700;
    }

    .log-row td {
      font-weight: 600;
      color: #444;
    }

    .log-row:hover td {
      background-color: #f1f3f9;
    }

    .changes-container {
      padding: 15px 25px;
      background-color: #fafbfc;
      border-bottom: 1px solid #dee2e6;
    }

    .changes-table {
      width: 100%;
      margin: 0;
      box-shadow: none;
      border: 1px solid #e9ecef;
    }

    .changes-table th {
      background-color: #edf0f5;
      color: var(--primary);
      font-size: 12px;
      padding: 8px 12px;
    }

    .changes-table td {
      padding: 8px 12px;
      font-size: 13px;
    }

    .badge-status {
      display: inline-block;
      padding: 4px 10px;
      font-size: 11px;
      font-weight: 700;
      border-radius: 20px;
      text-transform: uppercase;
      color: #fff;
      background-color: var(--info);
    }

    .badge-Opened { background-color: var(--info); }
    .badge-Closed { background-color: var(--danger); }
    .badge-Approved { background-color: var(--success); }
    .badge-Draft { background-color: var(--text-muted); }

    .image-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 20px;
      margin-top: 15px;
    }

    .image-card {
      background: #f8f9fa;
      border: 1px solid #dee2e6;
      border-radius: 12px;
      padding: 15px;
      text-align: center;
      box-shadow: 0 4px 6px rgba(0,0,0,0.01);
    }

    .image-card img {
      max-width: 100%;
      height: 150px;
      object-fit: cover;
      border-radius: 8px;
      margin-bottom: 10px;
      border: 1px solid #dee2e6;
    }

    .image-meta {
      font-size: 12px;
      font-weight: 600;
      color: var(--text-muted);
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
      <h1 id="permit-no">PERMIT LOG TIMELINE: ${permitNo}</h1>
    </div>
    <div>
      ${rightLogo ? `<img src="${rightLogo}" alt="Logo Right" class="logo-img">` : ''}
    </div>
  </div>

  <!-- Logs Table -->
  <div class="section-title">Permit Actions Log</div>
  <table>
    <thead>
      <tr>
        <th>Username</th>
        <th>User Type</th>
        <th>Site</th>
        <th>Contractor</th>
        <th>Action Time</th>
        <th>Work Date</th>
        <th>Status Action</th>
      </tr>
    </thead>
    <tbody>
      ${logs.map((log: any) => {
        // Map user type mapping logic from PHP
        let usertype = log.user?.userType || '';
        if (log.system === 1) {
          usertype = 'System Auto Cancel';
        } else {
          const uLower = usertype.toLowerCase().trim();
          if (uLower === 'department') usertype = 'ConM/HSE';
          else if (uLower === 'department1') usertype = 'C&Q';
          else if (uLower === 'subcontractor') usertype = 'Contractor';
        }

        const username = log.system === 1 ? 'NA' : (log.user?.username || 'System');
        const contractor = log.system === 1 ? 'NA' : (log.request?.subcontractor?.subContractorName || '-');

        return `
        <tr class="log-row">
          <td>${username}</td>
          <td>${usertype}</td>
          <td>${log.request?.companyName || '-'}</td>
          <td>${contractor}</td>
          <td>${formatDateTime(log.createdTime)}</td>
          <td>${formatDate(log.request?.workingDate)}</td>
          <td><span class="badge-status badge-${log.requestType}">${log.requestType || 'Created'}</span></td>
        </tr>
        ${log.changes && log.changes.length > 0 ? `
        <tr>
          <td colspan="7" class="changes-container">
            <table class="changes-table">
              <thead>
                <tr>
                  <th>Field Path / Name</th>
                  <th>Previous Value</th>
                  <th>Present Value</th>
                  <th>Changed At</th>
                </tr>
              </thead>
              <tbody>
                ${log.changes.map((chg: any) => `
                <tr>
                  <td><strong>${chg.fieldName}</strong></td>
                  <td>${chg.previous === null || chg.previous === '' ? '<i>Empty</i>' : chg.previous}</td>
                  <td>${chg.present === null || chg.present === '' ? '<i>Empty</i>' : chg.present}</td>
                  <td>${formatDateTime(chg.createdTime)}</td>
                </tr>
                `).join('')}
              </tbody>
            </table>
          </td>
        </tr>
        ` : ''}
        `;
      }).join('')}
    </tbody>
  </table>

  <!-- Uploaded Images Section -->
  ${images && images.length > 0 ? `
  <div class="page-break"></div>
  <div class="section-title">Uploaded Check-In/Check-Out Pictures</div>
  <div class="image-grid">
    ${images.map((img: any) => {
      const srcUrl = `/requests/uploads/request/${img.imageName}`;
      return `
      <div class="image-card">
        <img src="${srcUrl}" alt="Check In/Out Image" onerror="this.src='https://placehold.co/220x150?text=No+Image'">
        <div class="image-meta">
          <strong>Uploaded By:</strong> ${img.user?.username || 'N/A'}<br>
          <strong>Role:</strong> ${img.user?.userType || 'N/A'}
        </div>
      </div>
      `;
    }).join('')}
  </div>` : ''}

  <!-- Footer Actions -->
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
    const name = "Permit_Logs_" + "${permitNo}".trim() + ".pdf";
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
