import puppeteer from 'puppeteer';
import { generatePermitHtml } from './permit-html-template';
import { generateLogsHtml } from './logs-html-template';

/**
 * Generates a permit PDF via Puppeteer/headless Chrome from the HTML template.
 */
export async function generatePermitPdf(data: any): Promise<Buffer> {
  const html = generatePermitHtml(data);
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' as any });
    const pdfBuffer = await page.pdf({
      width: '330mm',
      height: '483mm',
      printBackground: true,
      margin: { top: '15mm', bottom: '15mm', left: '5mm', right: '5mm' },
      preferCSSPageSize: false,
    });
    return Buffer.from(pdfBuffer);
  } finally {
    await browser.close();
  }
}

/**
 * Generates a logs PDF via Puppeteer/headless Chrome from the logs HTML template.
 */
export async function generateLogsPdf(
  permitNo: string,
  logs: any[],
  images: any[],
): Promise<Buffer> {
  const html = generateLogsHtml(permitNo, logs, images);
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' as any });
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '15mm', bottom: '15mm', left: '10mm', right: '10mm' },
    });
    return Buffer.from(pdfBuffer);
  } finally {
    await browser.close();
  }
}