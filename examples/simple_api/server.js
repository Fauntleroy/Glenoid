//
//// Express
//// Enables a variety of http server functions
//// http://expressjs.com
//

Express = require('express');

router = Express.createServer();
router.listen( 8080 );
router.configure( function(){
	router.use( Express.static( __dirname +'/assets') );
});

router.get( '/', function( req, res ){
	
	res.send(
		'<html>'+
			'<head>'+
			'	<script src="/scripts/vendor/underscore.js"></script>'+
			'	<script src="/scripts/vendor/jquery.js"></script>'+
			'	<script src="/scripts/vendor/backbone.js"></script>'+
			'	<script src="/scripts/vendor/glenoid.js"></script>'+
			'	<script src="/socket.io/socket.io.js"></script>'+
			'	<script src="/scripts/client.js"></script>'+
			'</head>'+
			'<body></body>'+
		'</html>'
	);
	
});



//
//// Socket.io
//// Provides cross-browser websockets
//// http://www.socket.io
//

io = require('socket.io').listen( router );

io.configure( function(){
	
	io.enable('browser client minification');
	io.enable('browser client etag');
	io.enable('browser client gzip');
	io.set( 'log level', 1 );
	io.set( 'transports', [
		'websocket',
		'htmlfile',
		'xhr-polling',
		'jsonp-polling'
	]);
	
});

var ROOM = 'test';

// Simple messages collection
var ids = 0;
var messages = {};

io.of( '/messages' ).on( 'connection', function( socket ){
	
	socket.join( ROOM );
	
	socket.on( 'create', function( data, callback ){
		
		console.log( 'create', arguments );
		
		var errors = [];
		var message = data.attributes;
		message.id = ids;
		messages[ids] = message;
		ids++;
		
		if( errors.length > 0 )
			return callback( errors );
		
		callback( data );
		io.of('/messages').in( ROOM ).emit( 'create', data );
		
	});
	
	socket.on( 'read', function( data, callback ){
		
		console.log( 'read', messages );
		
		var errors = [];
		var id = data.id;
		if( id ){
			var message = messages[id];
			data.attributes = message;
		}
		else {
			var messages_array = [];
			for( i in messages )
				messages_array.push( messages[i] );
			data.attributes = messages_array;
		}
		
		if( errors.length > 0 )
			return callback( errors );
		
		callback( data );
		
	});
	
	socket.on( 'update', function( data, callback ){
		
		console.log( 'update', arguments );
		
		var errors = [];
		var id = data.id;
		var message = messages[id];
		message = data.attributes;
		
		callback( data );
		io.of('/messages').in( ROOM ).emit( 'update', data );
		
	});
	
	socket.on( 'delete', function( data, callback ){
		
		console.log( 'delete', arguments );
		
		var errors = [];
		var id = data.id;
		delete messages[id];
		
		callback( data );
		io.of('/messages').in( ROOM ).emit( 'delete', data );
		
	});
	
});

var room = {
	title: 'test room',
	subtitle: 'test subtitle'
};

io.of( '/room' ).on( 'connection', function( socket ){
	
	socket.join( ROOM );
	
	socket.on( 'read', function( data, callback ){
		
		data.attributes = room;
		
		callback( data );
		
	});
	
	socket.on( 'update', function( data, callback ){
		
		room = data.attributes;
		
		callback( data );
		io.of( '/messages' ).in( ROOM ).emit( 'update', data );
		
	});
	
});