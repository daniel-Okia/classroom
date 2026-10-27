# Content authoring guide

Teachers write **original** notes. Do not paste from textbooks, past papers or websites. Ask if unsure.

## One lesson = one file in `content/lessons/`
```
---
id: new-s1-math-integers          # unique, lowercase
track: new                         # new = NCDC competency curriculum, legacy = older syllabus
level: S1
subject: mathematics               # code from content/taxonomy/taxonomy.json
topic: Working with Integers       # must match a topic name in the taxonomy
title: Adding and subtracting integers
author: Your name
review: draft                      # draft -> reviewed -> published (a second teacher changes this)
source: Original to Classroom
licence: Original, owner to choose licence
publishable: true
wisdom: Optional one line linking work and faith
---
## Key idea
## Worked example
## Practice
## Check yourself

```quiz
[{"q":"...","options":["a","b","c","d"],"answer":0,"explain":"Why this is right.","marks":1}]
```
```
Rules: the four headings, in that order; maths in `$...$` (KaTeX); short sentences; no raw HTML; every quiz item has an explanation. `answer` is the index of the correct option.

## Workflow
1. Write the file. Run `pnpm --filter @classroom/content test` (validates every lesson).
2. A second teacher checks facts, pitch and language, then sets `review: reviewed`.
3. Head of department sets `review: published`. Only `published` lessons ship to production.
4. Faith content (prayers, devotions) also needs chaplain review before `published`.

## Topics missing from the taxonomy
Extract them from an NCDC syllabus with `tools/content/extract_taxonomy.py` (names only, never prose), add to `taxonomy.json`, then run `node tools/content/gaps.mjs`.
