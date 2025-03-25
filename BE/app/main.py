# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.routes.meeting import router as meetings_router
from app.routes.user import router as members_router
from app.routes.auth import router as auth_router
# from app.routes.auth import router as auth
from data.database import setup_mongo, get_db

app = FastAPI()

# Thiết lập MongoDB
setup_mongo(app)

# Cấu hình CORS để FE có thể gọi API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Đăng ký các router
app.include_router(meetings_router, prefix="/api/meetings", tags=["meetings"])
app.include_router(members_router, prefix="/api/users", tags=["members"])
app.include_router(auth_router, prefix="/api/auth", tags=["auth"])
# app.include_router(auth, prefix="/api/auth")

# Phục vụ file tĩnh
# app.mount("/recordings", StaticFiles(directory="recordings"), name="recordings")
app.mount("/voice_samples", StaticFiles(directory="voice_samples"), name="voice_samples")

@app.get("/")
def read_root():
    return {"message": "Chào mừng đến với API Cuộc họp"}

# Endpoint kiểm tra kết nối database
@app.get("/check-db")
async def check_db():
    try:
        db = get_db()
        # Thử truy vấn một collection để kiểm tra
        await db.meetings.find_one()
        return {"status": "success", "message": "Kết nối database thành công!"}
    except Exception as e:
        return {"status": "error", "message": f"Không thể kết nối đến database: {str(e)}"}