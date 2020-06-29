import React, { useState, useEffect } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import AppointmentModal from '../components/AppointmentModal';
import { config } from '../config';
import '../components/css/appointment.css';

function Info(props) {
  const [data, setData] = useState(null);
  const [zoneData, setZoneData] = useState(null);
  const [selectedZone, setSelectedZone] = useState(null);
  const [currentEventKey, setCurrentEventKey] = useState(null);
  const [show, setShow] = useState(false);
  const sid = sessionStorage.getItem('sid');
  const authid = sessionStorage.getItem('authid');

  const GetCanBookSpaceType = () => {
    fetch(config.API_URL + `/APPAPI/GetCanBookSpaceType.aspx?sid=${sid}&authid=${authid}&restype=json`, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => response.json())
      .then(res => {
        if (res[0].rescode === '3' || res[0].rescode === '4') {
          props.setSession(false);
        } else {
          setData(res[0].resdata);
        }
      })
      .catch(err => console.log(err))
  }

  const GetZoneInfo = (elem) => {
    const spacetype = elem.target.getAttribute('spacetype');
    setCurrentEventKey(spacetype);
    if (spacetype !== currentEventKey) {
      fetch(config.API_URL + `/APPAPI/GetZoneInfo.aspx?sid=${sid}&authid=${authid}&spacetype=${spacetype}&restype=json`, {
        method: 'get',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => response.json())
        .then(res => {
          if (res[0].rescode === '3' || res[0].rescode === '4') {
            props.setSession(false);
          } else {
            setZoneData(res[0].resdata);
          }
        })
        .catch(err => console.log(err))
    } else {
      setCurrentEventKey(null);
      setZoneData(null);
    }
    setSelectedZone(null);
  }

  const selectZone = (elem) => {
    const zoneid = elem.target.getAttribute('zoneid');
    const zonename = elem.target.getAttribute('zonename');
    fetch(config.API_URL + `/APPAPI/GetParams.aspx?sid=${sid}&authid=${authid}&spacetype=${currentEventKey}&restype=json`, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => response.json())
      .then(res => {
        if (res[0].rescode === '3' || res[0].rescode === '4') {
          props.setSession(false);
        } else {
          setSelectedZone({
            zoneid: zoneid,
            zonename: zonename,
            spacetype: currentEventKey,
            params: res[0].resdata[0]
          });
          setShow(true);
        }
      })
      .catch(err => console.log(err))
  }

  useEffect(GetCanBookSpaceType, []);

  return (
    <>
      <Accordion>
        {data === null ? 'loading' :
          data.length === 0 ? 'No Data Found' :
            data.map((row, index) => {
              return (
                <Card key={row.spacetype}>
                  <Accordion.Toggle as={Card.Header} eventKey={row.spacetype} onClick={GetZoneInfo} spacetype={row.spacetype}>
                    {row.spacetypename}
                  </Accordion.Toggle>
                  <Accordion.Collapse eventKey={row.spacetype}>
                    <ListGroup variant="flush">
                      {zoneData === null ? 'loading' :
                        zoneData.length === 0 ? 'No Data Found' :
                          zoneData.map((row, index) => {
                            return (
                              <ListGroup.Item key={index}>
                                <div className="d-flex justify-content-between align-items-center">
                                  <b>{row.zonename} 【{row.zoneid}】</b>
                                  <Button variant="success" zoneid={row.zoneid} zonename={row.zonename} onClick={selectZone}>新增預約</Button>
                                </div>
                              </ListGroup.Item>
                            )
                          })
                      }
                    </ListGroup>
                  </Accordion.Collapse>
                </Card>
              )
            })
        }
      </Accordion>
      {show ? <AppointmentModal show={show} setshow={setShow} selectedzone={selectedZone} setSession={props.setSession} /> : null}      
    </>
  )
}

export default Info;