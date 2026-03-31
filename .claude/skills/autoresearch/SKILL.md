---
name: autoresearch
description: "Karpathy-style AutoResearch loop: define metric, run experiments, eval, keep/revert, repeat. Use when user says 'autoresearch', 'auto-research', 'experiment loop', 'optimize automatically', or wants to run autonomous improvement cycles on code/prompts/skills."
allowed-tools: Bash, Read, Write, Edit, Grep, Glob, WebSearch, WebFetch
effort: max
argument-hint: "[file-to-optimize] [metric]"
---

# AutoResearch Loop (Karpathy Pattern)

Autonomous experimentation: one file, one metric, fixed budget, keep or discard.

## Setup
1. Ask user:
   - "What file/component to optimize?" (default: auto-detect main bottleneck)
   - "What metric defines success?" (speed, accuracy, score, pass rate, size)
   - "How many iterations?" (default: 20, max: 50)
   - "Time budget?" (default: 30 min)

2. Baseline:
   - Run current eval/test → record baseline score
   - Git commit current state as checkpoint: `git stash` or branch

## The Loop

```
FOR iteration IN 1..max_iterations:

  1. ANALYZE: Read current code + past failures
     What's the weakest point? What hasn't been tried?

  2. HYPOTHESIZE: One specific change, predicted impact
     Log: knowledge/research/autoresearch_[date].md

  3. IMPLEMENT: Make exactly ONE change
     Small, testable, reversible

  4. EVAL: Run the metric
     Binary: PASS (score improved) or FAIL (same or worse)

  5. DECIDE:
     IF improved → KEEP → git add + commit "autoresearch: [what] [before→after]"
     IF same/worse → REVERT → git checkout -- [files]

  6. LOG: Append to EVOLUTION_LOG.md
     [date] [iteration] [change] [score before→after] [KEEP/REVERT]

  7. CHECK: Stop conditions met?
```

## Stop Conditions
- Max iterations reached
- No improvement in last 5 iterations
- Score reached target
- Time budget exhausted
- User says stop

## Key Principles (from Karpathy)
- ONE change per iteration — never compound changes
- Binary eval — no "maybe" or "slightly better"
- ALWAYS revert failures — don't accumulate debt
- Log EVERYTHING — failures are as valuable as successes
- The loop is the product, not any single iteration

## Output
```
AutoResearch complete:
  Iterations: 23/50
  Improvements found: 7
  Score: 0.62 → 0.84 (+35%)
  Best changes: [list top 3]
  Failed experiments: [count] (logged in knowledge/research/)
  Time: 28 min
```
