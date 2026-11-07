# Noocene Lab

Public source: https://github.com/Herzilove/noocene-lab

Mind Quest is a short, objectively scored reasoning experience. INNERSPACE is a guided reflection on personal situations. A reproducible research runner tests the analysis pipeline separately from the web experience.

## Run

Requires Node.js 24+ and pnpm. Commands run from this repository:

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm typecheck
pnpm test
pnpm research:reproduce
pnpm build
pnpm start --port 3100
# In a second terminal, with Chrome installed:
pnpm test:e2e
```

Open http://127.0.0.1:3000 during development or http://127.0.0.1:3100 for the production test. Webpack is selected explicitly because Turbopack failed to start its CSS worker in the tested Windows environment.

## Working prototype

All website routes, accessibility labels, server-returned prompts and errors use English. User-authored saved cards keep their original language. The English objective task and study have distinct version IDs to avoid silently pooling translated and earlier German trials.

- Responsive landing, Mind Quest, discovery, INNERSPACE, research, privacy and protected research export interface.
- One original, logically checked multiple-choice problem; initial/revised answers, confidence, randomized independent/guided conditions and deterministic grading.
- Separate optional consent for research storage and sending reasoning-task data to Claude.
- Server-controlled transitions, expiring anonymous sessions, origin checks, validated inputs and authenticated aggregate-data access.
- One INNERSPACE entry with three reflection steps, an optional reality check, rule-based grounded insights, source-linked exercises and a discovery garden. Unsaved entries remain in tab memory; saving a card and revisiting an outcome requires an explicit local-device choice.
- Repeatable synthetic analysis with tests, metrics, SVG, manifest, hashes, validation and a next-experiment proposal.

The single question is not a psychometrically validated task bank. Repeated attempts are not independent participants. The web flow is a feasibility prototype, not a completed efficacy experiment.

## Model configuration

Copy `.env.example` to `.env.local`. Default mode makes no paid requests and labels guided prompts as a demo. A configured live integration uses the official Anthropic SDK to select one of three reviewed Socratic prompts. Arbitrary model text never becomes an answer hint. This is constrained adaptive selection, not unrestricted question generation.

Set `ENABLE_LIVE_AI=true`, an API key, and an available `ANTHROPIC_MODEL` only after choosing a usage budget. Configure `APP_ORIGIN` to the exact public origin behind a reverse proxy. Set a random `ADMIN_TOKEN` of at least 32 characters for the research export. Never commit actual values. The deployed objective quest was verified with actual provider calls on 2026-11-07, including a full mobile browser flow. The exact configured model ID and token usage were not captured; adaptive personal INNERSPACE calls remain unimplemented.

## Research loop

```sh
pnpm research:reproduce
```

The approved synthetic fixture is `research/sample.json`. Each run writes a new ignored directory under `research/runs/`, including the hypothesis, configuration, software snapshot, tests, metrics, visualization and report. Identical inputs produce identical metric results. Synthetic and real data must never be combined or described as equivalent evidence.

The runner executes a finite, auditable analysis loop over a curated literature registry. It does not autonomously browse literature or invent and execute new analysis code. Next experiments are proposals requiring human approval. There are no human efficacy results. See `docs/EXPERIMENT.md` and `docs/ACCEPTANCE.md` for the remaining study requirements.

Web feasibility exports and the synthetic experiment use different schemas. A reviewed importer, participant accounting, preregistered allocation and a suitable task bank are required before real-study analysis.

## Storage and deployment

Research data currently lives only in bounded server process memory with a 30-minute expiry. Restarting the process, exiting or replacing a session can remove its record. This is unsuitable for durable or distributed study collection. INNERSPACE narratives are not sent to Claude or stored by the server.

Supabase persistence, policies and migrations remain open. Dedicated intended cloud resources are listed in `docs/INFRASTRUCTURE.md`; no existing app database or deployment is reused. The dedicated Vercel project is live at https://noocene-lab.vercel.app. Supabase is not provisioned.

## License and source material

Original code: Apache-2.0 (`LICENSE`). Original documentation and synthetic fixture: CC BY 4.0 (`LICENSE-CC-BY-4.0`). Third-party components retain their licenses. Source PDFs, private chats, credentials and participant narratives are excluded from this repository.

See `docs/DEMO.md` for the demonstration and `docs/SUBMISSION.md` for the event submission draft.
