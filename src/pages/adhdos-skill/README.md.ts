import fs from 'node:fs';
import path from 'node:path';

export const prerender = true;

export async function GET() {
  const filePath = path.join(process.cwd(), 'src/skills/README.md');
  const fileContent = fs.readFileSync(filePath, 'utf-8');

  return new Response(fileContent, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
    },
  });
}
