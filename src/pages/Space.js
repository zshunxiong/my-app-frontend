import React, { useState, useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import { config } from '../config';
import Nav from 'react-bootstrap/Nav';
import Info from '../pages/Info';
import Appointment from '../pages/Appointment';
import Record from '../pages/Record';

function Space(props) {
  const [current, setCurrent] = useState(props.location.pathname.split('space/')[1]);
  const [session, setSession] = useState(null);
  // check session
  const sid = sessionStorage.getItem('sid');
  const authid = sessionStorage.getItem('authid');

  const handlePage = (selectedKey) => {
    setCurrent(selectedKey);
    props.history.push('/space/' + selectedKey);
  }

  const CheckSession = () => {
    fetch(config.API_URL + `/APPAPI/GetBookInfo.aspx?sid=${sid}&authid=${authid}&restype=json`, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => response.json())
      .then(res => {
        if (res[0].rescode === '3' || res[0].rescode === '4') {
          setSession(false);
        } else {
          setSession(true);
        }
      })
      .catch(err => console.log(err))
  }

  useEffect(CheckSession, []);

  if (session === null) {
    return 'Loading.';
  } else if (!session) {
    return 'Invalid Session. Please Login to Continue.';
  } else {
    return (
      <div className="container">
        <div className="row">
          <div className="col-sm-12">
            <Nav justify variant="tabs" defaultActiveKey={current} onSelect={(selectedKey) => { handlePage(selectedKey); }}>
              <Nav.Item>
                <Nav.Link eventKey="info">預約現況</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="appointment">新增預約</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="record">用戶紀錄</Nav.Link>
              </Nav.Item>
            </Nav>
            <Switch>
              {/* The component will show here if the current URL matches the path */}
              <Route path="/space/info" render={props => <Info {...props} setSession={setSession}/>} />
              <Route path="/space/appointment" render={props => <Appointment {...props} setSession={setSession} />} />
              <Route path="/space/record" render={props => <Record {...props} setSession={setSession}/>} />
            </Switch>

          </div>
        </div>
      </div>
    );
  }  
}

export default Space;
