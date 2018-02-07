import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Link, Route, browserHistory, HashRouter} from 'react-router-dom';
import Home from './index.js';
import Game from './main.js';

// class Home extends React.Component {
//     render () {
//         return (
//             <h2>Home</h2>
//         );
//     }
// }

class About extends React.Component {
    render () {
        return (
            <h2>About</h2>
        );
    }
}

class Topics extends React.Component {
    render () {
        return (
            <h2>Topics</h2>
        );
    }
}

function App(){
    return (
        // <Home />
        <HashRouter history={browserHistory}>
            <div>
                <Route exact path="/" component={Home}/>
                <Route path="/about" component={About}/>
                <Route path="/game/:room" component={Game}/>
            </div>
        </HashRouter >
    );
}
    
ReactDOM.render(<App/>, document.getElementById('container'))