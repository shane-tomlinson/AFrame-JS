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
 *    var button = AFrame.construct( {
 *       type: AFrame.Display
 *       config: {
 *           target: buttonSelector
 *       }
 *    } );
 *   
 *    // When binding to a DOM event, must define the target, which 
 *    //    can be any jQuery element or selector. If a selector is given, 
 *    //    the target is looked for as a descendant of the display's 
 *    //    target.
 *    button.bindClick( $( buttonSelector ), function( event ) {
 *      // take care of the click, the event's default action is 
 *      //     already prevented.
 *    } );
 *   
 *    // Any DOM event can be bound to.
 *    button.bindDOMEvent( $( buttonSelector ), 'mouseenter', function( event ) {
 *       // Do a button highlight or some other such thing.
 *    } );
 *
 *
 *
 *## Using render to draw a display ##
 *
 * By default, the AFrame assumes that a display's DOM is already drawn.  If a display needs rendered,
 * this can be done so using the render method.  The below example is of a subclass
 * overriding the render method.  When using render, be sure to use the superclass's render method.
 *
 *     ...
 * 
 *     // Example of render which directly inserts HTML
 *     render: function() {
 *         this.getTarget().html( '<div>This is rendered inside of ' +
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

        this.render();
        
		this.domEvents = {};
		
		AFrame.Display.superclass.init.apply( this, arguments );
	},

	teardown: function() {
		for( var key in this.domEvents ) {
			this.unbindDOMEvent( key );
		}
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
    *         this.getTarget().html( '<div>This is rendered inside of ' +
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
        * @param {AFrame.Display} display - the display being rendered.
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
		return this.getTarget()[ 0 ];
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
			callback.call( context, event );
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