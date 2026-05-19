# Terraform — Testing

---

## Core Terraform (Go)

```bash
cd ~/oss/terraform/core
go test ./internal/... -run TestYourPackage
make test   # if Makefile target exists — check repo CONTRIBUTING.md
```

---

## Provider acceptance tests

Providers use real/cloud APIs — use dedicated dev accounts only:

```bash
cd ~/oss/terraform-provider-example
TF_ACC=1 go test ./... -v -timeout 120m
```

Never run acceptance tests against production credentials.

---

## Results log

| Work | Result |
|------|--------|
| — | |
