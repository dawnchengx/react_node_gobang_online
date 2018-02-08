var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

 
var redis   = require('redis');
var client  = redis.createClient('6379', 'localhost');

// redis 链接错误
client.on("error", function(error) {
    console.log(error);
});

// client.auth("foobared");

//产生随机数函数
function RndNum(n){
    var rnd="";
    for(var i=0;i<n;i++)
        rnd+=Math.floor(Math.random()*10);
    return rnd;
}

//allow custom header and CORS
app.all('*',function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');

    if (req.method == 'OPTIONS') {
        res.send(200); /让options请求快速返回/
    }
    else {
        next();
    }
});

app.post('/room', function (req, resource) {
    var rand_code = RndNum(6);
    var key = 'room:'+rand_code;
    client.set(key, 1, function(error, res){
        if(error) {
            console.log(error);
        } else {
            client.expire(key, 600);
            resource.send(rand_code);
        }
    });
})

app.post('/game', function (req, resource) {
    var squares = req.body.squares;
    var in_redis = {
        x_is_next: req.body.x_is_next,
        squares: squares,
        if_done: req.body.if_done,
    }
    in_redis = JSON.stringify(in_redis);
    var key = 'room:'+ req.body.room;
    client.set(key, in_redis, function(error, res){
        if(error) {
            console.log(error);
        } else {
            client.expire(key, 600);
            resource.send({'status': 0});
        }
    });
})

app.get('/game', function (req, resource) {
    var key = 'room:'+ req.query.room;
    client.get(key, function(error, res){
        if(error) {
            console.log(error);
        } else {
            client.expire(key, 600);
            var res = JSON.parse(res);
            resource.send({
                'status': 0,
                'game' : res.squares,
                'x_is_next': res.x_is_next,
                if_done: res.if_done,
            });
        }
    });
})

var server = app.listen(8081, function () {
 
  var host = server.address().address
  var port = server.address().port
 
  console.log("应用实例，访问地址为 http://%s:%s", host, port)
 
})