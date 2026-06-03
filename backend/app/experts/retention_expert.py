from app.experts.base import AbstractExpert, ExpertResult


class RetentionExpert(AbstractExpert):
    name = "retention"
    prompt_version_name = "RetentionExpert_v1"

    async def analyze(self, content_type, s3_key, text_content, prompt_text) -> ExpertResult:
        # Stub — replaced by real Anthropic call in Milestone 4
        return ExpertResult(
            score=0.0,
            output={"status": "stub", "note": "RetentionExpert analysis not yet implemented"},
        )
