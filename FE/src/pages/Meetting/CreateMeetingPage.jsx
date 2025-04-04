import { useState, useEffect } from "react";

export const CreateMeetingPage = () => {
    const [numMembers, setNumMembers] = useState(0);
    const [createdMeeting, setCreatedMeeting] = useState(null);
    const [error, setError] = useState(null);
    const [users, setUsers] = useState([]);
    const [showAddUserModal, setShowAddUserModal] = useState(false);
    const [newUserName, setNewUserName] = useState("");

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch("http://localhost:8000/api/members/list");
                if (!response.ok) {
                    throw new Error("Không thể lấy danh sách thành viên");
                }
                const data = await response.json();
                setUsers(data);
            } catch (err) {
                setError(err.message);
            }
        };
        fetchUsers();
    }, []);

    const handleMemberChange = (e) => {
        const value = parseInt(e.target.value, 10) || 0;
        setNumMembers(value);
    };

    

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        const formData = new FormData(e.target);

        // Lấy ID của các thành viên được chọn
        const memberIds = Array.from({ length: numMembers }).map((_, index) => {
            const memberId = formData.get(`member-${index}`);
            return memberId;
        });

        const meetingData = {
            name: formData.get("name"),
            host: formData.get("nameHost"), // Gửi ID của host
            num_members: parseInt(formData.get("numMembers"), 10) || 0,
            address: formData.get("address"),
            date: formData.get("date"),
            time: formData.get("time"),
            description: formData.get("description"),
            member_ids: memberIds, // Gửi mảng ID của các thành viên
        };

        try {
            const meetingResponse = await fetch("http://localhost:8000/api/meetings/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(meetingData),
            });

            if (!meetingResponse.ok) {
                const errorData = await meetingResponse.json();
                throw new Error(errorData.detail || "Lỗi khi tạo cuộc họp");
            }

            const meetingResult = await meetingResponse.json();
            setCreatedMeeting(meetingResult);

            e.target.reset();
            setNumMembers(0);
        } catch (error) {
            console.error("Lỗi:", error);
            setError(error.message);
        }
    };

    // Hàm để lấy tên từ ID
    const getUserNameById = (id) => {
        const user = users.find((user) => user.id === id);
        return user ? user.name : "Không xác định";
    };

    return (
        <>
            <div className="form">
                <form onSubmit={handleSubmit} method="post">
                    <h2 className="create-meeting">Thêm cuộc họp</h2>

                    {error && <div className="error-message">{error}</div>}

                    <div className="form-group">
                        <label htmlFor="name">Tên cuộc họp <span className="required">*</span></label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            placeholder="Nhập tên cuộc họp"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="nameHost">Chủ tọa <span className="required">*</span></label>
                        <select id="nameHost" name="nameHost" required>
                            <option value="">-- Chọn chủ tọa --</option>
                            {users.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="numMembers">Số lượng thành viên <span className="required">*</span></label>
                        <input
                            type="number"
                            name="numMembers"
                            id="numMembers"
                            placeholder="Nhập số lượng"
                            onChange={handleMemberChange}
                            min="0"
                            required
                        />
                    </div>
                    {Array.from({ length: numMembers }).map((_, index) => (
                        <div className="form-group" key={index}>
                            <label htmlFor={`member-${index}`}>
                                Thành viên {index + 1} <span className="required">*</span>
                            </label>
                            <select id={`member-${index}`} name={`member-${index}`} required>
                                <option value="">-- Chọn thành viên --</option>
                                {users.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    ))}
                    <div className="form-group">
                        <label htmlFor="address">Địa điểm <span className="required">*</span></label>
                        <input
                            type="text"
                            name="address"
                            id="address"
                            placeholder="Nhập địa điểm"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="date">Ngày <span className="required">*</span></label>
                        <input type="date" name="date" id="date" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="time">Thời gian <span className="required">*</span></label>
                        <input type="time" name="time" id="time" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Mô tả</label>
                        <textarea
                            name="description"
                            id="description"
                            placeholder="Nhập mô tả"
                        ></textarea>
                    </div>
                    <div className="form-group">
                        <button type="submit">Thêm mới</button>
                    </div>
                </form>
            </div>




        </>
    );
};