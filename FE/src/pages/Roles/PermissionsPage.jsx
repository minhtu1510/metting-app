import { useState } from "react"

export const PermissionsPage = () => {
    const [isModalTopicOpen, setIsModalTopiclOpen] = useState(false)
    const [isModalMainOpen, setIsModalMainlOpen] = useState(false)
    const [isModalSingerOpen, setIsModalSingerOpen] = useState(false)
    const [isModalSingOpen, setIsModalSingOpen] = useState(false)

    const handlemanagersing = () => {
        setIsModalSingOpen(!isModalSingOpen)
    }
    const handlemanagersinger = () => {
        setIsModalSingerOpen(!isModalSingerOpen)
    }
    const handlemanagertopic = () => {
        console.log("oke")
        setIsModalTopiclOpen(!isModalTopicOpen)

    }
    const handlemain = () => {
        setIsModalMainlOpen(!isModalMainOpen)
    }
    return (

        <>
            <div className="decentralization">
                <h1>Phân quyền</h1>
                <div className="updateRole">Cập nhật</div>
                <table>
                    <thead>
                        <tr>
                            <th>Tính năng</th>
                            <th>Quản trị viên</th>
                            <th>Tác giả</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td onClick={handlemain} className="tdTitle">Trang tổng quan</td>
                            <td></td>
                            <td></td>

                        </tr>
                        {isModalMainOpen && (
                            <tr>
                                <td>Xem</td>
                                <td><input type="checkbox" /></td>
                                <td><input type="checkbox" /></td>
                            </tr>
                        )

                        }

                        <tr>
                            <td onClick={handlemanagertopic} className="tdTitle">Quản lý chủ đề</td>
                            <td></td>
                            <td></td>
                        </tr>
                        {isModalTopicOpen && (
                            <>
                                <tr >
                                    <td>Xem</td>
                                    <td><input type="checkbox" /></td>
                                    <td><input type="checkbox" /></td>
                                </tr>
                                <tr >
                                    <td>Thêm mới</td>
                                    <td><input type="checkbox" /></td>
                                    <td><input type="checkbox" /></td>
                                </tr>
                                <tr >
                                    <td>Chỉnh sửa</td>
                                    <td><input type="checkbox" /></td>
                                    <td><input type="checkbox" /></td>
                                </tr>
                                <tr >
                                    <td>Xóa</td>
                                    <td><input type="checkbox" /></td>
                                    <td><input type="checkbox" /></td>
                                </tr>
                            </>
                        )

                        }
                        <tr>
                            <td className="tdTitle" onClick={() => handlemanagersing()}>Quản lý bài hát</td>
                            <td></td>
                            <td></td>
                        </tr>
                        {isModalSingOpen && (
                            <>
                                <tr >
                                    <td>Xem</td>
                                    <td><input type="checkbox" /></td>
                                    <td><input type="checkbox" /></td>
                                </tr>
                                <tr >
                                    <td>Thêm mới</td>
                                    <td><input type="checkbox" /></td>
                                    <td><input type="checkbox" /></td>
                                </tr>
                                <tr >
                                    <td>Chỉnh sửa</td>
                                    <td><input type="checkbox" /></td>
                                    <td><input type="checkbox" /></td>
                                </tr>
                                <tr >
                                    <td>Xóa</td>
                                    <td><input type="checkbox" /></td>
                                    <td><input type="checkbox" /></td>
                                </tr>
                            </>
                        )

                        }
                        <tr>
                            <td className="tdTitle" onClick={() => handlemanagersinger()}>Quản lý ca sĩ</td>
                            <td></td>
                            <td></td>
                        </tr>
                        {isModalSingerOpen && (
                            <>
                                <tr >
                                    <td>Xem</td>
                                    <td><input type="checkbox" /></td>
                                    <td><input type="checkbox" /></td>
                                </tr>
                                <tr >
                                    <td>Thêm mới</td>
                                    <td><input type="checkbox" /></td>
                                    <td><input type="checkbox" /></td>
                                </tr>
                                <tr >
                                    <td>Chỉnh sửa</td>
                                    <td><input type="checkbox" /></td>
                                    <td><input type="checkbox" /></td>
                                </tr>
                                <tr >
                                    <td>Xóa</td>
                                    <td><input type="checkbox" /></td>
                                    <td><input type="checkbox" /></td>
                                </tr>
                            </>
                        )

                        }
                    </tbody>
                </table>
                {/* {isModalTopicOpen && (

            )

            } */}
            </div>
        </>
    )
}