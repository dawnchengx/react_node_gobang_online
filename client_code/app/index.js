import React from 'react';
import QRCode from 'qrcode.react';
// import {Link, browserHistory } from 'react-router-dom';
import axios from 'axios';

export default class Home extends React.Component {
    constructor(props) {
        super(props);
    }
    
    handleCreateRoom(props){
        axios.post('http://localhost:8081/room', {})//请求发送数据  
        .then(function (response) {//请求成功
          props.history.push('/game/'+response.data);
        }.bind(this))  
        .catch(function (error) {//请求失败！  
          console.log(error);
        }.bind(this));  
    }

    render () {
        return (
            <button onClick={props => this.handleCreateRoom(this.props)}>创建房间</button>
        );
    }
}
