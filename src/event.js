/**
* A basic event, very loosly modeled after [W3C DOM Level 2 Events](http://www.w3.org/TR/DOM-Level-2-Events/events.html)
* @class AFrame.Event
* @constructor
*/
/**
* The event type
* @config type
* @type {string}
*/
/**
* When the event was created.
* @property timestamp
* @type {Date}
*/
/**
* Type of event.
* @property type
* @type {string}
*/
/**
* event target, not always set
* @property target
* @type {object}
*/
/**
* original event target, before any proxying, not always set
* @property originalTarget
* @type {object}
*/
AFrame.Event = (function() {
    "use strict";

    var Event = AFrame.Class( {
        /**
        * initialize the event.  All items in configuration will be added to event.  If timestamp
        *   is specified, it will be ignored.  type must be specified.
        * @param {object} config
        * @param {string} config.type - type of event
        */
        init: function( config ) {
            for( var key in config ) {
                this[ key ] = config[ key ];
            }

            if( !this.type ) {
                throw 'Event type undefined';
            }

            if( this.target ) {
                this.setOriginalTarget = true;
            }

            this.timestamp = new Date();
        },

        /**
        * Check if preventDefault has been called.
        *
        *     // Check if preventDefault has been called
        *     var isPrevented = event.isDefaultPrevented();
        *
        * @method isDefaultPrevented
        * @return {booelan} true if preventDefault has been called, false otw.
        */
        isDefaultPrevented: function() {
            return !!this.defaultPrevented;
        },

        /**
        * Cancel the default action of the event.  Note, this does nothing on its own,
        *   any object that passes an Event object must check isDefaultPrevented to see
        *   whether an action should be cancelled.
        *
        *    // Prevent the default action
        *    event.preventDefault();
        *
        * @method preventDefault
        */
        preventDefault: function() {
            this.defaultPrevented = true;
        },

        /**
        * Proxy an event.  If this is the first time the event is proxied, causes
        *   originalTarget to be set to the original target, and updates target to
        *   point to the proxy.
        *
        *    event.proxyEvent( proxy );
        *
        * @method proxyEvent
        * @param {object} proxy - object proxying event
        */
        proxyEvent: function( proxy ) {
            if( this.setOriginalTarget ) {
                this.originalTarget = this.target;
                this.setOriginalTarget = false;
            }

            this.target = proxy;
        }
    } );

    /**
    * A factory method to create an event.
    *
    *    // returns an event with event.type == 'eventType'
    *    var event = AFrame.Event.create( 'eventType' );
    *
    *    // returns an event with event.type == 'eventType', extraField == 'extraValue'
    *    var event = AFrame.Event.create( {
    *        type: 'eventType',
    *        extraField: 'extraValue'
    *    } );
    *
    * @method AFrame.Event.create
    * @param {object||string} config - if an object, object is used as Event config,
    *   if a string, the string signifies the type of event
    * @return {AFrame.Event} event with type
    */
    var origCreate = Event.create;

    Event.create = function( config ) {
        if( AFrame.string( config ) ) {
            config = { type: config };
        }
        return origCreate( config );
    };

    return Event;
})();
