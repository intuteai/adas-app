import fs from 'fs';
import path from 'path';

export default async function decodeImage(base64Image: string): Promise<string> {
  const matches = base64Image.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
  if (!matches) throw new Error('Invalid base64 string');

  const buffer = Buffer.from(matches[2], 'base64');
  const filePath = path.join(__dirname, '../uploads', `${Date.now()}.jpg`);
  fs.writeFileSync(filePath, buffer);

  return filePath;
}
