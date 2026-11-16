const fs = require('fs');
const path = require('path');
const kiwi = require('kiwi-schema');

const schema = kiwi.compileSchema(kiwi.decodeBinarySchema(fs.readFileSync('temp_schema.bin')));
const msg = schema.decodeMessage(fs.readFileSync('temp_data.bin'));

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
  let p = 0;
  let d = '';
  while (p < b.byteLength) {
    const cmd = v.getUint8(p); p += 1;
    if (cmd === 0) break; // padding
    if (cmd === 1) { // moveTo
      const x = v.getFloat32(p, true); p += 4;
      const y = v.getFloat32(p, true); p += 4;
      d += `M${+x.toFixed(2)},${+y.toFixed(2)}`;
    } else if (cmd === 2) { // lineTo
      const x = v.getFloat32(p, true); p += 4;
      const y = v.getFloat32(p, true); p += 4;
      d += `L${+x.toFixed(2)},${+y.toFixed(2)}`;
    } else if (cmd === 3) { // quadTo
      const x1 = v.getFloat32(p, true); p += 4;
      const y1 = v.getFloat32(p, true); p += 4;
      const x = v.getFloat32(p, true); p += 4;
      const y = v.getFloat32(p, true); p += 4;
      d += `Q${+x1.toFixed(2)},${+y1.toFixed(2)} ${+x.toFixed(2)},${+y.toFixed(2)}`;
    } else if (cmd === 4) { // cubicTo
      const x1 = v.getFloat32(p, true); p += 4;
      const y1 = v.getFloat32(p, true); p += 4;
      const x2 = v.getFloat32(p, true); p += 4;
      const y2 = v.getFloat32(p, true); p += 4;
      const x = v.getFloat32(p, true); p += 4;
      const y = v.getFloat32(p, true); p += 4;
      d += `C${+x1.toFixed(2)},${+y1.toFixed(2)} ${+x2.toFixed(2)},${+y2.toFixed(2)} ${+x.toFixed(2)},${+y.toFixed(2)}`;
    } else if (cmd === 5) { // closePath
      d += 'Z';
    } else {
      break;
    }
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

function renderNodeToSvg(nodeId) {
  const n = byId.get(nodeId);
  if (!n) return '';
  const cList = children.get(nodeId) || [];
  
  let transform = '';
  if (n.transform) {
    const { m00, m01, m02, m10, m11, m12 } = n.transform;
    if (m00 !== 1 || m01 !== 0 || m10 !== 0 || m11 !== 1 || m02 !== 0 || m12 !== 0) {
      transform = ` transform="matrix(${+m00.toFixed(4)},${+m10.toFixed(4)},${+m01.toFixed(4)},${+m11.toFixed(4)},${+m02.toFixed(2)},${+m12.toFixed(2)})"`;
    }
  }

  let opacity = n.opacity !== undefined && n.opacity < 1 ? ` opacity="${+n.opacity.toFixed(2)}"` : '';

  if (n.type === 'VECTOR') {
    let d = '';
    if (n.fillGeometry && n.fillGeometry.length > 0) {
      for (const geom of n.fillGeometry) {
        if (geom.commandsBlob !== undefined) {
          const raw = msg.blobs[geom.commandsBlob];
          if (raw) d += decodeCommands(raw);
        }
      }
    }
    let fill = 'none';
    if (n.fillPaints && n.fillPaints.length > 0) {
      const p = n.fillPaints[0];
      if (p.type === 'SOLID' && p.color) {
        fill = toHex(p.color);
        if (p.opacity !== undefined && p.opacity < 1) fill += Math.round(p.opacity * 255).toString(16).padStart(2, '0');
      }
    }
    let stroke = '';
    if (n.strokePaints && n.strokePaints.length > 0) {
      const sp = n.strokePaints[0];
      if (sp.type === 'SOLID' && sp.color) {
        stroke = ` stroke="${toHex(sp.color)}" stroke-width="${n.strokeWeight || 1}"`;
      }
    }
    return `<path d="${d}" fill="${fill}"${stroke}${transform}${opacity}/>\n`;
  }

  if (n.type === 'ELLIPSE') {
    const rx = (n.size ? n.size.x : 0) / 2;
    const ry = (n.size ? n.size.y : 0) / 2;
    let fill = '#000';
    if (n.fillPaints && n.fillPaints[0] && n.fillPaints[0].color) fill = toHex(n.fillPaints[0].color);
    return `<ellipse cx="${rx}" cy="${ry}" rx="${rx}" ry="${ry}" fill="${fill}"${transform}${opacity}/>\n`;
  }

  if (n.type === 'ROUNDED_RECTANGLE' || n.type === 'RECTANGLE') {
    const w = n.size ? n.size.x : 0;
    const h = n.size ? n.size.y : 0;
    const r = n.cornerRadius || 0;
    let fill = '#000';
    if (n.fillPaints && n.fillPaints[0] && n.fillPaints[0].color) fill = toHex(n.fillPaints[0].color);
    let stroke = '';
    if (n.strokePaints && n.strokePaints[0] && n.strokePaints[0].color) {
      stroke = ` stroke="${toHex(n.strokePaints[0].color)}" stroke-width="${n.strokeWeight || 1}"`;
    }
    return `<rect width="${w}" height="${h}" rx="${r}" fill="${fill}"${stroke}${transform}${opacity}/>\n`;
  }

  // Container (FRAME, GROUP, SYMBOL, INSTANCE)
  let inner = '';
  for (const c of cList) {
    inner += renderNodeToSvg(id(c.guid));
  }
  return `<g${transform}${opacity}>\n${inner}</g>\n`;
}

function exportComponent(nodeId, fileName, defaultW, defaultH) {
  const n = byId.get(nodeId);
  const w = n && n.size ? Math.round(n.size.x) : defaultW;
  const h = n && n.size ? Math.round(n.size.y) : defaultH;
  const content = renderNodeToSvg(nodeId);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">\n${content}</svg>`;
  const outPath = path.join('assets/images/figma', fileName);
  fs.writeFileSync(outPath, svg);
  console.log(`Exported ${fileName} (${w}x${h})`);
}

// 1. Symbol 1:1002 (_1 ornate divider)
exportComponent('1:1002', 'decor_filigree_divider.svg', 348, 19);

// 2. Symbol 1:974 (icon clipboard checklist)
exportComponent('1:974', 'icon_clipboard_result.svg', 42, 58);

// 3. Symbol 1:811 (frames diamond dots divider)
exportComponent('1:811', 'decor_diamond_divider.svg', 260, 14);
