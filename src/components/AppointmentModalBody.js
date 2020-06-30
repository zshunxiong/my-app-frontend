import React, { useState, useEffect } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card'
import moment from 'moment';
import { SingleDatePicker } from 'react-dates';
import TimePicker from 'rc-time-picker';
import { config } from '../config';
import './css/timepicker.css';

function AppointmentDateS0(props) {
  const [sdate_focus, setSdate_focus] = useState(null);
  const [edate_focus, setEdate_focus] = useState(null);

  return (
    <Form>
      <Form.Row>
        <Form.Group as={Col}>
          <Form.Label>開始日期</Form.Label>
          <SingleDatePicker
            id="sdate"
            date={props.sdate}
            focused={sdate_focus}
            onDateChange={(e) => {
              props.setSdate(e);
              props.setEdate(moment(e).add(6, 'days'));
            }}
            onFocusChange={(e) => {
              setSdate_focus(e.focused);
            }}
            placeholder=''
            isOutsideRange={() => false}
            displayFormat="YYYY/MM/DD"
            block
            readOnly
          />
        </Form.Group>
        <Form.Group as={Col}>
          <Form.Label>結束日期</Form.Label>
          <SingleDatePicker
            id="edate"
            date={props.edate}
            focused={edate_focus}
            onDateChange={(e) => {
              props.setEdate(e);
            }}
            onFocusChange={(e) => {
              setEdate_focus(e.focused);
            }}
            placeholder=''
            isOutsideRange={() => false}
            displayFormat="YYYY/MM/DD"
            disabled
            block
            readOnly
          />
        </Form.Group>
      </Form.Row>
      <Form.Group>
        <Form.Label>連續使用大於</Form.Label>
        <Form.Control as="select" id="seqdays">
          <option value={1}> 1 日</option>
          <option value={3}> 3 日</option>
          <option value={5}> 5 日</option>
          <option value={7}> 7 日</option>
        </Form.Control>
      </Form.Group>
    </Form>
  )
}

function AppointmentTimeS0(props) {
  const [sdate_focus, setSdate_focus] = useState(null);
  const [opentime, setOpentime] = useState("00:00");
  const [closetime, setClosetime] = useState("00:00");
  const sid = sessionStorage.getItem('sid');
  const authid = sessionStorage.getItem('authid');

  const GetOpenTime = () => {
    if (props.previousStage !== 1) {
      fetch(config.API_URL + `/APPAPI/GetOpenTime.aspx?sid=${sid}&authid=${authid}&bookdate=${props.sdate.format('YYYY/MM/DD')}&restype=json`, {
        method: 'get',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => response.json())
        .then(res => {
          if (res[0].rescode === '3' || res[0].rescode === '4') {
            props.setSession(false);
          } else {
            // setOpentime(res[0].resdata[0].opentime);
            // setClosetime(res[0].resdata[0].closetime);
            // setStime(res[0].resdata[0].opentime);
            // setEtime(res[0].resdata[0].closetime);
            setOpentime('08:30');
            setClosetime('17:30');
            props.setStime('08:30');
            props.setEtime('17:30');
          }
        })
        .catch(err => console.log(err))
    }
  }

  function generateOptions(length, excludedOptions) {
    const arr = [];
    for (let value = 0; value < length; value++) {
      if (excludedOptions.indexOf(value) >= 0) {
        arr.push(value);
      }
    }
    return arr;
  }

  function disabledHours() {
    const openHour = parseInt(opentime.split(':')[0]);
    const closeHour = parseInt(closetime.split(':')[0]);
    if (opentime === '00:00' && closetime === '00:00') {
      return [];
    } else {
      let temp = [];
      for (let index = 0; index < openHour; index++) {
        temp.push(index);
      }
      for (let index = 23; index > closeHour; index--) {
        temp.push(index);
      }
      return temp;
    }
  }

  function disabledMinutes(h) {
    const openHour = parseInt(opentime.split(':')[0]);
    const closeHour = parseInt(closetime.split(':')[0]);
    let temp = [];
    for (let index = 0; index < parseInt(opentime.split(':')[1]); index++) {
      temp.push(index);
    }
    let temp2 = [];
    for (let index = (parseInt(closetime.split(':')[1]) + 1); index < 60; index++) {
      temp2.push(index);
    }
    if (opentime === '00:00' && closetime === '00:00') {
      return [];
    } else {
      switch (h) {
        case openHour:
          return generateOptions(60, temp);
        case closeHour:
          return generateOptions(60, temp2);
        default:
          return generateOptions(60, []);
      }
    }
  }

  useEffect(GetOpenTime, []);

  return (
    <Form>
      <Form.Row>
        <Form.Group as={Col}>
          <Form.Label>選擇日期</Form.Label>
          <SingleDatePicker
            id="sdate"
            date={props.sdate}
            focused={sdate_focus}
            onDateChange={(e) => {
              props.setSdate(e);
            }}
            onFocusChange={(e) => {
              setSdate_focus(e.focused);
            }}
            placeholder=''
            isOutsideRange={() => false}
            displayFormat="YYYY/MM/DD"
            block
            readOnly
          />
        </Form.Group>
      </Form.Row>
      <Form.Row>
        <Form.Group as={Col}>
          <Form.Label>開始時間</Form.Label>
          <TimePicker hideDisabledOptions showSecond={false} value={moment(props.stime, "HH:mm")} onChange={(val) => { props.setStime(moment(val).format("HH:mm")); }} disabledHours={disabledHours} disabledMinutes={disabledMinutes} />
        </Form.Group>
        <Form.Group as={Col}>
          <Form.Label>結束時間</Form.Label>
          <TimePicker hideDisabledOptions showSecond={false} value={moment(props.etime, "HH:mm")} onChange={(val) => { props.setEtime(moment(val).format("HH:mm")); }} disabledHours={disabledHours} disabledMinutes={disabledMinutes} />
        </Form.Group>
      </Form.Row>
    </Form>
  )
}

function AppointmentDateS1(props) {
  const [checked, setChecked] = useState('');

  const handleCheck = (i) => {
    setChecked(i);
  }

  useEffect(() => {
    setChecked(props.checked);
  }, []);

  return (
    <Row className="deviceArea">
      {props.data === null ? 'loading' :
        props.data.length === 0 ? 'No Data Found' :
          props.data.map((row, index) => {
            const isChecked = checked === row.deviceid ? true : false;
            return (
              <Col key={row.deviceid} sm={6} md={4} lg={3} xl={2}>
                <Card border="dark" onClick={() => { handleCheck(row.deviceid); }}>
                  <Card.Body className="d-flex justify-content-around align-items-center">
                    <div className="text-center device_left">
                      <b>{row.devicename}</b><br />
                      <b>{row.maxcanbookdays}天</b>
                    </div>
                    <div>
                      <Form.Check type="radio" name="deviceid" value={row.deviceid} aria-label={`deviceid_${row.deviceid}`} checked={isChecked} readOnly />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            )
          })
      }
    </Row>
  )
}

function AppointmentTimeS1(props) {
  const [checked, setChecked] = useState('');

  const handleCheck = (i) => {
    setChecked(i);
  }
  
  useEffect(() => {
    setChecked(props.checked);
  }, []);

  return (
    <Row className="deviceArea">
      {props.data === null ? 'loading' :
        props.data.length === 0 ? 'No Data Found' :
          props.data.map((row, index) => {
            const isChecked = checked === row.deviceid ? true : false;
            return (
              <Col key={row.deviceid} sm={6} md={4} lg={3} xl={2}>
                <Card border="dark" onClick={() => { handleCheck(row.deviceid); }}>
                  <Card.Body className="d-flex justify-content-around align-items-center">
                    <div className="text-center device_left">
                      <b>{row.devicename}</b><br />
                      <b>可預約</b>
                    </div>
                    <div>
                      <Form.Check type="radio" name="deviceid" value={row.deviceid} aria-label={`deviceid_${row.deviceid}`} checked={isChecked} readOnly />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            )
          })
      }
    </Row>
  )
}

function AppointmentDateS2(props) {
  const [checked, setChecked] = useState([]);

  const handleCheck = (i) => {
    // 若 i 已勾選
    if (checked.find(elem => elem === i)) {
      // 取消勾選 i 及 i 以後的日期時間
      setChecked(checked.filter(elem => elem !== i && parseInt(elem) < parseInt(i)));
    } else {
      // 若 i 未勾選
      let newState = [];
      // 若目前有任何勾選 && 若 i 大於目前已勾選的最小值
      if (checked.length !== 0 && parseInt(i) > parseInt(checked[0])) {
        // 勾選所有 i 與 最小值之間的選項
        props.data.map((row, index) => {
          if (parseInt(row.bookvalue) <= parseInt(i) && parseInt(row.bookvalue) >= parseInt(checked[0])) {
            newState.push(row.bookvalue);
          }
        })
      } else {
        // 若未有任何勾選 || 若 i 小於最小值 
        // 只改為勾選 i
        newState.push(i);
      }
      // setChecked(prevState => [...prevState, i]);
      setChecked(newState);
    }
  }

  return (
    <Row className="deviceArea">
      {props.data === null ? 'loading' :
        props.data.length === 0 ? 'No Data Found' :
          props.data.map((row, index) => {
            const isChecked = checked.find(elem => elem === row.bookvalue) ? true : false;
            return (
              <Col key={row.bookvalue} sm={6} md={4} lg={3} xl={2}>
                <Card border="dark" onClick={() => { handleCheck(row.bookvalue); }}>
                  <Card.Body className="d-flex justify-content-around align-items-center">
                    <div className="text-center device_left">
                      <b>{row.bookdate}</b>
                    </div>
                    <div>
                      <Form.Check name="bookvalue" value={row.bookvalue} aria-label={`bookvalue_${row.bookvalue}`} checked={isChecked} readOnly />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            )
          })
      }
    </Row>
  )
}

function AppointmentTimeS2(props) {
  const [checked, setChecked] = useState([]);

  const handleCheck = (i) => {
    // 若 i 已勾選
    if (checked.find(elem => elem === i)) {
      // 取消勾選 i 及 i 以後的日期時間
      setChecked(checked.filter(elem => elem !== i && parseInt(elem) < parseInt(i)));
    } else {
      // 若 i 未勾選
      let newState = [];
      // 若目前有任何勾選 && 若 i 大於目前已勾選的最小值
      if (checked.length !== 0 && parseInt(i) > parseInt(checked[0])) {
        // 勾選所有 i 與 最小值之間的選項
        props.data.map((row, index) => {
          if (parseInt(row.bookvalue) <= parseInt(i) && parseInt(row.bookvalue) >= parseInt(checked[0])) {
            newState.push(row.bookvalue);
          }
        })
      } else {
        // 若未有任何勾選 || 若 i 小於最小值 
        // 只改為勾選 i
        newState.push(i);
      }
      // setChecked(prevState => [...prevState, i]);
      setChecked(newState);
    }
  }

  return (
    <Row className="deviceArea">
      {props.data === null ? 'loading' :
        props.data.length === 0 ? 'No Data Found' :
          props.data.map((row, index) => {
            const isChecked = checked.find(elem => elem === row.bookvalue) ? true : false;
            return (
              <Col key={row.bookvalue} sm={6} md={4} lg={3} xl={2}>
                <Card border="dark" onClick={() => { handleCheck(row.bookvalue); }}>
                  <Card.Body className="d-flex justify-content-around align-items-center">
                    <div className="text-center device_left">
                      <b>{row.booktime}</b>
                    </div>
                    <div>
                      <Form.Check name="bookvalue" value={row.bookvalue} aria-label={`bookvalue_${row.bookvalue}`} checked={isChecked} readOnly />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            )
          })
      }
    </Row>
  )
}

export {
  AppointmentDateS0,
  AppointmentTimeS0,
  AppointmentDateS1,
  AppointmentTimeS1,
  AppointmentDateS2,
  AppointmentTimeS2
};