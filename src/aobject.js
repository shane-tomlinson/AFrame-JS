AFrame.AObject = function() {
	this.events = {};
	
}
AFrame.AObject.prototype = {
	constructor: AFrame.AObject,
	
	init: function( config ) {
		this.config = config;
		
		this.triggerEvent( 'onInit' );
	},
	
	triggerEvent: function() {
		var eventName = arguments[ 0 ];
		var args = Array.prototype.slice.call( arguments, 1 );
		
		var event = this.events[ eventName ];
		if( event ) {
			event.trigger.apply( event, args );
		}
		
	},
	
	bindEvent: function( eventName, callback, context ) {
		if( !this.events[ eventName ] ) {
			this.events[ eventName ] = new Observable();
		}
		
		this.events[ eventName ].bind( callback.bind( context ) );
	}
};