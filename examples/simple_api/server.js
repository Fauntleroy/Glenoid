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

// fake ids for create
var id = 0;

io.of('/messages').on( 'connection', function( socket ){
	
	socket.on( 'create', function( data, callback ){
		
		console.log( 'create', arguments );
		
		if( typeof errors !== 'undefined' ){
			return callback( errors );
		}
		
		data.attributes.id = id;
		id++;
		callback( data );
		io.of('/messages').emit( 'create', data );
		
	});
	
	socket.on( 'read', function( data, callback ){
		
		console.log( 'read', arguments );
		
	});
	
	socket.on( 'update', function( data, callback ){
		
		console.log( 'update', arguments );
		
		callback( data );
		io.of('/messages').emit( 'update', data );
		
	});
	
	socket.on( 'delete', function( data, callback ){
		
		console.log( 'delete', arguments );
		
	});
	
});