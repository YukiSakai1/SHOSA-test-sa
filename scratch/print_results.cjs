const fs = require('fs');
const raw = fs.readFileSync('scratch/user_prompt_dict.txt', 'utf8');

const startIdx = raw.indexOf('Front Deskの場合');
console.log(raw.slice(startIdx, startIdx + 2500));

