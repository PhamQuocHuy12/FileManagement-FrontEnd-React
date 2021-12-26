import { initializeApp } from "firebase/app";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBy_PZY-JkUzhxEdMauY9dbjKNH-RkjuYk",
  authDomain: "file-management-b22ca.firebaseapp.com",
  projectId: "file-management-b22ca",
  storageBucket: "file-management-b22ca.appspot.com",
  messagingSenderId: "989971585022",
  appId: "1:989971585022:web:2030954fe30feda1ff12af",
};

const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);

export const firebaseUpload = async (file) => {
  var re = /(?:\.([^.]+))?$/;
  const extention = re.exec(file.name)[1];
  const storageRef = ref(storage, `${Math.random().toString(36)}.${extention}`);
  const uploadTask = await uploadBytesResumable(storageRef, file);
  return await getDownloadURL(uploadTask.ref);
};

export const firebaseDownload = async (url, name, id) => {
  const xhr = new XMLHttpRequest();
  xhr.responseType = "blob";
  xhr.onload = (event) => {
    const blob = xhr.response;
    var link = window.document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  xhr.open("GET", url);
  xhr.send();
};
