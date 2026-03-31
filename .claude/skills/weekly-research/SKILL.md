---
name: weekly-research
description: "Search the web for new Claude Code features, tips, skills, and MCP tools. Updates knowledge base with findings. Use weekly or when user says 'weekly research', 'search for updates', 'what's new', or 'find improvements'."
allowed-tools: Read, Write, Edit, Grep, WebSearch, WebFetch
effort: high
argument-hint: "[specific-topic]"
---

# Weekly Research — Ecosystem Updates

## Pre-check
- Last research: !`ls -t knowledge/research/weekly_*.md 2>/dev/null | head -1`
- Current framework version: !`cat .claude/VERSION 2>/dev/null || echo 'unknown'`

## Search Sequence (run ALL, use subagents for parallelism)

### 1. New Features
Search: "claude code new features [current-month] [current-year]"
Search: "claude code changelog [current-year]"
→ Any features we're not using?
→ Any deprecations?

### 2. Tips & Tricks
Search: "claude code tips tricks workflow [current-year]"
Search: "site:x.com bcherny claude code"
Search: "howborisusesclaudecode.com"
→ New techniques from Boris or community?

### 3. Skills & Plugins
Search: "claude code skills plugins MCP [current-year]"
Search: "awesome claude code github"
→ New skills/MCPs relevant to our stack?
→ Security advisories on existing plugins?

### 4. Self-Improvement Patterns
Search: "claude code self improving autonomous agent [current-year]"
Search: "autoresearch karpathy [current-year]"
→ Better auto-improvement patterns?

### 5. Stack-Specific
Detect stack from package.json/requirements.txt/etc, then:
Search: "[stack] best practices [current-year]"
Search: "[stack] claude code skill"

## For EACH Finding
1. Is it relevant to our project? (yes/no)
2. If yes: Does it improve something? (speed/quality/safety/DX)
3. If improves:
   - Effort to adopt: quick (<5 min) / moderate (15-30 min) / significant (1+ hr)
   - Propose to user if moderate+, auto-apply if quick
4. If not relevant but interesting: save to knowledge/research/
5. If not useful: skip

## Output
Save to: knowledge/research/weekly_[YYYY-MM-DD].md
```markdown
# Weekly Research [date]

## New Features Found
- [feature]: [impact for us] [action: adopt/skip/investigate]

## Tips Discovered
- [tip]: [source] [action]

## Skills/MCPs Found
- [name]: [what it does] [relevant: yes/no]

## Stack Updates
- [update]: [action]

## Applied This Session
- [change]: [result]

## Next Research: [date + 7 days]
```
