import * as fs from 'fs';
import * as path from 'path';

/**
 * Reads a local image file and returns its Base64 data URL representation.
 */
export function getBase64Image(filePath: string): string {
  try {
    if (!fs.existsSync(filePath)) {
      return '';
    }
    const fileBuffer = fs.readFileSync(filePath);
    const ext = path.extname(filePath).slice(1).toLowerCase();
    const mime = ext === 'jpg' ? 'jpeg' : ext;
    return `data:image/${mime};base64,${fileBuffer.toString('base64')}`;
  } catch (error) {
    console.error(`Error encoding image ${filePath} to Base64:`, error);
    return '';
  }
}
