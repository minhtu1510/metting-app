# app/models/meeting.py
from bson import ObjectId
from pydantic import BaseModel, validator
from typing import Optional, List
from .user import PyObjectId

class MeetingCreate(BaseModel):
    title: str
    description: Optional[str] = None
    participants: List[str] = []  # Đổi từ attendees thành participants
    status: Optional[str] = "planned"  # Thêm status, mặc định là "planned"
    start_time: Optional[str] = None  # Thêm start_time
    end_time: Optional[str] = None  # Thêm end_time

    @validator("title")
    def title_not_empty(cls, v):
        if not v.strip():
            raise ValueError("Tiêu đề không được để trống")
        return v.strip()

class MeetingUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    participants: Optional[List[str]] = None  # Đổi từ attendees thành participants
    status: Optional[str] = None
    start_time: Optional[str] = None
    end_time: Optional[str] = None

    @validator("title", pre=True)
    def check_not_empty_if_provided(cls, v):
        if v is not None and isinstance(v, str) and not v.strip():
            raise ValueError("Trường này không được để trống nếu được cung cấp")
        return v.strip() if isinstance(v, str) else v

class MeetingResponse(BaseModel):
    id: PyObjectId
    title: str
    description: Optional[str] = None
    participants: List[str] = []  # Đổi từ attendees thành participants
    status: Optional[str] = None  # Thêm status
    created_by: Optional[str] = None  # Thêm created_by
    created_at: str
    updated_at: Optional[str] = None
    start_time: Optional[str] = None  # Thêm start_time
    end_time: Optional[str] = None  # Thêm end_time
    audio_segments: Optional[List[str]] = []  # Thêm audio_segments
    transcripts: Optional[List[str]] = []  # Thêm transcripts

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}