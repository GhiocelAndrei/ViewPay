from datetime import datetime
from enum import Enum

from pydantic import BaseModel, ConfigDict, Field


class StyleVector(BaseModel):
    """8 scored style dimensions, 0–100 each (dev-doc §6)."""
    warmth: int = 0
    energy: int = 0
    authority: int = 0
    refinement: int = 0
    convention: int = 0
    humor: int = 0
    demonstration: int = 0
    intimacy: int = 0


# ── Portrait request contract ──────────────────────────────────────────────────────────────
# Mirrors PortraitRequestDto on the .NET side. The backend serializes camelCase + string enums;
# these models accept both the alias (camelCase) and the field name via populate_by_name.
# Enum *values* must match the C# member names exactly (e.g. "Ugc", "PaidPost").


class CreatorCategory(str, Enum):
    food = "Food"
    sport = "Sport"
    tech = "Tech"
    beauty = "Beauty"
    travel = "Travel"
    comedy = "Comedy"
    education = "Education"
    lifestyle = "Lifestyle"
    gaming = "Gaming"
    music = "Music"


class TravelWillingness(str, Enum):
    none = "None"
    same_county = "SameCounty"
    nationwide = "Nationwide"
    out_of_country = "OutOfCountry"


class Clip(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    tik_tok_video_id: str = Field(alias="tikTokVideoId")
    title: str | None = None
    cover_image_url: str | None = Field(default=None, alias="coverImageUrl")
    embed_link: str | None = Field(default=None, alias="embedLink")
    view_count: int = Field(alias="viewCount")
    like_count: int = Field(alias="likeCount")
    comment_count: int = Field(alias="commentCount")
    share_count: int = Field(alias="shareCount")
    tik_tok_create_time: datetime = Field(alias="tikTokCreateTime")


class Aggregates(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    avg_views: int = Field(alias="avgViews")
    avg_likes: int = Field(alias="avgLikes")
    avg_comments: int = Field(alias="avgComments")
    avg_shares: int = Field(alias="avgShares")
    engagement_rate: float = Field(alias="engagementRate")  # ratio 0..1 — not money


class PriorSponsorship(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    brand_name: str = Field(alias="brandName")
    category: CreatorCategory


class Questionnaire(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    preferred_categories: list[CreatorCategory] = Field(default_factory=list, alias="preferredCategories")
    excluded_categories: list[CreatorCategory] = Field(default_factory=list, alias="excludedCategories")
    accepts_shipped_products: bool = Field(default=False, alias="acceptsShippedProducts")
    can_purchase_products: bool = Field(default=False, alias="canPurchaseProducts")
    travel_willingness: TravelWillingness = Field(default=TravelWillingness.none, alias="travelWillingness")
    goals: list[str] = Field(default_factory=list)
    values: list[str] = Field(default_factory=list)
    preferred_formats: list[str] = Field(default_factory=list, alias="preferredFormats")
    content_languages: list[str] = Field(default_factory=list, alias="contentLanguages")
    excluded_brands: list[str] = Field(default_factory=list, alias="excludedBrands")
    allows_alcohol: bool = Field(default=False, alias="allowsAlcohol")
    allows_gambling: bool = Field(default=False, alias="allowsGambling")
    allows_political: bool = Field(default=False, alias="allowsPolitical")
    collab_capacity_per_month: int = Field(default=0, alias="collabCapacityPerMonth")
    self_described_audience: str = Field(default="", alias="selfDescribedAudience")
    prior_sponsorships: list[PriorSponsorship] = Field(default_factory=list, alias="priorSponsorships")


class PortraitRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    creator_id: str = Field(alias="creatorId")  # Guid serializes as a string
    display_name: str = Field(alias="displayName")
    follower_count: int = Field(alias="followerCount")
    category: CreatorCategory
    city: str | None = None
    county: str | None = None
    clips: list[Clip] = Field(default_factory=list)
    aggregates: Aggregates
    questionnaire: Questionnaire


class CreatorSummary(BaseModel):
    """Lightweight row from GET /creators — mirrors the backend CreatorSummaryDto."""
    model_config = ConfigDict(populate_by_name=True)
    id: str
    display_name: str = Field(alias="displayName")
    category: CreatorCategory
    follower_count: int = Field(alias="followerCount")
    city: str | None = None
    clip_count: int = Field(alias="clipCount")


# Note: the video-analysis payload is posted to the backend as a raw JSON dict (pass-through) — the
# backend stores it verbatim as JSONB. Its shape is defined by the analyzer's ontology/prompt, not a
# model here; see BackendClient.post_clip_analysis.


# TODO: PortraitClaim (evidence required), CreatorPortrait, the score contract
#       {value?, confidence, factors[], evidence[]} enforced via messages.parse().
