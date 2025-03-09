import tableEmpty from "../../assets/images/table-empty.svg";
import { NavLink } from "react-router-dom"
export const WorkspacePage = () => {
    return (
        <>
        <div className="workSpace">
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
        </div>

        </>
    )
}