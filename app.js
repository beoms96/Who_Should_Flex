var express = require('express');
var app = express();
var server = require('http').createServer(app);
// http server를 socket.io server로 upgrade한다
var io = require('socket.io')(server);

var userInfo = new Array();   //For User
var scoreInfo = new Array();    //For Score

app.use('/Who_Should_Flex', express.static(__dirname));

// 서버에 접속하면 클라이언트로 Who_Should_Flex.html을 전송한다
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/Who_Should_Flex.html');
});

// connection event handler
// connection이 수립되면 event handler function의 인자로 socket이 들어온다
io.on('connection', function (socket) {

    // 접속한 클라이언트의 정보가 수신되면
    socket.on('login', function (data) {
        console.log('Client logged-in:\n name: %s', data.msg);

        // socket에 클라이언트 정보를 저장한다
        socket.name = data.msg;
        //userInfo.push({id: data.msg, isReady: false, isMan: false});
        userInfo.push({id: data.msg});
        console.log(userInfo);

        // 접속된 모든 클라이언트에게 메시지를 전송한다
        io.emit('login', userInfo);
    });

    // 클라이언트로부터의 점수가 수신되면
    socket.on('score', function (data) {
        console.log('Score from %s: %s', socket.name, data.result);

        var msg = {
            id: socket.name,
            score: parseInt(data.result)
        };

        scoreInfo.push(msg);

        if(scoreInfo.length === userInfo.length) { //모든 참여자 게임 완료
            io.emit("scoreboard", scoreInfo);
            var wsf = new Array();
            var minScore = scoreInfo[0].score;
            for (var i = 0; i <scoreInfo.length; i++) {
                if(scoreInfo[i].score < minScore) {
                    wsf = new Array();
                    minScore = scoreInfo[i].score;
                    wsf.push({id: scoreInfo[i].id, score: scoreInfo[i].score})
                }
                else if(scoreInfo[i].score == minScore) {
                    wsf.push({id: scoreInfo[i].id, score: scoreInfo[i].score})
                }
            }
            console.log(wsf);
            if(wsf.length == 1) {
                io.emit("result", "Loser: " + wsf[0].id);
            }
            else {
                var rand = wsf[Math.floor(Math.random() * wsf.length)];
                io.emit("result", "Loser: " + rand.id);
            }
            userInfo = new Array();
            scoreInfo = new Array();
        }
    });

    // force client disconnect from server
    socket.on('forceDisconnect', function () {
        socket.disconnect();
    })

    socket.on('disconnect', function () {
        console.log('user disconnected: ' + socket.name);
        const idx = userInfo.findIndex(function(item) {return item.id == socket.name;});
        if (idx>-1) userInfo.splice(idx, 1);
        if (idx>-1) scoreInfo.splice(idx, 1);
        console.log(userInfo, scoreInfo);
    });
});

server.listen(5000, '0.0.0.0', function () {
    console.log('Socket IO server listening on port 5000');
});