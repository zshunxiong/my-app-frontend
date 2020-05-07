import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function InputArea(props) {
  const modalData = props.modalData ? props.modalData : '';
  return (
    <div className="col-sm-12">
      <div className="row">
        <div className="col-sm-12">
          <div className="form-group">
            <label htmlFor="name">姓名:</label>
            <input type="text" className="form-control" id="name" defaultValue={modalData.name} />
          </div>
        </div>
        <div className="col-sm-12">
          <div className="form-group">
            <label htmlFor="age">年龄:</label>
            <input type="text" className="form-control" id="age" defaultValue={modalData.age} />
          </div>
        </div>
        <div className="col-sm-12">
          <div className="form-group">
            <label htmlFor="email">E-Mail:</label>
            <input type="text" className="form-control" id="email" defaultValue={modalData.email} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default InputArea;