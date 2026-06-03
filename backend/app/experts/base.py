from abc import ABC, abstractmethod
from dataclasses import dataclass, field


@dataclass
class ExpertResult:
    score: float  # 0.0 – 10.0
    output: dict = field(default_factory=dict)


class AbstractExpert(ABC):
    name: str               # "hook" | "retention" | "clarity"
    prompt_version_name: str  # e.g. "HookExpert_v1"

    @abstractmethod
    async def analyze(
        self,
        content_type: str,
        s3_key: str,
        text_content: str | None,
        prompt_text: str,
    ) -> ExpertResult: ...
