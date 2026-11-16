import re

with open('src/onboarding_data.ts', encoding='utf-8') as f:
    src = f.read()

m = re.search(r'const APP_TRANSLATIONS.*?=\s*\{(.*?)\n\};', src, re.S)
print('=== APP_TRANSLATIONS keys/values ===')
print(m.group(0) if m else 'NOT FOUND')

with open('src/onboarding.ts', encoding='utf-8') as f:
    ob = f.read()

print('\n=== loadIntroSlide & loadCharacterGreet & renderJourneySteps snippets ===')
for fn in ['function loadIntroSlide', 'function loadCharacterGreet', 'function renderJourneySteps', 'function applyAppLanguage']:
    idx = ob.find(fn)
    if idx != -1:
        print('---', fn, '---')
        print(ob[idx:idx+2600])
