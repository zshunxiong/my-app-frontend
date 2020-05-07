import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

class TableArea extends React.Component {
  render() {
    return (
      <div className="col-sm-6">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>姓名</th>
              <th>年龄</th>
              <th>E-Mail</th>
              <th></th>
            </tr>
          </thead>
          <tbody id='content'>
            {/* 這裡要改成會迴圈跑出 data 的資料 */}
            {this.props.data.map((row, index) => {
              return (
                <tr key={index}>
                  <td>{row.name}</td>
                  <td>{row.age}</td>
                  <td>{row.email}</td>
                  <td>
                    <button type='button' className='btn btn-danger' onClick={() => this.props.delData(row.id)}>刪除</button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default TableArea;