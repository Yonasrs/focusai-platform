from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class UploadResponse(BaseModel):
    id: str
    filename: str
    content_type: str
    file_size_bytes: int
    status: str
    created_at: datetime

    model_config = {"from_attributes": True}


class JobResponse(BaseModel):
    id: str
    upload_id: str
    user_id: str
    status: str
    credits_used: int
    created_at: datetime

    model_config = {"from_attributes": True}


class UploadCreateResponse(BaseModel):
    upload: UploadResponse
    job: JobResponse
    message: str


class JobStatusResponse(BaseModel):
    job_id: str
    status: str
    upload: Optional[UploadResponse]
    message: str
