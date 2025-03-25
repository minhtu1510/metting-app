import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export const EditMeetingPage = () => {
    const { meetingId } = useParams(); // Lấy meetingId từ URL
    const navigate = useNavigate();
    const [numMembers, setNumMembers] = useState(0);
    const [meeting, setMeeting] = useState(null);
    const [error, setError] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Lấy danh sách thành viên
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch("http://localhost:8000/api/users/list");
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

    // Lấy thông tin cuộc họp
    useEffect(() => {
        const fetchMeeting = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/meetings/${meetingId}`);
                if (!response.ok) {
                    throw new Error("Không thể lấy thông tin cuộc họp");
                }
                const data = await response.json();
                setMeeting(data);
                setNumMembers(data.num_members);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };
        fetchMeeting();
    }, [meetingId]);

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
            const response = await fetch(`http://localhost:8000/api/meetings/${meetingId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(meetingData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "Lỗi khi cập nhật cuộc họp");
            }

            const updatedMeeting = await response.json();
            setMeeting(updatedMeeting);
            alert("Cập nhật cuộc họp thành công!");
            navigate("/meeting"); // Chuyển hướng về trang danh sách cuộc họp
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

    if (loading) {
        return <div>Đang tải...</div>;
    }

    if (!meeting) {
        return <div>Không tìm thấy cuộc họp</div>;
    }

    return (
        <>
            <div className="form">
                <form onSubmit={handleSubmit} method="put">
                    <h2 className="edit-meeting">Chỉnh sửa cuộc họp</h2>

                    {error && <div className="error-message">{error}</div>}

                    <div className="form-group">
                        <label htmlFor="name">Tên cuộc họp <span className="required">*</span></label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            defaultValue={meeting.name}
                            placeholder="Nhập tên cuộc họp"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="nameHost">Chủ tọa <span className="required">*</span></label>
                        <select id="nameHost" name="nameHost" defaultValue={meeting.host} required>
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
                            defaultValue={meeting.num_members}
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
                            <select
                                id={`member-${index}`}
                                name={`member-${index}`}
                                defaultValue={meeting.member_ids[index] || ""}
                                required
                            >
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
                            defaultValue={meeting.address}
                            placeholder="Nhập địa điểm"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="date">Ngày <span className="required">*</span></label>
                        <input
                            type="date"
                            name="date"
                            id="date"
                            defaultValue={meeting.date}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="time">Thời gian <span className="required">*</span></label>
                        <input
                            type="time"
                            name="time"
                            id="time"
                            defaultValue={meeting.time}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Mô tả</label>
                        <textarea
                            name="description"
                            id="description"
                            defaultValue={meeting.description || ""}
                            placeholder="Nhập mô tả"
                        ></textarea>
                    </div>
                    <div className="form-group">
                        <button type="submit">Cập nhật</button>
                        <button type="button" onClick={() => navigate("/meeting")}>
                            Hủy
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};