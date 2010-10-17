/**
* @module AFrame
*/

if( !Function.prototype.bind ) {
	Function.prototype.bind = function( context ) {
		var callback = this;
		return function() {
			return callback.apply( context, arguments );
		};
	};
}

if( !window.console ) {
	window.console = function() {	// do a whole lotta nothin 
	};
}
