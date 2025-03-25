# app/routes/users.py
from fastapi import APIRouter, HTTPException, Form, UploadFile, File, Depends
from app.models.user import UserCreate, UserResponse, UserUpdate
from data.database import get_db
from app.auth.auth import get_current_user, require_role
import logging
from passlib.context import CryptContext
from datetime import datetime
import os
import uuid
from typing import List
from pydantic import EmailStr, ValidationError
from bson import ObjectId

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

VOICE_SAMPLES_DIR = "voice_samples"
if not os.path.exists(VOICE_SAMPLES_DIR):
    os.makedirs(VOICE_SAMPLES_DIR)

@router.post("/register-first-admin", response_model=UserResponse)
async def register_first_admin(
    username: str = Form(...),
    email: EmailStr = Form(...),
    full_name: str = Form(...),
    password: str = Form(...),
    voice_sample: UploadFile = File(None),
    db=Depends(get_db)
):
    try:
        user_data = {
            "username": username,
            "email": email,
            "full_name": full_name,
            "password": password,
            "role": "member",
            "voice_sample_path": None,
        }
        logger.info(f"Dữ liệu nhận được: {user_data}")
        logger.info(f"File voice_sample: {voice_sample.filename if voice_sample else 'Không có file'}")

        user = UserCreate(**user_data)

        existing_user = await db.users.find_one()
        if existing_user:
            logger.warning("Đã có tài khoản trong hệ thống")
            raise HTTPException(status_code=403, detail="Đã có tài khoản trong hệ thống. Vui lòng sử dụng API đăng ký thông thường.")

        hashed_password = pwd_context.hash(user.password)
        user_dict = user.dict()

        voice_sample_path = None
        if voice_sample:
            if not voice_sample.filename.endswith((".wav", ".mp3")):
                logger.error("File không đúng định dạng: chỉ hỗ trợ WAV hoặc MP3")
                raise HTTPException(status_code=400, detail="Chỉ hỗ trợ file WAV hoặc MP3")
            file_id = str(uuid.uuid4())
            filename = f"{file_id}_{voice_sample.filename}"
            file_path = os.path.join(VOICE_SAMPLES_DIR, filename)
            with open(file_path, "wb") as f:
                content = await voice_sample.read()
                f.write(content)
            voice_sample_path = f"/voice_samples/{filename}"

        user_dict["password_hash"] = hashed_password
        user_dict["voice_sample_path"] = voice_sample_path
        user_dict["created_at"] = datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%S.%fZ")
        user_dict["updated_at"] = datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%S.%fZ")
        user_dict["disabled"] = False
        user_dict["role"] = "admin"
        del user_dict["password"]

        result = await db.users.insert_one(user_dict)
        user_dict["id"] = str(result.inserted_id)
        logger.info(f"Tạo tài khoản admin thành công: {user_dict['id']}")
        return UserResponse(**user_dict)
    except ValidationError as e:
        logger.error(f"Validation error: {e.errors()}")
        raise HTTPException(status_code=422, detail=e.errors())
    except Exception as e:
        logger.error(f"Error in register_first_admin: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Lỗi server: {str(e)}")

@router.get("/", response_model=List[UserResponse])
async def get_users(current_user: dict = Depends(require_role("admin")), db=Depends(get_db)):
    try:
        users = await db.users.find().to_list(None) or []
        result = []
        for user in users:
            created_at = user.get("created_at")
            updated_at = user.get("updated_at")
            if isinstance(created_at, datetime):
                created_at = created_at.strftime("%Y-%m-%dT%H:%M:%S.%fZ")
            if isinstance(updated_at, datetime):
                updated_at = updated_at.strftime("%Y-%m-%dT%H:%M:%S.%fZ")

            user_data = {
                "id": str(user.pop("_id")),
                "username": user.get("username", "Unknown"),
                "email": user.get("email", "unknown@example.com"),
                "full_name": user.get("full_name", "Unknown"),
                "role": user.get("role", "member"),
                "created_at": created_at,
                "updated_at": updated_at,
                "disabled": user.get("disabled", False),
                "voice_sample_path": user.get("voice_sample_path"),
            }
            result.append(UserResponse(**user_data))
        return result
    except ValidationError as e:
        print(f"ValidationError in get_users: {e.errors()}")
        raise HTTPException(status_code=422, detail=e.errors())
    except Exception as e:
        print(f"Error in get_users: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Lỗi server: {str(e)}")

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: dict = Depends(get_current_user), db=Depends(get_db)):
    try:
        print("Current user:", current_user)
        user = await db.users.find_one({"email": current_user["email"]})
        if not user:
            raise HTTPException(status_code=404, detail="Người dùng không tồn tại")

        created_at = user.get("created_at")
        updated_at = user.get("updated_at")
        if isinstance(created_at, datetime):
            created_at = created_at.strftime("%Y-%m-%dT%H:%M:%S.%fZ")
        if isinstance(updated_at, datetime):
            updated_at = updated_at.strftime("%Y-%m-%dT%H:%M:%S.%fZ")

        user_data = {
            "id": str(user.pop("_id")),
            "username": user.get("username", "Unknown"),
            "email": user.get("email", "unknown@example.com"),
            "full_name": user.get("full_name", "Unknown"),
            "role": user.get("role", "member"),
            "created_at": created_at,
            "updated_at": updated_at,
            "disabled": user.get("disabled", False),
            "voice_sample_path": user.get("voice_sample_path"),
        }
        return UserResponse(**user_data)
    except ValidationError as e:
        print(f"ValidationError in get_current_user_info: {e.errors()}")
        raise HTTPException(status_code=422, detail=e.errors())
    except Exception as e:
        print(f"Error in get_current_user_info: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Lỗi server: {str(e)}")

@router.put("/{id}", response_model=UserResponse)
async def update_user(
    id: str,
    username: str = Form(None),
    email: str = Form(None),
    full_name: str = Form(None),
    password: str = Form(None),
    voice_sample: UploadFile = File(None),
    current_user: dict = Depends(get_current_user),
    db=Depends(get_db)
):
    try:
        existing_user = await db.users.find_one({"_id": ObjectId(id)})
        if not existing_user:
            raise HTTPException(status_code=404, detail="Người dùng không tồn tại")

        if current_user["role"] != "admin" and current_user["email"] != existing_user["email"]:
            raise HTTPException(
                status_code=403,
                detail="Bạn không có quyền chỉnh sửa thông tin của người dùng này"
            )

        update_data = {
            "username": username,
            "email": email,
            "full_name": full_name,
            "password": password,
            "voice_sample_path": existing_user.get("voice_sample_path"),
        }

        user_update = UserUpdate(**{k: v for k, v in update_data.items() if v is not None})

        update_dict = user_update.dict(exclude_unset=True)

        if voice_sample:
            if not voice_sample.filename.endswith((".wav", ".mp3")):
                raise HTTPException(status_code=400, detail="Chỉ hỗ trợ file WAV hoặc MP3")
            file_id = str(uuid.uuid4())
            filename = f"{file_id}_{voice_sample.filename}"
            file_path = os.path.join(VOICE_SAMPLES_DIR, filename)
            with open(file_path, "wb") as f:
                content = await voice_sample.read()
                f.write(content)
            update_dict["voice_sample_path"] = f"/voice_samples/{filename}"

        if "password" in update_dict:
            update_dict["password_hash"] = pwd_context.hash(update_dict["password"])
            del update_dict["password"]

        if update_dict:
            update_dict["updated_at"] = datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%S.%fZ")
            await db.users.update_one({"_id": ObjectId(id)}, {"$set": update_dict})

        updated_user = await db.users.find_one({"_id": ObjectId(id)})
        created_at = updated_user.get("created_at")
        updated_at = updated_user.get("updated_at")
        if isinstance(created_at, datetime):
            created_at = created_at.strftime("%Y-%m-%dT%H:%M:%S.%fZ")
        if isinstance(updated_at, datetime):
            updated_at = updated_at.strftime("%Y-%m-%dT%H:%M:%S.%fZ")

        updated_user_data = {
            "id": str(updated_user.pop("_id")),
            "username": updated_user.get("username", "Unknown"),
            "email": updated_user.get("email", "unknown@example.com"),
            "full_name": updated_user.get("full_name", "Unknown"),
            "role": updated_user.get("role", "member"),
            "created_at": created_at,
            "updated_at": updated_at,
            "disabled": updated_user.get("disabled", False),
            "voice_sample_path": updated_user.get("voice_sample_path"),
        }
        return UserResponse(**updated_user_data)
    except ValidationError as e:
        print(f"ValidationError in update_user: {e.errors()}")
        raise HTTPException(status_code=422, detail=e.errors())
    except Exception as e:
        print(f"Error in update_user: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Lỗi server: {str(e)}")

@router.delete("/{id}")
async def delete_user(id: str, current_user: dict = Depends(require_role("admin")), db=Depends(get_db)):
    try:
        result = await db.users.delete_one({"_id": ObjectId(id)})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Người dùng không tồn tại")
        return {"message": "Xóa người dùng thành công"}
    except Exception as e:
        print(f"Error in delete_user: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Lỗi server: {str(e)}")