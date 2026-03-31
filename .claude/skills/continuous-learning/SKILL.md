---
name: continuous-learning
description: "Auto-extract learnings from corrections and mistakes — updates knowledge base and CLAUDE.md rules without asking. Fires when Claude is corrected, makes an error, or discovers a pattern."
user-invocable: false
---

# Continuous Learning v2

## Trigger: User Correction or Error Detected

### Immediate (no asking)
1. Log to knowledge/failures/[date]_[topic].md:
   ```
   ## [Problem]
   Date: [date]
   What happened: [description]
   Why it failed: [root cause]
   Better approach: [what to do instead]
   ```

2. Extract rule: "Always/Never [action] because [reason]"

3. Check recurrence in knowledge/failures/:
   - 1st time → save as failure
   - 2nd time → promote to knowledge/instincts/ with confidence: 0.6
   - 3rd time → promote to CLAUDE.md (confidence: 0.9)

### The Pipeline
```
Correction → failures/ → patterns/ → instincts/ → CLAUDE.md
  (event)    (what)      (how)       (proven)     (permanent)
```

### Also Capture Successes
When user confirms a non-obvious approach worked:
- Save to knowledge/patterns/ with confidence: 0.7
- "User confirmed [approach] works for [scenario]"
- This prevents drift away from validated approaches

## Key: "Update your CLAUDE.md so you don't make that mistake again" (Boris)
