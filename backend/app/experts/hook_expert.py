from app.experts.base import AbstractExpert, ExpertResult


class HookExpert(AbstractExpert):
    name = "hook"
    prompt_version_name = "HookExpert_v1"

    async def analyze(self, content_type, s3_key, text_content, prompt_text) -> ExpertResult:
        # Stub — replaced by real Anthropic call in Milestone 3
        return ExpertResult(
            score=0.0,
            output={"status": "stub", "note": "HookExpert analysis not yet implemented"},
        )
