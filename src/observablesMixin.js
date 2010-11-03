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
	 * Bind a callback to an event.  Note, if the object being bound from is AObject based, the preferred
	 * method to bind is to use bindTo, as bindTo will automatically unbind when either object is torn down.
	 * @method bindEvent
	 * @param {string} eventName name of event to register on
	 * @param {function} callback callback to call
	 * @param {object} context (optional) optional context to call the callback in.  If not given,
	 * 	use the 'this' object.
	 * @return {id} id that can be used to unbind the callback.
	 */
	bindEvent: function( eventName, callback, context ) {
		this.cid = this.cid || AFrame.getUniqueID();
		this.events = this.events || {};
		this.events[ eventName ] = this.events[ eventName ] || AFrame.Observable.getInstance();
		
		var eid = this.events[ eventName ].bind( callback.bind( context || this ) );

		this.eventIDs = this.eventIDs || {};
		this.eventIDs[ eid ] = this.events[ eventName ];
		
		return eid;
	},

	/**
	 * Unbind an event on this object
	 * @method unbindEvent
	 * @param {id} id returned by bindEvent
	 */
	unbindEvent: function( id ) {
		var observable = this.eventIDs[ id ];
		
		if( observable ) {
			AFrame.remove( this.eventIDs, id );
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
			this.bindTo( proxyFrom, eventName, function() {
				var args = Array.prototype.slice.call( arguments, 0 );
				args.splice( 0, 0, eventName );
				this.triggerEvent.apply( this, args );
			}.bind( this ) );
		}, this );
	},
	
	/**
	 * Bind a callback to an event on another object.  This is the preferred method to use when binding
	 * internally to another object as any items bound through this method will be unbound whenever this
	 * object is torn down.
	 * @method bindTo
	 * @param {AFrame.AObject} bindToObject object to bind to
	 * @param {string} eventName name of event to register on
	 * @param {function} callback callback to call
	 * @param {object} context (optional) optional context to call the callback in.  If not given,
	 * 	use the 'this' object.
	 * @return {id} id that can be used to unbind the callback.
	 */
	bindTo: function( bindToObject, eventName, callback, context ) {
		var id = bindToObject.bindEvent( eventName, callback, context );
		
		this.boundTo = this.boundTo || {};
		this.boundTo[ id ] = {
			object: bindToObject
		};
		
		return id;
	},

	/**
	 * Unbind a listener bound from this object to another object
	 * @method unbindTo
	 * @param {id} id of event to unbind
	 */
	unbindTo: function( id ) {
		var binding = this.boundTo[ id ];
		if( binding ) {
			binding.object.unbindEvent( id );
			AFrame.remove( this.boundTo, id );
		}
	},
	
	/**
	 * Unbind all events registered from this object on other objects.  Useful when tearing
	 * an object down
	 * @method unbindToAll
	 */
	unbindToAll: function() {
		for( var id in this.boundTo ) {
			var binding = this.boundTo[ id ];
			binding.object.unbindEvent( id );
			AFrame.remove( this.boundTo, id );
		}
		this.boundTo = null;
		this.boundTo = {};
	}
};