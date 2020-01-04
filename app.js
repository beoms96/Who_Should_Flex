var app = require('express')();
var server = require('http').createServer(app);
// http server를 socket.io server로 upgrade한다
var io = require('socket.io')(server);

var userInfo = new Array();   //For User
var scoreInfo = new Array();    //For Score

// localhost:5000으로 서버에 접속하면 클라이언트로 index.html을 전송한다
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/scio.js');
    res.sendFile(__dirname + '/wsf.js');
    res.sendFile(__dirname + '/Who_Should_Flex.html');
});

// connection event handler
// connection이 수립되면 event handler function의 인자로 socket인 들어온다
io.on('connection', function (socket) {

    // 접속한 클라이언트의 정보가 수신되면
    socket.on('login', function (data) {
        console.log('Client logged-in:\n name: %s', data.msg);

        // socket에 클라이언트 정보를 저장한다
        socket.name = data.msg;
        userInfo.push({id: data.msg, isReady: false});

        // 접속된 모든 클라이언트에게 메시지를 전송한다
        io.emit('login', userInfo);
    });

    // 클라이언트로부터의 메시지가 수신되면
    socket.on('score', function (data) {
        console.log('Score from %s: %s', socket.name, data.result);

        var msg = {
            name: socket.name,
            score: data.result
        };

        scoreInfo.push(msg);

        // 메시지를 전송한 클라이언트를 제외한 모든 클라이언트에게 메시지를 전송한다
        // socket.broadcast.emit('chat', msg);

        // 메시지를 전송한 클라이언트에게만 메시지를 전송한다
        // socket.emit('s2c chat', msg);

        // 접속된 모든 클라이언트에게 메시지를 전송한다
        //io.emit('idList', idList);

        // 특정 클라이언트에게만 메시지를 전송한다
        // io.to(id).emit('s2c chat', data);

        if(scoreInfo.length === userInfo.length) { //모든 참여자 게임 완료
            console.log(scoreInfo);
        }
    });

    // force client disconnect from server
    socket.on('forceDisconnect', function () {
        socket.disconnect();
    })

    socket.on('disconnect', function () {
        console.log('user disconnected: ' + socket.name);
    });
});

/*server.listen(5000, '127.0.0.1', function () {
    console.log('Socket IO server listening on port 5000');
});*/

server.listen(5000, '0.0.0.0', function () {
    console.log('Socket IO server listening on port 5000');
});