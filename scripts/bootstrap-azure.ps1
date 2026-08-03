<#
  Vira - one-time Azure + GitHub OIDC bootstrap (PowerShell native).
  Prereqs: `az login` and `gh auth login` already done.
  Run from the repo root:
      ./scripts/bootstrap-azure.ps1 -SubscriptionId <your-sub-id>
  If script execution is blocked:
      pwsh -ExecutionPolicy Bypass -File ./scripts/bootstrap-azure.ps1 -SubscriptionId <your-sub-id>
#>
[CmdletBinding()]
param(
  [Parameter(Mandatory)] [string] $SubscriptionId,
  [string] $ResourceGroup  = 'vira-rg',
  [string] $Location       = 'westeurope',
  [string] $GithubRepo     = 'GhiocelAndrei/ViewPay',   # must match the real GitHub repo
  [string] $AppDisplayName = 'vira-github-oidc'
)

# Don't auto-throw on native (az/gh) non-zero exits; we handle idempotency ourselves.
$PSNativeCommandUseErrorActionPreference = $false

foreach ($c in 'az','gh') {
  if (-not (Get-Command $c -ErrorAction SilentlyContinue)) { throw "$c CLI is required (install + login first)" }
}
function Assert-LastExit($msg) { if ($LASTEXITCODE -ne 0) { throw $msg } }

Write-Host "Subscription : $SubscriptionId"
Write-Host "Resource grp : $ResourceGroup ($Location)"
Write-Host "GitHub repo  : $GithubRepo`n"

az account set --subscription $SubscriptionId; Assert-LastExit "az account set failed - run 'az login'?"
$TenantId = az account show --query tenantId -o tsv

Write-Host '1/5 Resource group...'
az group create -n $ResourceGroup -l $Location -o none; Assert-LastExit "resource group create failed"

Write-Host '2/5 Entra app + service principal...'
$AppId = az ad app list --display-name $AppDisplayName --query "[0].appId" -o tsv
if ([string]::IsNullOrWhiteSpace($AppId)) {
  $AppId = az ad app create --display-name $AppDisplayName --query appId -o tsv; Assert-LastExit "app create failed"
}
az ad sp show --id $AppId -o none 2>$null
if ($LASTEXITCODE -ne 0) { az ad sp create --id $AppId -o none | Out-Null }

Write-Host '3/5 Federated credential (main branch)...'
$fed = @{
  name      = 'github-main'
  issuer    = 'https://token.actions.githubusercontent.com'
  subject   = "repo:${GithubRepo}:ref:refs/heads/main"
  audiences = @('api://AzureADTokenExchange')
} | ConvertTo-Json -Compress
$tmp = New-TemporaryFile
Set-Content -Path $tmp -Value $fed -Encoding ascii
az ad app federated-credential create --id $AppId --parameters "@$tmp" 2>$null
if ($LASTEXITCODE -ne 0) { Write-Host '   (federated credential already exists - ok)' }
Remove-Item $tmp -Force

Write-Host '4/5 Role assignments (retry for AAD propagation)...'
$scope = "/subscriptions/$SubscriptionId/resourceGroups/$ResourceGroup"
function New-RoleAssignment([string]$role) {
  for ($i = 1; $i -le 6; $i++) {
    az role assignment create --assignee $AppId --role $role --scope $scope -o none 2>$null
    if ($LASTEXITCODE -eq 0) { Write-Host "   $role  ok"; return }
    Start-Sleep -Seconds 10
  }
  Write-Host "   $role  - not assigned (may already exist or need an admin); verify in the portal"
}
New-RoleAssignment 'Contributor'
New-RoleAssignment 'User Access Administrator'

Write-Host '5/5 GitHub secrets + variables...'
gh secret   set AZURE_CLIENT_ID       --repo $GithubRepo --body $AppId ; Assert-LastExit "gh secret set failed - run 'gh auth login'?"
gh secret   set AZURE_TENANT_ID       --repo $GithubRepo --body $TenantId
gh secret   set AZURE_SUBSCRIPTION_ID --repo $GithubRepo --body $SubscriptionId
gh variable set AZURE_RESOURCE_GROUP  --repo $GithubRepo --body $ResourceGroup
gh variable set AZURE_LOCATION        --repo $GithubRepo --body $Location

Write-Host "`n✅ Bootstrap complete. Next:"
Write-Host "  gh secret set POSTGRES_ADMIN_PASSWORD --repo $GithubRepo   # required (invent a strong password)"
Write-Host "  gh secret set ANTHROPIC_API_KEY        --repo $GithubRepo   # optional (AI features)"
Write-Host "  Then run 'Deploy Infra', then 'Deploy Backend' + 'Deploy ai-service'."
