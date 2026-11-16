import re

with open('index.html', encoding='utf-8') as f:
    lines = f.readlines()

print('=== HTML SECTIONS ===')
for idx, line in enumerate(lines, 1):
    if '<section ' in line or 'id="modal-' in line:
        print(f'{idx}: {line.strip()}')

with open('src/onboarding_data.ts', encoding='utf-8') as f:
    ob_data = f.read()

idx = ob_data.find('i18n:')
print('\n=== i18n in onboarding_data.ts ===')
print(ob_data[idx:] if idx != -1 else 'NOT FOUND')

