import React from 'react';
import ReactDOM from 'react-dom';
import QRCode from 'qrcode.react';
import axios from 'axios';
import qs from 'qs';

const board_size = 12;

function Square(props) {
    return (
      <button className="square" onClick={props.onClick}>
        {props.value}
      </button>
    );
  }
  
  class Board extends React.Component {  
    render() {
        let square_arr = [];
        let square_col = [];
        for(let i = 0; i< board_size; ++i){
            square_col = [];
            for(let j = 0; j< board_size; ++j){
                square_col.push(
                    <Square 
                        key={(j)}
                        value={this.props.squares[j + board_size * i]}
                        onClick={() => this.props.onClick(j + board_size * i)}
                    />
                )
            }
            square_arr.push(
                <div className="board-row" key={i}>
                    {square_col}
                </div>
            );
        }
        return (
            <div>
                {square_arr}
            </div>
        );
    }
  }
  
  
export default class Game extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        squares: Array(board_size* board_size).fill(null),
        xIsNext: true,
        current_piece: -1,
      };
      this.if_done = false;
      this.winner = '';
    }
  
    componentDidMount() {
      this.timerID = setInterval(
        () => this.handleRefresh(),
        1000
      );
    }

    componentWillUnmount() {
      clearInterval(this.timerID);
    }

    handleAgain(){
      axios.post('http://localhost:8081/game', {
          room: this.props.match.params.room,
          squares: Array(board_size* board_size).fill(null),
          x_is_next : !this.state.xIsNext
      })//请求发送数据  
      .then(function (response) {//请求成功
      }.bind(this)) 
      .catch(function (error) {//请求失败！  
        console.log(error);
      }.bind(this));
      this.setState({
        squares : Array(board_size* board_size).fill(null),
        xIsNext: true,
        current_piece: -1,
      });
      this.if_done = false; 
      this.timerID = setInterval(
        () => this.handleRefresh(),
        1000
      );
    }

    handleClick(i) {
      const squares = this.state.squares.slice();
      if ( this.if_done || squares[i]) {
        return;
      }
      
      squares[i] = this.state.xIsNext ? "●" : "○";

      const wanner = this.calculateWinner();
      if(wanner){
        this.if_done = true
      }

      axios.post('http://localhost:8081/game', {
          room: this.props.match.params.room,
          squares: squares,
          x_is_next : !this.state.xIsNext,
          if_done: this.if_done,
      })//请求发送数据  
      .then(function (response) {//请求成功
      }.bind(this)) 
      .catch(function (error) {//请求失败！  
        console.log(error);
      }.bind(this));  

      this.setState({
        squares: squares,
        xIsNext: !this.state.xIsNext,
        current_piece: i
      });
    }
  
    handleRefresh() {
      axios.get('http://localhost:8081/game', {
        params: {
          room: this.props.match.params.room
        }
      })//请求发送数据  
      .then(function (response) {//请求成功
        console.log(response.data);
        if('undefined' != typeof response.data.game){
          this.setState({
            squares : response.data.game,
            xIsNext: response.data.x_is_next,
          });
          this.if_done = response.data.if_done;
        }
      }.bind(this)) 
      .catch(function (error) {//请求失败！  
        console.log(error);
      }.bind(this));  
    }

    calculateWinner() {
      let piece_type = (this.state.xIsNext ? "○" : "●");
      if(this.if_done){
        clearInterval(this.timerID);
        return piece_type == "○" ? '白子' : '黑子';
      }
      let current = this.state.current_piece;
      let squares = this.state.squares;
      let is_continuous_arr = [
        true, true, true, true, 
        true, true, true, true,
      ];
      let winner_arr = [
        0, 0, 0, 0,
        0, 0, 0, 0,
      ];
      for(let i = 1; i <= 4; ++i){
        // 左上
        if(is_continuous_arr[0] && 0 <= current-(board_size+1)*i &&  piece_type == squares[current-(board_size+1)*i]){
          ++winner_arr[0];
        }else{
          is_continuous_arr[0] = false;
        }
        // 右下
        if(is_continuous_arr[1] && 399 >= current+(board_size+1)*i && piece_type == squares[current+(board_size+1)*i]){
          ++winner_arr[1];
        }else{
          is_continuous_arr[1] = false;
        }
        // 上
        if(is_continuous_arr[2] && 0 <= current-(board_size)*i &&  piece_type == squares[current-(board_size)*i]){
          ++winner_arr[2];
        }else{
          is_continuous_arr[2] = false;
        }
        // 下
        if(is_continuous_arr[3] && 0 <= current+(board_size)*i &&  piece_type == squares[current+(board_size)*i]){
          ++winner_arr[3];
        }else{
          is_continuous_arr[3] = false;
        }
        // 右上
        if(is_continuous_arr[4] && 0 <= current-(board_size-1)*i &&  piece_type == squares[current-(board_size-1)*i]){
          ++winner_arr[4];
        }else{
          is_continuous_arr[4] = false;
        }
        // 右下
        if(is_continuous_arr[5] && 0 <= current+(board_size-1)*i &&  piece_type == squares[current+(board_size-1)*i]){
          ++winner_arr[5];
        }else{
          is_continuous_arr[5] = false;
        }
        // 左
        if(is_continuous_arr[6] && 0 <= current-1*i &&  piece_type == squares[current-1*i]){
          ++winner_arr[6];
        }else{
          is_continuous_arr[6] = false;
        }
        // 右
        if(is_continuous_arr[7] && 0 <= current+1*i &&  piece_type == squares[current+1*i]){
          ++winner_arr[7];
        }else{
          is_continuous_arr[7] = false;
        }
        if(4 == winner_arr[0]+winner_arr[1] || 4 == winner_arr[2]+winner_arr[3] || 4 == winner_arr[4]+winner_arr[5] || 4 == winner_arr[6]+winner_arr[7]){
          this.if_done = true;
          clearInterval(this.timerID);
          return piece_type == "○" ? '白子' : '黑子';
        }
      }
      return null;
    }

    render() {
      const winner = this.calculateWinner();
      this.winner = winner;

      console.log(winner);

      let status;
      if (winner) {
        status = "胜利者: " + winner;
      } else {
        status = "下一个下棋者: " + (this.state.xIsNext ? "黑子 ●" : "白子 ○");
      }
  
      return (
        <div className="game">
          <div className="game-board">
            <Board
              squares={this.state.squares}
              onClick={i => this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <div><button onClick={() => this.handleAgain()}>再来一局</button></div>
          </div>
        </div>
      );
    }
  }