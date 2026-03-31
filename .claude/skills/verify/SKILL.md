---
name: verify
description: "Run project-specific verification: tests, lint, build, type-check. Auto-detects stack and runs appropriate commands. Use after any code change, or when user says 'verify', 'check', 'test', 'does it work'."
allowed-tools: Bash, Read, Grep
argument-hint: "[specific-check]"
---

# Verify v2 — Stack-Aware Verification

## Auto-Detect & Run (parallel where possible)

### Node/Bun Projects (package.json exists)
```bash
# Run in parallel:
npx tsc --noEmit 2>&1 || true        # Type check
npm run lint 2>&1 || true             # Lint
npm run test 2>&1 || true             # Tests
npm run build 2>&1 || true            # Build
```

### Python Projects (requirements.txt/pyproject.toml)
```bash
python3 -m pytest 2>&1 || true        # Tests
python3 -m mypy . 2>&1 || true        # Types
python3 -m ruff check . 2>&1 || true  # Lint
```

### Rust Projects (Cargo.toml)
```bash
cargo check 2>&1 || true
cargo test 2>&1 || true
cargo clippy 2>&1 || true
```

### Go Projects (go.mod)
```bash
go build ./... 2>&1 || true
go test ./... 2>&1 || true
go vet ./... 2>&1 || true
```

## Interpret Results
- ALL pass → "Verification PASS" → continue
- ANY fail → show EXACT error → fix → re-verify
- If test doesn't exist for changed code → propose creating one

## Boris's Rule
"Verification is probably the most important thing to get great results.
If Claude has a feedback loop, it will 2-3x the quality."
