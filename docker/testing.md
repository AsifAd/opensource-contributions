# Docker — Testing

---

## community.docker (Ansible)

```bash
source ~/dev/ansible_collections/community/general/.venv/bin/activate
cd ~/dev/ansible_collections/community/docker
ansible-test units tests/unit/plugins/modules/test_docker_image.py --python 3.11
```

Repro #790: run module in check mode with image tag + digest — document in PR.

---

## moby/moby (Go)

```bash
cd ~/oss/moby
make test
```

---

## Results log

| Work | Result |
|------|--------|
| — | |
