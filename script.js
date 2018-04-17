
var canvas = document.getElementById("myCanvas");
var context = canvas.getContext("2d");
var isMouseDown = false;
var stroke = null;
var pen;
var socket = io();
var offSet = getOffset( document.getElementById('myCanvas') );

console.log(offSet);

socket.emit('playerJoined');

requestAnimationFrame(draw);

document.onmousemove = handleMouseMove;
document.onmousedown = handleMouseDown;
document.onmouseup = handleMouseUp;

var clientDrawer = {
    id: socket.io.engine.id,
    color: '#000000',
    size: 12,
    currentAction: 1
  }

var actions = {}

function handleMouseMove(event) {
        var dot, eventDoc, doc, body, pageX, pageY;
        event = event || window.event; // IE-ism

        if (event.pageX == null && event.clientX != null) {
            eventDoc = (event.target && event.target.ownerDocument) || document;
            doc = eventDoc.documentElement;
            body = eventDoc.body;

            event.pageX = event.clientX +
              (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
              (doc && doc.clientLeft || body && body.clientLeft || 0);
            event.pageY = event.clientY +
              (doc && doc.scrollTop  || body && body.scrollTop  || 0) -
              (doc && doc.clientTop  || body && body.clientTop  || 0 );
        }
				if(isMouseDown && clientDrawer.currentAction == 1){
					point = {
							x: event.pageX,
							y: event.pageY
					};
          socket.emit('updateClientLine', point);
				}
}
//actions will not work
function handleMouseDown(event){
	if(!isMouseDown){
    isMouseDown = true;
    if(clientDrawer.currentAction ==1){
      line = {
        type: 1,
        clientId: clientDrawer.id,
        mousePoints : [{x: event.pageX, y: event.pageY}],
        style: clientDrawer.color,
        size: clientDrawer.size
      }
      socket.emit('addClientLine', line);
    }
    // other actions
	}
}
function handleMouseUp(event){
	isMouseDown = false;
}


function draw(){
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.strokeStyle="#000000";
	context.lineWidth = 2;
	for(var i = actions.length - 2; i < actions.length; i++){
		context.beginPath();
    const currentAction = actions[i];
		for(var j = 0; j < actions[i].mousePoints.length; j++) {
      const currentPoint = currentAction.mousePoints[j];
      if (j === 0) {
        context.strokeStyle='#000000';
        context.moveTo(actions[i].mousePoints[j].x - offSet.x, actions[i].mousePoints[j].y - offSet.y);
      } else {
        context.strokeStyle='#ff0000';
        context.lineTo(actions[i].mousePoints[j].x - offSet.x, actions[i].mousePoints[j].y - offSet.y);
      }


      // context.moveTo(actions[i].mousePoints[j].x - offSet.x,actions[i].mousePoints[j].y - offSet.y);

		}
    context.stroke();
	}
	requestAnimationFrame(draw);
}


//Listening
socket.on('clientJoined', function(data) {
	clientDrawer.id = socket.io.engine.id
  console.log(clientDrawer.clientId);
  //mousePoints = data;
	console.log("got some mouse points");
});

socket.on('updateActions', function(data) {
  actions = data;
	console.log("got some mouse points");
});



//Util
function getOffset( el ) {
    var _x = 0;
    var _y = 0;
    while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
        _x += el.offsetLeft - el.scrollLeft;
        _y += el.offsetTop - el.scrollTop;
        el = el.offsetParent;
    }
    return { y: _y, x: _x };
}

function clearCanvas(){
	mousePoints = [];
	console.log("stuff")
	socket.emit('updateMousePoints', mousePoints);
}
