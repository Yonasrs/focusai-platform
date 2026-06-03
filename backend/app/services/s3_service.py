import asyncio
from typing import Optional

import boto3
from botocore.exceptions import ClientError

from app.core.config import settings


class S3Service:
    def __init__(self) -> None:
        self._client: Optional[object] = None

    def _get_client(self):
        if self._client is None:
            self._client = boto3.client(
                "s3",
                aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                region_name=settings.AWS_REGION,
            )
        return self._client

    @staticmethod
    def _safe_filename(filename: str) -> str:
        return "".join(c if c.isalnum() or c in "._-" else "_" for c in filename)

    def build_key(self, user_id: str, upload_id: str, filename: str) -> str:
        return f"uploads/{user_id}/{upload_id}/{self._safe_filename(filename)}"

    async def upload(
        self,
        content: bytes,
        user_id: str,
        upload_id: str,
        filename: str,
        mime_type: str,
    ) -> str:
        key = self.build_key(user_id, upload_id, filename)

        def _put() -> None:
            self._get_client().put_object(
                Bucket=settings.S3_BUCKET_NAME,
                Key=key,
                Body=content,
                ContentType=mime_type,
            )

        await asyncio.to_thread(_put)
        return key

    async def delete(self, key: str) -> None:
        def _delete() -> None:
            self._get_client().delete_object(
                Bucket=settings.S3_BUCKET_NAME, Key=key
            )

        await asyncio.to_thread(_delete)

    def presigned_url(self, key: str, expires: int = 3600) -> str:
        return self._get_client().generate_presigned_url(
            "get_object",
            Params={"Bucket": settings.S3_BUCKET_NAME, "Key": key},
            ExpiresIn=expires,
        )


s3_service = S3Service()
