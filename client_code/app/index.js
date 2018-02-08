import React from 'react';
import QRCode from 'qrcode.react';
// import {Link, browserHistory } from 'react-router-dom';
import axios from 'axios';

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            if_create: false,
            room_uri: '',
        }
    }
    
    handleCreateRoom(props){
        axios.post('http://localhost:8081/room', {})//请求发送数据  
        .then(function (response) {//请求成功
            this.setState({
                if_create: true,
                room_uri: '/game/'+response.data
            });
        }.bind(this))  
        .catch(function (error) {//请求失败！  
          console.log(error);
        }.bind(this));  
    }

    handleEnterRoom(props){
        props.history.push(this.state.room_uri);
    }

    render () {
        let if_create_dom = []
        if(this.state.if_create){
            let room_url = window.location.href + this.state.room_uri.substr(1);
            if_create_dom.push(
                <div key='method-1'>
                    <span>方式一：分享二维码</span>
                    <QRCode value={room_url} />
                </div>
            );
            if_create_dom.push(
                <div key='method-2'>
                    <span>方式二：分享链接</span>
                    <input style={{width:'300px'}} type="text" value={room_url} readOnly />
                </div>
            );
            if_create_dom.push(
                <div key='enter'><button onClick={props => this.handleEnterRoom(this.props)}>进入房间</button></div>
            );
        }
        return (
            <div>
                <div key='create'>
                    <button onClick={props => this.handleCreateRoom(this.props)}>创建房间</button>
                </div>
                {if_create_dom}
            </div>
        );
    }
}
