#!/usr/bin/env bash
# One-time bootstrap: resource group + GitHub OIDC federation + repo secrets/vars.
# Prereqs: `az login` and `gh auth login` already done. Run from the repo root:
#   SUBSCRIPTION_ID=<sub> bash scripts/bootstrap-azure.sh
set -euo pipefail

# ---- configure (override via env) ----
SUBSCRIPTION_ID="${SUBSCRIPTION_ID:-}"                 # REQUIRED
RESOURCE_GROUP="${RESOURCE_GROUP:-vira-rg}"
LOCATION="${LOCATION:-westeurope}"
GITHUB_REPO="${GITHUB_REPO:-GhiocelAndrei/Vira}"    # owner/repo
APP_DISPLAY_NAME="${APP_DISPLAY_NAME:-vira-github-oidc}"
# --------------------------------------

command -v az >/dev/null || { echo "az CLI required"; exit 1; }
command -v gh >/dev/null || { echo "gh CLI required"; exit 1; }
[ -n "$SUBSCRIPTION_ID" ] || { echo "Set SUBSCRIPTION_ID (env var)"; exit 1; }

echo "Subscription : $SUBSCRIPTION_ID"
echo "Resource grp : $RESOURCE_GROUP ($LOCATION)"
echo "GitHub repo  : $GITHUB_REPO"
echo

az account set --subscription "$SUBSCRIPTION_ID"
TENANT_ID=$(az account show --query tenantId -o tsv)

echo "Registering resource providers (subscription-level, one-time)…"
PROVIDERS="Microsoft.App Microsoft.OperationalInsights Microsoft.ContainerRegistry Microsoft.ManagedIdentity Microsoft.KeyVault Microsoft.DBforPostgreSQL"
for p in $PROVIDERS; do az provider register --namespace "$p" >/dev/null 2>&1; done
for i in $(seq 1 30); do
  pending=""
  for p in $PROVIDERS; do
    [ "$(az provider show --namespace "$p" --query registrationState -o tsv 2>/dev/null)" = "Registered" ] || pending="$pending $p"
  done
  [ -z "$pending" ] && { echo "   all registered"; break; }
  sleep 10
done

echo "1/5 Resource group…"
az group create -n "$RESOURCE_GROUP" -l "$LOCATION" -o none

echo "2/5 Entra app + service principal…"
APP_ID=$(az ad app list --display-name "$APP_DISPLAY_NAME" --query "[0].appId" -o tsv)
if [ -z "$APP_ID" ]; then
  APP_ID=$(az ad app create --display-name "$APP_DISPLAY_NAME" --query appId -o tsv)
fi
az ad sp show --id "$APP_ID" >/dev/null 2>&1 || az ad sp create --id "$APP_ID" -o none

echo "3/5 Federated credential (main branch)…"
# Read the repo's actual OIDC subject prefix from GitHub (may embed immutable IDs).
PREFIX=$(gh api "repos/${GITHUB_REPO}/actions/oidc/customization/sub" --jq '.sub_claim_prefix' 2>/dev/null || true)
[ -n "$PREFIX" ] || PREFIX="repo:${GITHUB_REPO}"
SUBJECT="${PREFIX}:ref:refs/heads/main"
echo "   subject: $SUBJECT"
az ad app federated-credential create --id "$APP_ID" --parameters "{
  \"name\": \"github-main\",
  \"issuer\": \"https://token.actions.githubusercontent.com\",
  \"subject\": \"${SUBJECT}\",
  \"audiences\": [\"api://AzureADTokenExchange\"]
}" >/dev/null 2>&1 || echo "   (federated cred already exists — ok)"

echo "4/5 Role assignments on the resource group…"
RG_SCOPE="/subscriptions/${SUBSCRIPTION_ID}/resourceGroups/${RESOURCE_GROUP}"
# Contributor: deploy + build + update apps. User Access Administrator: Bicep creates
# role assignments (ACR pull / Key Vault) for the app's managed identity.
az role assignment create --assignee "$APP_ID" --role "Contributor" --scope "$RG_SCOPE" -o none 2>/dev/null || true
az role assignment create --assignee "$APP_ID" --role "User Access Administrator" --scope "$RG_SCOPE" -o none 2>/dev/null || true

echo "5/5 GitHub secrets + variables…"
gh secret   set AZURE_CLIENT_ID       --repo "$GITHUB_REPO" --body "$APP_ID"
gh secret   set AZURE_TENANT_ID       --repo "$GITHUB_REPO" --body "$TENANT_ID"
gh secret   set AZURE_SUBSCRIPTION_ID --repo "$GITHUB_REPO" --body "$SUBSCRIPTION_ID"
gh variable set AZURE_RESOURCE_GROUP  --repo "$GITHUB_REPO" --body "$RESOURCE_GROUP"
gh variable set AZURE_LOCATION        --repo "$GITHUB_REPO" --body "$LOCATION"

echo
echo "✅ Bootstrap complete."
echo "Next:"
echo "  gh secret set POSTGRES_ADMIN_PASSWORD --repo $GITHUB_REPO      # required"
echo "  gh secret set ANTHROPIC_API_KEY        --repo $GITHUB_REPO      # optional (AI features)"
echo "  Then run the 'Deploy Infra' workflow, then 'Deploy Backend' + 'Deploy ai-service'."
