const Tesseract = require('tesseract.js');
const fs = require('fs');
const path = require('path');

const imgDir = '/Users/sachingopalakrishnan/DSA TEST WEB/dsa mcq questions';

async function extractText() {
  const files = fs.readdirSync(imgDir).filter(f => f.endsWith('.jpg') || f.endsWith('.png'));
  console.log(`Found ${files.length} images`);
  
  let allText = '';
  
  // Just do the first 3 files for testing
  for (let i = 0; i < Math.min(3, files.length); i++) {
    const file = files[i];
    console.log(`Processing ${file}...`);
    try {
      const { data: { text } } = await Tesseract.recognize(
        path.join(imgDir, file),
        'eng',
        { logger: m => console.log(m.status, Math.round(m.progress * 100) + '%') }
      );
      allText += `\n\n--- ${file} ---\n\n` + text;
      console.log(`Finished ${file}`);
    } catch (e) {
      console.error(`Error processing ${file}:`, e);
    }
  }
  
  fs.writeFileSync('extracted_text.txt', allText);
  console.log('Saved to extracted_text.txt');
}

extractText();
