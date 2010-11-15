/**
 * A base class for a display.  Provides base target and DOM functionality.
 * 
 * @class AFrame.Display
 * @extends AFrame.AObject
 * @constructor
 */
AFrame.Display = function() {
	AFrame.Display.superclass.constructor.apply( this, arguments );
};
AFrame.Display.currDOMEventID = 0;
AFrame.extend( AFrame.Display, AFrame.AObject, {
	/**
	 * the target
	 * @config target
	 * @type {element || selector}
	 */
	init: function( config ) {
		this.target = $( config.target );
		
		if( !this.target.length ) {
			throw 'invalid target';
		}

		this.domEvents = {};
		
		AFrame.Display.superclass.init.apply( this, arguments );
	},

	teardown: function() {
		for( var key in this.domEvents ) {
			this.unbindDOMEvent( key );
		}
	},
	
	/**
	 * Get the display's target
	 * @method getTarget
	 * @return {element} target
	 */
	getTarget: function() {
		return this.target;
	},

	/**
	 * Bind to a DOM event
	 * @method bindDOMEvent
	 * @param {element || selector} target - the target.  If a string, searches the DOM
	 * @param {string} eventName - the name of the event to bind to
	 * @param {function} callback - the callback to callback
	 * @param {object} context (optional)- the context to call the callback in, if not given, use this.
	 * @return {id} id that can be used to unbind the event.
	 */
	bindDOMEvent: function( target, eventName, callback, context ) {
		var eventCallback = callback.bind( context || this );
		var eventTarget = this.getEventTarget( target );
		eventTarget.bind( eventName, eventCallback );

		AFrame.Display.currDOMEventID++;
		var id = AFrame.Display.currDOMEventID;
		this.domEvents[ id ] = {
			target: eventTarget,
			eventName: eventName,
			callback: eventCallback
		};
		
		return id;
	},

	/**
	 * Unbind a DOM event
	 * @method unbindDOMEvent
	 * @param {id} id - id of event to unbind
	 */
	unbindDOMEvent: function( id ) {
		var event = this.domEvents[ id ];
		if( event ) {
			event.target.unbind( event.eventName, event.callback );
			event.target = null;
			event.eventName = null;
			event.callback = null;
			AFrame.remove( this.domEvents, id );
		}
	},

	getEventTarget: function( target ) {
		var eventTarget;

		if( 'string' == typeof( target ) ) {
			eventTarget = $( target, this.getTarget() );
		}
		else {
			eventTarget = $( target );
		}
		
		return eventTarget;
	}
} );