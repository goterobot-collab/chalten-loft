---
name: capture-knowledge
description: "Save a pattern, failure, or decision to the knowledge base. Auto-categorizes and updates INDEX.md. Use when something is learned, discovered, or decided."
allowed-tools: Read, Write, Edit, Grep
argument-hint: "[pattern|failure|decision] [description]"
---

# Capture Knowledge

## Auto-Categorize
- Error/mistake/fix → knowledge/failures/
- Reusable technique → knowledge/patterns/
- Architecture/tool choice → knowledge/decisions/
- Proven rule (confidence >= 0.8) → knowledge/instincts/
- Research finding → knowledge/research/

## Template: Failure
```markdown
## [Problem Name]
Date: [YYYY-MM-DD]
Context: [what was being done]
What happened: [the error]
Root cause: [why]
Solution: [what fixed it]
Prevention: [rule to avoid recurrence]
```

## Template: Pattern
```markdown
## [Pattern Name]
Date: [YYYY-MM-DD]
Context: [when to use this]
Implementation: [how]
Why it works: [explanation]
Confidence: [0.0-1.0]
```

## Template: Decision
```markdown
## [Decision]
Date: [YYYY-MM-DD]
Options considered: [list]
Chosen: [which]
Why: [reasoning]
Trade-offs: [what we gave up]
Revisit if: [conditions that would change this]
```

## After Saving
1. Update knowledge/INDEX.md with one-line summary
2. If 2+ similar failures exist → extract pattern → knowledge/instincts/
3. If instinct confidence >= 0.8 → propose adding to CLAUDE.md
