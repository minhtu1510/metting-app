// import fileRecord from "../../assets/images/files-record.jpg"
// import fileUpload from "../../assets/images/files-upload.jpg"
// import {Link } from "react-router-dom"
import React from "react"
// import imageUpload from "../../assets/images/image_upload.jpg"
// import recordImg from "../../assets/images/microphone-only.svg"
export const AccountsPage = () => {
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
            <div className="AccountsPage">
                <div className="AccountsPage__listAudio">
                    <div className="AccountsPage__header">
                        <div className="AccountsPage__header--Title_Filter">
                            <div className="AccountsPage__header--Title"><b>Quản lý tài khoản</b></div>
                        </div>
                        <div className="AccountsPage__header--AddAccount">
                            <i class="fa-solid fa-plus"></i> Thêm tài khoản
                        </div>

                    </div>
                    <div className="AccountsPage__search">
                        <input type="text" placeholder="Tìm kiếm File tên" />
                        <i class="fa-solid fa-magnifying-glass"></i>
                    </div>
                    <div className="AccountsPage__content">
                        <table>
                            <thead>
                                <tr>
                                    <th><input type="checkbox" /></th>
                                    <th>Tên</th>
                                    <th>Tạo</th>
                                    <th>Tên đăng nhập</th>
                                    <th>Mật khẩu</th>
                                    <th>Tình trạng</th>
                                    <th>
                                        Tác vụ
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <React.Fragment>
                                    <tr>
                                        <td><input type="checkbox" /></td>
                                        <td>Nguyễn Văn A</td>
                                        <td>12/12/2025</td>
                                        <td>a@gmail.com</td>
                                        <td>12345</td>
                                        <td><button class="btn btn-active">Hoạt động</button></td>
                                        <td>
                                            <button class="btn btn-edit">Sửa</button>
                                            <button class="btn btn-delete">Xóa</button>
                                        </td>
                                    </tr>
                                </React.Fragment>

                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </>
    )
}