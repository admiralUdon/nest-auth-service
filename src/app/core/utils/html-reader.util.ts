import { readFileSync } from 'fs-extra';
import { join } from 'path';

export function readHTMLFile(fileName) {
    try {        
        const filePath = join(__dirname, '..', '..', '..', '..', 'assets', 'templates', fileName);
        const htmlContent = readFileSync(filePath, 'utf-8');
        return htmlContent;
    } catch (err) {
        console.error('Error reading HTML file:', err);
        return null;
    }
}