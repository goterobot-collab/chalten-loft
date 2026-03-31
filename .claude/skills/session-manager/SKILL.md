---
name: session-manager
description: "Initialize or close a work session — loads context on start, saves state on close. Use when starting work ('start', 'begin', 'continue') or ending ('close', 'wrap up', 'done', 'handoff')."
disable-model-invocation: true
---

# Session Manager v2

## Dynamic Context
- Git: !`git branch --show-current 2>/dev/null` / !`git status --short 2>/dev/null | wc -l` modified files
- Knowledge: !`ls knowledge/ 2>/dev/null`
- Last research: !`ls -t knowledge/research/weekly_*.md 2>/dev/null | head -1`

## On Start

### Returning Session (CURRENT_TASK.md has content)
1. Read CURRENT_TASK.md + knowledge/failures/ (parallel)
2. Summarize: "Last session: [X]. Next step: [Y]."
3. Ask: "Continue with [Y] or something new?"
4. If > 7 days since last weekly research → mention it

### New Project (no context)
1. Run /auto-diagnose
2. Create initial knowledge structure

## On Close
1. Update CURRENT_TASK.md:
   ```
   ## Done This Session
   - [specific changes, files modified]

   ## Current State
   - [what works, what doesn't]

   ## Next Steps
   1. [concrete next action]
   2. [second priority]

   ## Blockers
   - [if any]

   ## Start Phrase
   "Continue with [specific next step]"
   ```
2. Capture learnings → knowledge/ (use learn-agent)
3. Update EVOLUTION_LOG.md if improvements were made
4. Report: "Done: [1-line]. Next: [1-line]. Score: [X/10]."
