---
name: evolve
description: "Meta-improvement: audit the framework itself, find gaps in skills/hooks/agents, propose and implement upgrades. Use after milestones, or when user says 'evolve', 'improve framework', 'audit', 'meta-improvement'."
allowed-tools: Read, Grep, Glob, Write, Edit, WebSearch
effort: high
argument-hint: "[component-to-audit]"
---

# Evolve Framework v2

## Step 1: Score Current State
If evaluator exists → `python3 evaluator_v2.py .` → baseline score
If not → manual audit:
- CLAUDE.md quality (specific rules, not vague) [0-2]
- knowledge/ usefulness (real entries, not templates) [0-2]
- Skills coverage (stack-relevant skills exist) [0-2]
- Hooks effectiveness (actually run checks, not just echo) [0-2]
- Agents defined for common tasks [0-2]
Total: /10

## Step 2: Identify Highest-Impact Gap
Priority: security > correctness > automation > quality > style

Questions:
- What manual step could a hook automate?
- What repeated task lacks a skill?
- What error keeps happening that CLAUDE.md doesn't prevent?
- What knowledge/ category is empty?
- Is there a new Claude Code feature we're not using?

## Step 3: Implement ONE Change
- Small, testable, reversible
- Anti-proliferation: modify existing file over creating new one

## Step 4: Re-Score
- Run evaluator or re-audit
- IF improved → keep → commit "evolve: [change] [score before→after]"
- IF same/worse → revert

## Step 5: Log
EVOLUTION_LOG.md:
```
[date] [type:skill|hook|agent|rule] [what changed] [score: X→Y]
```

## Step 6: Search for External Improvements
If last weekly-research > 7 days ago → run /weekly-research first
