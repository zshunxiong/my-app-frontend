import React, { useState, useEffect } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import { config } from '../config';
import 'bootstrap/dist/css/bootstrap.min.css';

function Record(props) {
  const [data, setData] = useState(null);
  const sid = sessionStorage.getItem('sid');
  const authid = sessionStorage.getItem('authid');

  const GetDemeritList = () => {
    fetch(config.API_URL + `/APPAPI/GetDemeritList.aspx?sid=${sid}&authid=${authid}&restype=json`, {
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

  useEffect(GetDemeritList, []);

  return (
    <ListGroup>
      {data === null ? 'loading' :
        data.length === 0 ? 'No Data Found' :
        data.map((row, index) => {
          return (
            <ListGroup.Item action key={index}> {row.spacetypename} | {row.devname} | {row.reason} | {row.mdate}</ListGroup.Item>
          )
        })
      }
    </ListGroup>
  )
}

export default Record;