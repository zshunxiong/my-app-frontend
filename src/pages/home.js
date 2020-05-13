import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import InputArea from '../components/InputArea';
import TableArea from '../components/TableArea';
import { API_URL } from '../config';
import 'bootstrap/dist/css/bootstrap.min.css';

function Home(props) {
  // 取得 JWT
  const token = sessionStorage.getItem('token');
  const [data, setData] = useState([]);
  const [modalData, setModalData] = useState(null);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);

  const showModal = (data) => {
    setModalData(data);
    setShow(true);
  }

  const addData = () => {
    let name = document.getElementById('name').value;
    let age = document.getElementById('age').value;
    let email = document.getElementById('email').value;
    let newData = { name, age, email };
    // this.setState(prevState => ({
    //   data: [...prevState.data, newData]
    // }))
    fetch(API_URL + '/crud', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify(newData)
    })
      .then(response => response.json())
      .then(res => {
        if (res.success) {
          handleClose();
          getData();
        } else {
          alert(res.msg);
          if (res.redirect) {
            logout();
          }
        }
      })
      .catch(err => console.log(err))
  }

  const updData = () => {
    let id = modalData.id;
    let name = document.getElementById('name').value;
    let age = document.getElementById('age').value;
    let email = document.getElementById('email').value;
    let newData = { id, name, age, email };
    // this.setState(prevState => ({
    //   data: [...prevState.data, newData]
    // }))
    fetch(API_URL + '/crud', {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify(newData)
    })
      .then(response => response.json())
      .then(res => {
        if (res.success) {
          handleClose();
          getData();
        } else {
          alert(res.msg);
          if (res.redirect) {
            logout();
          }
        }
      })
      .catch(err => console.log(err))
  }

  const delData = (id) => {
    // 刪除的方法很特別，這裡是做過濾的動作，讓 data 跑迴圈，
    // 查到刪除對象後不把它加入新的 data，就可以把它從 data 中移除了
    // this.setState({
    //   data: this.state.data.filter(row => row.name !== name)
    // })
    let confirmDelete = window.confirm('Delete item forever?')
    if (confirmDelete) {
      fetch(API_URL + '/crud', {
        method: 'delete',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ id })
      })
        .then(response => response.json())
        .then(res => {
          if (res.success) {
            getData();
          } else {
            alert(res.msg);
            if (res.redirect) {
              logout();
            }
          }
        })
        .catch(err => console.log(err))
    }
  }

  const getData = () => {
    fetch(API_URL + '/crud', {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    }).then(response => response.json())
      .then(res => {
        if (res.success) {
          setData(res.data)
        } else {
          alert(res.msg);
          if(res.redirect) {
            logout();
          }
        }
      })
      .catch(err => console.log(err))
  }

  const logout = () => {
    sessionStorage.removeItem('token');
    props.history.push('./');
  }
  
  useEffect(() => {
    getData();
  }, []);
  

  return (
    <div className="container">
      <div className="row">
        <TableArea data={data} delData={delData} showModal={showModal} />
        <div className="col d-flex justify-content-between">
          <button type="button" className="btn btn-primary" onClick={() => showModal(null)}>新增</button>
          <button type="button" className="btn btn-secondary" onClick={logout}>登出</button>
        </div>
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{modalData ? '修改資料' : '新增資料'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputArea modalData={modalData} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            取消
          </Button>
          <Button variant="primary" onClick={modalData ? updData : addData}>
            {modalData ? '儲存' : '新增'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Home;