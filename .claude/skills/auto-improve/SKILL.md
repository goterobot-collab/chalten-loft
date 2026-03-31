---
name: auto-improve
description: "Continuous improvement loop: detect gaps, search solutions, implement, verify, keep/revert. Combines Boris's verification principle with Karpathy's AutoResearch pattern. Use when user says 'improve', 'optimize', 'make it better', 'auto-improve', or 'find improvements'."
allowed-tools: Bash, Read, Write, Edit, Grep, Glob, WebSearch, WebFetch
effort: high
argument-hint: "[area-to-improve or 'all']"
---

# Auto-Improve Loop v2

## Detection Phase (parallel)
- Tech stack: !`ls package.json requirements.txt Cargo.toml go.mod pyproject.toml 2>/dev/null`
- Test count: !`find . -name "*test*" -o -name "*spec*" -maxdepth 3 2>/dev/null | wc -l`
- Known failures: !`ls knowledge/failures/ 2>/dev/null`
- Last research: !`ls -t knowledge/research/weekly_*.md 2>/dev/null | head -1`
- Evaluator exists: !`ls evaluator_v2.py 2>/dev/null`

## Baseline
If evaluator exists → run it → record score
If not → manual checklist:
  - CLAUDE.md has learned errors? [y/n]
  - CURRENT_TASK.md up to date? [y/n]
  - knowledge/ has useful entries? [y/n]
  - Tests exist and pass? [y/n]
  - Linting configured? [y/n]

## The Loop

```
FOR EACH area IN [security, correctness, testing, performance, code-quality, DX]:

  1. ANALYZE current state (read files, run tools)

  2. SEARCH best practices (use research-agent subagent)
     - "[stack] [area] best practices 2026"
     - "[stack] [area] common mistakes"

  3. COMPARE: gap = best_practice - current_state
     Skip if gap is trivial

  4. RANK by: security > correctness > impact > effort
     Pick TOP 1 improvement

  5. PROPOSE to user:
     "[Area] — [Change] — Impact: [high/med/low] — Effort: [quick/mod/sig]"

  6. IF approved → IMPLEMENT
     → Run verification (tests, lint, build)
     → IF passes → KEEP → commit → knowledge/patterns/
     → IF fails → REVERT → knowledge/failures/

  7. RE-SCORE if evaluator exists

  8. LOG to EVOLUTION_LOG.md:
     [date] [area] [change] [score before→after] [KEEP/REVERT]
```

## Parallel Execution
When multiple improvements are independent:
- Use subagents for each area simultaneously
- Each subagent: analyze → search → propose
- Main agent: review proposals → implement sequentially (verify between each)

## Stop Conditions
- User says stop
- All areas checked, no gaps remain
- 10 improvements without user feedback → pause and ask
- 15 iterations with no score improvement
- Score reached maximum

## Output Per Improvement
```
[IMPROVE] area=testing change="Added auth edge case tests"
  Impact: high | Effort: quick | Verify: PASS (tests: 45→52)
  Captured: knowledge/patterns/auth-edge-cases.md
  Score: 6.2→6.8
```
