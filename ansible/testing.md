# Ansible — Testing

How to validate changes before opening a PR.

**Setup:** [setup.md](setup.md) (activate `.venv` first)

---

## Unit tests (required)

Use **`ansible-test`**, not plain `pytest` — collection loader breaks direct pytest.

```bash
source ~/dev/ansible_collections/community/general/.venv/bin/activate
cd ~/dev/ansible_collections/community/general

# Single module test file
ansible-test units tests/unit/plugins/modules/test_ini_file.py --python 3.11
ansible-test units tests/unit/plugins/modules/test_nmcli.py --python 3.11

# Full unit suite (slow)
ansible-test units --python 3.11
```

Install if `mocker` fixture missing:

```bash
pip install pytest-mock
```

---

## Sanity tests

```bash
ansible-test sanity --test validate-modules --python 3.11 plugins/modules/nmcli.py
```

---

## Manual repro (optional)

Point Ansible at your dev clone:

```bash
source .venv/bin/activate
ANSIBLE_COLLECTIONS_PATH=~/dev ansible-playbook /tmp/test-playbook.yml
```

Example ini_file repro — see [work/ini-file-11919.md](work/ini-file-11919.md).

---

## PR test plan checklist

- [ ] Unit tests for touched module pass
- [ ] New regression test added for the bug
- [ ] `validate-modules` sanity if module args/docs changed
- [ ] Changelog fragment in `changelogs/fragments/`

---

## Results log

| Work | Command | Result |
|------|---------|--------|
| nmcli #11588 | `ansible-test units tests/unit/plugins/modules/test_nmcli.py --python 3.11` | 163 passed |
| nmcli #11588 | `ansible-test sanity --test validate-modules plugins/modules/nmcli.py` | passed |

Update when you run tests for new work.
