import React, { useEffect, useState } from "react";
import "./App.css";
import { getAllFile } from "./services/Services";

function App() {
  const [files, setFiles] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchFiles = async () => {
      const data = await getAllFile();
      setFiles(data);
    };
    fetchFiles();
  }, [search]);

  console.log(showForm);

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

  const SettingForm = () => {
    return (
      <div>
        <form id="add-app" className="setting">
          <label>Max file size : </label>
          <input type="text" />
          <label>Item per page </label>
          <input type="text" />
          <label>Allow type</label>
          <input list="browsers"/>
          <datalist id="browsers">
            <option value="Document/PDF" />
            <option value="Image" />
          </datalist>
          <button className="btn btn-blue">
            <i className="far fa-trash-alt"></i> Save
          </button>
        </form>
      </div>
    );
  };
  const onUpload = () => {
    console.log('hehe')
  }
  const onDelete = () => {};
  const onDownload = () => {};
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
          <label for="myfile">Select a file:</label>
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
      {showForm ? <SettingForm /> : null}

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
    </div>
  );
}

const RenderRow = (props) => {
  console.log(props);
  return (
    <>
      <>
        <td>{props.data.id}</td>
      </>
      <>
        {props.idx === 0 ? <td rowSpan={props.rows}>{props.keys}</td> : null}
        <>
          <td>{props.data.version}</td>
          <td>{props.data.size}</td>
          <td>{props.data.createdDateTime}</td>
          <td>{props.data.numberOfDownLoad}</td>
          <td>
            <button
              className="btn btn-blue"
              onClick={() => props.onDownload(props.data.id)}
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
