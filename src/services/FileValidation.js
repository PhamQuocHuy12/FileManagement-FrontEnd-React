const docType = ["docx", "doc", "pdf", "xlsx"];
const imageType = ["png", "PNG", "JPEG", "jpeg", "jpg", "JPG"]
export function validateFileType (fileType, mimeTypeAllowed) {
    console.log(fileType  +" "+ mimeTypeAllowed);
    if (mimeTypeAllowed === "Document/PDF") {
        if (docType.includes(fileType)) {
            return true;
        } else {
            alert("Invalid fileType");
            return false;
        }
    }
    if (mimeTypeAllowed === "Image") {
        if (imageType.includes(fileType)) {
            return true;
        } else {
            alert("Invalid file type");
            return false;
        }
    }
    return true;
}

export function validateFileSize(fileSize, maxSize){
    console.log(fileSize  +" "+ maxSize);
    if(fileSize<= maxSize){
        return true;
    } else {
        alert("Invalid file size");
        return false;
    }
}