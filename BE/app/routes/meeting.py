# app/routes/meetings.py
from fastapi import APIRouter, HTTPException, Depends
from app.models.meeting import MeetingCreate, MeetingResponse, MeetingUpdate
from data.database import get_db
from app.auth.auth import get_current_user, require_role
from datetime import datetime
from typing import List
from pydantic import ValidationError
from bson import ObjectId

router = APIRouter()

@router.get("/", response_model=List[MeetingResponse])
async def get_meetings(current_user: dict = Depends(get_current_user), db=Depends(get_db)):
    try:
        print("Current user in get_meetings:", current_user)
        if current_user.get("role") == "admin":
            print("Fetching all meetings for admin")
            meetings = await db.meetings.find().to_list(None) or []
        else:
            print(f"Fetching meetings for user {current_user.get('email')}")
            meetings = await db.meetings.find({"participants": current_user.get("email")}).to_list(None) or []
        print("Meetings fetched:", meetings)

        # Chuyển đổi dữ liệu trước khi tạo MeetingResponse
        result = []
        for meeting in meetings:
            created_at = meeting.get("created_at")
            updated_at = meeting.get("updated_at")
            if isinstance(created_at, datetime):
                created_at = created_at.strftime("%Y-%m-%dT%H:%M:%S.%fZ")
            if isinstance(updated_at, datetime):
                updated_at = updated_at.strftime("%Y-%m-%dT%H:%M:%S.%fZ")

            meeting_data = {
                "id": str(meeting.pop("_id")),
                "title": meeting.get("title", "Untitled Meeting"),
                "description": meeting.get("description"),
                "participants": meeting.get("participants", []),
                "status": meeting.get("status"),
                "created_by": meeting.get("created_by"),
                "created_at": created_at,
                "updated_at": updated_at,
                "start_time": meeting.get("start_time"),
                "end_time": meeting.get("end_time"),
                "audio_segments": meeting.get("audio_segments", []),
                "transcripts": meeting.get("transcripts", []),
            }
            result.append(MeetingResponse(**meeting_data))
        
        print("Meetings response:", result)
        return result
    except ValidationError as e:
        print(f"ValidationError in get_meetings: {e.errors()}")
        raise HTTPException(status_code=422, detail=e.errors())
    except Exception as e:
        print(f"Error in get_meetings: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Lỗi server: {str(e)}")

@router.post("/", response_model=MeetingResponse)
async def create_meeting(meeting: MeetingCreate, current_user: dict = Depends(require_role("admin")), db=Depends(get_db)):
    try:
        meeting_dict = meeting.dict()
        meeting_dict["created_by"] = current_user["email"]
        meeting_dict["created_at"] = datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%S.%fZ")
        meeting_dict["updated_at"] = None
        meeting_dict["audio_segments"] = []
        meeting_dict["transcripts"] = []

        for email in meeting_dict["participants"]:
            user = await db.users.find_one({"username": email})
            if not user:
                raise HTTPException(status_code=400, detail=f"Username {email} không tồn tại trong hệ thống")

        result = await db.meetings.insert_one(meeting_dict)
        meeting_dict["id"] = str(result.inserted_id)
        return MeetingResponse(**meeting_dict)
    except ValidationError as e:
        print(f"ValidationError in create_meeting: {e.errors()}")
        raise HTTPException(status_code=422, detail=e.errors())
    except Exception as e:
        print(f"Error in create_meeting: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Lỗi server: {str(e)}")

# app/routes/meetings.py
@router.get("/{id}", response_model=MeetingResponse)
async def get_meeting(id: str, current_user: dict = Depends(get_current_user), db=Depends(get_db)):
    try:
        meeting = await db.meetings.find_one({"_id": ObjectId(id)})
        if not meeting:
            raise HTTPException(status_code=404, detail="Cuộc họp không tồn tại")
        if current_user["role"] != "admin" and current_user["username"] not in meeting["participants"]:
            raise HTTPException(status_code=403, detail="Bạn không có quyền xem cuộc họp này")
        # ...
        
        created_at = meeting.get("created_at")
        updated_at = meeting.get("updated_at")
        if isinstance(created_at, datetime):
            created_at = created_at.strftime("%Y-%m-%dT%H:%M:%S.%fZ")
        if isinstance(updated_at, datetime):
            updated_at = updated_at.strftime("%Y-%m-%dT%H:%M:%S.%fZ")

        meeting_data = {
            "id": str(meeting.pop("_id")),
            "title": meeting.get("title", "Untitled Meeting"),
            "description": meeting.get("description"),
            "participants": meeting.get("participants", []),
            "status": meeting.get("status"),
            "created_by": meeting.get("created_by"),
            "created_at": created_at,
            "updated_at": updated_at,
            "start_time": meeting.get("start_time"),
            "end_time": meeting.get("end_time"),
            "audio_segments": meeting.get("audio_segments", []),
            "transcripts": meeting.get("transcripts", []),
        }
        return MeetingResponse(**meeting_data)
    except Exception as e:
        print(f"Error in get_meeting: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Lỗi server: {str(e)}")

@router.put("/{meetingId}", response_model=MeetingResponse)
async def update_meeting(id: str, meeting: MeetingUpdate, current_user: dict = Depends(require_role("admin")), db=Depends(get_db)):
    try:
        existing_meeting = await db.meetings.find_one({"_id": ObjectId(id)})
        if not existing_meeting:
            raise HTTPException(status_code=404, detail="Cuộc họp không tồn tại")

        update_dict = meeting.dict(exclude_unset=True)
        if "participants" in update_dict:
            for email in update_dict["participants"]:
                user = await db.users.find_one({"email": email})
                if not user:
                    raise HTTPException(status_code=400, detail=f"Email {email} không tồn tại trong hệ thống")

        if update_dict:
            update_dict["updated_at"] = datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%S.%fZ")
            await db.meetings.update_one({"_id": ObjectId(id)}, {"$set": update_dict})

        updated_meeting = await db.meetings.find_one({"_id": ObjectId(id)})
        created_at = updated_meeting.get("created_at")
        updated_at = updated_meeting.get("updated_at")
        if isinstance(created_at, datetime):
            created_at = created_at.strftime("%Y-%m-%dT%H:%M:%S.%fZ")
        if isinstance(updated_at, datetime):
            updated_at = updated_at.strftime("%Y-%m-%dT%H:%M:%S.%fZ")

        updated_meeting_data = {
            "id": str(updated_meeting.pop("_id")),
            "title": updated_meeting.get("title", "Untitled Meeting"),
            "description": updated_meeting.get("description"),
            "participants": updated_meeting.get("participants", []),
            "status": updated_meeting.get("status"),
            "created_by": updated_meeting.get("created_by"),
            "created_at": created_at,
            "updated_at": updated_at,
            "start_time": updated_meeting.get("start_time"),
            "end_time": updated_meeting.get("end_time"),
            "audio_segments": updated_meeting.get("audio_segments", []),
            "transcripts": updated_meeting.get("transcripts", []),
        }
        return MeetingResponse(**updated_meeting_data)
    except ValidationError as e:
        print(f"ValidationError in update_meeting: {e.errors()}")
        raise HTTPException(status_code=422, detail=e.errors())
    except Exception as e:
        print(f"Error in update_meeting: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Lỗi server: {str(e)}")

@router.delete("/{id}")
async def delete_meeting(id: str, current_user: dict = Depends(require_role("admin")), db=Depends(get_db)):
    try:
        result = await db.meetings.delete_one({"_id": ObjectId(id)})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Cuộc họp không tồn tại")
        return {"message": "Xóa cuộc họp thành công"}
    except Exception as e:
        print(f"Error in delete_meeting: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Lỗi server: {str(e)}")