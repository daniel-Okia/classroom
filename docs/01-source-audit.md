# Source audit (Deliverable 1)

Audit date: 2026-10-27. Probed with the user agent `ClassroomAuditBot/0.1 (contact: danielokia256@gmail.com)`.
Nothing has been ingested. This is not legal advice; "licence/terms" is what the sites state, and silence is not permission.

## Verdict table

| # | Source | Content | Format | Licence / terms found | robots.txt | Verdict |
|---|---|---|---|---|---|---|
| 1 | exinetacademy.com 2026 UACE sample papers page | ~20 UACE subjects, 1-2 papers each, question paper + marking guide combined per PDF. Originally attributed to UNEB. Compiled by Exinet, posted 2026-07-10. No notes. | PDF via `/download/...` | Page states free, no reuse licence. ToS s3a: no reproduction/distribution without prior written permission; s2c bans "data mining". Third-party compilation of UNEB material. | 200. Only disallows one WP plugin JSON; crawling allowed. | **LINK ONLY** (and seek the original at UNEB) |
| 2 | yaaka.cc UACE sample papers | Not readable: server returns HTTP 403 to our client, so the course page and its terms could not be audited. | unknown | Unverified. robots.txt: `Content-Signal: search=yes, ai-train=no`, expressly reserves rights under EU DSM Art. 4. | 200, `Allow: /` but with content-signal restrictions on AI training | **EXCLUDE** from ingestion (cannot verify; training use reserved). Manual browsing for structure study only |
| 3 | exoticnotes.com | Nursery to tertiary: notes, papers, schemes of work, holiday packages, A-level sample papers. Partly user-uploaded, with paid extra downloads (from UGX 1,000, sign-in for some features). No marking guides seen. | PDF/Word/PPT | ToS s2 bans bots/scrapers/spiders without written consent; s4 bans reproduction/distribution/commercial use; downloads for personal or institutional educational use only. Uploaders retain ownership. | 200, `Disallow:` empty, `Crawl-delay: 1`. **robots allows, ToS forbids.** ToS governs. | **EXCLUDE** from ingestion. **LINK ONLY** for human-curated outbound references. Could approach for written consent |
| 4 | uneb.ac.ug (official) | Expected: past papers, results, circulars. **Not verified.** | n/a | Not read. | Not retrieved | **PENDING.** Host refused connections (`ECONNREFUSED`) from this machine on 2026-10-27, both `uneb.ac.ug` and `www.`. Retry from another network, or you check manually |
| 5 | ncdc.go.ug (official) | Advanced Secondary **assessment guidelines** for 12 subjects (History, Entrepreneurship, General Paper, Local Languages, Music, Physics, Metal Work, Geography, French, Economics, CRE, Clothing & Textile). Lower-secondary has a separate CBC page not yet read. No syllabi, learning outcomes or teaching guides found on the home page; the `/resource/` index not yet crawled. Also Orange Book 2024, Curriculum Tree magazine, set-books list. | PDFs in `/wp-content/uploads/YYYY/MM/` marked "Free Download" | Footer "© 2026 NCDC. All rights reserved". No open licence or terms for downloads. | Returned 200 but empty file (no restrictions stated) | **LINK ONLY** by default. Free public download is not a reuse licence. **Needs your decision**: write to NCDC for permission to cache and serve syllabi in-app |
| 6 | education.go.ug (MoES) | Not yet read beyond robots. Policy circulars, calendars, likely. | HTML/PDF | Not read. | Allows all but `/wp-admin/` | **PENDING**, likely LINK ONLY for circulars. Note the Ministry's domain is `education.go.ug`, not `moes.go.ug` as in the brief; the latter was not tested |

## Verdict summary

- INGEST: **none yet.** Every candidate is either unlicensed for redistribution (1, 3, 5), unverifiable (2, 4, 6) or restricted.
- Consequence: no ingestion tooling will be built against any of these sources until you decide how to proceed (options below). The tool can still be built as a generic, robots/ToS-aware fetcher with a verdict gate that refuses anything not marked INGEST, plus provenance records.
- Papers and marking guides will mostly be **link-out references** with metadata we author ourselves (year, paper, topic tags). Question text is not copied.

## Decisions needed from you

1. **Ask UNEB and NCDC in writing** for permission to host past papers, marking guides and syllabi. Meanwhile, link only. I can draft the letter. (Licensing: your call.)
2. OK to treat commercial/aggregator sites (Exinet, Exotic Notes, Yaaka) as structure-study and link-out only?
3. If UNEB/NCDC permission isn't granted, the "frequently tested" insights would be built on topic tags that **we** author from reviewing papers (counts only, no question text). Confirm that is acceptable.

## Structure observations (taxonomy, from public pages only; no copying)

- Exinet: UACE sorted by subject; paper numbers 1-2 (Subsidiary Maths and General Paper have one); syllabus-code slugs such as `p425_1`.
- Exotic Notes: Level → resource type (notes, papers, books, schemes, holiday packages) → subject. Tertiary by course.
- Both group by level then subject. Neither exposes a topic-level taxonomy on the pages read, so topics must come from NCDC/UNEB syllabi that we author against.
- Gaps visible: no marking guides outside UACE; nothing found for UCE (new curriculum) papers; no original notes.

## Curriculum rollout status (cited, with gaps)

| Level | Finding | Source | Confidence |
|---|---|---|---|
| Lower secondary (S1-S4) | Competency-based revised curriculum rolled out 2020; NCDC planning a review to reduce content load (Apr 2025). | [Independent, 2025-04-18](https://www.independent.co.ug/new-lower-secondary-curriculum-faces-more-reviews/) | Medium (news, not NCDC) |
| UCE assessment | First UCE under revised curriculum sat in 2025, results released 2026-02-13. Divisions dropped; grades A-E; reported as 20% continuous assessment + 80% end-of-cycle exam; certificate needs at least D in one subject. Reports of confusion. | [Monitor](https://www.monitor.co.ug/uganda/news/national/uce-what-you-need-to-know-about-new-grading-system--5358278), [Eagle](https://eagle.co.ug/2026/02/13/uneb-99-of-candidates-excel-in-2025-uce/) | Medium. **Must be confirmed from UNEB before we encode any grading rule.** The two sources also conflict on details |
| Upper secondary (S5-S6) | Abridged/transitional A-Level curriculum, 29 subjects, for S5 from 24 Feb 2025; full competency-based A-Level in development, expected no earlier than 2028 per one NCDC official. NCDC posted A-Level assessment guidelines 2026-07-27. | [Kampala Report, 2025-01-31](https://www.thekampalareport.com/latest/2025013146322/ncdc-develops-rollout-plan-for-abridged-a-level-transition-curriculum.html), [NCDC home](https://www.ncdc.go.ug/) | Medium |
| Primary | Revised primary curriculum reported for rollout in 2028; NCDC and World Bank discussed the revised lower-primary curriculum 2026-10-16. | [Monitor](https://www.monitor.co.ug/uganda/news/education/primary-school-syllabus-reforms-to-be-rolled-out-in-2028-5562928) (article body blocked 403, headline only), NCDC news | Low |
| Early years | NCDC lists collaboration on pre-primary; no rollout date found. | NCDC home | Low |

Implication: for S5-S6 the Legacy track and an abridged transitional syllabus coexist; Legacy past papers stay relevant for UACE. For S1-S4, the New Curriculum is the live track. Do not hard-code grading until verified with UNEB.

## Not done / limits

- UNEB and MoES not actually read (UNEB unreachable here). NCDC `/resource/` and CBC pages not crawled.
- Yaaka's page returned 403; no content or terms read.
- News figures are secondary reporting.
