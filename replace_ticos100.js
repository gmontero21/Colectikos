const fs = require('fs');
const path = require('path');

const files = [
  'src/dictionaries/es.json',
  'src/dictionaries/en.json',
  'src/app/[lang]/layout.tsx',
  'src/components/OnboardingModal.tsx',
  'src/components/InstallBanner.tsx',
  'src/app/[lang]/admin/insights/actions.ts',
  'src/app/api/contact/route.ts'
];

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    // Replace Ticos100, but not if it's part of a variable like hasSeenTicos100Tour
    // \b matches word boundary. Ticos100 has a number at the end, so \b works.
    const newContent = content.replace(/\bTicos100\b/g, 'Colectikos');
    if (content !== newContent) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`Updated ${file}`);
    }
  }
});
