/**
 * An Observable is the way events are done.  Observables are very similar to DOM Events in that
 * each object has a set of events that it can trigger.  Objects that are concerned with a particular event register a callback to be
 * called whenever the event is triggered.  Observables allow for each event to have zero or many listeners, meaning the developer does not have
 * to manually keep track of who to notify when a particular event happens.  This completely decouples the triggering object from any
 * objects that care about it.
 *
 * @class AFrame.Observable
 */
AFrame.Observable = ( function() {
    "use strict";

    var Observable = AFrame.Class( {
        /**
         * Initialize the observable
         * @method init
         */
        init: function() {
            this.callbacks = {};
        },

        /**
         * Tear the observable down, free references
         * @method teardown
         */
        teardown: function() {
            this.unbindAll();
        },

        /**
         * Trigger the observable, calls any callbacks bound to the observable.
         * @method trigger
         * @param {variant} optional - any arguments will be passed to the callbacks
         */
        trigger: function() {
            var me=this,
                key;

            me.triggered = true;
            for( key in me.callbacks ) {
                me.callbacks[ key ].apply( me, arguments );
            }
        },

        /**
         * Bind a callback to the observable
         * @method bind
         * @param {function} callback - callback to register
         * @return {id} id that can be used to unbind the callback.  Note, all ids for all bindings are unique.
         */
        bind: function( callback ) {
            var id = AFrame.getUniqueID();

            this.callbacks[ id ] = callback;

            return id;
        },

        /**
         * Unbind an observable
         * @method unbind
         * @param {id} id - id of observable to unbind
         */
        unbind: function( id ) {
            AFrame.remove( this.callbacks, id );
        },

        /**
         * Unbind all observables
         * @method unbindAll
         */
        unbindAll: function() {
            var me=this,
                key;
            for( key in me.callbacks ) {
              AFrame.remove( me.callbacks, key );
            }
        },

        /**
         * Check whether the observable has been triggered
         * @method isTriggered
         * @return {boolean} true if observable has been triggered, false otw.
         */
        isTriggered: function() {
            return !!this.triggered;
        }
    } );

    return Observable;
}() );
