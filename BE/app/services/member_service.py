# app/services/member_service.py
from bson import ObjectId
from fastapi import HTTPException
from data.database import get_db
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def create_member(member_data: dict):
    db = get_db()
    result = await db.members.insert_one(member_data)
    return result.inserted_id

async def get_members_by_meeting(meeting_id: str):
    db = get_db()
    members = await db.members.find({"meeting_id": meeting_id}).to_list(length=None)
    return [{"id": str(member["_id"]), "meeting_id": member["meeting_id"], "member_name": member["member_name"]} for member in members]

async def get_all_users():
    logger.info("Bắt đầu lấy danh sách thành viên từ collection users")
    try:
        db = get_db()
        logger.info("Đã lấy database thành công")
        users = await db.members.find().to_list(length=None)
        logger.info(f"Tìm thấy {len(users)} thành viên trong collection users")
        if not users:
            logger.warning("Không tìm thấy thành viên nào trong collection users")
            return []
        return [{"id": str(user["_id"]), "name": str(user["full_name"])} for user in users]
    except Exception as e:
        logger.error(f"Lỗi khi lấy danh sách thành viên: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Lỗi khi lấy danh sách thành viên: {str(e)}")

async def create_user(user_data: dict):
    logger.info(f"Tạo thành viên mới với dữ liệu: {user_data}")
    try:
        db = get_db()
        existing_user = await db.users.find_one({"full_name": user_data["name"]})
        if existing_user:
            logger.warning(f"Tên người dùng đã tồn tại: {user_data['name']}")
            raise HTTPException(status_code=400, detail="Tên người dùng đã tồn tại")
        result = await db.users.insert_one({"full_name": user_data["name"]})
        logger.info(f"Đã tạo thành viên mới với ID: {str(result.inserted_id)}")
        return {"id": str(result.inserted_id), "name": user_data["name"]}
    except Exception as e:
        logger.error(f"Lỗi khi tạo thành viên: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Lỗi khi tạo thành viên: {str(e)}")