// src/MenuBar.jsx
import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import imageUser from "../../assets/images/imageUser.jpg";
import './MenuBar.css';

export const MenuBar = () => {
    const [user, setUser] = useState(null);
    const [showSettings, setShowSettings] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    navigate("/login");
                    return;
                }

                const response = await fetch("http://localhost:8000/api/users/me", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Không thể lấy thông tin người dùng");
                }

                const data = await response.json();
                setUser(data);
            } catch (err) {
                setError(err.message);
                if (err.message.includes("401")) {
                    localStorage.removeItem("token");
                    navigate("/login");
                }
            }
        };
        fetchUser();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("rememberedEmail");
        navigate("/login");
    };

    const toggleSettings = () => {
        setShowSettings(!showSettings);
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <div className="MenuBar">
                <div className="MenuBar__header">
                    <div className="MenuBar__infoUser">
                        <div className="MenuBar__infoUser--image">
                            <img src={imageUser} alt="Ảnh đại diện" />
                        </div>
                        <div className="MenuBar__infoUser--name">
                            <div className="MenuBar__infoUser--name--fullname">{user.full_name}</div>
                            <div className="MenuBar__infoUser--name--gmail">{user.username}</div>
                        </div>
                        <div className="MenuBar__infoUser--setting" onClick={toggleSettings}>
                            <i className="fa-solid fa-gear"></i>
                            {showSettings && (
                                <div className="settings-dropdown">
                                    <div
                                        onClick={handleLogout}
                                        className="logout-option"
                                    >
                                        Đăng xuất
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="MenuBar__Workspace">
                        <i className="fa-solid fa-users-line"></i>
                        Workspace
                    </div>
                </div>

                <nav className="MenuBar__nav">
                    <ul>
                        <li>
                            <NavLink to="/meeting">
                                <i className="fa-solid fa-table-list"></i> Quản lý cuộc họp
                            </NavLink>
                        </li>
                        {user.role === "admin" && (
                            <li>
                                <NavLink to="/user">
                                    <i className="fa-solid fa-user"></i> Quản lý người dùng
                                </NavLink>
                            </li>
                        )}
                        <li>
                            <NavLink to="/profile">
                                <i className="fa-solid fa-id-card"></i> Thông tin cá nhân
                            </NavLink>
                        </li>
                    </ul>
                </nav>
            </div>
        </>
    );
};