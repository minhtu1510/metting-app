import { useState } from "react";

export const CreatePage = () => {
    const [numMembers, setNumMembers] = useState(0); // State lưu số lượng thành viên

    // Hàm cập nhật số lượng thành viên
    const handleMemberChange = (e) => {
        const value = parseInt(e.target.value, 10) || 0;
        setNumMembers(value);
    };
    return (
        <>
            <div className="form">
                <form action="" method="post">
                    <h2 className="create-meeting">Thêm cuộc họp</h2>
                    <div className="form-group">
                        <label for="name">Tên cuộc họp </label>
                        <input type="text" name="name" id="name" placeholder="Nhập tên cuộc họp" />
                    </div>
                    <div className="form-group">
                        <label for="nameHost">Chủ tọa</label>
                        <select id="options" name="nameHost">
                            <option value="option1">Tùy chọn 1</option>
                            <option value="option2">Tùy chọn 2</option>
                            <option value="option3">Tùy chọn 3</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label for="name">Số lượng thành viên</label>
                        <input type="number" name="numMembers" id="numMembers" placeholder="Nhập số lượng"onChange={handleMemberChange} 
                        min="0"/>
                    </div>
                                    {/* Hiển thị dropdown chọn thành viên tương ứng với số lượng nhập vào */}
                {Array.from({ length: numMembers }).map((_, index) => (
                    <div className="form-group" key={index}>
                        <label htmlFor={`member-${index}`}>Thành viên {index + 1}</label>
                        <select id={`member-${index}`} name={`member-${index}`}>
                            <option value="member1">Thành viên 1</option>
                            <option value="member2">Thành viên 2</option>
                            <option value="member3">Thành viên 3</option>
                        </select>
                    </div>
                ))}
                    <div className="form-group">
                        <label for="address">Địa điểm</label>
                        <input type="text" name="address" id="address" placeholder="Nhập địa điểm"/>
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
                        <button type="submit">Thêm mới</button>
                    </div>
                </form>
            </div>
        </>
    )
}