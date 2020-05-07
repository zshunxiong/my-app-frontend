import React from 'react';
import InputArea from './components/InputArea';
import TableArea from './components/TableArea';
import API_URL from './config';
import 'bootstrap/dist/css/bootstrap.min.css';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      data: []
    }
  }

  addData = () => {
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
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newData)
    })
      .then(response => response.json())
      .then(res => {
        if (res.success) {
          this.getData();
        } else {
          alert(res.msg)
        }
      })
      .catch(err => console.log(err))
  }

  delData = (id) => {
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
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id })
      })
        .then(response => response.json())
        .then(res => {
          if (res.success) {
            this.getData();
          } else {
            alert(res.msg)
          }
        })
        .catch(err => console.log(err))
    }
  }

  getData = () => {
    fetch(API_URL + '/crud')
      .then(response => response.json())
      .then(res => {
        if (res.success) {
          this.setState({
            data: res.data
          })
        } else {
          alert(res.msg)
        }
      })
      .catch(err => console.log(err))
  }

  componentDidMount() {
    this.getData();
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <InputArea addData={this.addData} />
          <TableArea data={this.state.data} delData={this.delData} />
        </div>
      </div>
    );
  }
}

export default App;