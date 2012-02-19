/**
 * Gives objects the ability to have a basic event system.  This must be mixed in to other classes and objects.
 * @class AFrame.ObservablesMixin
 * @static
 */
AFrame.ObservablesMixin = (function() {
  "use strict";

  return {
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
        var me=this,
                eventData = arguments[ 0 ],
                isDataObj = !AFrame.string( eventData ),
                eventName = isDataObj ? eventData.type : eventData,
            observable = me.handlers && me.handlers[ eventName ];

        if( observable ) {
                eventData = isDataObj ? eventData : {
                    type: eventData
                };
                me.setEventData( eventData );
                var eventObject = me.getEventObject(),
              args = Array.prototype.slice.call( arguments, 1 );
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
            var me=this;
            if( me.eventData ) {
                AFrame.mixin( me.eventData, data );
            }
            else {
                me.eventData = data;
            }
        },

        /**
        * Get an event object.  Should not be called directly, but can be overridden in subclasses to add
        *   specialized fields to the event object.
        * @method getEventObject
        * @return {AFrame.Event}
        */
        getEventObject: function() {
            var me=this;
            if( !me.eventData.target ) {
                me.eventData.target = me;
            }

            var event = me.event || AFrame.Event.create( me.eventData );
            me.eventData = me.event = null;
            return event;
        },

      /**
       * Check to see if an event has been triggered
       * @method isEventTriggered
       * @param {string} eventName name of event to check.
       * @return {boolean} true if event has been triggered, false otw.
       */
      isEventTriggered: function( eventName ) {
        var me=this,
                retval = false,
            observable = me.handlers && me.handlers[ eventName ];

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
        var me=this,
            handlers = me.handlers = me.handlers || {},
            bindings = me.bindings = me.bindings || {},
            observable = handlers[ eventName ] || AFrame.Observable.create(),
            eid = observable.bind( callback.bind( context || me ) );

        handlers[ eventName ] = observable;

        bindings[ eid ] = {
          object: context,
          observable: observable
        };

        context && context.bindTo && context.bindTo( me, eid );

        return eid;
      },

      /**
       * Unbind an event on this object
       * @method unbindEvent
       * @param {id} id returned by bindEvent
       */
      unbindEvent: function( id ) {
            var bindings = this.bindings,
            binding = bindings && bindings[ id ],
                object = binding && binding.object;

        if( binding ) {
          AFrame.remove( bindings, id );
          object && object.unbindTo && object.unbindTo( id );

          return binding.observable.unbind( id );
        }
      },

      /**
       * Unbind all events on this object
       * @method unbindAll
       */
      unbindAll: function() {
            var me=this,
                key,
                id,
                handlers = me.handlers,
                bindings = me.bindings,
                binding;

        for( key in handlers ) {
          handlers[ key ].unbindAll();
          AFrame.remove( handlers, key );
        }

        for( id in bindings ) {
          binding = bindings[ id ];
          AFrame.remove( bindings, id );

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
            var me=this,
                args,
                event;
        eventList.forEach( function( eventName, index ) {
          proxyFrom.bindEvent( eventName, function() {
                    // get rid of the original event, a new one will be created.
            args = Array.prototype.slice.call( arguments, 1 );

                    // create a new event, used in getEventObject
                    me.event = event = arguments[ 0 ];
                    event.originalTarget = event.target;
                    event.target = me;

            args.splice( 0, 0, eventName );
            me.triggerEvent.apply( me, args );
          } );
        } );
      },

      /**
       * Create a binding between this object and another object.  This means this object
       * is listening to an event on another object.
       * @method bindTo
       * @param {AFrame.AObject} bindToObject object to bind to
       * @param {id} id of event this object is listening for on the bindToObject
       */
      bindTo: function( bindToObject, id ) {
            var me=this,
                boundTo = me.boundTo = me.BoundTo || {};

        boundTo[ id ] = boundTo[ id ] || {
          object: bindToObject
        };
      },

      /**
       * Unbind a listener bound from this object to another object
       * @method unbindTo
       * @param {id} id of event to unbind
       */
      unbindTo: function( id ) {
        var boundTo = this.boundTo,
                binding = boundTo[ id ];

        if( binding ) {
          binding.object.unbindEvent( id );
          AFrame.remove( boundTo, id );
        }
      },

      /**
       * Unbind all events registered from this object on other objects.  Useful when tearing
       * an object down
       * @method unbindToAll
       */
      unbindToAll: function() {
            var me=this,
                boundTo = me.boundTo,
                id;

        for( id in boundTo ) {
          boundTo[ id ].object.unbindEvent( id );
          AFrame.remove( boundTo, id );
        }
        me.boundTo = null;
        me.boundTo = {};
      }
    };

}());
