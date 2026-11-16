const fs = require('fs');

const raw = fs.readFileSync('scratch/user_prompt_dict.txt', 'utf8');

// Let's print out the sections to understand the layout
const blocks = raw.split(/\n(?=(?:CH0-|YOUR JOURNEY|0章完了画面|Front Deskの場合|Bell & Door Servicesの場合|Housekeepingの場合|Restaurant Serviceの場合|Reservationsの場合|適性診断の内容|-))/);
console.log('Found', blocks.length, 'blocks');
blocks.forEach((b, i) => {
  const firstLine = b.trim().split('\n')[0];
  console.log(`Block ${i}: ${firstLine.slice(0, 60)} (${b.length} chars)`);
});

