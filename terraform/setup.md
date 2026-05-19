# Terraform — Setup

**Isolation:** Separate directory and state — never touch work Terraform state.

→ [../ISOLATION.md](../ISOLATION.md)

```bash
mkdir -p ~/oss/terraform
export TF_DATA_DIR=~/oss/terraform/.terraform-plugin-cache   # optional

# Install tfenv or use brew install terraform (only if needed)
brew install tfenv
tfenv install 1.9.0
tfenv use 1.9.0
```

Core Terraform (Go):

```bash
git clone https://github.com/hashicorp/terraform.git ~/oss/terraform/core
cd ~/oss/terraform/core
go build -o bin/terraform .
```

Use **local backend** for learning:

```hcl
terraform {
  backend "local" {
    path = "~/oss/terraform/state/terraform.tfstate"
  }
}
```

→ [testing.md](testing.md)
