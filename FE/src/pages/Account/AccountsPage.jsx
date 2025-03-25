import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export const AccountsPage = () => {
    const [members, setMembers] = useState([]);
    const [filteredMembers, setFilteredMembers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentMember, setCurrentMember] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        status: "active",
        voice_sample: null,
    });
    const [error, setError] = useState(null);

    // Lấy danh sách tài khoản
    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch("http://localhost:8000/api/members/", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    throw new Error("Không thể lấy danh sách tài khoản");
                }
                const data = await response.json();
                setMembers(data);
                setFilteredMembers(data);
            } catch (err) {
                setError(err.message);
            }
        };
        fetchMembers();
    }, []);

    // Tìm kiếm tài khoản
    useEffect(() => {
        const filtered = members.filter((member) =>
            member.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredMembers(filtered);
    }, [searchTerm, members]);

    // Mở modal thêm tài khoản
    const handleAddAccount = () => {
        setIsEditMode(false);
        setFormData({
            name: "",
            email: "",
            password: "",
            status: "active",
            voice_sample: null,
        });
        setShowModal(true);
    };

    // Mở modal sửa tài khoản
    const handleEditAccount = (member) => {
        setIsEditMode(true);
        setCurrentMember(member);
        setFormData({
            name: member.name,
            email: member.email,
            password: "", // Không điền sẵn mật khẩu
            status: member.status,
            voice_sample: null,
        });
        setShowModal(true);
    };

    // Xử lý thay đổi input trong form
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Xử lý upload file audio
    const handleFileChange = (e) => {
        setFormData((prev) => ({ ...prev, voice_sample: e.target.files[0] }));
    };

    // Thêm hoặc sửa tài khoản
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        const form = new FormData();
        form.append("name", formData.name);
        form.append("email", formData.email);
        if (formData.password) {
            form.append("password", formData.password);
        }
        form.append("status", formData.status);
        if (formData.voice_sample) {
            form.append("voice_sample", formData.voice_sample);
        }

        try {
            const token = localStorage.getItem("token");
            const url = isEditMode
                ? `http://localhost:8000/api/members/${currentMember.id}`
                : "http://localhost:8000/api/members/";
            const method = isEditMode ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: form,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "Lỗi khi lưu tài khoản");
            }

            const updatedMember = await response.json();
            if (isEditMode) {
                setMembers((prev) =>
                    prev.map((m) => (m.id === updatedMember.id ? updatedMember : m))
                );
            } else {
                setMembers((prev) => [...prev, updatedMember]);
            }
            setShowModal(false);
        } catch (err) {
            setError(err.message);
        }
    };

    // Xóa tài khoản
    const handleDeleteAccount = async (memberId) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa tài khoản này?")) return;

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:8000/api/members/${memberId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "Lỗi khi xóa tài khoản");
            }

            setMembers((prev) => prev.filter((m) => m.id !== memberId));
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <>
            <div className="AccountsPage">
                <div className="AccountsPage__listAudio">
                    <div className="AccountsPage__header">
                        <div className="AccountsPage__header--Title_Filter">
                            <div className="AccountsPage__header--Title">
                                <b>Quản lý tài khoản</b>
                            </div>
                        </div>
                        <div className="AccountsPage__header--AddAccount" onClick={handleAddAccount}>
                            <i className="fa-solid fa-plus"></i> Thêm tài khoản
                        </div>
                    </div>
                    <div className="AccountsPage__search">
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo tên"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <i className="fa-solid fa-magnifying-glass"></i>
                    </div>
                    <div className="AccountsPage__content">
                        {error && <div className="error-message">{error}</div>}
                        <table>
                            <thead>
                                <tr>
                                    <th><input type="checkbox" /></th>
                                    <th>Tên</th>
                                    <th>Tạo</th>
                                    <th>Tên đăng nhập</th>
                                    <th>Mật khẩu</th>
                                    <th>Tình trạng</th>
                                    <th>Tác vụ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredMembers.map((member) => (
                                    <tr key={member.id}>
                                        <td><input type="checkbox" /></td>
                                        <td>{member.name}</td>
                                        <td>{member.created_at}</td>
                                        <td>{member.email}</td>
                                        <td>********</td> {/* Ẩn mật khẩu */}
                                        <td>
                                            <button
                                                className={`btn ${
                                                    member.status === "active" ? "btn-active" : "btn-inactive"
                                                }`}
                                            >
                                                {member.status === "active" ? "Hoạt động" : "Không hoạt động"}
                                            </button>
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-edit"
                                                onClick={() => handleEditAccount(member)}
                                            >
                                                Sửa
                                            </button>
                                            <button
                                                className="btn btn-delete"
                                                onClick={() => handleDeleteAccount(member.id)}
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

            {/* Modal thêm/sửa tài khoản */}
            {showModal && (
                <div className="modal">
                    <div className="modal-overlay" onClick={() => setShowModal(false)}></div>
                    <div className="modal-main">
                        <div className="modal-close" onClick={() => setShowModal(false)}>
                            <i className="fa-solid fa-xmark"></i>
                        </div>
                        <div className="modal-content">
                            <h2>{isEditMode ? "Sửa tài khoản" : "Thêm tài khoản"}</h2>
                            {error && <div className="error-message">{error}</div>}
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label>Tên</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Mật khẩu</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        placeholder={isEditMode ? "Để trống nếu không đổi" : ""}
                                        required={!isEditMode}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Tình trạng</label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleInputChange}
                                    >
                                        <option value="active">Hoạt động</option>
                                        <option value="inactive">Không hoạt động</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>File audio giọng mẫu</label>
                                    <input
                                        type="file"
                                        accept=".wav"
                                        onChange={handleFileChange}
                                    />
                                </div>
                                <button type="submit">{isEditMode ? "Cập nhật" : "Thêm"}</button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};