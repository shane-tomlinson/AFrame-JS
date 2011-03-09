/**
 * A base class for a display.  Provides base target and DOM functionality.  A Display is completely
 *  generic, but can be used as the View in the Model-View-Controller paradigm.  See [Field](AFrame.Field.html) for
 *  Views that are tied to specific pieces of data.
 *
 *    <button id="submitForm">Submit</button>
 *    
 *    ---------
 * 
 *    var buttonSelector = '#submitForm';
 *   
 *    // buttonSelector is a selector used to specify the root node of 
 *    //    the target.
 *    var button = AFrame.create( AFrame.Display, {
 *        target: buttonSelector
 *    } );
 *   
 *    // When binding to a DOM event, must define the target, which 
 *    //    can be any element or selector. If a selector is given, 
 *    //    the target is looked for as a descendant of the display's 
 *    //    target.
 *    button.bindClick( buttonSelector, function( event ) {
 *      // take care of the click, the event's default action is 
 *      //     already prevented.
 *    } );
 *   
 *    // Any DOM event can be bound to.
 *    button.bindDOMEvent( buttonSelector, 'mouseenter', function( event ) {
 *       // Do a button highlight or some other such thing.
 *    } );
 *
 *
 *
 *## Using render to draw a display ##
 *
 * By default, the AFrame assumes that a display's DOM is already drawn.  If a display needs rendered,
 * this can be done so using the render method.  The below example is of a subclass
 * overriding the render method.  When using render, be sure to use the sc's render method.
 *
 *     ...
 *     // Using the jQuery DOM adapter.
 *     
 *     // Example of render which directly inserts HTML
 *     render: function() {
 *         AFrame.DOM.setInner( this.getTarget(), '<div>This is rendered inside of ' +
 *              'the Dislay\'s target</div>' );
 *     },
 *
 *     // Example of using jTemplate to render a template
 *     render: function() {
 *         this.getTarget().setTemplate( $( '#template' ).html() ).processTemplate( {} );
 *     },
 * 
 * 
 * @class AFrame.Display
 * @extends AFrame.AObject
 * @constructor
 */
AFrame.Display = (function() {
    "use strict";
    
    var currDOMEventID = 0;

    var Display = AFrame.Class( AFrame.AObject, {
        /**
         * the target
         * @config target
         * @type {element || selector}
         */
        init: function( config ) {
            this.target = AFrame.DOM.getElements( config.target );
            
            if( !this.target.length ) {
                throw 'invalid target';
            }

            this.render();
            
            this.domEventHandlers = {};
            
            Display.sc.init.call( this, config );
            
            bindDOMEvents.call( this );
        },

        teardown: function() {
            for( var key in this.domEventHandlers ) {
                this.unbindDOMEvent( key );
            }

            this.target = null;
            
            Display.sc.teardown.call( this );
        },
        
        
        /**
        * Render the HTML element, by default, only triggers the onRender observable.  Should be overridden in 
        *   subclasses to do any templating, setting up the DOM, etc.  Subclasses do not need to do anything
        *   if the full DOM for this display has already been created.  AFrame does not care what templating system
        *   that is used, so any way of setting the target's HTML is fine.
        *
        *
        *     ...
        * 
        *     // Example of render which directly inserts HTML
        *     render: function() {
        *         AFrame.DOM.setInner( this.getTarget(), '<div>This is rendered inside of ' +
        *              'the Dislay\'s target</div>' );
        *     },
        *
        *     // Example of using jTemplate to render a template
        *     render: function() {
        *         this.getTarget().setTemplate( $( '#template' ).html() ).processTemplate( {} );
        *     },
        * 
        *
        * @method render
        */
        render: function() {
            /**
            * Triggered whenever the displayed is rendered.
            * @event onRender
            * @param {Display} display - the display being rendered.
            */
            this.triggerEvent( 'onRender', this );
        },
        
        /**
         * Get the display's target.
         *
         *    var target = display.getTarget();
         *
         * @method getTarget
         * @return {element} target
         */
        getTarget: function() {
            return this.target;
        },
        
        /**
        * Get the display's native DOM Element.
        * 
        *    var element = display.getDOMElement();
        *
        * @method getDOMElement
        * @return {HTMLElement} - the DOM Element
        */
        getDOMElement: function() {
            return this.target[ 0 ];
        },

        /**
         * Bind to a DOM event
         *
         *    var onClose = function( event ) {
         *      // close something here
         *    };
         *    var id = display.bindDOMEvent( '.btnClose', 'click', onClose );
         *    // use id to unbind DOM event
         *
         * @method bindDOMEvent
         * @param {element || selector} target - the target.  If a string, searches the DOM
         * @param {string} eventName - the name of the event to bind to
         * @param {function} callback - the callback to callback
         * @param {object} context (optional)- the context to call the callback in, if not given, use this.
         * @return {id} id that can be used to unbind the event.
         */
        bindDOMEvent: function( target, eventName, callback, context ) {
            var eventCallback = callback.bind( context || this );
            var eventTarget = getEventTarget.call( this, target );
            AFrame.DOM.bindEvent( eventTarget, eventName, eventCallback );

            currDOMEventID++;
            var id = currDOMEventID;
            this.domEventHandlers[ id ] = {
                target: eventTarget,
                eventName: eventName,
                callback: eventCallback
            };
            
            return id;
        },
        
        /**
        * a convenience function for binding click events.  The event has it's default prevented so that
        *	if binding to an anchor with an href of "#", the screen does not jump.
        *
        *    var onClose = function( event ) {
        *      // event's default is already prevented
        *      // close something here
        *    };
        *    var id = display.bindClick( '.btnClose', onClose );
        *    // use id to unbind DOM event
        *
        * @method bindClick
        * @param {element || selector} target - the target.  If a string, searches the DOM
        * @param {function} callback - the callback to callback
        * @param {object} context (optional)- the context to call the callback in, if not given, use this.
        * @return {id} id that can be used to unbind the event.
        */
        bindClick: function( target, callback, context ) {
            return this.bindDOMEvent( target, 'click', function( event ) {
                event.preventDefault();
                callback.call( this, event );
            }, context );
        },
        
        /**
         * Unbind a DOM event
         *
         *    var id = display.bindDOMEvent( ... );
         *    display.unbindDOMEvent( id );
         *
         * @method unbindDOMEvent
         * @param {id} id - id of event to unbind
         */
        unbindDOMEvent: function( id ) {
            var event = this.domEventHandlers[ id ];
            if( event ) {
                AFrame.DOM.unbindEvent( event.target, event.eventName, event.callback );
                event.target = null;
                event.eventName = null;
                event.callback = null;
                AFrame.remove( this.domEventHandlers, id );
            }
        }
    } );
    
    function getEventTarget( target ) {
        var eventTarget;

        if( 'string' == typeof( target ) ) {
            eventTarget = AFrame.DOM.getDescendentElements( target, this.getTarget() );
        }
        else {
            eventTarget = AFrame.DOM.getElements( target );
        }
        
        return eventTarget;
    }
    
    function bindDOMEvents() {
        var me = this, target = me.getTarget();
        
        AFrame.Class.walkChain( me, function( currClass ) {
            var domEvents = currClass.prototype.domevents || {};
            
            for( var eventName in domEvents ) {
                var nameTarget = getNameAndTarget.call( me, eventName );
                bindHandlers.call( me, nameTarget.name, nameTarget.target, domEvents[ eventName ] );
            }
        } );
        
        function getNameAndTarget( eventName ) {
            var parts = eventName.split( ' ' );
            var target = parts.length == 1 ? me.getTarget() : parts.slice( 1 ).join( ' ' );
            
            return {
                name: parts[ 0 ],
                target: target
            };
        }
        
        function bindHandlers( name, target, handlers ) {
            handlers = AFrame.array( handlers ) ? handlers : [ handlers ];
            
            handlers.forEach( function( handler ) {
                handler = AFrame.func( handler ) ? handler : me[ handler ];
                me.bindDOMEvent( target, name, handler );
            } );
        }
    }
    
    return Display;
} )();
