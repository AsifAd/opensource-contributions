# Contribution Guide — community.general

How to go from a local fix to a merged PR.

**Hub repo (live site):** when you start, open a PR, or merge — update [docs/assets/data/contributions.json](../docs/assets/data/contributions.json) in the same push. See [WORKFLOW.md](../WORKFLOW.md).

---

## Before You Write Code

1. **Comment on the issue** — say you're working on it. Avoids duplicate PRs.
   - Example: "Hi, I'd like to take a look at this. I can reproduce the issue on 10.4.0."
2. **Read CONTRIBUTING.md** in the repo root — maintainers enforce it strictly.
3. **Check if there's already a PR** — filter issues by `has_pr` label.

---

## Commit Conventions

community.general follows standard conventions:

```
Short imperative summary (max 72 chars)

Longer explanation of WHY if needed. What was broken, what you changed,
and why this is the right fix. Reference the issue number.

Fixes: #11919
```

- Use imperative mood: "Fix", "Add", "Remove" — not "Fixed", "Added"
- No period at end of summary line
- Reference the issue in the body with `Fixes: #NNNN`

Example for our fix:
```
ini_file: do not delete comment-only lines when exclusive=True

The exclusive=True cleanup loop used match_opt() which matches any line
containing the option name, including pure doc comments (e.g. "; key").
Switch the cleanup loop to match_active_opt() so only active (uncommented)
duplicate option lines are removed.

Fixes: #11919
```

---

## Test Requirements

community.general requires tests for all bug fixes. No test = no merge.

### Test file location

```
tests/unit/plugins/modules/test_ini_file.py
```

### Running tests

```bash
# run just ini_file tests
pytest tests/unit/plugins/modules/test_ini_file.py -v

# run with coverage
pytest tests/unit/plugins/modules/test_ini_file.py -v --tb=short

# run all unit tests (slower)
pytest tests/unit/ -v
```

### What a good test looks like

- Reproduces the exact scenario from the issue report
- Tests the fix (assert the bug no longer happens)
- Tests that existing behavior still works (no regression)
- Uses descriptive names — `test_ini_file_comment_lines_not_deleted_issue_11919`
- See [bug-analysis.md](bug-analysis.md) for the full test case draft

### Integration tests (optional for bug fixes)

Integration tests live at `tests/integration/targets/ini_file/`.
For a bug fix, unit tests are usually sufficient. Maintainers will tell you if they want more.

---

## Changelog Entry

community.general uses a changelog fragment system (antsibull-changelog).
You must add a fragment file for your PR.

```bash
# create a fragment file named after your PR number
# you get the PR number after you open the PR on GitHub
# use a placeholder name for now, rename after PR is created

cat > changelogs/fragments/11919-ini-file-comment-deletion.yml << 'EOF'
bugfixes:
  - ini_file - fix an issue where comment lines containing the option name
    were deleted when ``state=present`` and ``exclusive=true``
    (https://github.com/ansible-collections/community.general/issues/11919).
EOF
```

Format rules:
- Must be valid YAML
- Key is the change type: `bugfixes`, `minor_changes`, `breaking_changes`, `deprecated_features`
- Value is a list of strings
- End the string with a link to the issue or PR in parentheses
- Keep it to one sentence

---

## Opening the PR

### Push your branch

```bash
git push origin fix/ini-file-comment-deletion-11919
```

### PR on GitHub

Go to https://github.com/AsifAd/community.general and GitHub will show a prompt to open a PR against upstream.

Target branch: `main` (the upstream main branch)

### PR title format

```
ini_file: fix comment lines being deleted when exclusive=true (#11919)
```

Pattern: `<module_name>: <short description> (#<issue>)`

### PR description template

```markdown
## Summary

Fixes #11919.

The `ini_file` module was deleting pure documentation comment lines (e.g. `; output_buffering`)
when `state=present` and `exclusive=true`, because the cleanup loop used `match_opt()` which
matches any line containing the option name including comment-only lines.

## Changes

- `plugins/modules/ini_file.py`: Switch the exclusive cleanup loop to use `match_active_opt()`
  so only active (uncommented) duplicate option lines are removed.
- `tests/unit/plugins/modules/test_ini_file.py`: Add regression test for the exact scenario
  described in the issue.
- `changelogs/fragments/11919-ini-file-comment-deletion.yml`: Changelog entry.

## Testing

```
pytest tests/unit/plugins/modules/test_ini_file.py -v
```

All existing tests pass. New test reproduces and verifies the fix.
```

---

## After Opening the PR

- CI runs automatically — watch for failures in the GitHub Actions tab
- A maintainer will review, often within a few days to a week
- They may request changes — respond directly in the PR, push new commits
- Do NOT force-push after review starts unless asked to rebase
- Once approved, a maintainer will merge — you don't merge your own PRs

---

## Common Review Feedback to Expect

- "Please add a changelog fragment" (if you forgot)
- "Can you add a test for X edge case?"
- "Rebase on main, there have been recent changes"
- Style nit: line length, variable names, docstring format

All of this is normal. Respond politely, update the PR, and re-request review.

---

## Useful Commands Reference

```bash
# check test file for existing test patterns
grep -n "def test_" tests/unit/plugins/modules/test_ini_file.py

# lint your Python (project uses flake8/pep8)
pip install flake8
flake8 plugins/modules/ini_file.py

# check for any sanity issues (requires ansible-core dev tools)
ansible-test sanity plugins/modules/ini_file.py --docker

# sync with upstream before PR
git fetch upstream
git rebase upstream/main
```
