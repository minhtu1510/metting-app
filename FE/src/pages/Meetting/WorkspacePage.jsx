// import tableEmpty from "../../assets/images/table-empty.svg";
// import { NavLink } from "react-router-dom"
import React, { useState } from "react"
// import imageUpload from "../../assets/images/image_upload.jpg"
import recordAudio from "../../assets/Audios/audio_demo.mp3"
import recordAudio2 from "../../assets/Audios/audio_demo_2.mp3"
export const WorkspacePage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalData, setModalData] = useState(null);

    const data = [
        { id: 1, name: 'Nguyễn Văn A', date: '12/12/2025', rank: 'Thượng úy', position: 'Chủ nhiệm chính trị', audio: recordAudio },
        { id: 2, name: 'Nguyễn Văn B', date: '01/01/2026', rank: 'Thiếu tá', position: 'Trưởng phòng nhân sự', audio: recordAudio2 }
    ];
    const openModal = (item) => {
        setModalData(item);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };
    return (
        <>
            <div className="workSpace">
                <div className="FileAudio__listAudio">
                    <div className="FileAudio__header">
                        <div className="FileAudio__header--Title_Filter">
                            <div className="FileAudio__header--Title">Tệp gần đây</div>
                        </div>
                        <div className="FileAudio__header--AddFolder">
                            <i class="fa-solid fa-plus"></i> Thêm thư mục
                        </div>

                    </div>
                    <div className="FileAudio__search">
                        <input type="text" placeholder="Tìm kiếm File tên" />
                        <i class="fa-solid fa-magnifying-glass"></i>
                    </div>
                    <div className="FileAudio__content">
                        <table>
                            <thead>
                                <tr>
                                    <th><input type="checkbox" /></th>
                                    <th>Tên</th>
                                    <th>Tạo</th>
                                    <th>Cấp bậc</th>
                                    <th>Chức vụ</th>
                                    <th>
                                        Tác vụ
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((item) => (
                                    <React.Fragment key={item.id}>
                                        <tr onClick={() => openModal(item)}>
                                            <td><input type="checkbox" /></td>
                                            <td>{item.name}</td>
                                            <td>{item.date}</td>
                                            <td>{item.rank}</td>
                                            <td>{item.position}</td>
                                            <td>
                                                <button class="btn btn-edit">Sửa</button>
                                                <button class="btn btn-delete">Xóa</button>
                                            </td>

                                        </tr>

                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                        {isModalOpen && (
                            <div className="modal ">
                                <div className="modalMain">
                                    <button onClick={closeModal} className="btn-close-modal">✖️</button>
                                    {modalData && (
                                        <>
                                            <h2 className="text-lg font-bold mb-4">Chi tiết {modalData.name}</h2>
                                            <p><strong>Ngày:</strong> {modalData.date}</p>
                                            <p><strong>Chức vụ:</strong> {modalData.rank}</p>
                                            <p><strong>Vị trí:</strong> {modalData.position}</p>
                                            <div className="audioBox mt-4">
                                                <div className="audio-row">
                                                    <audio controls className="audio">
                                                        <source src={modalData.audio} type="audio/mp3" />
                                                        Trình duyệt không hỗ trợ audio
                                                    </audio>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                </div>

            </div>


            {/* <div className="workSpace">
            <div className="workSpace_header">
                <div className="workSpace_header--names">
                    <div className="workSpace_header--name">
                        Quản lý cuộc họp
                    </div>
                </div>
                <div className="workSpace_header--user">
                    <div className="workSpace_header--mergeFile">
                        <i class="fa-solid fa-user-plus"></i>
                        Gộp file
                    </div>
                    <button className="workSpace_header--refresh">
                    <i class="fa-solid fa-repeat"></i>
                    </button>

                </div>
            </div>
            <div className="workSpace_content">
                <div className="workSpace_content--intro">
                    <div className="workSpace_content--introTitle">
                        Tạo gần đây
                    </div>
                    <div className="workSpace_content--introAdd">
                        <div className="workSpace_content--introAddItem">
                            <NavLink to="/meeting/create"><i class="fa-solid fa-plus"></i>
                            Tạo cuộc họp</NavLink>
                        </div>
                    </div>
                </div>
                <div className="workSpace_content--in">
                    <div className="workSpace_content--Image">
                        <img src={tableEmpty} alt="anh"/>
                    </div>
                    <div className="workSpace_content--LoadFile">
                        Tải tập tin lên
                    </div>

                </div>
            </div>
        </div> */}

        </>
    )
}