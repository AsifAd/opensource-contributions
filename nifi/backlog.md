# NiFi — Backlog

From production investigation [IP-19886](../../Issues/IP-19886-g02t05-nifi-login-error/INVESTIGATION.md) (NiFi 1.27.0, g02t05).

---

## Next up

| Priority | Work | Type | Effort |
|----------|------|------|--------|
| **1** | Provenance corruption after OOM — upstream issue | Bug report | 1–2 days |
| **2** | Provenance recovery runbook | Docs PR | 2–3 days |
| **3** | UI 500 from `UpdateAttribute`/`jsonPath()` on bad attributes | Separate issue | TBD |
| **4** | Code: clearer error on corrupt provenance journal | Java fix | Weeks |

---

## Issue content sketch (priority 1)

**Title:** Node fails to restart after OOM leaves corrupt provenance journal (EncryptedWriteAheadProvenanceRepository)

**Include:**
- Version 1.27.0
- Symptom: crash loop on startup after OOM during high log volume
- Corrupt files: `*.prov.gz` under provenance_repository
- Recovery: quarantine/remove bad journal files → node starts, index rebuilds
- Flow cluster sync from peer did not fix corrupted local repo

---

## Planned

| Item | Notes |
|------|-------|
| Search JIRA for existing provenance corruption tickets | Avoid duplicate |
| `:isJson()` / HealthZ Flow processor issue | Separate upstream or internal fix first |

---

## Done / tracking

| Issue | PR/JIRA | Status | Notes |
|-------|---------|--------|-------|
| — | — | — | |
