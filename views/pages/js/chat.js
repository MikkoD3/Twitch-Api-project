var socket = io();
    function setUsername() {
      socket.emit('setUsername', document.getElementById('name').value);
    };
    var user;
    socket.on('userExists', function(data){
      document.getElementById('error-container').innerHTML = data;
    });
    socket.on('userSet', function(data) {
      user = data.username;
      document.body.innerHTML = ' <nav class="navbar navbar-inverse" style="border-radius: 0px;"> \
        <div class="navbar-header"> \
              <a href="/"><p class="navbar-brand" href="#" style="color: #6441a5 !important">Random Twitch Stream</p></a> \
            </div> \
            <ul class="nav navbar-nav"> \
          </ul> \
          <ul class="nav navbar-nav navbar-right"> \
            <li><a role="button" href="/about">About</a></li> \
            <li><a role="button" href="/chatroom">Chatroom</a></li> \
            <li>&nbsp;</li> \
            <li>&nbsp;</li> \
            <li>&nbsp;</li> \
          </ul> \
      </nav>\
      <div id="chatcontrol" class="form-inline"><input class="form-control" type="text" id="message">\
      <button id="chatBtn" type="button" class="btn btn-primary" style="background-color: #6441a5 !important" name="button" onclick="sendMessage()">Send</button></div>\
      <div id="message-container" class="container"></div>';
    });
    function sendMessage(){
      var msg = document.getElementById('message').value;
      if(msg){
        socket.emit('msg', {message: msg, user:user});
      }
    }
    socket.on('newmsg', function(data){
      if(user){
        document.getElementById('message-container').innerHTML += '<b id="chatUser">' + data.user + '</b>: ' + data.message + '<br>'
      }
    })
