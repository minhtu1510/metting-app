export const CreatePage = () => {
    return (
        <>
            <div className="form">
                <form action="" method="post">
                    <h2 className="create-meeting">Thêm cuộc họp</h2>
                    <div className="form-group">
                        <label for="name">Tên cuộc họp </label>
                        <input type="text" name="name" id="name" placeholder="Nhập tên cuộc họp"/>
                    </div>
                    <div className="form-group">
                        <label for="name">Chủ tọa</label>
                        <input type="text" name="name" id="name" placeholder="Nhập tên chủ tọa"/>
                    </div>
                    <div className="form-group">
                        <label for="name">Số lượng thành viên:</label>
                        <input type="number" name="name" id="name" placeholder="Nhập số lượng"/>
                    </div>
                    <div className="form-group">
                        <label for="name">Địa điểm</label>
                        <input type="text" name="name" id="name" placeholder="Nhập địa điểm"/>
                    </div>
                    <div className="form-group">
                        <label for="date">Ngày</label>
                        <input type="date" name="date" id="date"/>
                    </div>
                    <div className="form-group">
                        <label for="time">Thời gian</label>
                        <input type="time" name="time" id="time"/>
                    </div>
                    <div className="form-group">
                        <label for="description">Mô tả</label>
                        <textarea name="description" id="description" placeholder="Nhập mô tả"></textarea>
                    </div>
                    <div className="form-group">
                        <button type="submit">Thêm</button>
                    </div>
                </form>
            </div>
        </>
    )
}