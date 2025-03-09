import fileRecord from "../../assets/images/files-record.jpg"
import fileUpload from "../../assets/images/files-upload.jpg"
import {Link } from "react-router-dom"
import React from "react"
// import imageUpload from "../../assets/images/image_upload.jpg"
// import recordImg from "../../assets/images/microphone-only.svg"
export const UserPage = () => {
    // const handleClickUpload = () => {
    //     const body = document.querySelector("body");
    //     const elementRecord = document.createElement("div")
    //     elementRecord.classList.add("modal")
    //     elementRecord.innerHTML = `
    //     <div class="modal-main">
    //         <div class="modal-close"><i class="fa-solid fa-xmark"></i></div>
    //                 <div class="modal-content">
    //                     <div class="modal-upload">
    //                         <img src="../../assets/images/image_upload.jpg"/>
    //                         <div>Duyệt tệp</div>
    //                     </div>
    //                 </div>
    //             </div>

    //         </div>
    //     <div class="modal-overlay"></div>
    //     `
    //     body.appendChild(elementRecord);
    //     // closeModal(elementRecord);
    //     const modalButtonAgree = document.querySelector(".button-agree");
    //     modalButtonAgree.addEventListener("click", () =>{
    //         // remove(ref(db, '/todoApp/' + id));
    //         // alertFunc("Xóa thành công",3000,"alert--success");
    //         alert("xóa thành công")
    //         body.removeChild(elementRecord);
    //     })
    // }
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
                                    <React.Fragment>
                                        <tr>
                                            <td><button class="play-btn">▶</button><input type="checkbox"/></td>
                                            <td>Nguyễn Văn A</td>
                                            <td>12/12/2025</td>
                                            <td>Thượng úy</td>
                                            <td>Chủ nhiệm chính trị</td>
                                            <td>
                                                <button class= "btn btn-edit">Sửa</button>
                                                <button class= "btn btn-delete">Xóa</button>
                                            </td>
                                            <tr>
                                                <td colSpan="6" className="audio-row">
                                                    <audio controls autoPlay className="audio">
                                                        <source src="" type="audio/mp3" />
                                                        Trình duyệt không hỗ trợ audio
                                                    </audio>
                                                </td>
                                            </tr>
                                        </tr>
                                    </React.Fragment>

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