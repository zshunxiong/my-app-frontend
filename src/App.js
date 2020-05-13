import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card'
import { API_URL } from './config';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App(props) {
  const [show, setShow] = useState(false);
  const toggleModal = () => setShow(!show);

  const register = () => {
    let account = document.getElementById('regis_account').value;
    let password = document.getElementById('regis_password').value;
    let data = { account, password };
    fetch(API_URL + '/register', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then(response => response.json())
      .then(res => {
        if (res.success) {
          toggleModal();
        } else {
          alert(res.msg)
        }
      })
      .catch(err => console.log(err))
  }

  const login = () => {
    let account = document.getElementById('login_account').value;
    let password = document.getElementById('login_password').value;
    let data = { account, password };
    fetch(API_URL + '/login', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then(response => response.json())
      .then(res => {
        if (res.success) {       
          sessionStorage.setItem('token', res.data.token);
          props.history.push('home')
        } else {
          alert(res.msg)
        }
      })
      .catch(err => console.log(err))
  }

  return (
    <div className="main">
      <Card>
        <Card.Header>
          <b>管理者登入</b>
        </Card.Header>
        <Card.Body>
          <div className="row">
            <div className="col-sm-12">
              <div className="form-group">
                <label htmlFor="login_account">帳號:</label>
                <input type="text" className="form-control" id="login_account" defaultValue='' />
              </div>
            </div>
            <div className="col-sm-12">
              <div className="form-group">
                <label htmlFor="login_password">密碼:</label>
                <input type="password" className="form-control" id="login_password" defaultValue='' />
              </div>
            </div>
          </div>
        </Card.Body>
        <Card.Footer className="d-flex justify-content-between">
          <Button variant="secondary" onClick={toggleModal}>註冊</Button>
          <Button variant="primary" onClick={login}>登入</Button>
        </Card.Footer>
      </Card>

      <Modal centered show={show} onHide={toggleModal}>
        <Modal.Header closeButton>
          <Modal.Title>註冊帳號</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-sm-12">
              <div className="form-group">
                <label htmlFor="regis_account">帳號:</label>
                <input type="text" className="form-control" id="regis_account" />
              </div>
            </div>
            <div className="col-sm-12">
              <div className="form-group">
                <label htmlFor="regis_password">密碼:</label>
                <input type="password" className="form-control" id="regis_password" />
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-between">
          <Button variant="secondary" onClick={toggleModal}>
            取消
          </Button>
          <Button variant="primary" onClick={register}>
            送出
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default App;