# NiFi — Testing

---

## Bug report / repro (most likely first contribution)

No automated test suite needed for upstream issue filing.

### Checklist for a good NiFi JIRA/GitHub issue

- [ ] NiFi version: **1.27.0**
- [ ] Provenance impl: `org.apache.nifi.provenance.EncryptedWriteAheadProvenanceRepository`
- [ ] Steps: OOM during log storm → corrupt `*.prov.gz` → restart fails
- [ ] What fixed it: quarantine bad journal files under `provenance_repository/`
- [ ] What did **not** fix it: flow sync from peer alone
- [ ] Redacted log snippets
- [ ] Search duplicates first: [GitHub issues](https://github.com/apache/nifi/issues) + [NIFI JIRA](https://issues.apache.org/jira/projects/NIFI)

Source material: [IP-19886 investigation](../../Issues/IP-19886-g02t05-nifi-login-error/INVESTIGATION.md)

---

## Manual testing (Docker dev instance)

```bash
# After setup.md docker run
curl -k -u admin:adminadminadmin https://localhost:8443/nifi-api/system-diagnostics
```

Validate processor behaviour, provenance settings, restart behaviour.

---

## Code fix testing (Java)

```bash
cd ~/oss/nifi   # inside VM
mvn test -pl nifi-commons/nifi-utils   # example — module depends on change
mvn -T1C verify -DskipITs              # broader — slow
```

Follow module-specific docs in NiFi contributor guide.

---

## Results log

| Work | Method | Result |
|------|--------|--------|
| — | — | Update when started |
