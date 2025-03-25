// src/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        full_name: '',
        password: '',
        voice_sample: null,
    });
    const [error, setError] = useState(null);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:8000/api/users/me', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Không thể lấy thông tin cá nhân');
                }

                const data = await response.json();
                setUser(data);
                setFormData({
                    username: data.username,
                    email: data.email,
                    full_name: data.full_name,
                    password: '',
                    voice_sample: null,
                });
            } catch (err) {
                setError(err.message);
                if (err.message.includes('401')) {
                    localStorage.removeItem('token');
                    navigate('/login');
                }
            }
        };
        fetchUser();
    }, [navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setFormData((prev) => ({ ...prev, voice_sample: e.target.files[0] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setErrors({});

        const newErrors = {};
        if (!formData.username.trim()) newErrors.username = "Tên người dùng là bắt buộc";
        if (!formData.email.trim()) newErrors.email = "Email là bắt buộc";
        else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email.trim())) {
            newErrors.email = "Email không hợp lệ (ví dụ: user@domain.com)";
        }
        if (!formData.full_name.trim()) newErrors.full_name = "Họ tên là bắt buộc";
        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            console.log("Validation errors:", newErrors);
            return;
        }

        const form = new FormData();
        form.append("username", formData.username.trim());
        form.append("email", formData.email.trim());
        form.append("full_name", formData.full_name.trim());
        if (formData.password.trim()) form.append("password", formData.password.trim());
        if (formData.voice_sample) {
            form.append("voice_sample", formData.voice_sample);
        }

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:8000/api/users/${user.id}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: form,
            });

            if (!response.ok) {
                let errorMessage = "Lỗi khi cập nhật thông tin";
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

            const updatedUser = await response.json();
            setUser(updatedUser);
            setIsEditMode(false);
        } catch (err) {
            setError(err.message);
        }
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="profile" style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>
                Thông tin cá nhân
            </h2>
            {error && <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>}
            {!isEditMode ? (
                <div className="profile-info">
                    <p><strong>Tên người dùng:</strong> {user.username}</p>
                    <p><strong>Họ tên:</strong> {user.full_name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Vai trò:</strong> {user.role}</p>
                    <p><strong>Ngày tạo:</strong> {user.created_at}</p>
                    <p><strong>Ngày cập nhật:</strong> {user.updated_at}</p>
                    <p><strong>Trạng thái:</strong> {user.disabled ? "Vô hiệu hóa" : "Hoạt động"}</p>
                    {user.voice_sample_path && (
                        <div>
                            <strong>Giọng mẫu:</strong>
                            <audio controls style={{ marginTop: "10px", width: "100%" }}>
                                <source src={`http://localhost:8000${user.voice_sample_path}`} type="audio/mp3" />
                                Trình duyệt không hỗ trợ audio
                            </audio>
                        </div>
                    )}
                    <button
                        onClick={() => setIsEditMode(true)}
                        style={{
                            marginTop: "20px",
                            padding: "10px 20px",
                            backgroundColor: "#2196F3",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                        }}
                    >
                        Chỉnh sửa
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div className="form-group" style={{ marginBottom: "15px" }}>
                        <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Tên người dùng</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            required
                            style={{
                                width: "100%",
                                padding: "10px",
                                borderRadius: "5px",
                                border: "1px solid #ddd",
                                fontSize: "16px",
                            }}
                        />
                        {errors.username && <div style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>{errors.username}</div>}
                    </div>
                    <div className="form-group" style={{ marginBottom: "15px" }}>
                        <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            style={{
                                width: "100%",
                                padding: "10px",
                                borderRadius: "5px",
                                border: "1px solid #ddd",
                                fontSize: "16px",
                            }}
                        />
                        {errors.email && <div style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>{errors.email}</div>}
                    </div>
                    <div className="form-group" style={{ marginBottom: "15px" }}>
                        <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Họ tên</label>
                        <input
                            type="text"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleInputChange}
                            required
                            style={{
                                width: "100%",
                                padding: "10px",
                                borderRadius: "5px",
                                border: "1px solid #ddd",
                                fontSize: "16px",
                            }}
                        />
                        {errors.full_name && <div style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>{errors.full_name}</div>}
                    </div>
                    <div className="form-group" style={{ marginBottom: "15px" }}>
                        <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Mật khẩu (để trống nếu không đổi)</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            style={{
                                width: "100%",
                                padding: "10px",
                                borderRadius: "5px",
                                border: "1px solid #ddd",
                                fontSize: "16px",
                            }}
                        />
                    </div>
                    <div className="form-group" style={{ marginBottom: "15px" }}>
                        <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>File audio giọng mẫu</label>
                        <input
                            type="file"
                            accept=".wav,.mp3"
                            onChange={handleFileChange}
                            style={{
                                width: "100%",
                                padding: "10px",
                                borderRadius: "5px",
                                border: "1px solid #ddd",
                                fontSize: "16px",
                            }}
                        />
                    </div>
                    <button
                        type="submit"
                        style={{
                            width: "100%",
                            padding: "10px",
                            backgroundColor: "#4CAF50",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            fontSize: "16px",
                            cursor: "pointer",
                        }}
                    >
                        Cập nhật
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsEditMode(false)}
                        style={{
                            width: "100%",
                            padding: "10px",
                            backgroundColor: "#f44336",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            fontSize: "16px",
                            cursor: "pointer",
                            marginTop: "10px",
                        }}
                    >
                        Hủy
                    </button>
                </form>
            )}
        </div>
    );
};