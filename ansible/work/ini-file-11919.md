# Bug Analysis — Issue #11919

**Title:** `ini_file` removes comment lines that contain the key name prefix  
**Upstream:** https://github.com/ansible-collections/community.general/issues/11919  
**Module file:** `plugins/modules/ini_file.py`  
**PR:** https://github.com/ansible-collections/community.general/pull/12083  
**Branch:** `fix/ini-file-comment-deletion-11919`  
**Status:** PR open (May 2026)  
**Reported on:** community.general 10.4.0, ansible-core 2.17.14, Ubuntu 24.04

---

## The Problem

When running `ini_file` with `state=present` on an option like `output_buffering`, the module also **deletes pure comment lines** that happen to contain the word `output_buffering` — even though those lines are documentation, not config.

### Input INI file

```ini
[PHP]
;   Integer = Enables the buffer and sets its maximum size in bytes.
; Note: This directive is hardcoded to Off for the CLI SAPI
; Default Value: Off
; output_buffering              <-- doc comment, should NOT be touched
; Development Value: 4096
; Production Value: 4096
; https://php.net/output-buffering
;output_buffering = 4096        <-- commented config, OK to replace
```

### Task

```yaml
- community.general.ini_file:
    path: my-php.ini
    section: PHP
    option: output_buffering
    value: '123'
    state: present
```

### Expected result

```ini
[PHP]
;   Integer = Enables the buffer and sets its maximum size in bytes.
; Note: This directive is hardcoded to Off for the CLI SAPI
; Default Value: Off
; output_buffering              <-- still here
; Development Value: 4096
; Production Value: 4096
; https://php.net/output-buffering
output_buffering = 123          <-- replaced from commented config
```

### Actual result (buggy)

```ini
[PHP]
;   Integer = Enables the buffer and sets its maximum size in bytes.
; Note: This directive is hardcoded to Off for the CLI SAPI
; Default Value: Off
; Development Value: 4096       <-- gap where "; output_buffering" was
; Production Value: 4096
; https://php.net/output-buffering
output_buffering = 123
```

The `; output_buffering` line was deleted. The `;output_buffering = 4096` was also deleted (instead of replaced in-place).

---

## Root Cause

### The two regex functions (lines 271–278)

```python
def match_opt(option, line):
    option = re.escape(option)
    return re.match(f"( |\t)*([#;]?)( |\t)*({option})( |\t)*(=|$)( |\t)*(.*)", line)

def match_active_opt(option, line):
    option = re.escape(option)
    return re.match(f"()()( |\t)*({option})( |\t)*(=|$)( |\t)*(.*)", line)
```

- `match_opt` — matches both active and commented lines (the `[#;]?` group)
- `match_active_opt` — matches only active (non-commented) lines

The `(=|$)` at the end is meant to require either `=` or end-of-line after the option name.

**The flaw:** A line like `; output_buffering` ends right after the option name with no `=`, so `$` matches — making `match_opt` treat it as a valid match. This is a false positive for pure documentation comments.

### The deletion loop (lines ~478–483)

```python
# state=present + exclusive=True: remove all remaining option occurrences
for index in range(len(section_lines) - 1, 0, -1):
    if not changed_lines[index] and match_function(option, section_lines[index]):
        del section_lines[index]   # BUG: deletes doc comments too
        del changed_lines[index]
        changed = True
        msg = "option changed"
```

When `modify_inactive_option=True` (the default), `match_function = match_opt`. So this loop uses the broad regex and deletes **any line** containing the option name — including pure comment lines.

### Why `modify_inactive_option=False` doesn't fully help

Setting `modify_inactive_option=False` switches to `match_active_opt` everywhere, which would skip the commented lines entirely. But then the legitimate `;output_buffering = 4096` line would never be replaced either. The user wants the commented config replaced but the doc comments untouched — that's a finer distinction.

---

## Fix Strategy

### Option A — Fix the regex (most surgical)

Distinguish between:
1. `;output_buffering = 4096` — has `=` after the key → commented config, OK to match
2. `; output_buffering` — no `=`, ends after key → doc comment, should NOT match

Change `match_opt` to require `=` when the line has a comment character:

```python
def match_opt(option, line):
    option = re.escape(option)
    # If line starts with a comment char, require = (not bare end-of-line)
    # This prevents matching pure doc comments like "; output_buffering"
    return re.match(f"( |\t)*([#;]?)( |\t)*({option})( |\t)*(=|$)( |\t)*(.*)", line)
```

Specifically, the fix would be to add a conditional: if group(2) is non-empty (comment character present), then group(6) must be `=`, not `$`.

### Option B — Fix the deletion loop (safer, more targeted)

In the `exclusive=True` cleanup loop, always use `match_active_opt` instead of `match_function`. This means: when cleaning up leftover/duplicate option lines, only delete **active** (uncommented) lines. Commented lines that were already handled by the first pass (replace in-place) should not be subject to deletion here.

```python
# Before (buggy):
if not changed_lines[index] and match_function(option, section_lines[index]):

# After (fix):
if not changed_lines[index] and match_active_opt(option, section_lines[index]):
```

This is the safer option because:
- It doesn't change `match_opt` semantics (which is used in many other places)
- It's a minimal, targeted change
- The deletion loop's intent is "remove duplicate active options" — using `match_active_opt` matches that intent

### Option C — Both (belt and suspenders)

Fix the regex AND the deletion loop. This is the most correct but requires more test coverage.

---

## Files to Change

| File | What to change |
|------|----------------|
| `plugins/modules/ini_file.py` | Fix the deletion loop around line 480 |
| `tests/unit/plugins/modules/test_ini_file.py` | Add test case reproducing the bug |

---

## Test Case to Add

```python
def test_ini_file_comment_lines_not_deleted(self, tmpdir):
    """
    Regression test for #11919:
    Pure doc comments containing the key name must not be deleted
    when state=present and exclusive=True.
    """
    ini_content = (
        "[PHP]\n"
        ";   Some description about output_buffering.\n"
        "; output_buffering\n"           # doc comment — must survive
        "; Development Value: 4096\n"
        ";output_buffering = 4096\n"     # commented config — gets replaced
    )
    path = str(tmpdir.join("test.ini"))
    with open(path, "w") as f:
        f.write(ini_content)

    do_ini(
        module=...,
        filename=path,
        section="PHP",
        option="output_buffering",
        values=["123"],
        state="present",
        exclusive=True,
        modify_inactive_option=True,
    )

    with open(path) as f:
        result = f.read()

    assert "; output_buffering\n" in result, "Doc comment should not be deleted"
    assert "output_buffering = 123\n" in result, "Active config should be set"
    assert ";output_buffering = 4096\n" not in result, "Old commented config should be gone"
```

---

## Notes

- The bug exists regardless of whether `modify_inactive_option` is `True` or `False`
- It affects any INI file with doc comments above commented config entries (common in PHP, MySQL, nginx conf-style files)
- `exclusive=True` is the default, so most users hit this
- The fix must not break the `modify_inactive_option=True` behavior of replacing `;key=val` lines
