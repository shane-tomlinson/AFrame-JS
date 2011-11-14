
/**
 * The AFrame base namespace.  Provides some useful utility functions.  The most commonly used functions are [Class](#method_Class) and [create](#method_create).
 *
 *
 * @class AFrame
 * @static
*/
var AFrame = ( function() {
    "use strict";

    var AFrame = {
		/**
		* Checks whether the subClass is a sub-class of superClass, as is
		*  done using AFrame.extend or AFrame.Class.
		*
		*    var SubClass = AFrame.Class( AFrame.AObject );
		*
		*    // extendsFrom will be true;
		*    var extendsFrom = AFrame.extendsFrom( SubClass, AFrame.AObject );
		*
		* @method extendsFrom
		* @param {function} subClass - the potential subclass
		* @param {function} superClass - the potential superclass
		* @return {boolean} true if subClass is a subclass of superClass, false otw.
		*/
		extendsFrom: function( subClass, superClass ) {
			var same = false;
			if( AFrame.func( subClass ) ) {
				do {
					same = subClass === superClass;
					subClass = subClass.superclass;
				} while( subClass && !same );
			}

			return same;
		},

        /**
        * extend an object with the members of another object.
        *
        *    var objectToMixinTo = {
        *         name: 'AFrame'
        *    };
        *    AFrame.mixin( objectToMixinTo, '{ version: 1.0 } );
        *
        * @method mixin
        * @param {object} toExtend - object to extend
        * @param {object} mixin (optional) - object with optional functions to extend bc with
        */
        mixin: function( toExtend, mixin ) {
            for( var key in mixin ) {
                toExtend[ key ] = mixin[ key ];
            }
            return toExtend;
        },

        /**
        * @deprecated
        * This has been deprecated in favor of calling a Class' static create method
        *	instead.
        *
        * Instantiate an [AFrame.AObject](#AFrame.AObject.html) compatible object.
        * When using the create function, any Plugins are automatically created
        * and bound, and init is called on the created object.
        *
        *    // create an object with no config, no plugins
        *    var newObj = AFrame.create( AFrame.SomeObject );
        *
        *    // create an object with config, no plugins
        *    var newObj = AFrame.create( AFrame.SomeObject, {
        *       configItem1: configVal1
        *    } );
        *
        *    // create an object with a plugin, but no other config
        *    var newObj = AFrame.create( AFrame.SomeObject, {
        *       plugins: [ AFrame.SomePlugin ]
        *    } );
        *
        *    // create an object with a plugin, and other config
        *    var newObj = AFrame.create( AFrame.SomeObject, {
        *       plugins: [ AFrame.SomePlugin ],
        *       configItem1: configVal1
        *    } );
        *
        *    // create an object with a plugin that also has configuration
        *    var newObj = AFrame.create( AFrame.SomeObject, {
        *       plugins: [ [ AFrame.SomePlugin, {
        *           pluginConfigItem1: pluginConfigVal1
        *       } ] ]
        *    } );
        *
        * @method create
        * @param {function} constructor - constructor to create
        * @param {object} config (optional) - configuration.
        * @param {array} config.plugins (optional) - Any plugins to attach
        */
        create: function( construct, config ) {
        	return construct.create( config );
        },

        /**
         * Remove an item from an object freeing the reference to the item.
         *
         *     var obj = {
         *        name: 'AFrame'
         *     };
         *     AFrame.remove( obj, 'name' );
         *
         * @method remove
         * @param {object} object to remove item from.
         * @param {string} key of item to remove
         */
        remove: function( object, key ) {
          object[ key ] = null;
          delete object[ key ];
        },

        currentID: 0,

        /**
         * Get a unique ID
         *
         *     var uniqueID = AFrame.getUniqueID();
         *
         * @method getUniqueID
         * @return {id} a unique id
         */
        getUniqueID: function() {
            this.currentID++;
            return 'cid' + this.currentID;
        },

        /**
         * Check whether an item is defined
         *
         *     var isDefined = AFrame.func( valueToCheck );
         *
         * @method defined
         * @param {variant} itemToCheck
         * @return {boolean} true if item is defined, false otw.
         */
        defined: function( itemToCheck ) {
            return 'undefined' != typeof( itemToCheck );
        },

        /**
        * If the console is available, log a message.
        *
        *    AFrame.log( 'message to log' );
        *
        * @method log
        * @param {string} message - message to display
        */
        log: function( message ) {
            if( typeof( console ) !== 'undefined' ) {
                console.log( message );
            }
        },

        /**
        * Check whether an item is a function
         *
         *     var isFunc = AFrame.func( valueToCheck );
         *
        * @method func
        * @param {variant} itemToCheck
        * @return {boolean} true if item is a function, false otw.
        */
        func: function( itemToCheck ) {
            return 'function' == typeof( itemToCheck );
        },

        /**
        * Check whether an item is a string
        *
        *    var isString = AFrame.string( valueToCheck );
        *
        * @method string
        * @param {variant} itemToCheck
        * @return {boolean} true if item is a string, false otw.
        */
        string: function( itemToCheck ) {
            return '[object String]' === Object.prototype.toString.apply( itemToCheck );
        },

        /**
        * Check whether an item is an array
        *
        *    // returns true
        *    var isArray = AFrame.array( [] );
        *
        *    // returns true
        *    isArray = AFrame.array( new Array() );
        *
        *    // returns false
        *    isArray = AFrame.array( '' );
        *
        * @method array
        * @param {variant} itemToCheck
        * @return {boolean} true if item is an array, false otw.
        */
        array: function( itemToCheck ) {
            return '[object Array]' === Object.prototype.toString.apply( itemToCheck );
        }
    };


    if( typeof( module ) != 'undefined' ) {
        module.exports = AFrame;
    }

    return AFrame;

}() );
AFrame.Class = ( function() {
    "use strict";

    /**
    * A shortcut to create a new class with a default constructor.  A default
    *   constructor does nothing unless it has a superclass, where it calls the
    *   superclasses constructor.  If the first parameter to Class is a function,
    *   the parameter is assumed to be the superclass.  All other parameters
    *   should be objects which are mixed in to the new classes prototype.
    *
    * If a new class needs a non-standard constructor, the class constructor should
    *   be created manually and then any mixins/superclasses set up using the
    *   [AFrame.extend](#method_extend) function.
    *
    *     // Create a class that is not subclassed off of anything
    *     var Class = AFrame.Class( {
    *        anOperation: function() {
    *           // do an operation here
    *        }
    *     } );
    *
    *     // Create a Subclass of Class
    *     var SubClass = Class.extend( {
    *        anOperation: function() {
    *           // do an operation here
    *        }
    *     } );
    *
    * @method Class
    * @param {function} superclass (optional) - superclass to use.  If not given, class has
    *   no superclass.
    * @param {object}
    * @return {function} - the new class.
    */
    var Class = function() {
        var args = [].slice.call( arguments, 0 ),
        	F = createChain( args );

		addMixins( F, args );
		addCreate( F );
		addExtend( F );

        return F;
    };

    /**
    * Walk the class chain of an object.  The object must be an AFrame.Class/AFrame.extend based.
    *
    *    // Walk the object's class chain
    *    // SubClass is an AFrame.Class based class
    *    var obj = SubClass.create();
    *    AFrame.Class.walkChain( function( currClass ) {
    *        // do something.  Context of function is the obj
    *    }, obj );
    *
    * @method AFrame.Class.walkChain
    * @param {function} callback - callback to call.  Called with two parameters, currClass and
    *   obj.
    * @param {AFrame.Class} obj - object to walk.
    */
    Class.walkChain = function( callback, obj ) {
        var currClass = obj.constructor;
        do {
            callback.call( obj, currClass );
            currClass = currClass.superclass;
        } while( currClass );
    };

    function createChain( args ) {
    	var F;
        if( AFrame.func( args[ 0 ] ) ) {
	        // we have a superclass, do everything related to a superclass
        	F = chooseConstructor( args[ 1 ], function() {
				F.sc.constructor.call( this );
			} );
			extendWithSuper( F, args[ 0 ] );
            args.splice( 0, 1 );
        }
        else {
        	F = chooseConstructor( args[ 0 ], function() {} );
        }
        return F;
    }

	function chooseConstructor( checkForConst, alternate ) {
		var F;
		if( checkForConst && checkForConst.hasOwnProperty( 'constructor' ) ) {
			F = checkForConst.constructor;
		}
		else {
			F = alternate;
		}
		return F;
	}

	function extendWithSuper( subClass, superClass ) {
		var F = function() {};
		F.prototype = superClass.prototype;
		subClass.prototype = new F;
		subClass.superclass = superClass;        // superclass and sc are different.  sc points to the superclasses prototype, superclass points to the superclass itself.
		subClass.sc = superClass.prototype;

		var mixins = [].slice.call( arguments, 2 );
		for( var mixin, index = 0; mixin = mixins[ index ]; ++index ) {
			AFrame.mixin( subClass.prototype, mixin );
		}
		subClass.prototype.constructor = subClass;

		addCreate( subClass );
	}

	function addMixins( F, args ) {
        for( var mixin, index = 0; mixin = args[ index ]; ++index ) {
            AFrame.mixin( F.prototype, mixin );
        }

        // Always set the constructor last in case any mixins overwrote it.
        F.prototype.constructor = F;
    }

	/**
	* @private
	* Add a create function to a Class if the Class has an init function.
	*  The create function is an alias to call AFrame.create with this
	*  class.
	*
	* @method addCreate
	* @param {function} Class
	*/
	function addCreate( Class ) {
		if( Class.prototype && AFrame.func( Class.prototype.init ) && !Class.create ) {
			// Add a create function so that every class with init has one.
			Class.create = create.bind( null, Class );
		}
	}

	function addExtend( F ) {
		F.extend = Class.bind( null, F );
	}

	function create( construct, config ) {
		var retval;
		if( construct ) {
			try {
				retval = new construct;
			} catch ( e ) {
				AFrame.log( e.toString() );
			}

			AFrame.Class.walkChain( function( currClass ) {
				if( currClass.prototype && currClass.prototype.hasOwnProperty( 'plugins' ) ) {
					addPlugins( retval, currClass.prototype.plugins );
				}
			}, retval );

			config = config || {};
			addPlugins( retval, config.plugins || [] );

			retval.init( config );
		}
		else {
			throw 'Class does not exist.';
		}
		return retval;
	}

	function addPlugins( plugged, plugins ) {
		// recursively create and bind any plugins
		for( var index = 0, plugin; plugin = plugins[ index ]; ++index ) {
			plugin = AFrame.array( plugin ) ? plugin : [ plugin ];
			var pluginConfig = AFrame.mixin( { plugged: plugged }, plugin[ 1 ] || {} );
			plugin[ 0 ].create( pluginConfig );
		}
	}

    return Class;
}() );
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
        var me=this;
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
/**
 * The base object of nearly everything.  It is recommended to create all new classes as a subclass
 * of AObject since it provides general functionality such as event binding and teardown housekeeping.
 * All AObjects in the system have a cid, a cid is a unique identifier within the application.
 * If an AObject creates and is responsible for maintaining other AObjects, [addChild](#method_addChild)
 * should be called with the created children.  When this object is torn down, the child object added via addChild will
 * have its teardown function called as well.  This can ensure that all memory is freed and that
 * no references are kept when the object's lifespan has ended.
 *
 *
 * Declaring Configuration Items to Import
 *=========
 *
 * A very common pattern used in AFrame derived objects is to save off a list of
 *	configuration options that an object is created with.  Each class can define
 *	a list of configuration options that should automatically be imported on
 *  object creation.
 *
 * Example Auto-Import of Configuration Items
 *
 *    // Define a class with items to import
 *    var SomeClass = AFrame.Class( {
 *        importconfig: [ 'firstImportedParam', 'secondImportedParam' ]
 *    } );
 *
 *    var someClassInst = SomeClass.create( {
 *        firstImportedParam: "This is imported",
 *        secondImportedParam: "So is this",
 *        thirdParam: "But this is not"
 *    } );
 *
 * Event Usage
 *=========
 *
 * All AFrame.AObject based classes have a built in event mechanism.  Events are
 *  dynamically created, there is no need to explicitly create an event, all that is
 *  needed is to call the object's triggerEvent or bindEvent.
 *
 * Event Example Usage:
 *
 *    // Assume anObject is an AFrame.AObject based object.
 *    // Every AFrame.AObject based object triggers an onInit event
 *    // when its init function is called.
 *    var onObjectInit = function() {
 *       // called whenever anObject.init is called.
 *    };
 *
 *    anObject.bindEvent( 'onInit', onObjectInit );
 *    anObject.init();    // calls onObjectInit function
 *
 *
 * Declaring Event Bindings
 *========
 *
 * Binding to dependent object's events is another common pattern used in AFrame.
 *  To make this process simpler, it is possible to declare event bindings.  When
 *  declaring event bindings, three pieces of information are needed, the event name,
 *  the name of the object that is triggering the event, and the function (or name of
 *  the member function to bind as a handler.
 *
 * Example Usage:
 *
 *    // bind to two events on insertedObj, event1, and event2.
 *    // event1 has an inline handler.
 *    // event2 uses a class member as a handler.
 *    var Class = AFrame.AObject.extend( {
 *        importconfig: [ 'insertedObj' ],
 *        events: {
 *            'event1 insertedObj': function() {
 *                // Handle event here
 *            },
 *            'event2 insertedObj': 'event2Handler'
 *        },
 *        event2Handler: function() {
 *             // handle event here
 *        }
 *    } );
 *
 * @class AFrame.AObject
 * @uses AFrame.ObservablesMixin
 */
/**
 * cid for the object, if not given, a unique id is assigned
 * @config {cid} cid
 */
AFrame.AObject = (function(){
    "use strict";

    var AObject = AFrame.Class( {
        /**
         * Initialize the object.  Note that if a class' create static function is used to create an object, this will be called automatically.
         *
         *    var obj = new AFrame.SomeObject();
         *    obj.init( { name: 'value' } );
         *
         *
         * @method init
         * @param config {object} - configuration
         * @param config.cid {id} - cid to give to the object, if not given, one is generated.
         */
        init: function( config ) {
            var me=this;
            me.config = config;
            me.cid = config.cid || AFrame.getUniqueID();
            me.children = {};

            importConfig.call( me );
            me.bindEvents();

            /**
             * Triggered when the object is initialized
             * @event onInit
             * @param {AFrame.Event} event - the event object
             */
             me.triggerEvent( 'onInit' );
        },

        /**
         * Return the configuration object given in init.
         *
         *     var config = this.getConfig();
         *
         * @method getConfig
         * @return {object} the configuration object
         */
        getConfig: function() {
            return this.config;
        },

        /**
         * Override to do any event binding
         * @method bindEvents
         */
        bindEvents: function() {
            bindEvents.call( this );
        },

        /**
         * Tear the object down, free any references
         *
         *    this.teardown();
         *
         * @method teardown
         */
        teardown: function() {
            /**
             * triggered whenever tte object is torn down
             * @event onTeardown
             * @param {AFrame.Event} event - the event
             */
            var me=this;
            me.triggerEvent( 'onTeardown' );

            me.unbindAll();
            me.unbindToAll();
            me.teardownChildren();
            me.config = me.cid = me.children = null;
        },

        teardownChildren: function() {
            for( var cid in this.children ) {
                var child = this.children[ cid ];
                child.teardown();
                AFrame.remove( this.children, cid );
            }
        },

        /**
         * Get the CID of the object
         *
         *     var cid = this.getCID();
         *
         * @method getCID
         * @returns {cid}
         */
        getCID: function() {
            return this.cid;
        },

        /**
         * Add a child.  All children are torn down on this object's teardown
         *
         *     // childToBeTornDown is an AObject based item created by this AObject.
         *     // childToBeTornDown needs torn down whenever this object is torn down.
         *     this.addChild( childToBeTornDown );
         *
         * @method addChild
         * @param {AObject} child - child object
         */
        addChild: function( child ) {
            this.children[ child.getCID() ] = child;
        },

        /**
         * Remove a child.
         *
         *    // childToRemove is a child that this object has already
         *    // created and no longer needs.
         *    this.removeChild( childToRemove.getCID() );
         *
         * @method removeChild
         * @param {cid} cid - cid of item to remove
         */
        removeChild: function( cid ) {
            AFrame.remove( this.children, cid );
        },


        /**
        * Create a trigger event proxy function.  Useful to re-broadcast an event or when a DOM
        *   event should trigger a normal AObject based event.
        *
        *    // use triggerProxy to rebroadcast an event from a child
        *    child.bindEvent( 'eventToProxy', this.triggerProxy( 'eventToProxy' ) );
        *
        *
        * @method triggerProxy
        * @param {string} eventName - name of event to trigger
        */
        triggerProxy: function( eventName ) {
            return this.triggerEvent.bind( this, eventName );
        }
    }, AFrame.ObservablesMixin );

    function importConfig() {
        var me = this;
        AFrame.Class.walkChain( function( currClass ) {
        	if( currClass.prototype.hasOwnProperty( 'importconfig' ) ) {
				var classImports = currClass.prototype.importconfig;
				classImports.forEach( function( importName ) {
					if( AFrame.defined( me.config[ importName ] ) ) {
						me[ importName ] = me.config[ importName ];
					}
				} );
            }
        }, me );
    }

    function bindEvents() {
        var me = this,
            events,
            eventName,
            nameTarget;

        AFrame.Class.walkChain( function( currClass ) {
        	if( currClass.prototype.hasOwnProperty( 'events' ) ) {
				events = currClass.prototype.events;

				for( eventName in events ) {
					nameTarget = getNameAndTarget.call( me, eventName );
					bindHandlers.call( me, nameTarget.name, nameTarget.target, events[ eventName ] );
				}
            }
        }, me );

        function getNameAndTarget( eventName ) {
            var parts = eventName.split( ' ' ),
                target = me[ parts[ 1 ] ] || me;

            return {
                name: parts[ 0 ],
                target: target
            };
        }

        function bindHandlers( name, target, handlers ) {
            handlers = AFrame.array( handlers ) ? handlers : [ handlers ];

            handlers.forEach( function( handler ) {
                handler = AFrame.func( handler ) ? handler : me[ handler ];
                target.bindEvent( name, handler, me );
            } );
        }
    }


    return AObject;
}() );
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
 *    var button = AFrame.Display.create( {
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
 *         AFrame.DOM.setInner( this.getTarget(), '<div>This is rendered ' +
 *              'inside of the Dislay\'s target</div>' );
 *     },
 *
 *     // Example of using jTemplate to render a template
 *     render: function() {
 *         this.getTarget().setTemplate( $( '#template' ).html() )
 *             .processTemplate( {} );
 *     },
 *
 *
 * Declaring DOM Event Bindings
 *========
 *
 * Binding to a DOM event is a particularly common pattern in AFrame, so common
 *  that a shortcut way to declare these bindings is implemented.  DOM Events
 *  are declared in the "domevents" array on the Class' prototype.
 *
 * Example Usage:
 *
 *    // First is a simple click event with an inline handler.  The
 *	  // click event is attached to the Display's target node.
 *    var Display = AFrame.Display.extend( {
 *        domevents: {
 *            click: function( event ) {
 *                	// Handle event here
 *            }
 *        }
 *    } );
 *
 *    // Second, a mouseover event is attached to the Display's target.
 *    // The handler is a class function, whose name is given as the
 *    // event handler.  All strings are assumed to be class functions.
 *    var Display = AFrame.Display.extend( {
 *        domevents: {
 *            mouseover: 'onMouseOver'
 *        },
 *        onMouseOver: function( event ) {
 *            // Handle Event
 *        }
 *    } );
 *
 *    // Frequently, it is necessary to attach an event not to the target
 *	  // element of the object, but to one of its children.  This is possible
 *	  // by specifying a selector to attach to.
 *    var Display = AFrame.Display.extend( {
 *        domevents: {
 *            'click .selector': function( event ) {}
 *        }
 *    } );
 *
 *    // Since attaching multiple event handlers can help reduce
 *    // event handler complexity, multiple handlers are possible.
 *    // Instead of specifying one handler, specify an array of handlers.
 *    var Display = AFrame.Display.extend( {
 *        domevents: {
 *            click: [ function( event ) {
 *            // Handle Event
 *            }, 'onClick' ],
 *        },
 *        onClick: function( event ) {
 *            // Handle Event
 *        }
 *    } );
 *
 *    // All together now - Multiple events, using a combination
 *	  // of inline and class handlers
 *    var Display = AFrame.Display.extend( {
 *        domevents: {
 *            'click .selector': [ function( event ) {
 *                // Handle Event
 *            }, 'onClick' ],
 *            mouseover: 'onMouseOver',
 *        },
 *        onClick: function( event ) {
 *            // Handle Event
 *        },
 *        onMouseOver: function( event ) {
 *            // Handle Event
 *        }
 *    } );
 *
 * @class AFrame.Display
 * @extends AFrame.AObject
 * @constructor
 */
AFrame.Display = (function() {
    "use strict";

    var currDOMEventID = 0;

    var Display = AFrame.AObject.extend( {
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

        AFrame.Class.walkChain( function( currClass ) {
        	if( currClass.prototype.hasOwnProperty( 'domevents' ) ) {
				var domEvents = currClass.prototype.domevents;

				for( var eventName in domEvents ) {
					var nameTarget = getNameAndTarget.call( me, eventName );
					bindHandlers.call( me, nameTarget.name, nameTarget.target, domEvents[ eventName ] );
				}
            }
        }, me );

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
/**
* A DOM Manipulation adapter for jQuery.
* @class AFrame.DOM
* @static
*/
AFrame.DOM = ( function() {
    var jQuery = typeof( window ) !== 'undefined' && window.jQuery;
    var DOM = {
        /**
        * Get a set of elements that match the selector
        * @method getElements
        * @param {selector || element} selector - if a string, a selector to search for.
        * @return {array} array of elements
        */
        getElements: function( selector ) {
            return jQuery( selector );
        },
    
        /**
        * Get a set of descendent elements that match the selector
        * @method getDescendentElements
        * @param {string} selector - The selector to search for.
        * @param {element} root - root node to search from
        * @return {array} array of elements
        */
        getDescendentElements: function( selector, root ) {
            return jQuery( root ).find( selector );
        },
        
        /**
        * Bind to an elements DOM Event
        * @method bindEvent
        * @param {selector || element} element to bind on
        * @param {string} eventName - name of event
        * @param {function} callback - callback to call
        */
        bindEvent: function( element, eventName, callback ) {
            return jQuery( element ).bind( eventName, callback );
        },
        
        /**
        * Unbind an already bound DOM Event from an element.
        * @method unbindEvent
        * @param {selector || element} element to unbind from
        * @param {string} eventName - name of event
        * @param {function} callback - callback
        */
        unbindEvent: function( element, eventName, callback ) {
            return jQuery( element ).unbind( eventName, callback );
        }
        
        
    };
    
    return DOM;
    
}() );
