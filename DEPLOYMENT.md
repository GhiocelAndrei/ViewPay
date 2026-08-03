# Vira — Deployment

Deploy the walking skeleton end-to-end **before** building features, so "works locally" and
"works in prod" stay in sync. Every push to `main` redeploys and smoke-tests.

```
frontend (React)  → Vercel            (auto deploy on push; PR preview URLs)
backend (.NET)    → Azure Container Apps   (external ingress)   ┐  built by ACR Tasks,
ai-service (Py)   → Azure Container Apps   (internal ingress)   ┘  deployed on push to main
Postgres          → Azure DB for PostgreSQL (Flexible)
secrets           → Azure Key Vault (referenced by the apps via managed identity)
GitHub → Azure    → OIDC federated (no stored cloud secret)
```

## Prerequisites (once)

- `az login` (Azure CLI) — you're on 2.73 ✓
- `gh auth login` (GitHub CLI) — you're on 2.57 ✓
- A Vercel account
- Your Azure **subscription id**

## 1. Bootstrap Azure + GitHub (one time)

Creates the resource group, the GitHub→Azure OIDC federation, and sets the repo secrets/vars.

**PowerShell (recommended on Windows):**
```powershell
./scripts/bootstrap-azure.ps1 -SubscriptionId <your-sub-id>
# if script execution is blocked:
pwsh -ExecutionPolicy Bypass -File ./scripts/bootstrap-azure.ps1 -SubscriptionId <your-sub-id>
```

**Git Bash alternative** (NOT PowerShell's `bash`, which is WSL and can't see gh):
```bash
SUBSCRIPTION_ID=<your-sub-id> "/c/Program Files/Git/bin/bash.exe" scripts/bootstrap-azure.sh
```

Then set the Postgres password (and optionally the Anthropic key):
```
gh secret set POSTGRES_ADMIN_PASSWORD --repo GhiocelAndrei/ViewPay   # required (strong password)
gh secret set ANTHROPIC_API_KEY        --repo GhiocelAndrei/ViewPay   # optional (AI features)
```

> The scripts default `-GithubRepo` to `GhiocelAndrei/ViewPay` (your current repo). If you rename
> the GitHub repo to `Vira`, rename it on GitHub, run `git remote set-url origin ...`, and pass
> `-GithubRepo GhiocelAndrei/Vira`.

This sets: secrets `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, `AZURE_SUBSCRIPTION_ID`,
`POSTGRES_ADMIN_PASSWORD`, `ANTHROPIC_API_KEY`; variables `AZURE_RESOURCE_GROUP`, `AZURE_LOCATION`.

## 2. Provision infrastructure (Bicep)

GitHub → **Actions → Deploy Infra → Run workflow**. Provisions Log Analytics, Container Apps
environment, ACR, managed identity, Key Vault, Postgres, and the two Container Apps (with
placeholder images). Re-runnable; run again whenever `infra/main.bicep` changes.

> First run may show the apps as unhealthy — expected, they're still on the placeholder image.
> Step 3 pushes the real images. (If a role-assignment propagation race fails the run, just re-run it.)

## 3. First app deploy

GitHub → **Actions → Deploy Backend → Run**, then **Deploy ai-service → Run**. Each builds the
image in ACR, updates the Container App, and verifies health. After this, every push to `main`
that touches `backend/**` or `ai-service/**` redeploys automatically.

Get the backend URL:
```bash
az containerapp show -n vira-backend -g <rg> --query properties.configuration.ingress.fqdn -o tsv
```

## 4. Frontend on Vercel

1. Vercel → **Add New → Project** → import `GhiocelAndrei/ViewPay`.
2. **Root Directory = `frontend`** (framework auto-detects as Vite via `frontend/vercel.json`).
3. Environment variables:
   - `VITE_API_BASE_URL` = `https://<backend-fqdn>` (from step 3)
   - `VITE_FIREBASE_*` (when auth lands)
4. Deploy. Vercel now auto-deploys `main` (production) and **every PR gets a preview URL**.

## The per-change loop

| You do | What happens |
|---|---|
| Open a PR | `ci.yml` builds all 3 services; Vercel posts a frontend preview URL |
| Merge to `main` (backend/ai change) | Image built in ACR → Container App updated → `/health` smoke-tested |
| Merge to `main` (frontend change) | Vercel deploys production |

## ⚠ Cross-origin auth (when login lands)

Vercel (`*.vercel.app`) and Azure (`*.azurecontainerapps.io`) are **different sites**, so the
HttpOnly session cookie (D5) won't be first-party by default. Before wiring auth, either:
- put both behind one registrable domain (`app.vira.com` + `api.vira.com`, cookie `Domain=.vira.com`, `SameSite=Lax`), **or**
- set the cookie `SameSite=None; Secure` and pin credentialed CORS to the exact Vercel origin.

## Teardown

```bash
az group delete -n <rg> --yes --no-wait   # removes all Azure resources
```
