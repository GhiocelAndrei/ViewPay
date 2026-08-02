from fastapi import APIRouter

router = APIRouter(prefix="/assistant", tags=["assistant"])


@router.post("/chat")
def chat():
    # TODO: style-aware brainstorm via the Messages API (multi-turn, streamed).
    return {"todo": "assistant chat"}
