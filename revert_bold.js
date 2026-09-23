const fs = require('fs');
const path = require('path');

const updateFile = (filePath) => {
  console.log(`Processing ${filePath}`);
  const content = fs.readFileSync(filePath, 'utf8');
  const indentMatch = content.match(/^[ \t]+/m);
  const indent = indentMatch ? indentMatch[0] : 4;
  
  const obj = JSON.parse(content);
  let changed = false;

  const traverseAndReplace = (current) => {
    for (let k in current) {
      if (typeof current[k] === 'object' && current[k] !== null) {
        traverseAndReplace(current[k]);
      } else if (typeof current[k] === 'string') {
        const old = current[k];
        current[k] = current[k].replace(/<strong>COLECTIKOS<\/strong>/g, 'COLECTIKOS');
        if (old !== current[k]) {
          console.log(`Reverted ${k}`);
          changed = true;
        }
      }
    }
  };

  traverseAndReplace(obj);

  if (changed) {
    fs.writeFileSync(filePath, JSON.stringify(obj, null, indent), 'utf8');
    console.log(`Saved ${filePath}`);
  }
};

updateFile(path.join(__dirname, 'src', 'dictionaries', 'es.json'));
updateFile(path.join(__dirname, 'src', 'dictionaries', 'en.json'));
