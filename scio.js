var socket;

$(function () {
    // socket.io 서버에 접속한다
    socket = io.connect('http://13.59.234.130:5000');
    //socket = io.connect('http://localhost:3000');

    // 접속 버튼이 클릭되면
    $("form").submit(function (e) {
        e.preventDefault();
        var $msgForm = $("#msgForm");

        // 서버로 id 전송한다.
        socket.emit("login", {msg: $msgForm.val()});
        $msgForm.val("");
    });

    // 서버로부터 로그인 수신되면
    socket.on("login", function(data) {
    $("#idLogs").empty();
    for(var i=0; i<data.length; i++) {
        $("#idLogs").append("<div><strong>" + data[i].id + "</strong></div>");
    }
});

    // 서버로부터 결과 수신되면
    socket.on("Result", function (data) {
        // $("#idLogs").append("<div>" + data.msg + " : from <strong>" + data.from.name + "</strong></div>");
    });
});