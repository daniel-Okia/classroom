# 0003 NCDC downloads for local testing
Owner instruction (2026-10-27): use NCDC free downloads for testing; nothing is published yet.
Implementation: tools/ingest treats ncdc as INGEST with `publishable:false`. Files go to git-ignored data/raw. Provenance in data/provenance.jsonl. The content pipeline must block `publishable:false` resources from any production or public build. Before launch: written permission from NCDC, or switch to link-only.
Tool language: plain Node ESM (no dependencies, Node 20) instead of TypeScript for now, to avoid a build step; convert when the monorepo is set up.
