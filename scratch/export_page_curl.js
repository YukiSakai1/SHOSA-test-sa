const fs = require('fs');
const kiwi = require('kiwi-schema');
const schema = kiwi.decodeBinarySchema(fs.readFileSync('temp_schema.bin'));
const compiled = kiwi.compileSchema(schema);
const msg = compiled.decodeMessage(fs.readFileSync('temp_data.bin'));
const nodes = msg.nodeChanges;
const id = (g) => (g ? `${g.sessionID}:${g.localID}` : null);
const byId = new Map(nodes.map(n => [id(n.guid), n]));

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

const v1 = byId.get('1:2722');
const v2 = byId.get('1:2723');
const d1 = decodeCommands(msg.blobs[v1.fillGeometry[0].commandsBlob]);
const d2 = decodeCommands(msg.blobs[v2.fillGeometry[0].commandsBlob]);

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 355 120" width="355" height="120" fill="none">
  <!-- Gradient for curl shadow -->
  <defs>
    <linearGradient id="curlShadow" x1="0%" y1="100%" x2="0%" y2="0%">
      <stop offset="0%" stop-color="#000000" stop-opacity="0.35" />
      <stop offset="60%" stop-color="#000000" stop-opacity="0.1" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0" />
    </linearGradient>
    <linearGradient id="curlFlap" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E2DFD8" />
      <stop offset="50%" stop-color="#F2EFE9" />
      <stop offset="100%" stop-color="#FFFFFF" />
    </linearGradient>
  </defs>
  <!-- Curled Shadow (v1) -->
  <path d="${d1}" fill="url(#curlShadow)" transform="translate(0, 0)" />
  <!-- Curled White Flap (v2) -->
  <path d="${d2}" fill="url(#curlFlap)" transform="translate(40, 28)" />
</svg>`;

fs.writeFileSync('assets/images/figma/page_curl.svg', svg);
console.log('Saved page_curl.svg successfully!');
