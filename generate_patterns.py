import math

def generate_svg(fg_color, filename, size=180, r=5.8, gap=11.5, max_w=5.0):
    half = size / 2.0 # 90
    diag = math.hypot(half, half) # ~127.28
    
    half_w = max_w / 2.0
    
    def make_diamond(p1, p2):
        vx = p2[0] - p1[0]
        vy = p2[1] - p1[1]
        dist = math.hypot(vx, vy)
        u_x, u_y = vx / dist, vy / dist
        p_x, p_y = -u_y, u_x
        
        pt_start = (p1[0] + gap * u_x, p1[1] + gap * u_y)
        pt_end = (p1[0] + (dist - gap) * u_x, p1[1] + (dist - gap) * u_y)
        mid_x = (p1[0] + p2[0]) / 2.0
        mid_y = (p1[1] + p2[1]) / 2.0
        pt_top = (mid_x + half_w * p_x, mid_y + half_w * p_y)
        pt_bot = (mid_x - half_w * p_x, mid_y - half_w * p_y)
        
        pts = f"{pt_start[0]:.2f},{pt_start[1]:.2f} {pt_top[0]:.2f},{pt_top[1]:.2f} {pt_end[0]:.2f},{pt_end[1]:.2f} {pt_bot[0]:.2f},{pt_bot[1]:.2f}"
        return f'<polygon points="{pts}" fill="{fg_color}" />'

    lines = []
    lines.append(make_diamond((0, 0), (half, half)))
    lines.append(make_diamond((size, 0), (half, half)))
    lines.append(make_diamond((0, size), (half, half)))
    lines.append(make_diamond((size, size), (half, half)))

    dots = [
        f'<circle cx="{half:.2f}" cy="{half:.2f}" r="{r:.2f}" fill="{fg_color}" />',
        f'<circle cx="0" cy="0" r="{r:.2f}" fill="{fg_color}" />',
        f'<circle cx="{size}" cy="0" r="{r:.2f}" fill="{fg_color}" />',
        f'<circle cx="0" cy="{size}" r="{r:.2f}" fill="{fg_color}" />',
        f'<circle cx="{size}" cy="{size}" r="{r:.2f}" fill="{fg_color}" />',
    ]

    svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" width="{size}" height="{size}" viewBox="0 0 {size} {size}">
  <g>
{chr(10).join('    ' + l for l in lines)}
{chr(10).join('    ' + d for d in dots)}
  </g>
</svg>'''
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(svg_content)
    print(f'Generated {filename}')

generate_svg('rgba(175, 145, 110, 0.42)', 'assets/images/pattern_beige.svg')
generate_svg('rgba(255, 255, 255, 0.22)', 'assets/images/pattern_turquoise.svg')
