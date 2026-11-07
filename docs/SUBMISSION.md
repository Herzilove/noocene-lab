# [Submission] Noocene Lab: Mind Quest — testing guided reflection

Draft for the event template. Update implementation links and confirmations after final checks.

## Team name
Noocene Lab

## Team members
- Osk — Engineer
- Maik — Scientist

GitHub handles not supplied.

## Field
Other — metacognition and human-computer interaction

## Repository
https://github.com/Herzilove/noocene-lab

## License
Apache 2.0 for original code, CC BY 4.0 for original documentation and synthetic fixture. Full license texts are included.

## Open problem
Can brief Socratic reflection improve reasoning accuracy or confidence calibration compared with independent reflection? We investigate task-level outcomes, not consciousness levels or long-term benefit.

## The research loop
`research/hypothesis.json` defines question and outcomes. `research/literature.json` links foundational claims to publications. `research/reproduce.mjs` loads the approved synthetic fixture, executes tests and analysis, produces a chart/report and records a proposed next experiment awaiting human approval. Each run records hashes and configuration.

Literature currently uses a curated snapshot; live autonomous retrieval is not implemented. Recruitment and new experiments remain approval-gated.

## What the loop found
Four fictional records validate execution. Independent accuracy is 50% before and after; simulated Socratic accuracy is 0% before and 50% after. These are constructed inputs, not observations from people, and provide no efficacy evidence. Four automated analysis tests passed. Actual outputs are in `research/runs/<run-id>/report.md` and `validation.json`.

## Where it got stuck
No approved human study or real study dataset exists. Live-model behavior and leakage resistance require configured access and actual tests. Task validity, final protocol and matched reflection opportunities remain open. The runner is an offline reproducible process, not autonomous human experimentation.

## How Claude was used

The optional SDK integration is implemented for prompt selection in the objective quest. No credentialed provider call has yet been verified. The personal three-step experience and current synthetic runner do not call Claude. See docs/CLAUDE-INTEGRATION.md for the remaining model-driven loop work.

## What it would need next
Freeze and approve the pilot; review task keys and data collection; verify live intervention; recruit 5–10 consenting volunteers; preserve negative and inconclusive findings.

## How to run it
```sh
node --test tests/research.test.mjs
node research/reproduce.mjs
```
Node.js 24+. No credentials for synthetic reproduction. Consult final README for application setup.

## Data and sources
`research/sample.json` is fictional. No personal stories or real participant records are included. Source provenance is in `docs/SOURCES.md` and `research/literature.json`.

## Demo materials
https://noocene-lab.vercel.app — personal reflection; https://noocene-lab.vercel.app/research — research explanation. Show the question, complete Mind Quest, reproducible synthetic analysis and limitations.

## Confirmations
- [x] Repository is public and has complete license files.
- [x] Publication scan found no credentials, source PDFs or participant narratives in tracked content.
- [ ] Team agrees to publication of submission text under CC BY 4.0.
