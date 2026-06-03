from app.experts.base import AbstractExpert, ExpertResult


class ClarityExpert(AbstractExpert):
    name = "clarity"
    prompt_version_name = "ClarityExpert_v1"

    async def analyze(self, content_type, s3_key, text_content, prompt_text) -> ExpertResult:
        # Stub — replaced by real Anthropic call in Milestone 5
        return ExpertResult(
            score=0.0,
            output={"status": "stub", "note": "ClarityExpert analysis not yet implemented"},
        )
