/**
 * The base object of nearly everything.
 * @class AFrame.AObject
 */
AFrame.AObject = function() {
	this.events = {};
	
}
AFrame.AObject.prototype = {
	constructor: AFrame.AObject,
	/**
	 * Initialize the object
	 * @method init
	 * @param {object} config - configuration
	 */
	init: function( config ) {
	    this.config = config;
		
	    /**
	     * Triggered when the object is initialized
	     * @event onInit
	     */
	     this.triggerEvent( 'onInit' );
	},
	
	/**
	 * Tear the object down, free any references
	 * @method teardown
	 */
	teardown: function() {
	    /**
	     * triggered whenever hte object is torn down
	     * @method onTeardown
	     */
	    this.triggerEvent( 'onTeardown' );
	    
	    for( var key in this.events ) {
		this.events[ key ].unbindAll();
		AFrame.remove( this.events, key );
	    }
	},
	
	/**
	 * Trigger an event.
	 * @method triggerEvent
	 * @param {string} name - event name to trigger
	 * @param {variant} (optional) all other arguments are passed to any registered callbacks
	 */
	triggerEvent: function() {
		var eventName = arguments[ 0 ];
		var args = Array.prototype.slice.call( arguments, 1 );
		
		var event = this.events[ eventName ];
		if( event ) {
			event.trigger.apply( event, args );
		}
		
	},
	
	/**
	 * Bind a callback to an event
	 * @method bindEvent
	 * @param {string} eventName - name of event to register on
	 * @param {function} callback - callback to call
	 * @param {object} context (optional) - optional context to call the callback in.  If not given,
	 * 	use the 'this' object.
	 */
	bindEvent: function( eventName, callback, context ) {
		if( !this.events[ eventName ] ) {
			this.events[ eventName ] = new AFrame.Observable();
		}
		
		this.events[ eventName ].bind( callback.bind( context || this ) );
	}
};