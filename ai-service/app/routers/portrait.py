from fastapi import APIRouter

router = APIRouter(prefix="/portrait", tags=["portrait"])


@router.post("")
def generate_portrait():
    # TODO: build the Creator Portrait from clip metadata + stats + cover-image vision.
    return {"todo": "portrait generation"}
