# app/services/meeting_service.py
from bson import ObjectId
from fastapi import HTTPException
from data.database import get_db

async def create_meeting(meeting_data: dict):
    db = get_db()
    result = await db.meetings.insert_one(meeting_data)
    return result.inserted_id

async def get_meeting(meeting_id: str):
    db = get_db()
    meeting = await db.meetings.find_one({"_id": ObjectId(meeting_id)})
    if not meeting:
        raise HTTPException(status_code=404, detail="Không tìm thấy cuộc họp")
    return {"id": str(meeting["_id"]), **meeting}

async def update_meeting(meeting_id: str, meeting_data: dict):
    db = get_db()
    # Loại bỏ các trường None để không ghi đè giá trị hiện tại
    update_data = {k: v for k, v in meeting_data.items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="Không có dữ liệu để cập nhật")
    
    result = await db.meetings.update_one(
        {"_id": ObjectId(meeting_id)},
        {"$set": update_data}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Không tìm thấy cuộc họp")
    
    # Lấy thông tin cuộc họp sau khi cập nhật
    updated_meeting = await get_meeting(meeting_id)
    return updated_meeting