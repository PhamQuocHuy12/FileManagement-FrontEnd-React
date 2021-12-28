import React, { useEffect, useState } from "react";
import "./App.css";
import SettingForm from "./components/SettingForm";
import {
  getAllFile,
  uploadFile,
  downloadFile,
  deleteFile,
  getSetting,
} from "./services/Services";



function App() {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  const [showSetting, setShowSetting] = useState(false);

  const [itemPerPage, setItemPerPage] = useState(4);
  const [maxSize, setMaxSize] = useState(26214400);
  const [allowedType, setAllowedType] = useState("All");

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchFiles(itemPerPage, currentPage);
    fetchSetting();
  }, [currentPage, itemPerPage, allowedType, maxSize]);

  const fetchSetting = async () => {
    const setting = await getSetting();

    setItemPerPage(setting.itemPerPage);
    setMaxSize(setting.maxSize);
    setAllowedType(setting.mimeTypeAllowed);
  }

  const fetchFiles = async (itemPerPage, currentPage) => {
    let data;
    data = await getAllFile(itemPerPage, currentPage)

    setFiles(data.content);
    setTotalPages(data.totalPages);
    setCurrentPage(data.number);
  };

  const onUpload = async () => {
    await uploadFile(selectedFile, allowedType, maxSize);
    fetchFiles(itemPerPage, currentPage);
  };

  const onDelete = async (id) => {
    // eslint-disable-next-line no-restricted-globals
    if (confirm("Are u sure") === true) {
      await deleteFile(id);
      fetchFiles(itemPerPage, currentPage);
    }
  };

  const onDownload = async (url, name, id) => {
    await downloadFile(url, name, id);
    fetchFiles(itemPerPage, currentPage);
  };

  const onPrevPage = async () => {
    await fetchFiles(itemPerPage, currentPage - 1);
  };

  const onNextPage = async () => {
    await fetchFiles(itemPerPage, currentPage + 1);
  };

  const getRowsData = () => {
    let keys = files.reduce(function (a, e) {
      let estKey = e["name"];
      (a[estKey] ? a[estKey] : (a[estKey] = null || [])).push(e);
      return a;
    }, {});
    return Object.keys(keys).map((key, index) => {
      return keys[key].map((obj, index2) => {
        return (
          <tr key={index} style={{ borderWidth: 1 }}>
            <RenderRow
              key={index2}
              idx={index2}
              data={obj}
              keys={key}
              rows={keys[key].length}
              onDelete={onDelete}
              onDownload={onDownload}
            />
          </tr>
        );
      });
    });
  };

  return (
    <div className="container">
      <h1>File Manager</h1>
      <div className="controller">
        <button
          className="btn btn-orange"
          onClick={() => setShowSetting(!showSetting)}>
          <i className="far fa-trash-alt"></i> Setting
        </button>
        <div>
          <label htmlFor="myfile">Select a file:</label>
          <input
            type="file"
            id="myfile"
            name="myfile"
            onChange={(e) => setSelectedFile(e.target.files[0])}
          ></input>
          <button className="btn btn-blue" onClick={onUpload}>
            <i className="far fa-trash-alt"></i> Upload
          </button>
        </div>
      </div>

      {showSetting ? <SettingForm
        maxSize={maxSize}
        itemPerPage={itemPerPage}
        allowedType={allowedType}
        setShowSetting={setShowSetting}
        fetchSetting={fetchSetting}
      /> : null}


      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>File Name</th>
            <th>Version</th>
            <th>File size</th>
            <th>Created Time</th>
            <th>Download</th>
            <th width="210">Actions</th>
          </tr>
        </thead>
        <tbody>{getRowsData()}</tbody>
      </table>


      <div className="navigation-bar">
          <button
            className="btn btn-blue"
            disabled={currentPage === 0 ? true : false}
            onClick={onPrevPage}
          >
            <i className="far fa-trash-alt"></i> Prev
          </button>
          <p>
            {currentPage + 1}/{totalPages === 0? 1: totalPages}
          </p>
          <button
            className="btn btn-blue"
            disabled={currentPage === totalPages - 1 ? true : false}
            onClick={onNextPage}
          >
            <i className="far fa-trash-alt"></i> Next
          </button>
        </div>
    </div>
  );
}

const RenderRow = (props) => {
  return (
    <>
      <>
        <td>{props.data.id}</td>
      </>
      <>
        {props.idx === 0 ? (
          <td className="file-name" rowSpan={props.rows}>
            {props.keys}
          </td>
        ) : null}
        <>
          <td>{props.data.version}</td>
          <td>{props.data.size}KB</td>
          <td>{(props.data.createdDateTime).slice(0, 9)}</td>
          <td>{props.data.numberOfDownLoad}</td>
          <td>
            <button
              className="btn btn-blue"
              onClick={() =>
                props.onDownload(
                  props.data.path,
                  props.data.name,
                  props.data.id
                )
              }
            >
              <i className="far fa-trash-alt"></i> Download
            </button>
            <button
              className="btn btn-orange"
              onClick={() => props.onDelete(props.data.id)}
            >
              <i className="far fa-trash-alt"></i> Delete
            </button>
          </td>
        </>
      </>
    </>
  );
};

export default App;
