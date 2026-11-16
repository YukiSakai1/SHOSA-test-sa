const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');
lines.forEach((l, i) => {
  if (l.includes('btn-en-toggle') || l.includes('intro-lang-pill') || l.includes('figma-en-btn') || l.includes('EN')) {
    if (l.includes('btn') || l.includes('chip') || l.includes('pill') || l.includes('header')) {
      console.log(`${i + 1}: ${l.trim()}`);
    }
  }
});

