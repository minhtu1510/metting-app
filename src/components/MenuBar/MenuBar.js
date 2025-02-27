import { NavLink } from "react-router-dom"
import imageUser from "../../assets/images/imageUser.jpg";
export const MenuBar = () => {
    return(
        <>
            <div className="MenuBar">
                <div className="MenuBar__header">
                    <div className="MenuBar__infoUser">
                        <div className="MenuBar__infoUser--image">
                            <img src={imageUser} alt="Anh"/>
                        </div>
                        <div className="MenuBar__infoUser--name">
                            <div className="MenuBar__infoUser--name--fullname">Thao Linh</div>
                            <div className="MenuBar__infoUser--name--gmail">thaolinh@gmail.com</div>
                        </div>
                        <div className="MenuBar__infoUser--setting">

                        <i class="fa-solid fa-gear"></i>
                            </div>
                    </div>
                    <div className="MenuBar__Workspace">
                    <i class="fa-solid fa-users-line"></i>
                        Workspace
                    </div>
                </div>
                
                <nav className="MenuBar__nav">
                    <ul>
                        <li>
                            <NavLink to="/"><i class="fa-solid fa-table-list"></i> Bảng điều khiển</NavLink>
       
                        </li>
                        <li>
                            <NavLink to="/fileAudio"> <i class="fa-solid fa-file-invoice"></i> Các tập tin</NavLink>
                        </li>
                        <li>
                            <NavLink><i class="fa-solid fa-note-sticky"></i> Ghi chú</NavLink>
                        </li>
                        <li>
                            <NavLink><i class="fa-solid fa-calendar-days"></i> Lịch</NavLink>
                        </li>
                    </ul>
                </nav>
            </div>
            
        </>
    )
}