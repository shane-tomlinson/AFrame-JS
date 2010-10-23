/**
 * Gives objects the ability to have a basic event system.  This must be mixed in to other classes and objects.
 * @class AFrame.ObservablesMixin
 * @static
 */
AFrame.ObservablesMixin = {
	/**
	 * Trigger an event.
	 * @method triggerEvent
	 * @param {string} name event name to trigger
	 * @param {variant} (optional) all other arguments are passed to any registered callbacks
	 */
	triggerEvent: function() {
		var eventName = arguments[ 0 ];

		var event = this.events && this.events[ eventName ];
		if( event ) {
			var args = Array.prototype.slice.call( arguments, 1 );
			event.trigger.apply( event, args );
		}
	},
	
	/**
	 * Check to see if an event has been triggered
	 * @method isEventTriggered
	 * @param {string} eventName name of event to check.
	 * @return {boolean} true if event has been triggered, false otw.
	 */
	isEventTriggered: function( eventName ) {
		var retval = false;
		var observable = this.events && this.events[ eventName ];
		
		if( observable ) {
			retval = observable.isTriggered();
		}
		
		return retval;
	},
	
	/**
	 * Bind a callback to an event
	 * @method bindEvent
	 * @param {string} eventName name of event to register on
	 * @param {function} callback callback to call
	 * @param {object} context (optional) optional context to call the callback in.  If not given,
	 * 	use the 'this' object.
	 * @return {id} id that can be used to unbind the callback.
	 */
	bindEvent: function( eventName, callback, context ) {
		if( !this.events ) {
			this.events = {};
		}
		
		if( !this.events[ eventName ] ) {
			this.events[ eventName ] = AFrame.Observable.getInstance();
		}
		
		return this.events[ eventName ].bind( callback.bind( context || this ) );
	},
	
	/**
	 * Unbind an event
	 * @method unbindEvent
	 * @param {string} eventName name of event
	 * @param {id} id returned by bindEvent
	 */
	unbindEvent: function( eventName, id ) {
		var observable = this.events && this.events[ eventName ];
		
		if( observable ) {
			return observable.unbind( id );
		}
	},

	/**
	 * Proxy a list of events from another object as this object
	 * @method proxyEvents
	 * @param {object} proxyFrom object to proxy events from
	 * @param {array} eventList list of event names to proxy
	 */
	proxyEvents: function( proxyFrom, eventList ) {
		eventList.forEach( function( eventName, index ) {
			proxyFrom.bindEvent( eventName, function() {
				var args = Array.prototype.slice.call( arguments, 0 );
				args.splice( 0, 0, eventName );
				this.triggerEvent.apply( this, args );
			}.bind( this ) );
		}, this );
	}
};