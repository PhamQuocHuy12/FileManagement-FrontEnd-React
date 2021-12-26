import React, { useEffect, useState } from "react";
import "./App.css";
import {
  getAllFile,
  uploadFile,
  downloadFile,
  deleteFile,
  changeSetting,
} from "./services/Services";

function App() {
  const [files, setFiles] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [itemPerPage, setItemPerPage] = useState(4);
  const [currentPage, setCurrentPage] = useState(null);
  const [totalPages, setTotalPages] = useState(null);
  const [maxSize, setMaxSize] = useState(25600);
  const [allowedType, setAllowedType] = useState("Document/PDF");

  useEffect(() => {
    fetchFiles(itemPerPage, currentPage);
  }, [search, currentPage, itemPerPage]);

  const fetchFiles = async (itemPerPage, currentPage) => {
    const data = await getAllFile(itemPerPage, currentPage);
    setFiles(data.content);
    setTotalPages(data.totalPages);
    setCurrentPage(data.number);
  };

  const onUpload = async () => {
    await uploadFile(selectedFile);
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

  const onSaveSetting = async () => {
    const setting = await changeSetting(maxSize, itemPerPage, allowedType);
    setAllowedType(setting.mimeTypeAllowed);
    setMaxSize(setting.maxSize);
    setItemPerPage(setting.itemPerPage);
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
      <div id="search">
        <input
          type="text"
          placeholder="Search..."
          onChange={(inputEvent) => setSearch(inputEvent.target.value)}
        />
      </div>
      <div className="controller">
        <button
          className="btn btn-orange"
          onClick={() => setShowForm(!showForm)}
        >
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
      {showForm ? (
        <div>
          <form id="add-app" className="setting">
            <label>Max file size (KB) : </label>
            <input
              type="text"
              value={maxSize}
              onChange={(inputEvent) => setMaxSize(inputEvent.target.value)}
            />
            <label>Item per page </label>
            <input
              type="text"
              value={itemPerPage}
              onChange={(inputEvent) => setItemPerPage(inputEvent.target.value)}
            />
            <label>Allow type</label>
            <input
              list="browsers"
              value={allowedType}
              onChange={(inputEvent) => setAllowedType(inputEvent.target.value)}
            />
            <datalist id="browsers">
              <option value="Document/PDF" />
              <option value="Image" />
            </datalist>
            <button className="btn btn-blue" onClick={onSaveSetting}>
              <i className="far fa-trash-alt"></i> Save
            </button>
          </form>
        </div>
      ) : null}

      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>File Name</th>
            <th>Version</th>
            <th>File size (KB)</th>
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
          {currentPage + 1}/{totalPages}
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
          <td>{props.data.size}</td>
          <td>{props.data.createdDateTime}</td>
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
