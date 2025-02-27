import imageUser from "../../assets/images/imageUser.jpg";
import tableEmpty from "../../assets/images/table-empty.svg";
export const WorkspacePage = () => {
    return (
        <>
        <div className="workSpace">
            <div className="workSpace_header">
                <div className="workSpace_header--names">
                    <div className="workSpace_header--name">
                        y 
                    </div>
                    <i class="fa-solid fa-angle-down"></i>
                </div>
                <div className="workSpace_header--user">
                    <div className="workSpace_header--userRole">
                       <img src={imageUser} alt="anh"/>
                       <i class="fa-solid fa-angle-down"></i>
                    </div>
                    <div className="workSpace_header--userAdd">
                        <i class="fa-solid fa-user-plus"></i>
                        Mời thành viên
                    </div>
                </div>
            </div>
            <div className="workSpace_content">
                <div className="workSpace_content--intro">
                    <div className="workSpace_content--introTitle">
                        Tạo gần đây
                    </div>
                    <div className="workSpace_content--introAdd">
                        <div className="workSpace_content--introAddItem">
                            <i class="fa-solid fa-plus"></i>
                            Tạo cuộc họp
                        </div>
                        <div className="workSpace_content--introAddItem">
                            <i class="fa-solid fa-file-circle-plus"></i>Thêm tệp
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