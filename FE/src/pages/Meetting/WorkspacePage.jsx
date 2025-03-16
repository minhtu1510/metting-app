// import tableEmpty from "../../assets/images/table-empty.svg";
// import { NavLink } from "react-router-dom"
import React, { useState } from "react"
// import imageUpload from "../../assets/images/image_upload.jpg"
import recordAudio from "../../assets/Audios/audio_demo.mp3"
import recordAudio2 from "../../assets/Audios/audio_demo_2.mp3"
import { useNavigate } from "react-router-dom";
export const WorkspacePage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalData, setModalData] = useState(null);
    const navigate = useNavigate();

    const data = [
        { id: 1, name: 'Nguyễn Văn A', date: '12/12/2025', rank: 'Thượng úy', position: 'Chủ nhiệm chính trị', audio: recordAudio },
        { id: 2, name: 'Nguyễn Văn B', date: '01/01/2026', rank: 'Thiếu tá', position: 'Trưởng phòng nhân sự', audio: recordAudio2 }
    ];

    const handleRowClick = (item) => {
        navigate(`/meeting/detail`);
    };

    return (
        <>
            <div className="workSpace">
                <div className="FileAudio__listAudio">
                    <div className="FileAudio__header">
                        <div className="FileAudio__header--Title_Filter">
                            <div className="FileAudio__header--Title">Quản lý cuộc họp</div>
                        </div>
                        <div className="FileAudio__header--AddFolder">
                            <i className="fa-solid fa-plus"></i> Thêm thư mục
                        </div>
                    </div>
                    <div className="FileAudio__search">
                        <input type="text" placeholder="Tìm kiếm File tên" />
                        <i className="fa-solid fa-magnifying-glass"></i>
                    </div>
                    <div className="FileAudio__content">
                        <table>
                            <thead>
                                <tr>
                                    <th><input type="checkbox" /></th>
                                    <th>Tên</th>
                                    <th>Chủ tọa</th>
                                    <th>Thời gian</th>
                                    <th>Mô tả</th>
                                    <th>Tác vụ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((item) => (
                                    <tr key={item.id} onClick={() => handleRowClick(item)} style={{ cursor: 'pointer' }}>
                                        <td><input type="checkbox" /></td>
                                        <td>{item.name}</td>
                                        <td>{item.date}</td>
                                        <td>{item.rank}</td>
                                        <td>{item.position}</td>
                                        <td>
                                            <button className="btn btn-edit">Sửa</button>
                                            <button className="btn btn-delete">Xóa</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};