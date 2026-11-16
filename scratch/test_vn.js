const fs = require('fs');
const kiwi = require('kiwi-schema');
const schema = kiwi.decodeBinarySchema(fs.readFileSync('temp_schema.bin'));
const compiled = kiwi.compileSchema(schema);
const msg = compiled.decodeMessage(fs.readFileSync('temp_data.bin'));

function decodeVectorNetwork(blobIndex) {
  if (blobIndex === undefined || !msg.blobs[blobIndex]) return '';
  const raw = msg.blobs[blobIndex].bytes;
  if (!raw || raw.byteLength < 8) return '';
  const dv = new DataView(raw.buffer, raw.byteOffset, raw.byteLength);

  const numV = dv.getUint32(0, true);
  const numS = dv.getUint32(4, true);

  let p = 8;
  const vertices = [];
  for (let i = 0; i < numV; i++) {
    const x = dv.getFloat32(p, true); p += 4;
    const y = dv.getFloat32(p, true); p += 4;
    vertices.push({ x, y });
  }

  const segments = [];
  for (let i = 0; i < numS; i++) {
    const v0 = dv.getUint32(p, true); p += 4;
    const v1 = dv.getUint32(p, true); p += 4;
    const tsx = dv.getFloat32(p, true); p += 4;
    const tsy = dv.getFloat32(p, true); p += 4;
    const tex = dv.getFloat32(p, true); p += 4;
    const tey = dv.getFloat32(p, true); p += 4;
    segments.push({ v0, v1, tsx, tsy, tex, tey });
  }

  let d = '';
  if (p < raw.byteLength) {
    const numRegions = dv.getUint32(p, true); p += 4;
    for (let r = 0; r < numRegions; r++) {
      const numLoops = dv.getUint32(p, true); p += 4;
      for (let l = 0; l < numLoops; l++) {
        const numIndices = dv.getUint32(p, true); p += 4;
        let lastV = null;
        for (let k = 0; k < numIndices; k++) {
          const segIdx = dv.getUint32(p, true); p += 4;
          const seg = segments[segIdx];
          if (!seg) continue;
          
          // determine direction
          let startV, endV, tsX, tsY, teX, teY;
          if (lastV === null || lastV === seg.v0) {
            startV = vertices[seg.v0];
            endV = vertices[seg.v1];
            tsX = seg.tsx; tsY = seg.tsy;
            teX = seg.tex; teY = seg.tey;
            lastV = seg.v1;
          } else {
            startV = vertices[seg.v1];
            endV = vertices[seg.v0];
            tsX = seg.tex; tsY = seg.tey;
            teX = seg.tsx; teY = seg.tsy;
            lastV = seg.v0;
          }

          if (k === 0) {
            d += `M${startV.x.toFixed(2)},${startV.y.toFixed(2)}`;
          }

          if (tsX === 0 && tsY === 0 && teX === 0 && teY === 0) {
            d += `L${endV.x.toFixed(2)},${endV.y.toFixed(2)}`;
          } else {
            const cp1x = startV.x + tsX;
            const cp1y = startV.y + tsY;
            const cp2x = endV.x + teX;
            const cp2y = endV.y + teY;
            d += `C${cp1x.toFixed(2)},${cp1y.toFixed(2)} ${cp2x.toFixed(2)},${cp2y.toFixed(2)} ${endV.x.toFixed(2)},${endV.y.toFixed(2)}`;
          }
        }
        d += 'Z';
      }
    }
  } else {
    // No regions, just draw segments
    for (let i = 0; i < segments.length; i++) {
      const seg = segments[i];
      const startV = vertices[seg.v0];
      const endV = vertices[seg.v1];
      d += `M${startV.x.toFixed(2)},${startV.y.toFixed(2)}`;
      if (seg.tsx === 0 && seg.tsy === 0 && seg.tex === 0 && seg.tey === 0) {
        d += `L${endV.x.toFixed(2)},${endV.y.toFixed(2)}`;
      } else {
        const cp1x = startV.x + seg.tsx;
        const cp1y = startV.y + seg.tsy;
        const cp2x = endV.x + seg.tex;
        const cp2y = endV.y + seg.tey;
        d += `C${cp1x.toFixed(2)},${cp1y.toFixed(2)} ${cp2x.toFixed(2)},${cp2y.toFixed(2)} ${endV.x.toFixed(2)},${endV.y.toFixed(2)}`;
      }
    }
  }

  return d;
}

// Test on blob 977 (Vector inside 1:1003 of _1)
console.log('blob 977 d:', decodeVectorNetwork(977).slice(0, 100));
