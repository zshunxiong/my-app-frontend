import React, { useState } from 'react';
import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css'; // 新增這行
// import './App.css'; 目前沒用到

function App() {
  // 這是 React 的寫法，宣告有一個狀態 名叫 data，setData 是控制該狀態的 function名
  const [data, setData] = useState([]);
  const addData = () => {
    let name = document.getElementById('name').value;
    let age = document.getElementById('age').value;
    let email = document.getElementById('email').value;
    let newData = { name, age, email };
    setData(prevState => [...prevState, newData]);
  }

  const delData = (name) => {
    // 刪除的方法很特別，這裡是做過濾的動作，讓 data 跑迴圈，
    // 查到刪除對象後不把它加入新的 data，就可以把它從 data 中移除了
    setData(data.filter(row => row.name !== name));
  }

  return (
    <div className="container">
      <div className="row">
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
          <button type="button" className="btn btn-primary" onClick={addData}>新增</button>
        </div>
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
              {data.map((row, index) => {
                return (
                  <tr key={index}>
                    <td>{row.name}</td>
                    <td>{row.age}</td>
                    <td>{row.email}</td>
                    <td>
                      <button type='button' className='btn btn-danger' onClick={() => delData(row.name)}>刪除</button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
