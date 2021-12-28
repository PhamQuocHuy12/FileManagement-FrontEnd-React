import { validateFileType, validateFileSize } from "./FileValidation";
import { firebaseDownload, firebaseUpload } from "./FirebaseStorage";
const api = "http://localhost:8080";

export const getAllFile = async (itemPerPage, currentPage) => {
  const response = await fetch(`${api}?page=${currentPage}&size=${itemPerPage}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  const data = await response.json();
  return data;
};

export const uploadFile = async (file, mimeTypeAllowed, maxSize) => {

  const fileData = await uploadToStorage(file, mimeTypeAllowed, maxSize);
  if(fileData !== null){
    const response = await fetch(`${api}/upload`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(fileData)
    });
    const data = await response.json();
    return data;
  } else {
    return null;
  }

};

export const downloadFile = async (url, name, id) => {
  await firebaseDownload(url, name, id)
  const response = await fetch(`${api}/download/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  const data = await response.json();
  console.log(data)
}

export const deleteFile = async (id) => {
  const response = await fetch(`${api}/delete/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  const data = await response.json();
  return(data)
}

export const changeSetting = async (size, item, type) => {
  const setting = await createSetting(size, item, type);
  const response = await fetch(`${api}/setting`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(setting)
  });
  const data = await response.json();
  console.log(data)
};

export const getSetting = async () => {
  console.log("hehe")
  const response = await fetch(`${api}/setting`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  const data = await response.json();
  return data;
};

const createSetting = async (size, item, type) => {
  const setting = {};
  setting.maxSize = size;
  setting.itemPerPage = item;
  setting.mimeTypeAllowed = type;
  return setting;
}

const uploadToStorage = async (file, mimeTypeAllowed, maxSize) => {
  var re = /(?:\.([^.]+))?$/;
  if(validateFileType(re.exec(file.name)[1], mimeTypeAllowed) & validateFileSize(file.size, maxSize)){
    const fileData = {};
    fileData.mime = re.exec(file.name)[1];
    fileData.name = file.name;
    fileData.size = file.size / 1024;
    fileData.path = await firebaseUpload(file);
    fileData.status = "available";
    return fileData;
  } else {
    return null;
  }
};
