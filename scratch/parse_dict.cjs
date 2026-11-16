const fs = require('fs');

const raw = fs.readFileSync('scratch/user_prompt_dict.txt', 'utf8');
const lines = raw.split('\n').map(l => l.trim());

console.log('Total lines:', lines.length);

// Let's inspect where different sections start and end
let inDict = false;
const entries = [];
// Parse table-like lines
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes('参考翻訳内容です')) {
    inDict = true;
    continue;
  }
}

