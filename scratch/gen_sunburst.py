import math

cx, cy = 201, 310
r = 700

svg = ['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 402 874" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">']
svg.append('  <g opacity="0.22">')

# Count the rays in CH0-19:
# There are 16 sectors around 360 degrees (each sector is 22.5 deg, 11.25 deg ray)
for i in range(0, 360, 24):
    a1 = math.radians(i - 6)
    a2 = math.radians(i + 6)
    x1 = cx + r * math.cos(a1)
    y1 = cy + r * math.sin(a1)
    x2 = cx + r * math.cos(a2)
    y2 = cy + r * math.sin(a2)
    svg.append(f'    <polygon points="{cx:.1f},{cy:.1f} {x1:.1f},{y1:.1f} {x2:.1f},{y2:.1f}" fill="#FFFFFF" />')

svg.append('  </g>')
svg.append('</svg>')

with open('assets/images/figma/sunburst_ch19.svg', 'w', encoding='utf-8') as f:
    f.write('\n'.join(svg))

print('generated sunburst_ch19.svg')
