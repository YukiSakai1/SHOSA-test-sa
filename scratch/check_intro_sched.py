with open('src/onboarding.ts', encoding='utf-8') as f:
    ob = f.readlines()

print('=== onboarding.ts lines 250-380 ===')
print(''.join(f'{i}: {ob[i-1]}' for i in range(250, 381)))

print('\n=== onboarding.ts lines 1015-1090 ===')
print(''.join(f'{i}: {ob[i-1]}' for i in range(1015, 1091)))

with open('index.html', encoding='utf-8') as f:
    hl = f.readlines()
print('\n=== index.html lines 560-577 ===')
print(''.join(f'{i}: {hl[i-1]}' for i in range(560, 578)))

