Glenoid
=======

Simple Socket.io integration with Backbone.js.

Glenoid.js enables you to utilize Socket.io as a persistence method while still leaving normal HTTP sync methods intact. 

[Wondering what a "glenoid" is?](http://en.wikipedia.org/wiki/Glenoid)

## Usage

### Setting a Socket

Glenoid.js works by assigning sockets to models/collections instead of urls. If you're only going to use Glenoid with a single model/collection, all you need to do is set the socket:

```javascript
// Create your Socket.io connection
var my_socket = io.connect( 'http://localhost' );

// Instantiate your model
var my_model = new Glenoid.Model;

// Set the socket
my_model.setSocket( my_socket );
```

This gives your model an internal reference to the Socket.io connection and sets up some event listeners. You'll probably want to use Glenoid.js with multiple things, though. In order to do that, just utilize Socket.io namespaces:

```javascript
// Create your Socket.io connection with namespaces
var my_first_namespace = io.connect( 'http://localhost/first_namespace' );
var my_second_namespace = io.connect( 'http://localhost/second_namespace' );

// Instantiate your models
var my_first_model = new Glenoid.Model;
var my_second_model = new Glenoid.Model;

// Set the sockets
my_first_model.setSocket( my_first_namespace );
my_second_model.setSocket( my_second_namespace );
```

### Building a Socket.io Backend

Just like using Backbone.js normally, you'll need to construct an API to interact with. Glenoid.js requires a special kind of server-side set up which emulates the CRUD interface Backbone.js uses. Here's a very basic `create` endpoint:

```javascript
io.of( '/my_first_namespace' ).on( 'connection', function( socket ){
	
	socket.on( 'create', function( data, callback ){

		var response = {};

		// Do things with the sent data here
		response = data;
		response.id = 1;

		// Broadcast to everyone else listening
		socket.broadcast.emit( 'create', response );
		
		// Respond to the callback
		if( callback )
			callback( response );

	});

});
```

Endpoints for `read`, `update`, and `delete` are quite similar:

```javascript
socket.on( 'read', function( data, callback ){
	
	var response = {};
	var id = data.id;

	// Get your data
	response = stuff[id];
	
	// Respond to the callback
	// Note that you don't broadcast 'read'!
	if( callback )
		callback( response );
	
});
```
```javascript
socket.on( 'update', function( data, callback ){
	
	var response = {};
	var id = data.id;
	
	// Update something
	stuff[id] = data;

	// Broadcast to everyone else listening
	socket.broadcast.emit( 'update', response );
	
	// Respond to the callback
	if( callback )
		callback( response );
	
});
```
```javascript
socket.on( 'delete', function( data, callback ){

	var response = {};
	var id = data.id;
	
	// Delete something
	response = stuff[id];
	delete stuff[id];

	// Broadcast to everyone else listening
	socket.broadcast.emit( 'delete', response );
	
	// Respond to the callback
	if( callback )
		callback( response );
	
});
```

### Using Glenoid.js

Now that everything is in place, you can use a few simple methods to update models in real-time:

```javascript
// Use a convenience method
my_first_model.socketFetch();

// Or use the 'socket.io' option
my_first_model.fetch({
	method: 'socket.io'
});

// If you set a url for your model, you can still sync the old fashioned way
my_first_model.fetch();
```

For a complete list of the methods and properties Glenoid.js makes available, see below.

## Model

### setSocket( socket )

The `setSocket` method sets up the Socket.io listeners and methods necessary to use Glenoid.js. After `setSocket` has been called you can immediately start using it--anything executed before the connection is made will be queued and run once it connects.

### socket

The `socket` property stores a reference to the socket connection assigned with `setSocket`. Useful for sending or receiving custom events that don't quite fit into CRUD.

```javascript
my_model.socket.emit( 'custom', { special: 'data' } );
```

*Don't assign this manually!* Glenoid.js relies on the `setSocket` method for a variety of things.

### receiveSocketUpdate( data ), receiveSocketDelete( data )

Methods for receiving `update` and `delete` events. Generally you don't need to modify these, but they can be overwritten if the default functionality is not ideal.

### socketFetch( options )

A convenience method for using `fetch` with Glenoid.js. Literally a shortcut for:

```javascript
my_model.fetch({
	method: 'socket.io'
});
```

### socketSave( attributes, options | key, value, options )

A convenience method for using `save` with Glenoid.js. Literally a shortcut for:

```javascript
my_model.save( attributes, {
	method: 'socket.io'
});
```

### socketDestroy( options )

A convenience method for using `destroy` with Glenoid.js. Literally a shortcut for:

```javascript
my_model.destroy({
	method: 'socket.io'
});
```

## Collection

### setSocket( socket )

The `setSocket` method sets up the Socket.io listeners and methods necessary to use Glenoid.js.

### socket

A reference to the socket connection.

### receieveSocketCreate( data ), receieveSocketRead( data ), receieveSocketUpdate( data ), receieveSocketDelete( data )

Methods for receiving `create`, `read`, `update` and `delete` events. Generally you don't need to modify these, but they can be overwritten if the default functionality is not ideal.

### socketFetch( options )

A convenience method for using `fetch` with Glenoid.js. Literally a shortcut for:

```javascript
my_collection.fetch({
	method: 'socket.io'
});
```

### socketCreate( attributes, options )

A convenience method for using `create` with Glenoid.js. Literally a shortcut for:

```javascript
my_model.create( attributes, {
	method: 'socket.io'
});
```

## TODO

- TESTS.
- Error callbacks

## License

Glenoid.js uses the MIT license:

--

Copyright (c) 2012 Timothy Kempf

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.