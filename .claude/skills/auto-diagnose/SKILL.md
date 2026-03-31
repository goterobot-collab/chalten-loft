---
name: auto-diagnose
description: "First-session project diagnosis: detect stack, ask smart questions, find gaps, search solutions, create project-specific config. Use at project start, first session, or when user says 'diagnose', 'setup', 'what do I need', 'new project'."
allowed-tools: Bash, Read, Grep, Glob, WebSearch, WebFetch, Write, Edit
effort: high
argument-hint: "[project-path]"
---

# Auto-Diagnose v2

## Phase 1: Auto-Detection (run ALL in parallel, no questions yet)
- Stack: !`ls package.json requirements.txt Cargo.toml go.mod pyproject.toml Gemfile composer.json 2>/dev/null`
- Git: !`git status --short 2>/dev/null | head -5 || echo 'No git'`
- Structure: !`ls -la 2>/dev/null`
- Claude config: !`ls .claude/ 2>/dev/null || echo 'No .claude'`
- Tests: !`find . -name "*test*" -o -name "*spec*" -maxdepth 3 2>/dev/null | head -10`
- CI/CD: !`ls .github/workflows/ Jenkinsfile .gitlab-ci.yml Dockerfile docker-compose.yml 2>/dev/null`
- Existing knowledge: !`ls knowledge/ 2>/dev/null`

## Phase 2: Smart Questions (máx 3, basadas en lo detectado)
Use AskUserQuestion. Only ask what can't be auto-detected:
1. "Detecté [stack]. ¿Es correcto? ¿Qué querés hacer hoy?"
2. "¿Cómo verifico que terminé bien?" (tests/visual/manual/score)
3. "¿Algo que NO deba tocar?"

## Phase 3: Gap Analysis

| Area | Auto-Check | If Missing |
|------|-----------|------------|
| Tests | test files exist? | Propose TDD, create scaffold |
| Linting | config files? | Search best linter for stack, install |
| Types | tsconfig/mypy? | Recommend strict type checking |
| Security | .env in .gitignore? | Fix immediately |
| CI/CD | workflow files? | Search CI patterns for stack |
| Deps | audit results? | Run npm audit / pip-audit / cargo audit |

## Phase 4: Search & Install (use subagents for parallelism)

For each gap, spawn a research-agent subagent:
- Search: "[stack] [tool] recommended setup 2026"
- Search: "claude code skill [stack]"
- Find the minimal-effort, maximal-impact fix

Propose top 3 fixes ranked by impact. Auto-apply if trivial (< 1 min).

## Phase 5: Create Project Config

Based on detected stack, generate:
1. Appropriate permissions in .claude/settings.json
2. Stack-specific verify commands
3. knowledge/INDEX.md with initial entries
4. CURRENT_TASK.md with session plan

## Output
```
Project: [name] | Stack: [detected] | State: [new/existing]
Gaps found: [count] | Fixed: [count] | Remaining: [count]
Ready to work on: [user's goal]
```
