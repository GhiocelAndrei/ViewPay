# ViewPay

Marketplace connecting TikTok creators with brands — **fit, not volume**. This repo is the
4-week demo, built as the foundation for the full 13-week program. Architecture decisions are
recorded in [`BUILD_PLAN.md`](./BUILD_PLAN.md).

## Structure

```
ViewPay/
  frontend/            React + Vite + TS + Tailwind (SPA) → Vercel
  backend/             .NET 10, layered: Api → Application → DataAccess → Abstractions
    src/ViewPay.Api/             Controllers = the gateway; Program.cs; Swagger
    src/ViewPay.Application/      Interfaces, Services (AI + TikTok HttpClients), Mapping, ApplicationExtensions
    src/ViewPay.DataAccess/       EF Core DbContext, migrations, DataAccessExtensions
    src/ViewPay.Abstractions/     Models (entities), DTOs, Settings, Constants, Common (shared leaf)
  ai-service/          Python + FastAPI → Azure Container Apps (Anthropic SDK)
  packages/contracts/  shared types (mostly generated from OpenAPI)
  docker-compose.yml   local: Postgres + backend + ai-service
```

3 deployables. Postgres (schema-per-service). Firebase = business auth + media storage. Secrets in
Azure Key Vault. CI = GitHub Actions.

> This is a **skeleton** — projects build and run, but the logic is stubbed (`TODO`s throughout).

## Run locally

```bash
cp .env.example .env          # then fill in secrets

# everything via containers:
docker compose up --build     # postgres :5432 · ai-service :8000 · backend :8080

# or per service:
dotnet run --project backend/src/ViewPay.Api      # :8080  (Swagger at /swagger)
uvicorn app.main:app --reload --port 8000 --app-dir ai-service   # :8000 (/docs)
npm --prefix frontend install && npm --prefix frontend run dev   # :5173
```

## Health checks

- backend: `GET http://localhost:8080/health`
- ai-service: `GET http://localhost:8000/health`
