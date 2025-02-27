import imageUpload from "../../assets/images/image_upload.jpg"
export const FileUploadPage = () => {
    return (
    <>
        <div className="FileUpload">
          <div className="FileUpload__up">
            <img src={imageUpload} alt="mic"/>
            <input type="file"/>
          </div>
        </div>
    </>
    )
}