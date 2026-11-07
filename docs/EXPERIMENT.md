# Noocene Impact Lab — pilot protocol draft v1

Status: synthetic analysis approved; human experiment pending approval. No human intervention outcomes exist.

## Research question

Does brief Socratic reflection improve objectively scored reasoning compared with equal-duration independent reflection?

Hypothesis: participant-mean post-minus-pre accuracy change is greater in the Socratic condition. Primary outcome: difference between conditions in that change. Secondary outcomes: incorrect-to-correct and correct-to-incorrect transitions, Brier scores before/after, duration and completion rate.

## Design to freeze before recruitment

Proposed between-participant randomization for 5–10 consenting volunteers, same task bank and matched reflection opportunities. Keep assignment stable within each participant. Freeze question versions, task order, reflection time, leakage handling, exclusions and consent wording. Checking an answer key does not establish psychometric validity or equivalent difficulty.

Correctness comes from server-side answer keys. Record assignment separately from intervention delivered. API failures and deviations must not silently become valid Socratic trials. Recruitment and new experiments require human approval.

## Analysis

`node research/reproduce.mjs` reproduces the supplied synthetic fixture, runs tests and creates a new output directory. It performs no paid calls, recruitment or live literature search.

Accuracy is mean correctness among completed paired trials. Self-correction counts 0→1; regressions count 1→0. Report denominators. Completion rate includes all started input trials. Aborted records carry null final fields and are excluded from paired metrics, not hidden from completion rates.

Brier score = mean((confidence / 100 − correctness)^2). Lower means lower probability error on these trials. It is not a complete measure of metacognitive sensitivity or efficiency. Interpret alongside accuracy.

Average accuracy changes within participants before comparing condition means. Do not treat repeated trials as independent participants. No confirmatory significance claims from this small pilot. Baseline, item, practice, selection and attrition effects remain limitations.

## Validation and provenance

Four automated tests cover hand-calculated metrics, invalid consent/provenance, incomplete trials and participant aggregation. Known values: accuracy .5 before/after; Brier .4 before and .025 after. Synthetic results validate software, not the intervention.

Runs save hypotheses, configuration, source snapshot, hashes, software version, test output, metrics, chart and proposal. The fixture is fixed; the seed is metadata and does not generate allocation. New run directories preserve earlier outputs. Metrics reproduce; timestamps and run IDs differ.

The application's ephemeral feasibility export is currently a separate schema. This command deliberately does not ingest it as a research dataset. A reviewed importer, pseudonymous participant accounting, frozen model status and study approval are needed before human analysis. A session count is not necessarily a unique-person count.

## INNERSPACE

Personal conflicts have no objective answer key. Assess usability and perceived usefulness separately from objective reasoning outcomes.
