# app/routes/auth.py
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from data.database import get_db
from app.auth.auth import create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES
from passlib.context import CryptContext
from datetime import timedelta

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db=Depends(get_db)):
    user = await db.users.find_one({"username": form_data.username})
    if not user:
        raise HTTPException(status_code=400, detail="username hoặc mật khẩu không đúng")
    if user.get("disabled", False):
        raise HTTPException(status_code=400, detail="Tài khoản đã bị vô hiệu hóa")
    if not pwd_context.verify(form_data.password, user["password_hash"]):
        raise HTTPException(status_code=400, detail="username hoặc mật khẩu không đúng")
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["username"], "role": user["role"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}