# Design system

**These designs are my own,** built in the spirit of your five mockups (student home, study session, parent view, Kids Mode, teacher dashboard). Tokens: [packages/ui/src/tokens.css](../packages/ui/src/tokens.css). Typeface Nunito, self-hosted and subsetted (no Google Fonts call, saves a request and avoids tracking).

## Principles
One primary action per screen, gold button; body text >= 16px; targets >= 44px (Kids Mode 72px); plain English; every state has text, never colour alone; works at 360px wide; light and dark themes.

## Contrast (computed)
| Pair | Ratio | Use |
|---|---|---|
| white on green #0B6E4F | 6.25 | hero card, nav active |
| ink on gold #F2A900 | 7.95 | primary button |
| **white on gold** | **2.01 fail** | never used |
| ink on bg #F4F7FB | 14.87 | body |
| green on bg | 5.82 | links, secondary buttons |
| white on kids blue / purple / rust | 5.36 / 6.42 / 5.46 | Kids tiles |

## Where I changed the mockups, and why
| Mockup | Change | Why |
|---|---|---|
| Body and labels look ~11-13px | Minimum 16px, small labels 14px only for metadata | Brief requires 16px; cheap-phone readability |
| Parent nav: Overview / Messages / Plan / Account | **Home / Learn / School / Messages** | Section 4B: payments, notices, results and requests must be two taps from Home. "Plan" folds into Learn; "Account" moves to a profile menu at top |
| Student nav: Home / Library / Practice / Progress | Keep, but **Progress** is also reached from the Home hero card | Same 4 items as brief; fewer taps to continue |
| Study-day dots (colour only) | Add day letter + check mark + accessible label ("Wednesday: studied") | Colour-only fails WCAG |
| "30% · needs support" chip on a subject | Reword to "Let's practise this" on student/parent screens; "needs support" stays on the teacher view | Avoid shaming a child; teachers still need the flag |
| Streak chip "5-day streak" | A missed day shows "Welcome back" and keeps best streak, no reset language | Brief: no guilt or streak-shaming |
| Teacher status pills (On track/Behind/Not started) | Keep, add icon plus text; "Behind" amber, "Not started" ink | Not colour-only |
| Frequently tested box | Fixed text "Frequently tested, not a prediction." plus the count | Brief wording is mandatory; "[N] of the last 10 papers" only shown when counted from our own tags |
| Kids Mode: 4 tiles + tracing | Add a small padlock "Grown-ups" button requiring a parent PIN; voice prompt button on each screen | Brief: parent PIN to exit, voice prompts |
| Teacher dashboard: no filters | Add class/subject filter and "export CSV" | Brief: export reports |
| Timer "1:12:40 left" | Show only in timed-paper mode; practice mode has no timer | Reduces pressure on young learners |

## Components (first set)
Hero session card, progress bar (with % text), study-week dots, subject row, status pill, notice card (priority: normal/important/emergency with icon), request status trail, fee balance card (no shaming wording), result row with trend, bottom nav (4), top bar with profile menu, opening-moment panel (verse + "Begin", never a gate), quiz question, photo-answer upload, Kids tile.

## Faith in the UI
Opening moment is a calm panel with one "Begin" button, skippable by family setting; verse/prayer areas are hidden entirely when the school setting is Off.

## Copy rules
Short sentences. No "failed", "behind", "overdue" on parent or student screens (use "not yet", "due on", "balance"). Fees and arrears never shown to anyone but authorised guardians and finance staff.
