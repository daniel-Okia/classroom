"""Extract topic taxonomy (names, theme, term, periods) from NCDC syllabi text. Usage:
   python3 -I tools/content/extract_taxonomy.py <txt> <subject> <track> <level-regex> > out.json
Only topic NAMES and structure are taken (facts for navigation); no syllabus prose is copied.
Parses overview tables such as:  'Numbers   1. Number Bases     15'  under 'SENIOR 1  THEME  TOPIC  DURATION'."""
import re, sys, json

txt, subject, track, source = sys.argv[1:5]
lines = open(txt, encoding='utf-8', errors='replace').read().split('\n')
out, level, term, last = [], None, None, None
row = re.compile(r'^\s*(?:(Term\s*\d)\s+)?(?:([A-Z][A-Za-z ,&\-]+?)\s{2,})?(\d{1,2})\s*[.:]\s*(.+?)\s{2,}(\d{1,2})\s*$')
for ln in lines:
    m = re.match(r'^\s*(SENIOR\s+[1-4])\s+THEME\s+TOPIC', ln)
    if m: level, term, last = m.group(1).title().replace('Senior ', 'S'), None, None; continue
    if level is None: continue
    if re.match(r'^\s*Total\b', ln): level = None; continue
    t = re.match(r'^\s*Term\s*(\d)', ln)
    if t: term = int(t.group(1))
    m = row.match(ln)
    if m:
        theme = (m.group(2) or last or '').strip() or None
        last = theme
        out.append({'level': level, 'theme': theme, 'n': int(m.group(3)), 'topic': re.sub(r'\s+', ' ', m.group(4)).strip(' :.'), 'periods': int(m.group(5))})
print(json.dumps({'subject': subject, 'track': track, 'source': source, 'publishable': False, 'topics': out}, indent=1))
