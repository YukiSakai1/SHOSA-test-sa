const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/langside/Desktop/フレームランチ/shosa-game/assets/images';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.png') || f.endsWith('.jpg'));

console.log('Total uploaded files:', files.length);
files.forEach(f => {
  const stat = fs.statSync(path.join(dir, f));
  console.log(f, stat.size + ' bytes');
});
