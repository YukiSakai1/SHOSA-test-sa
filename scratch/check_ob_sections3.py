import json, re

with open('src/onboarding_data.ts', encoding='utf-8') as f:
    src = f.read()

print('=== hearings, q4Followup, roleResults in onboarding_data.ts ===')
for pat in [r'hearings:\s*\[.*?\n  \],', r'q4Followup:\s*\{.*?\n  \},', r'roleResults:\s*\{.*?\n  \},', r'schedule:\s*\{.*?\n  \},']:
    m = re.search(pat, src, re.S)
    print(m.group(0)[:2500] if m else 'NOT FOUND')
    print('---')

with open('index.html', encoding='utf-8') as f:
    hlines = f.readlines()
print('=== index.html lines 566-666 (CH0-20 Result + Schedule Header) ===')
print(''.join(f'{i}: {hlines[i-1]}' for i in range(566, 667)))

