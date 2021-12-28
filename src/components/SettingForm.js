import React, { useState } from 'react'
import "../App.css"
import { changeSetting } from '../services/Services';

export default function SettingForm({ maxSize, itemPerPage, allowedType, fetchSetting, setShowSetting}) {
  const [size, setSize] = useState(maxSize/1024/1024);
  const [item, setItem] = useState(itemPerPage);

  const [type, setType] = useState(allowedType);

  const saveSetting = async () => {
    await changeSetting(size*1024*1024, item, type);
    fetchSetting()
    setShowSetting(false);
  }
  return (
    <div id="add-app" className="setting">
      <label>Max file size (MB) : </label>
      <input
        type="number"
        value={size}
        onChange={(inputEvent) => setSize((inputEvent.target.value))}
      />
      <label>Item per page </label>
      <input
        type="number"
        value={item}
        onChange={(inputEvent) => setItem(inputEvent.target.value)}
      />
      <label>Allow type</label>
      <input
        list="browsers"
        value={type}
        onChange={(inputEvent) => setType(inputEvent.target.value)}
      />
      <datalist id="browsers">
        <option value="Document/PDF" />
        <option value="Image" />
        <option value="All" />
      </datalist>
      <button className="btn btn-blue" onClick={saveSetting}>
        <i className="far fa-trash-alt"></i> Save
      </button>
    </div>
  );
}
