import React, { useState, useEffect } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import { config } from '../config';
import 'bootstrap/dist/css/bootstrap.min.css';

function Info(props) {
  const [data, setData] = useState(null);
  const sid = sessionStorage.getItem('sid');
  const authid = sessionStorage.getItem('authid');

  const GetBookInfo = () => {
    fetch(config.API_URL + `/APPAPI/GetBookInfo.aspx?sid=${sid}&authid=${authid}&restype=json`, {
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

  useEffect(GetBookInfo, [])

  return (
    <ListGroup>
      {data === null ? 'loading' :
        data.length === 0 ? 'No Data Found' :
        data.map((row, index) => {
          return (
            <ListGroup.Item action key={row.bookid}>{row.spacetypename} | {row.bookedatetime} | {row.statusname}</ListGroup.Item>
          )
        })
      }
    </ListGroup>
  )
}

export default Info;