from pydantic import BaseModel


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


# TODO: PortraitClaim (evidence required), CreatorPortrait, the score contract
#       {value?, confidence, factors[], evidence[]} enforced via messages.parse().
