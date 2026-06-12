import json

with open('C:/Comp/mamacare-ai-triage.ipynb', 'r', encoding='utf-8') as f:
    nb = json.load(f)

for i, cell in enumerate(nb['cells']):
    ctype = cell['cell_type']
    src = ''.join(cell['source'])
    print(f'=== Cell {i} ({ctype}) ===')
    if ctype == 'code':
        # Show first 1000 chars of code
        print(src[:1000])
        if len(src) > 1000:
            print('...(truncated)')
    else:
        print(src[:1000])
    print()
