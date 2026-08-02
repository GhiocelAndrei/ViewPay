from fastapi import FastAPI

from app.routers import assistant, portrait

app = FastAPI(title="ViewPay AI Service")


@app.get("/health")
def health():
    return {"status": "ok", "service": "viewpay-ai"}


app.include_router(portrait.router)
app.include_router(assistant.router)
