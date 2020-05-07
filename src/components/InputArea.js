import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

class InputArea extends React.Component {
  render() {
    return (
      <div className="col-sm-6">
        <div className="row">
          <div className="col-sm-12">
            <div className="form-group">
              <label htmlFor="name">姓名:</label>
              <input type="text" className="form-control" id="name" />
            </div>
          </div>
          <div className="col-sm-12">
            <div className="form-group">
              <label htmlFor="age">年龄:</label>
              <input type="text" className="form-control" id="age" />
            </div>
          </div>
          <div className="col-sm-12">
            <div className="form-group">
              <label htmlFor="email">E-Mail:</label>
              <input type="text" className="form-control" id="email" />
            </div>
          </div>
        </div>
        <button type="button" className="btn btn-primary" onClick={this.props.addData}>新增</button>
      </div>
    );
  }
}

export default InputArea;