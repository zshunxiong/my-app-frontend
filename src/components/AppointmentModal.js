import React, { useState, useEffect, useRef } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import moment from 'moment';
import { config, spaceTypeConf } from '../config';
import { AppointmentDateS0, AppointmentTimeS0, AppointmentDateS1, AppointmentTimeS1, AppointmentDateS2, AppointmentTimeS2 } from './AppointmentModalBody';

function AppointmentModal(props) {
  // s0 state
  const [stage, setStage] = useState(0);
  const [sdate, setSdate] = useState(moment());
  const [edate, setEdate] = useState(moment().add(6, 'days'));
  const [stime, setStime] = useState("00:00");
  const [etime, setEtime] = useState("00:00");
  // s1 state
  const [s1data, setS1data] = useState(null);
  const [s1checked, setS1checked] = useState('');
  // s2 state
  const [s2data, setS2data] = useState(null);

  const previousStage = usePrevious(stage);
  const formType = props.selectedzone ? spaceTypeConf[`st_${props.selectedzone.spacetype}`] : null;
  const sid = sessionStorage.getItem('sid');
  const authid = sessionStorage.getItem('authid');

  const BookDeviceQuery = (qtype) => {
    let urlparam = '';
    if (qtype === 'date') {
      const seqdays = document.getElementById('seqdays').value;
      urlparam = `/APPAPI/BookDeviceQuery.aspx?sid=${sid}&authid=${authid}&spacetype=${props.selectedzone.spacetype}&zoneid=${props.selectedzone.zoneid}&sdate=${sdate.format('YYYY/MM/DD')}&edate=${edate.format('YYYY/MM/DD')}&seqdays=${seqdays}&restype=json`;
    } else if (qtype === 'time') {
      urlparam = `/APPAPI/BookDeviceQuery.aspx?sid=${sid}&authid=${authid}&spacetype=${props.selectedzone.spacetype}&zoneid=${props.selectedzone.zoneid}&sdate=${sdate.format('YYYY/MM/DD')}&shh=${stime.split(':')[0]}&smm=${stime.split(':')[1]}&ehh=${etime.split(':')[0]}&emm=${etime.split(':')[1]}&restype=json`;
    }
    fetch(config.API_URL + urlparam, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => response.json())
      .then(res => {
        if (res[0].rescode === '3' || res[0].rescode === '4') {
          props.setSession(false);
        } else {
          if (res[0].resdata) {
            setS1checked('');
            setS1data(res[0].resdata);
            setStage(1);
          } else {
            alert('查無空間');
          }
        }
      })
      .catch(err => console.log(err))
  }

  const BookTimeSegQuery = (qtype) => {
    if (document.querySelector('input[name="deviceid"]:checked')) {
      let urlparam = '';
      const deviceid = document.querySelector('input[name="deviceid"]:checked').value;
      setS1checked(deviceid);
      if (qtype === 'date') {
        urlparam = `/APPAPI/BookTimeSegQuery.aspx?sid=${sid}&authid=${authid}&spacetype=${props.selectedzone.spacetype}&deviceid=${deviceid}&sdate=${sdate.format('YYYY/MM/DD')}&edate=${edate.format('YYYY/MM/DD')}&restype=json`;
      } else if (qtype === 'time') {
        urlparam = `/APPAPI/BookTimeSegQuery.aspx?sid=${sid}&authid=${authid}&spacetype=${props.selectedzone.spacetype}&deviceid=${deviceid}&sdate=${sdate.format('YYYY/MM/DD')}&restype=json`;
      }
      fetch(config.API_URL + urlparam, {
        method: 'get',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => response.json())
        .then(res => {
          if (res[0].rescode === '3' || res[0].rescode === '4') {
            props.setSession(false);
          } else {
            setS2data(res[0].resdata);
            setStage(2);
          }
        })
        .catch(err => console.log(err))
    } else {
      alert('請先選擇預約位置');
    }
  }

  const BookAdd = (qtype) => {
    let confirmAdd = window.confirm('確定預約？')
    if (confirmAdd) {
      let urlparam = '';
      let bookvalue = '';
      const userid = sessionStorage.getItem('userid');
      const checkboxes = document.getElementsByName('bookvalue');
      for (let i = 0, n = checkboxes.length; i < n; i++) {
        if (checkboxes[i].checked) {
          bookvalue += "," + checkboxes[i].value;
        }
      }
      if (bookvalue) bookvalue = bookvalue.substring(1);
      if (qtype === 'date') {
        urlparam = `/APPAPI/BookAdd.aspx?sid=${sid}&authid=${authid}&spacetype=${props.selectedzone.spacetype}&deviceid=${s1checked}&userid=${userid}&bookdate=${bookvalue}&restype=json`;
      } else if (qtype === 'time') {
        urlparam = `/APPAPI/BookAdd.aspx?sid=${sid}&authid=${authid}&spacetype=${props.selectedzone.spacetype}&deviceid=${s1checked}&userid=${userid}&sdate=${sdate.format('YYYY/MM/DD')}&booktime=${bookvalue}&restype=json`;
      }
      fetch(config.API_URL + urlparam, {
        method: 'get',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => response.json())
        .then(res => {
          if (res[0].rescode === '3' || res[0].rescode === '4') {
            props.setSession(false);
          } else {
            props.setshow(false);
            alert('預約成功');
          }
        })
        .catch(err => console.log(err))
    }
  }

  return (
    <Modal size='xl' show={props.show} onHide={() => props.setshow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>{props.selectedzone ? `${props.selectedzone.zonename}【${props.selectedzone.zoneid}】` : `未選擇預約位置`}</Modal.Title>
      </Modal.Header>
      <ModalBody
        formType={formType}
        stage={stage}
        previousStage={previousStage}
        // s0 props
        sdate={sdate}
        edate={edate}
        stime={stime}
        etime={etime}
        setSdate={setSdate}
        setEdate={setEdate}
        setStime={setStime}
        setEtime={setEtime}
        params={props.selectedzone.params}
        setSession={props.setSession}
        // s1 props
        s1data={s1data}
        s1checked={s1checked}
        // s2 props
        s2data={s2data}
      />
      <ModalFooter
        formType={formType}
        stage={stage}
        setStage={setStage}
        setshow={props.setshow}
        BookDeviceQuery={BookDeviceQuery}
        BookTimeSegQuery={BookTimeSegQuery}
        BookAdd={BookAdd}
      />
    </Modal>
  )
}

function ModalBody(props) {
  let modalForm = [];
  if (props.formType === 'date') {
    modalForm[0] =
      <AppointmentDateS0
        sdate={props.sdate}
        setSdate={props.setSdate}
        edate={props.edate}
        setEdate={props.setEdate}
        setSession={props.setSession}
        params={props.params}
      />;
    modalForm[1] =
      <AppointmentDateS1
        data={props.s1data}
        checked={props.s1checked}
      />;
    modalForm[2] =
      <AppointmentDateS2
        data={props.s2data}
      />;
  } else if (props.formType === 'time') {
    modalForm[0] =
      <AppointmentTimeS0
        previousStage={props.previousStage}
        sdate={props.sdate}
        setSdate={props.setSdate}
        stime={props.stime}
        setStime={props.setStime}
        etime={props.etime}
        setEtime={props.setEtime}
        setSession={props.setSession}
        params={props.params}
      />;
    modalForm[1] =
      <AppointmentTimeS1
        data={props.s1data}
        checked={props.s1checked}
      />;
    modalForm[2] =
      <AppointmentTimeS2
        data={props.s2data}
      />;
  }

  return (
    <Modal.Body>
      {modalForm[props.stage]}
    </Modal.Body>
  )
}

function ModalFooter(props) {
  let modalFooter = [];
  if (props.formType === 'date') {
    modalFooter[0] =
      <>
        <Button variant="secondary" onClick={() => props.setshow(false)}>
          取消
        </Button>
        <Button variant="primary" onClick={() => props.BookDeviceQuery('date')}>
          查詢符合時間範圍空間
        </Button>
      </>;
    modalFooter[1] =
      <>
        <Button variant="secondary" onClick={() => props.setshow(false)}>
          取消
        </Button>
        <div className='d-flex justify-content-between'>
          <Button variant="secondary" onClick={() => props.setStage(0)}>
            上一步
          </Button>
          <Button variant="primary" onClick={() => props.BookTimeSegQuery('date')}>
            下一步
          </Button>
        </div>
      </>;
    modalFooter[2] =
      <>
        <Button variant="secondary" onClick={() => props.setshow(false)}>
          取消
        </Button>
        <div className='d-flex justify-content-between'>
          <Button variant="secondary" onClick={() => props.setStage(1)}>
            上一步
          </Button>
          <Button variant="primary" onClick={() => props.BookAdd('date')}>
            確定預約
          </Button>
        </div>
      </>;
  } else if (props.formType === 'time') {
    modalFooter[0] =
      <>
        <Button variant="secondary" onClick={() => props.setshow(false)}>
          取消
        </Button>
        <Button variant="primary" onClick={() => props.BookDeviceQuery('time')}>
          查詢符合時間範圍空間
        </Button>
      </>;
    modalFooter[1] =
      <>
        <Button variant="secondary" onClick={() => props.setshow(false)}>
          取消
        </Button>
        <div className='d-flex justify-content-between'>
          <Button variant="secondary" onClick={() => props.setStage(0)}>
            上一步
          </Button>
          <Button variant="primary" onClick={() => props.BookTimeSegQuery('time')}>
            下一步
          </Button>
        </div>
      </>;
    modalFooter[2] =
      <>
        <Button variant="secondary" onClick={() => props.setshow(false)}>
          取消
        </Button>
        <div className='d-flex justify-content-between'>
          <Button variant="secondary" onClick={() => props.setStage(1)}>
            上一步
          </Button>
          <Button variant="primary" onClick={() => props.BookAdd('time')}>
            確定預約
          </Button>
        </div>
      </>;
  }

  return (
    <Modal.Footer className='d-flex justify-content-between'>
      {modalFooter[props.stage]}
    </Modal.Footer>
  )
}

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export default AppointmentModal;