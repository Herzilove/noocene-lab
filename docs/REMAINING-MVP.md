# Concrete remaining work

Current baseline: English deployed prototype, three-step personal journey, rule-based insights, explicit local garden storage, source links, an objective reasoning quest with a verified constrained Claude prompt-selection call, and deterministic synthetic analysis.

## Implemented — personal Claude experience

Implemented a server endpoint for explicitly consented current-session text; one tailored Socratic prompt and a source-linked final response. Validate structured outputs, prohibit invented motives/diagnoses and fabricated citations, retain local mode on errors, and test injection/timeout/invalid-output cases. Personal opt-in calls return structured reflections and actual provider metadata. Live verification and durable abuse/cost protection remain important.

## P0 — genuine model-driven research loop

Implement and record an actual Claude-guided literature/hypothesis/code/validation/report iteration in an isolated work area. The current runner only loads a curated source snapshot and executes fixed code. Tavily is not called, despite a key having been configured by the user. Add extraction and claim verification when integrating live research; keep next human experiments approval-gated. Publish a sanitized example run with source and prompt provenance, metrics, logs and plots.

## P0 — durable study data and evaluation

Replace process-memory research sessions with isolated durable storage (planned Supabase project noocene-lab-mvp), schema/migrations, ownership rules and integration tests. Add participant-level assignment, withdrawal/deletion and export-to-analysis import mapping. Current browser-local garden storage is separate and should remain opt-in.

## P0 — reviewed experiment

Replace the single logically checked question with a reviewed multi-item task bank. Freeze hypothesis, primary metric, allocation, comparable reflection opportunity and analysis before recruitment. Keep English tiles-v1-en / pilot-v1-en separate from earlier German task data. Add verified human findings only after a voluntary pilot; preserve null and negative outcomes. Personal confidence changes are not objective evidence of metacognitive improvement.

## P1 — operational provenance and research UI

Capture the actual returned model ID, prompt version, token usage, latency and software version without logging personal text or secrets. Add durable rate limiting and cost controls, protected aggregate accuracy/calibration/completion charts and the operator/contact/deletion information needed before public research recruitment.

## P1 — event handoff

Finalize the submission with Osk (Engineer), Maik (Scientist), real evidence links, a three-minute demo and reproducible commands. The submission draft exists; it has not been submitted. Complete the team's publication confirmation and clearly mark prototype and study limits.

## Optional later

Cross-device garden sync, broader semantic retrieval/embeddings, more data sources and longer-term personal reflection studies. None is needed merely to render the current three-step experience.

Personal live integration verified with Claude Sonnet 5.5 using two synthetic calls. Public evidence: research/examples/personal-connection-check.json. Prompt personal-v2 and actual input/output token counts are recorded. This is not human effectiveness evidence. The quest now uses signed state cookies to survive serverless instance changes; research exports, revocation tracking and rate limits remain non-durable.
