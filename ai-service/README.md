# ai-service (Python / FastAPI)

The AI core. `IAiModelClient` black-box contract; primary impl = Anthropic SDK (`claude-opus-4-8`).
Owns: Creator Portrait, style-aware Assistant, and the (stubbed) analysis pipeline.

## Run locally

```bash
python -m venv .venv && . .venv/Scripts/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Health: http://localhost:8000/health · Docs: http://localhost:8000/docs
