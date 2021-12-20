import React from 'react'
import "../App.css"

export default function SettingForm() {
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
}
