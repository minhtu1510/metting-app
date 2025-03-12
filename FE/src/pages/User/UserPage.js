import fileRecord from "../../assets/images/files-record.jpg"
import fileUpload from "../../assets/images/files-upload.jpg"
import {Link } from "react-router-dom"
import React, { useState } from "react"
// import imageUpload from "../../assets/images/image_upload.jpg"
import recordAudio from "../../assets/Audios/audio_demo.mp3"
import recordAudio2 from "../../assets/Audios/audio_demo_2.mp3"
export const UserPage = () => {
    const [visitableRow, setvisitableRow] = useState(null)
    const data = [
        { id: 1, name: 'Nguyễn Văn A', date: '12/12/2025', rank: 'Thượng úy', position: 'Chủ nhiệm chính trị', audio: recordAudio },
        { id: 2, name: 'Nguyễn Văn B', date: '01/01/2026', rank: 'Thiếu tá', position: 'Trưởng phòng nhân sự', audio: recordAudio2 }
    ];
    const toggleAudio = (id) => {
        setvisitableRow(visitableRow === id ? null: id)
    }
    return (
        <>
            <div className="FileAudio">
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
                            <input type="text" placeholder="Tìm kiếm File tên"/>
                            <i class="fa-solid fa-magnifying-glass"></i>
                        </div>
                        <div className="FileAudio__content">
                            <table>
                                <thead>
                                    <tr>
                                        <th><input type="checkbox"/></th>
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
                                            <tr onClick={() => toggleAudio(item.id)}>
                                                <td><input type="checkbox"/></td>
                                                <td>{item.name}</td>
                                                <td>{item.date}</td>
                                                <td>{item.rank}</td>
                                                <td>{item.position}</td>
                                                <td>
                                                    <button class= "btn btn-edit">Sửa</button>
                                                    <button class= "btn btn-delete">Xóa</button>
                                                </td>

                                            </tr>
                                            {visitableRow === item.id && (
                                                <tr className="audioBox" >
                                                    <td colSpan="6" className="audio-row">
                                                        <audio controls className="audio">
                                                            <source src={item.audio} type="audio/mp3" />
                                                            Trình duyệt không hỗ trợ audio
                                                        </audio>
                                                    </td>
                                                </tr>
                                            )
                                            }

                                            </React.Fragment>
                                    ))}
                                </tbody>
                            </table>

                        </div>
                    
                </div>
                <div className="FileAudio__record">
                    <Link to="/Record" className="FileAudio__record__item FileAudio__record--onl">
                        <div className="FileAudio__record--title">Ghi âm & Phiên âm</div>                  
                        <img src={fileRecord} alt="anh"/> 
                    </Link>
                    <Link to="/Upload" className="FileAudio__record__item FileAudio__record--addFile" >
                        <div className="FileAudio__record--title">Phiên âm tệp âm thanh</div>                  
                        <img src={fileUpload} alt="anh"/> 
                    </Link>
                      
                </div>
               </div>
        </>
    )
}