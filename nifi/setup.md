# NiFi — Setup

**Isolation:** Run NiFi in Docker or a VM — do not install Java/Maven on your main Mac for day-to-day work.

→ [../ISOLATION.md](../ISOLATION.md)

---

## Quick dev instance (Docker)

```bash
docker run -d --name nifi-dev \
  -p 8443:8443 \
  -e SINGLE_USER_CREDENTIALS_USERNAME=admin \
  -e SINGLE_USER_CREDENTIALS_PASSWORD=adminadminadmin \
  apache/nifi:1.27.0
```

UI: https://localhost:8443/nifi (accept self-signed cert)

Stop/cleanup:

```bash
docker stop nifi-dev && docker rm nifi-dev
```

---

## Code contributions (Java — use VM)

Only if pursuing a code fix:

```bash
# Inside Multipass VM or cloud VM — not on main Mac
git clone https://github.com/apache/nifi.git
cd nifi
# check nifi pom for Java version
mvn -T1C install -DskipTests   # heavy first build
```

---

## Fork workflow

1. Fork https://github.com/apache/nifi on GitHub
2. Clone your fork to `~/oss/nifi`
3. Branch per JIRA ticket if required by Apache process

---

## Testing

→ [testing.md](testing.md)
