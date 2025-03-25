// src/MeetingPage.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import './MeetingPage.css';

export const WorkspacePage = () => {
    const navigate = useNavigate();
    const [meetings, setMeetings] = useState([]);
    const [filteredMeetings, setFilteredMeetings] = useState([]);
    const [users, setUsers] = useState([]); // Danh sách người dùng
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentMeeting, setCurrentMeeting] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        participants: [], // Lưu dưới dạng mảng email
        status: "planned",
        start_time: "",
        end_time: "",
    });
    const [error, setError] = useState(null);
    const [errors, setErrors] = useState({});

    // Lấy danh sách cuộc họp
    useEffect(() => {
        const fetchMeetings = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    navigate('/login');
                    return;
                }
                const response = await fetch("http://localhost:8000/api/meetings/", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        localStorage.removeItem('token');
                        navigate('/login');
                        return;
                    }
                    const errorData = await response.json();
                    throw new Error(errorData.detail || "Không thể lấy danh sách cuộc họp");
                }

                const data = await response.json();
                setMeetings(data);
                setFilteredMeetings(data);
            } catch (err) {
                setError(err.message);
                console.error("Error in fetchMeetings:", err.message);
            }
        };
        fetchMeetings();
    }, [navigate]);

    // Lấy danh sách người dùng
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    navigate('/login');
                    return;
                }
                const response = await fetch("http://localhost:8000/api/users/", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        localStorage.removeItem('token');
                        navigate('/login');
                        return;
                    }
                    const errorData = await response.json();
                    throw new Error(errorData.detail || "Không thể lấy danh sách người dùng");
                }

                const data = await response.json();
                setUsers(data);
            } catch (err) {
                setError(err.message);
                console.error("Error in fetchUsers:", err.message);
            }
        };
        fetchUsers();
    }, [navigate]);

    useEffect(() => {
        const filtered = meetings.filter((meeting) =>
            meeting.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredMeetings(filtered);
    }, [searchTerm, meetings]);

    const handleAddMeeting = () => {
        setIsEditMode(false);
        setFormData({
            title: "",
            description: "",
            participants: [],
            status: "planned",
            start_time: "",
            end_time: "",
        });
        setErrors({});
        setError(null);
        setShowModal(true);
    };

    const handleEditMeeting = (meeting) => {
        setIsEditMode(true);
        setCurrentMeeting(meeting);
        setFormData({
            title: meeting.title,
            description: meeting.description || "",
            participants: meeting.participants || [],
            status: meeting.status || "planned",
            start_time: meeting.start_time || "",
            end_time: meeting.end_time || "",
        });
        setErrors({});
        setError(null);
        setShowModal(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleParticipantsChange = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
        setFormData((prev) => ({ ...prev, participants: selectedOptions }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setErrors({});

        const newErrors = {};
        if (!formData.title.trim()) newErrors.title = "Tiêu đề là bắt buộc";
        if (formData.participants.length === 0) newErrors.participants = "Vui lòng chọn ít nhất một người tham gia";
        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            console.log("Validation errors:", newErrors);
            return;
        }

        const meetingData = {
            title: formData.title.trim(),
            description: formData.description.trim() || null,
            participants: formData.participants,
            status: formData.status || "planned",
            start_time: formData.start_time || null,
            end_time: formData.end_time || null,
        };

        try {
            const token = localStorage.getItem("token");
            const url = isEditMode
                ? `http://localhost:8000/api/meetings/${currentMeeting.id}`
                : "http://localhost:8000/api/meetings/";
            const method = isEditMode ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(meetingData),
            });

            if (!response.ok) {
                let errorMessage = "Lỗi khi lưu cuộc họp";
                try {
                    const errorData = await response.json();
                    console.log("Error response:", errorData);
                    if (errorData.detail) {
                        errorMessage = errorData.detail;
                    }
                } catch (parseError) {
                    console.error("Lỗi khi parse response:", parseError);
                    errorMessage = "Không thể phân tích lỗi từ server";
                }
                throw new Error(errorMessage);
            }

            const updatedMeeting = await response.json();
            if (isEditMode) {
                setMeetings((prev) =>
                    prev.map((m) => (m.id === updatedMeeting.id ? updatedMeeting : m))
                );
            } else {
                setMeetings((prev) => [...prev, updatedMeeting]);
            }
            setShowModal(false);
        } catch (err) {
            console.error("Lỗi trong handleSubmit:", err.message);
            setError(err.message);
        }
    };

    const handleDeleteMeeting = async (meetingId) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa cuộc họp này?")) return;

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:8000/api/meetings/${meetingId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "Lỗi khi xóa cuộc họp");
            }

            setMeetings((prev) => prev.filter((m) => m.id !== meetingId));
        } catch (err) {
            setError(err.message);
            console.error("Error in handleDeleteMeeting:", err.message);
        }
    };

    return (
        <>
            <div className="MeetingPage">
                <div className="MeetingPage__listMeetings">
                    <div className="MeetingPage__header">
                        <div className="MeetingPage__header--Title_Filter">
                            <div className="MeetingPage__header--Title">
                                Quản lý cuộc họp
                            </div>
                        </div>
                        <div
                            className="MeetingPage__header--AddMeeting"
                            onClick={handleAddMeeting}
                        >
                            <i className="fa-solid fa-plus"></i> Thêm cuộc họp
                        </div>
                    </div>
                    <div className="MeetingPage__search">
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo tiêu đề"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <i className="fa-solid fa-magnifying-glass"></i>
                    </div>
                    <div className="MeetingPage__content">
                        {error && <div className="error-message">{error}</div>}
                        <table>
                            <thead>
                                <tr>
                                    <th><input type="checkbox" /></th>
                                    <th>Tiêu đề</th>
                                    <th>Trạng thái</th>
                                    <th>Người tham gia</th>
                                    <th>Thời gian bắt đầu</th>
                                    <th>Thời gian kết thúc</th>
                                    <th>Tác vụ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredMeetings.map((item) => (
                                    <tr key={item.id}>
                                        <td><input type="checkbox" /></td>
                                        <td>
                                            <Link to={`/meeting/detail/${item.id}`}>
                                                {item.title}
                                            </Link>
                                        </td>
                                        <td>{item.status || "Chưa xác định"}</td>
                                        <td>{item.participants.join(", ")}</td>
                                        <td>{item.start_time || "Chưa xác định"}</td>
                                        <td>{item.end_time || "Chưa xác định"}</td>
                                        <td>
                                            <button
                                                className="btn btn-edit"
                                                onClick={() => handleEditMeeting(item)}
                                            >
                                                Sửa
                                            </button>
                                            <button
                                                className="btn btn-delete"
                                                onClick={() => handleDeleteMeeting(item.id)}
                                            >
                                                Xóa
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {showModal && (
                <div className="modal">
                    <div className="modal-overlay" onClick={() => setShowModal(false)}></div>
                    <div className="modal-main">
                        <div
                            className="modal-close"
                            onClick={() => setShowModal(false)}
                        >
                            <i className="fa-solid fa-xmark"></i>
                        </div>
                        <div className="modal-content">
                            <h2>
                                {isEditMode ? "Sửa cuộc họp" : "Thêm cuộc họp"}
                            </h2>
                            {error && <div className="error-message">{error}</div>}
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label>Tiêu đề</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    {errors.title && <div className="error">{errors.title}</div>}
                                </div>
                                <div className="form-group">
                                    <label>Mô tả</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Người tham gia (giữ Ctrl để chọn nhiều)</label>
                                    <select
                                        name="participants"
                                        multiple
                                        value={formData.participants}
                                        onChange={handleParticipantsChange}
                                        className="participants-select"
                                    >
                                        <option value="" disabled>
                                            Chọn người tham gia
                                        </option>
                                        {users.map((user) => (
                                            <option key={user.id} value={user.username}>
                                                {user.full_name} ({user.username})
                                            </option>
                                        ))}
                                    </select>
                                    {errors.participants && <div className="error">{errors.participants}</div>}
                                </div>
                                <div className="form-group">
                                    <label>Trạng thái</label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleInputChange}
                                    >
                                        <option value="planned">Lên kế hoạch</option>
                                        <option value="started">Đã bắt đầu</option>
                                        <option value="ended">Đã kết thúc</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Thời gian bắt đầu</label>
                                    <input
                                        type="datetime-local"
                                        name="start_time"
                                        value={formData.start_time}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Thời gian kết thúc</label>
                                    <input
                                        type="datetime-local"
                                        name="end_time"
                                        value={formData.end_time}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <button type="submit">
                                    {isEditMode ? "Cập nhật" : "Thêm"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};