const fs = require('fs');
const kiwi = require('kiwi-schema');
const schema = kiwi.decodeBinarySchema(fs.readFileSync('temp_schema.bin'));
const compiled = kiwi.compileSchema(schema);
const msg = compiled.decodeMessage(fs.readFileSync('temp_data.bin'));
const nodes = msg.nodeChanges;
const id = (g) => (g ? `${g.sessionID}:${g.localID}` : null);
const byId = new Map(nodes.map(n => [id(n.guid), n]));
const children = new Map();
for (const n of nodes) {
  const p = id(n.parentIndex && n.parentIndex.guid);
  if (!children.has(p)) children.set(p, []);
  children.get(p).push(n);
}

function decodeCommands(raw) {
  if (!raw) return '';
  const b = raw.bytes || raw;
  const v = new DataView(b.buffer, b.byteOffset, b.byteLength);
  let p = 0; let d = '';
  while (p < b.byteLength) {
    const cmd = v.getUint8(p); p += 1;
    if (cmd === 0) break;
    if (cmd === 1) { const x = v.getFloat32(p, true); p += 4; const y = v.getFloat32(p, true); p += 4; d += `M${x.toFixed(2)},${y.toFixed(2)}`; }
    else if (cmd === 2) { const x = v.getFloat32(p, true); p += 4; const y = v.getFloat32(p, true); p += 4; d += `L${x.toFixed(2)},${y.toFixed(2)}`; }
    else if (cmd === 3) { const x1 = v.getFloat32(p, true); p += 4; const y1 = v.getFloat32(p, true); p += 4; const x = v.getFloat32(p, true); p += 4; const y = v.getFloat32(p, true); p += 4; d += `Q${x1.toFixed(2)},${y1.toFixed(2)} ${x.toFixed(2)},${y.toFixed(2)}`; }
    else if (cmd === 4) { const x1 = v.getFloat32(p, true); p += 4; const y1 = v.getFloat32(p, true); p += 4; const x2 = v.getFloat32(p, true); p += 4; const y2 = v.getFloat32(p, true); p += 4; const x = v.getFloat32(p, true); p += 4; const y = v.getFloat32(p, true); p += 4; d += `C${x1.toFixed(2)},${y1.toFixed(2)} ${x2.toFixed(2)},${y2.toFixed(2)} ${x.toFixed(2)},${y.toFixed(2)}`; }
    else if (cmd === 5) { d += 'Z'; } else break;
  }
  return d;
}

function toHex(c) {
  if (!c) return '#000000';
  const r = Math.round(c.r * 255).toString(16).padStart(2, '0');
  const g = Math.round(c.g * 255).toString(16).padStart(2, '0');
  const b = Math.round(c.b * 255).toString(16).padStart(2, '0');
  return `#${r}${g}${b}`;
}

function renderNode(nodeId, overrideFill) {
  const n = byId.get(nodeId); if (!n) return '';
  const cList = children.get(nodeId) || [];
  let tf = '';
  if (n.transform) {
    const { m00, m01, m02, m10, m11, m12 } = n.transform;
    if (m00 !== 1 || m01 !== 0 || m10 !== 0 || m11 !== 1 || m02 !== 0 || m12 !== 0) tf = ` transform="matrix(${m00.toFixed(4)},${m10.toFixed(4)},${m01.toFixed(4)},${m11.toFixed(4)},${m02.toFixed(2)},${m12.toFixed(2)})"`;
  }
  if (n.type === 'VECTOR') {
    let d = '';
    if (n.fillGeometry) for (const g of n.fillGeometry) if (g.commandsBlob !== undefined) d += decodeCommands(msg.blobs[g.commandsBlob]);
    let fill = overrideFill || (n.fillPaints && n.fillPaints[0] ? toHex(n.fillPaints[0].color) : '#000');
    return `<path d="${d}" fill="${fill}"${tf}/>\n`;
  }
  let inner = '';
  for (const c of cList) inner += renderNode(id(c.guid), overrideFill);
  return `<g${tf}>\n${inner}</g>\n`;
}

// 1. Shosa face
const svg1 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 67 40" width="67" height="40">\n${renderNode('1:2657', '#ffffff')}</svg>`;
fs.writeFileSync('assets/images/figma/shosa_face_header.svg', svg1);

// 2. Yellow lock icon 1:2726 (size 33x44)
const svg2 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 33 44" width="33" height="44">\n${renderNode('1:2726')}</svg>`;
fs.writeFileSync('assets/images/figma/icon_lock_gold.svg', svg2);

console.log('Exported shosa_face_header.svg and icon_lock_gold.svg');
