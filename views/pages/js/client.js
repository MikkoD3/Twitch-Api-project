//Function to get the live stream info in JSON then parse it to the index page

//Ajax Call for a list of live streams
function getStreams() {
  var url = "https://api.twitch.tv/kraken/streams/?client_id=rf2mynnpxm923mi7izaf9qc31uvmvd";
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", url, true);
  xmlhttp.send();

  xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
          console.log("ready")
      var data = JSON.parse(xmlhttp.responseText);
     console.log(data);

//Get Random stream from the live streams
 var randomArray = data.streams[Math.floor(Math.random()*data.streams.length)];
 console.log(randomArray); // Test with console
 //console.log(randomArray.channel.name); // Test with console
 var streamName = randomArray.channel.name;
 console.log(streamName);

var frame = "<iframe \
src='http://player.twitch.tv/?channel=" + streamName + "' \
height='720'  \
width='1280' \
frameborder='0' \
scrolling='no'  \
allowfullscreen='true'  \
autoplay='true'>  \
</iframe>";

document.getElementById('liveStream').innerHTML = frame;

   }
 }
}
