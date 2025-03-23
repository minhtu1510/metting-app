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

    const handleAddUser = async (e) => {
        e.preventDefault();
        if (!newUserName.trim()) {
            setError("Tên thành viên không được để trống");
            return;
        }

        try {
            const response = await fetch("http://localhost:8000/api/members/users/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name: newUserName }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "Không thể thêm thành viên");
            }

            const newUser = await response.json();
            setUsers([...users, { id: newUser.id, name: newUser.name }]);
            setNewUserName("");
            setShowAddUserModal(false);
            setError(null);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        const formData = new FormData(e.target);

        const meetingData = {
            name: formData.get("name"),
            host: formData.get("nameHost"),
            num_members: parseInt(formData.get("numMembers"), 10) || 0,
            address: formData.get("address"),
            date: formData.get("date"), // Đã là chuỗi YYYY-MM-DD
            time: formData.get("time"), // Đã là chuỗi HH:MM
            description: formData.get("description"),
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
            const meetingId = meetingResult.id;

            const members = Array.from({ length: numMembers }).map((_, index) => ({
                meeting_id: meetingId,
                member_name: formData.get(`member-${index}`),
            }));

            for (const member of members) {
                const memberResponse = await fetch("http://localhost:8000/api/members/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(member),
                });

                if (!memberResponse.ok) {
                    const errorData = await memberResponse.json();
                    throw new Error(errorData.detail || "Lỗi khi thêm thành viên");
                }
            }

            const updatedMeetingResponse = await fetch(`http://localhost:8000/api/meetings/${meetingId}`);
            if (!updatedMeetingResponse.ok) {
                throw new Error("Lỗi khi lấy thông tin cuộc họp");
            }
            const updatedMeeting = await updatedMeetingResponse.json();
            setCreatedMeeting(updatedMeeting);

            e.target.reset();
            setNumMembers(0);
        } catch (error) {
            console.error("Lỗi:", error);
            setError(error.message);
        }
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
                        <select id="options" name="nameHost" required>
                            <option value="">-- Chọn chủ tọa --</option>
                            {users.map((user) => (
                                <option key={user.id} value={user.name}>
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
                                    <option key={user.id} value={user.name}>
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

            {showAddUserModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Thêm thành viên mới</h3>
                        <form onSubmit={handleAddUser}>
                            <div className="form-group">
                                <label htmlFor="newUserName">Tên thành viên</label>
                                <input
                                    type="text"
                                    id="newUserName"
                                    value={newUserName}
                                    onChange={(e) => setNewUserName(e.target.value)}
                                    placeholder="Nhập tên thành viên"
                                    required
                                />
                            </div>
                            <button type="submit">Thêm</button>
                            <button type="button" onClick={() => setShowAddUserModal(false)}>
                                Đóng
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {createdMeeting && (
                <div className="meeting-details">
                    <h3>Cuộc họp vừa tạo</h3>
                    <p><strong>Tên cuộc họp:</strong> {createdMeeting.name}</p>
                    <p><strong>Chủ tọa:</strong> {createdMeeting.host}</p>
                    <p><strong>Số lượng thành viên:</strong> {createdMeeting.num_members}</p>
                    <p><strong>Danh sách thành viên:</strong></p>
                    <ul>
                        {createdMeeting.members.map((member, index) => (
                            <li key={index}>{member.member_name}</li>
                        ))}
                    </ul>
                    <p><strong>Địa điểm:</strong> {createdMeeting.address}</p>
                    <p><strong>Ngày:</strong> {createdMeeting.date}</p>
                    <p><strong>Thời gian:</strong> {createdMeeting.time}</p>
                    <p><strong>Mô tả:</strong> {createdMeeting.description || "Không có mô tả"}</p>
                    <button onClick={() => setCreatedMeeting(null)}>Đóng</button>
                </div>
            )}
        </>
    );
};