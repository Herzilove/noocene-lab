# Claude integration and event readiness

Verified against the event README, RESEARCH-LOOPS.md and .github/ISSUE_TEMPLATE/project-submission.yml on 2026-11-07. The user's additional research-loop brief is a separate accepted requirement, not quoted as an official judging rubric.

## Actual status

- Public repository, open-source licenses, deployed app, synthetic reproducible analysis and known-answer tests exist.
- lib/claude.ts implements an optional official-SDK call selecting one of three reviewed prompts for the separate objective Mind Quest. Live production integration was exercised successfully on 2026-11-07 with synthetic answers and no research storage; two model calls succeeded. Exact configured model ID and token usage were not exposed to the test.
- INNERSPACE now has an explicit opt-in personal endpoint for two calls (targeted question, closing reflection). Solo mode remains local. Outputs use a validated tool schema and allowlisted source IDs; actual model/token/latency metadata is returned to session memory. No narratives or garden history are stored on the server. Per-instance throttling is not a durable global spend limit.
- The current offline runner loads curated literature and executes fixed tested code. It does not autonomously write analysis code or verify fresh literature. Synthetic artifacts demonstrate software execution, not a human effect.

## Concrete Claude work after access is configured

1. Personal experience: submit the explicitly consented current moment and thought to a server-only bounded call; return one concise targeted question or a structured alternative view, with uncertainty and allowlisted source IDs. Keep the three-screen state machine outside the model. Validate output and retain local mode on failure. Do not send stored garden cards by default.
2. Research loop: let Claude propose literature claims, a hypothesis and a small analysis-code change in a separate work area. Run known-answer tests, review source support, execute approved analysis, write artifacts, and have a separate validation pass check findings. Record actual model, prompt version, inputs, tests and failures. Do not give the model arbitrary production shell/database privileges.
3. Evaluation: freeze the intervention/protocol and compare independent reflection with the real Claude condition on a reviewed multi-item objectively scored task set. Use deterministic correctness and prespecified participant-level metrics. Live output quality and answer leakage need testing before a voluntary pilot. Claims about personal growth require an appropriate separate longitudinal design.

## Requirements and remaining evidence

| Requirement | Existing evidence | Remaining |
| --- | --- | --- |
| Scientific open problem | docs/EXPERIMENT.md | Refine reviewed task bank and protocol |
| Literature, code execution, validation | research/literature.json, reproduce.mjs, tests | Model-driven source verification and reviewed code iteration |
| Concrete findings with evidence | synthetic runs, metrics and plots | Public sanitized example outputs linked from submission; real findings if collected |
| Actual Claude contribution | SDK integration code | Model/prompt provenance and actual model-driven research-loop trace |
| Reproducibility | pnpm research:reproduce | Reproduce actual approved live run with model variability documented |
| Public project and licenses | GitHub and license files | Submission issue; GitHub handles for Osk/Maik; team confirmation for submission text |

The official submission asks what worked, where the loop got stuck, how to reproduce, data/source provenance, and links to evidence. Its Claude-usage field is optional, but a substantive actual Claude contribution is the intended project direction. No inspected instruction makes Tavily, Brave, Supabase or a positive human-study result mandatory. Failed/null results should be reported honestly.

## Other services

- Vercel: already hosts the app; no personal inference.
- Supabase: reliable study persistence and access-controlled optional cross-device personal storage; not currently configured.
- Tavily Extract: extract permitted webpage text for the scientific source library; extraction is not scientific verification.
- Brave Search: optional additional source discovery; not needed alongside an adequate search/retrieval source.
- Embeddings/pgvector: later retrieve a few relevant verified concepts from a larger collection; unnecessary for three curated sources.

Recommended order: credentialed Claude verification with budget, safe personal endpoint and research-loop trace, reviewed evaluation design and durable research collection. Add automated source ingestion only when needed. Never put secrets in repository or submission text.
