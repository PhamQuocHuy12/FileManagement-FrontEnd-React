import { firebaseDownload, firebaseUpload } from "./FirebaseStorage";
const api = "http://localhost:8080";

export const getAllFile = async (itemPerPage,currentPage) => {
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

export const uploadFile = async (file) => {
  const fileData = await uploadToStorage(file);
  const response = await fetch(`${api}/upload`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(fileData)
  });
  const data = await response.json();
  console.log(data)
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
  console.log(data)
}

export const changeSetting = async (maxSize, itemPerPage, allowedType) => {
  const setting = {maxSize, itemPerPage, allowedType};
  const response = await fetch(`${api}/upload`, {
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



const uploadToStorage = async (file) => {
  const fileData = {};
  var re = /(?:\.([^.]+))?$/;
  fileData.name = file.name;
  fileData.size = file.size/1024;
  fileData.mime = re.exec(file.name)[1];
  fileData.path = await firebaseUpload(file);
  fileData.status = "available";
  return fileData;
};
