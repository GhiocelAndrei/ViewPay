from fastapi import APIRouter

from app.models import PortraitRequest

router = APIRouter(prefix="/portrait", tags=["portrait"])


@router.post("")
def generate_portrait(req: PortraitRequest):
    # TODO: build the Creator Portrait from clip metadata + stats + cover-image vision.
    # For now, echo back that the payload arrived and parsed cleanly.
    return {
        "received": True,
        "creatorId": req.creator_id,
        "displayName": req.display_name,
        "category": req.category,
        "city": req.city,
        "county": req.county,
        "clipCount": len(req.clips),
        "engagementRate": req.aggregates.engagement_rate,
        "travelWillingness": req.questionnaire.travel_willingness,
        "acceptsShippedProducts": req.questionnaire.accepts_shipped_products,
        "canPurchaseProducts": req.questionnaire.can_purchase_products,
        "todo": "portrait generation (Claude call out of scope for this slice)",
    }
