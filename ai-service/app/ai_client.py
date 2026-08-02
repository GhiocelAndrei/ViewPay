from typing import Protocol


class AiModelClient(Protocol):
    """Black-box AI contract (dev-doc §8). Impls: Claude, GPT, Gemini, local. TODO: define methods."""
    ...


class ClaudeClient:
    """Anthropic implementation. TODO: implement with the anthropic SDK (claude-opus-4-8)."""
    ...
