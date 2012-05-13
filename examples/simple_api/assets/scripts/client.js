var SOCKET_SERVER = 'http://'+ location.hostname;
var SOCKET_PORT = 8080;

var sockets = {};
sockets.messages = io.connect( SOCKET_SERVER +'/messages', {
	port: SOCKET_PORT
});
sockets.room = io.connect( SOCKET_SERVER +'/room', {
	port: SOCKET_PORT
});

var Messages = Glenoid.Collection.extend({
	
	initialize: function(){
		
		this.setSocket( sockets.messages );
		
	}
	
})

var Room = Glenoid.Model.extend({
	
	initialize: function(){
		
		this.setSocket( sockets.room );
		
	}
	
});

var messages = new Messages;
var room = new Room;