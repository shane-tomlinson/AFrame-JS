/**
 * Gives objects the ability to have a basic event system.  This must be mixed in to other classes and objects.
 * @class AFrame.ObservablesMixin
 * @static
 */
AFrame.ObservablesMixin = {
	/**
	 * Trigger an event.
     *
     *    // trigger an event using event name only.  Event object returned.
     *    var event = object.triggerEvent( 'eventName' );
     *    
     *    // trigger an event using event name and some extra parameters
     *    object.triggerEvent( 'eventName', 'extraParameterValue' );
     *
     *    // Equivalent to first example
     *    object.triggerEvent( {
     *        type: 'eventName'
     *    } );
     *
     *    // Equivalent to second example
     *    object.triggerEvent( {
     *        type: 'eventName'
     *    }, 'extraParameterValue' );
     *
     *    // Add extra fields to the event
     *    object.triggerEvent( {
     *        type: 'eventName',
     *        extraField: 'extraValue'
     *    } );
     *    // event in listeners will be augmented with an extraField field whose value is extraValue
     *
	 * @method triggerEvent
	 * @param {string || object} type - event type to trigger or object that serves the same purpose as the data object in setEventData
	 * @param {variant} (optional) all other arguments are passed to any registered callbacks
	 * @return {AFrame.Event} - event object that is passed to event listeners, only returned if there
     *  are any listeners
	 */
	triggerEvent: function() {
		var eventData = arguments[ 0 ];
        var isDataObj = !AFrame.string( eventData );
        var eventName = isDataObj ? eventData.type : eventData;
        
		var observable = this.events && this.events[ eventName ];
		if( observable ) {
            eventData = isDataObj ? eventData : {
                type: eventData
            };
            this.setEventData( eventData );
            var eventObject = this.getEventObject();
            
			var args = Array.prototype.slice.call( arguments, 1 );
            args.splice( 0, 0, eventObject );
			observable.trigger.apply( observable, args );
            
            return eventObject;
		}
	},
    
    /**
    * Set data to be added on to the next event triggered.
    *
    *    object.setEventData( {
    *        addedField: 'addedValue'
    *    } );
    *    // can be called multiple times, new data with same key as old data
    *    // overwrites old data.
    *    object.setEventData( {
    *        secondField: 'secondValue'
    *    } );
    *    // the next event that is triggered will have it's event parameter augmented with addedField and secondField.
    *
    * @method setEventData
    * @param {object} data - data to be added to the next event triggered
    */
    setEventData: function( data ) {
        if( !this.eventData ) {
            this.eventData = data;
        }
        else {
            for( var key in data ) {
                // do this loop manually, jQuery.extend does not copy undefined values
                this.eventData[ key ] = data[ key ];
            }
        }
    },
    
    /**
    * Get an event object.  Should not be called directly, but can be overridden in subclasses to add
    *   specialized fields to the event object.
    * @method getEventObject
    * @return {AFrame.Event}
    */
    getEventObject: function() {
        if( !this.eventData.target ) {
            this.eventData.target = this;
        }
        
        var event = this.event || AFrame.Event.createEvent( this.eventData );
        this.eventData = null;
    
        this.event = null;
        return event;
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
	 * Bind a callback to an event.  When an event is triggered and the callback is called,
     *  the first argument to the callback will be an [AFrame.Event](AFrame.Event.html) object.
     *  The subsequent arguments will be those passed to the triggerEvent function.
     *
     *     // Bind a callback to an event
     *     obj.bindEvent( 'eventname', function( event, arg1 ) {
     *         // event is an AFrame.Event, arg1 is the first argument passed 
     *         // (when triggered below, will be 'arg1Value')
     *     } );
     *
     *     // trigger the event
     *     obj.triggerEvent( 'eventname', 'arg1Value' );
     *
	 * @method bindEvent
	 * @param {string} eventName name of event to register on
	 * @param {function} callback callback to call
	 * @param {object} context (optional) optional context to call the callback in.  If not given,
	 * 	use the 'this' object.
	 * @return {id} id that can be used to unbind the callback.
	 */
	bindEvent: function( eventName, callback, context ) {
		this.events = this.events || {};
		
		var observable = this.events[ eventName ] || AFrame.Observable.getInstance();
		this.events[ eventName ] = observable;
		
		var eid = observable.bind( callback.bind( context || this ) );

		this.bindings = this.bindings || {};
		this.bindings[ eid ] = {
			object: context,
			observable: observable
		};

		if( context && context.bindTo ) {
			context.bindTo( this, eid );
		}
		
		return eid;
	},

	/**
	 * Unbind an event on this object
	 * @method unbindEvent
	 * @param {id} id returned by bindEvent
	 */
	unbindEvent: function( id ) {
		var binding = this.bindings && this.bindings[ id ];
		
		if( binding ) {
			AFrame.remove( this.bindings, id );

			if( binding.object && binding.object.unbindTo ) {
				binding.object.unbindTo( id );
			}
			
			return binding.observable.unbind( id );
		}
	},

	/**
	 * Unbind all events on this object
	 * @method unbindAll
	 */
	unbindAll: function() {
		for( var key in this.events ) {
			this.events[ key ].unbindAll();
			AFrame.remove( this.events, key );
		}

		for( var id in this.bindings ) {
			var binding = this.bindings[ id ];
			AFrame.remove( this.bindings, id );
			
			if( binding.object && binding.object.unbindTo ) {
				binding.object.unbindTo( id );
			}
			// no need to call the observable's unbind, it has already been torn down in unbindAll above
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
                // get rid of the original event, a new one will be created.
				var args = Array.prototype.slice.call( arguments, 1 );
                
                // create a new event, used in getEventObject
                this.event = arguments[ 0 ];
                this.event.originalTarget = this.event.target;
                this.event.target = this;
                
				args.splice( 0, 0, eventName );
				this.triggerEvent.apply( this, args );
			}.bind( this ), this );
		}, this );
	},
	
	/**
	 * Create a binding between this object and another object.  This means this object
	 * is listening to an event on another object.
	 * @method bindTo
	 * @param {AFrame.AObject} bindToObject object to bind to
	 * @param {id} id of event this object is listening for on the bindToObject
	 */
	bindTo: function( bindToObject, id ) {
		this.boundTo = this.boundTo || {};
		this.boundTo[ id ] = this.boundTo[ id ] || {
			object: bindToObject
		};
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