// src/UserPage.jsx
import React, { useState, useEffect } from "react";

export const UserPage = () => {
    const [visitableRow, setVisitableRow] = useState(null);
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isFirstAdmin, setIsFirstAdmin] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        full_name: "",
        password: "",
        voice_sample: null,
    });
    const [error, setError] = useState(null);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const checkUsers = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch("http://localhost:8000/api/users/", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setUsers(data);
                    setFilteredUsers(data);
                    setIsFirstAdmin(data.length === 0);
                } else {
                    setIsFirstAdmin(true);
                }
            } catch (err) {
                setError(err.message);
                setIsFirstAdmin(true);
            }
        };
        checkUsers();
    }, []);

    useEffect(() => {
        const filtered = users.filter((user) =>
            user.full_name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredUsers(filtered);
    }, [searchTerm, users]);

    const toggleAudio = (id) => {
        setVisitableRow(visitableRow === id ? null : id);
    };

    const handleAddUser = () => {
        setIsEditMode(false);
        setFormData({
            username: "",
            email: "",
            full_name: "",
            password: "",
            voice_sample: null,
        });
        setErrors({});
        setError(null);
        setShowModal(true);
    };

    const handleEditUser = (user) => {
        setIsEditMode(true);
        setCurrentUser(user);
        setFormData({
            username: user.username,
            email: user.email,
            full_name: user.full_name,
            password: "",
            voice_sample: null,
        });
        setErrors({});
        setError(null);
        setShowModal(true);
    };

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
        if (!isEditMode && !formData.password.trim()) newErrors.password = "Mật khẩu là bắt buộc và không được để trống";
        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            console.log("Validation errors:", newErrors);
            return;
        }

        const form = new FormData();
        form.append("username", formData.username.trim());
        form.append("email", formData.email.trim());
        form.append("full_name", formData.full_name.trim());
        form.append("password", formData.password.trim());
        if (formData.voice_sample) {
            form.append("voice_sample", formData.voice_sample);
        }

        try {
            const token = localStorage.getItem("token");
            const url = isFirstAdmin
                ? "http://localhost:8000/api/users/register-first-admin"
                : isEditMode
                ? `http://localhost:8000/api/users/${currentUser.id}`
                : "http://localhost:8000/api/users/";
            const method = isEditMode ? "PUT" : "POST";

            const headers = isFirstAdmin ? {} : { Authorization: `Bearer ${token}` };

            console.log("Sending request to:", url);
            console.log("Form data:", Object.fromEntries(form));

            const response = await fetch(url, {
                method,
                headers,
                body: form,
            });

            if (!response.ok) {
                let errorMessage = "Lỗi khi lưu người dùng";
                try {
                    const errorData = await response.json();
                    console.log("Error response:", errorData);
                    if (errorData.detail) {
                        if (Array.isArray(errorData.detail)) {
                            errorMessage = errorData.detail.map(err => err.msg).join(", ");
                        } else {
                            errorMessage = errorData.detail;
                        }
                    }
                } catch (parseError) {
                    console.error("Lỗi khi parse response:", parseError);
                    errorMessage = "Không thể phân tích lỗi từ server";
                }
                throw new Error(errorMessage);
            }

            const updatedUser = await response.json();
            if (isEditMode) {
                setUsers((prev) =>
                    prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
                );
            } else {
                setUsers((prev) => [...prev, updatedUser]);
            }
            setShowModal(false);
        } catch (err) {
            console.error("Lỗi trong handleSubmit:", err.message);
            setError(err.message);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) return;

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:8000/api/users/${userId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "Lỗi khi xóa người dùng");
            }

            setUsers((prev) => prev.filter((u) => u.id !== userId));
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <>
            <div className="FileAudio" style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
                <div className="FileAudio__listAudio">
                    <div className="FileAudio__header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                        <div className="FileAudio__header--Title_Filter">
                            <div className="FileAudio__header--Title" style={{ fontSize: "24px", fontWeight: "bold", color: "#333" }}>
                                Quản lý mẫu giọng người dùng
                            </div>
                        </div>
                        <div
                            className="FileAudio__header--AddFolder"
                            onClick={handleAddUser}
                            style={{
                                backgroundColor: "#4CAF50",
                                color: "white",
                                padding: "10px 20px",
                                borderRadius: "5px",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: "5px",
                                transition: "background-color 0.3s",
                            }}
                            onMouseEnter={(e) => (e.target.style.backgroundColor = "#45a049")}
                            onMouseLeave={(e) => (e.target.style.backgroundColor = "#4CAF50")}
                        >
                            <i className="fa-solid fa-plus"></i> Thêm người dùng
                        </div>
                    </div>
                    <div className="FileAudio__search" style={{ marginBottom: "20px", position: "relative" }}>
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo họ tên"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                width: "100%",
                                padding: "10px 40px 10px 10px",
                                borderRadius: "5px",
                                border: "1px solid #ddd",
                                fontSize: "16px",
                                outline: "none",
                                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                            }}
                        />
                        <i className="fa-solid fa-magnifying-glass" style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "#666" }}></i>
                    </div>
                    <div className="FileAudio__content">
                        {error && <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>}
                        <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "#fff", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}>
                            <thead>
                                <tr style={{ backgroundColor: "#f4f4f4", textAlign: "left" }}>
                                    <th style={{ padding: "15px", borderBottom: "1px solid #ddd" }}><input type="checkbox" /></th>
                                    <th style={{ padding: "15px", borderBottom: "1px solid #ddd" }}>Họ tên</th>
                                    <th style={{ padding: "15px", borderBottom: "1px solid #ddd" }}>Tên người dùng</th>
                                    <th style={{ padding: "15px", borderBottom: "1px solid #ddd" }}>Email</th>
                                    <th style={{ padding: "15px", borderBottom: "1px solid #ddd" }}>Tạo</th>
                                    <th style={{ padding: "15px", borderBottom: "1px solid #ddd" }}>Mẫu giọng</th>
                                    <th style={{ padding: "15px", borderBottom: "1px solid #ddd" }}>Tác vụ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((item) => (
                                    <React.Fragment key={item.id}>
                                        <tr
                                            onClick={() => toggleAudio(item.id)}
                                            style={{
                                                cursor: "pointer",
                                                transition: "background-color 0.3s",
                                            }}
                                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f9f9f9")}
                                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                                        >
                                            <td style={{ padding: "15px", borderBottom: "1px solid #ddd" }}><input type="checkbox" /></td>
                                            <td style={{ padding: "15px", borderBottom: "1px solid #ddd" }}>{item.full_name}</td>
                                            <td style={{ padding: "15px", borderBottom: "1px solid #ddd" }}>{item.username}</td>
                                            <td style={{ padding: "15px", borderBottom: "1px solid #ddd" }}>{item.email}</td>
                                            <td style={{ padding: "15px", borderBottom: "1px solid #ddd" }}>{item.created_at}</td>
                                            <td style={{ padding: "15px", borderBottom: "1px solid #ddd" }}>{item.voice_sample_path ? "Có" : "Không"}</td>
                                            <td style={{ padding: "15px", borderBottom: "1px solid #ddd" }}>
                                                <button
                                                    className="btn btn-edit"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleEditUser(item);
                                                    }}
                                                    style={{
                                                        backgroundColor: "#2196F3",
                                                        color: "white",
                                                        padding: "8px 15px",
                                                        border: "none",
                                                        borderRadius: "5px",
                                                        cursor: "pointer",
                                                        marginRight: "5px",
                                                        transition: "background-color 0.3s",
                                                    }}
                                                    onMouseEnter={(e) => (e.target.style.backgroundColor = "#1976D2")}
                                                    onMouseLeave={(e) => (e.target.style.backgroundColor = "#2196F3")}
                                                >
                                                    Sửa
                                                </button>
                                                <button
                                                    className="btn btn-delete"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteUser(item.id);
                                                    }}
                                                    style={{
                                                        backgroundColor: "#f44336",
                                                        color: "white",
                                                        padding: "8px 15px",
                                                        border: "none",
                                                        borderRadius: "5px",
                                                        cursor: "pointer",
                                                        transition: "background-color 0.3s",
                                                    }}
                                                    onMouseEnter={(e) => (e.target.style.backgroundColor = "#d32f2f")}
                                                    onMouseLeave={(e) => (e.target.style.backgroundColor = "#f44336")}
                                                >
                                                    Xóa
                                                </button>
                                            </td>
                                        </tr>
                                        {visitableRow === item.id && (
                                            <tr className="audioBox">
                                                <td colSpan="7" className="audio-row" style={{ padding: "15px", borderBottom: "1px solid #ddd", backgroundColor: "#f9f9f9" }}>
                                                    {item.voice_sample_path ? (
                                                        <audio controls className="audio" style={{ width: "100%" }}>
                                                            <source src={`http://localhost:8000${item.voice_sample_path}`} type="audio/mp3" />
                                                            Trình duyệt không hỗ trợ audio
                                                        </audio>
                                                    ) : (
                                                        <div style={{ color: "gray", textAlign: "center" }}>
                                                            Không có file audio
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {showModal && (
                <div className="modal" style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
                    <div className="modal-overlay" onClick={() => setShowModal(false)} style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)" }}></div>
                    <div className="modal-main" style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "10px", width: "500px", maxWidth: "90%", position: "relative", boxShadow: "0 5px 15px rgba(0,0,0,0.3)" }}>
                        <div
                            className="modal-close"
                            onClick={() => setShowModal(false)}
                            style={{ position: "absolute", top: "10px", right: "10px", cursor: "pointer", fontSize: "20px", color: "#666" }}
                        >
                            <i className="fa-solid fa-xmark"></i>
                        </div>
                        <div className="modal-content">
                            <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "20px", textAlign: "center", color: "#333" }}>
                                {isEditMode ? "Sửa người dùng" : "Thêm người dùng"}
                            </h2>
                            {error && <div style={{ color: "red", marginBottom: "10px", textAlign: "center" }}>{error}</div>}
                            <form onSubmit={handleSubmit}>
                                <div className="form-group" style={{ marginBottom: "15px" }}>
                                    <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", color: "#555" }}>Tên người dùng</label>
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
                                            outline: "none",
                                            boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)",
                                            borderColor: errors.username ? "red" : "#ddd",
                                        }}
                                    />
                                    {errors.username && <div style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>{errors.username}</div>}
                                </div>
                                <div className="form-group" style={{ marginBottom: "15px" }}>
                                    <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", color: "#555" }}>Email</label>
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
                                            outline: "none",
                                            boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)",
                                            borderColor: errors.email ? "red" : "#ddd",
                                        }}
                                    />
                                    {errors.email && <div style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>{errors.email}</div>}
                                </div>
                                <div className="form-group" style={{ marginBottom: "15px" }}>
                                    <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", color: "#555" }}>Họ tên</label>
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
                                            outline: "none",
                                            boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)",
                                            borderColor: errors.full_name ? "red" : "#ddd",
                                        }}
                                    />
                                    {errors.full_name && <div style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>{errors.full_name}</div>}
                                </div>
                                <div className="form-group" style={{ marginBottom: "15px" }}>
                                    <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", color: "#555" }}>Mật khẩu</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        placeholder={isEditMode ? "Để trống nếu không đổi" : ""}
                                        required={!isEditMode}
                                        style={{
                                            width: "100%",
                                            padding: "10px",
                                            borderRadius: "5px",
                                            border: "1px solid #ddd",
                                            fontSize: "16px",
                                            outline: "none",
                                            boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)",
                                            borderColor: errors.password ? "red" : "#ddd",
                                        }}
                                    />
                                    {errors.password && <div style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>{errors.password}</div>}
                                </div>
                                <div className="form-group" style={{ marginBottom: "15px" }}>
                                    <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", color: "#555" }}>File audio giọng mẫu</label>
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
                                        transition: "background-color 0.3s",
                                    }}
                                    onMouseEnter={(e) => (e.target.style.backgroundColor = "#45a049")}
                                    onMouseLeave={(e) => (e.target.style.backgroundColor = "#4CAF50")}
                                >
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