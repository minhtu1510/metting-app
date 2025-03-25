# data/database.py
from motor.motor_asyncio import AsyncIOMotorClient
from fastapi import FastAPI
import logging

# Thiết lập logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Kết nối MongoDB
MONGODB_URL = "mongodb+srv://thieulk23:thieulk23@cluster0.es7pd.mongodb.net/bibaapp?retryWrites=true&w=majority&appName=Cluster0"  # Cập nhật nếu cần username/password hoặc port khác
client = AsyncIOMotorClient(MONGODB_URL)
db = client["bibaapp"]

# Hàm kiểm tra kết nối
async def check_mongo_connection():
    try:
        # Thử liệt kê các database để kiểm tra kết nối
        await client.server_info()
        logger.info("Kết nối MongoDB thành công!")
    except Exception as e:
        logger.error(f"Không thể kết nối đến MongoDB: {str(e)}")
        raise Exception(f"Không thể kết nối đến MongoDB: {str(e)}")

# Đóng kết nối khi ứng dụng tắt
def setup_mongo(app: FastAPI):
    @app.on_event("startup")
    async def startup_mongo():
        # Kiểm tra kết nối khi ứng dụng khởi động
        await check_mongo_connection()
        app.mongodb_client = client
        app.mongodb = db
        logger.info("MongoDB đã được thiết lập trong ứng dụng.")

    @app.on_event("shutdown")
    async def shutdown_mongo():
        app.mongodb_client.close()
        logger.info("Đã đóng kết nối MongoDB.")

# Hàm để lấy database
def get_db():
    return db