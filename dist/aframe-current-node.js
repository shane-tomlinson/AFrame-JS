/**
* Note, this class does not really exist!  It is a placeholder for extensions to system prototypes like Function, Array, Date.  
* @class SystemExtensions
*/

/**
 * The main AFrame module.  All AFrame related items are under this.
 * @module AFrame
*/

/**
* bind a function to a context - taken from https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Function/bind
* @methopd Function.prototype.bind
*/
if ( !Function.prototype.bind ) {

  Function.prototype.bind = function( obj ) {
    var slice = [].slice,
        args = slice.call(arguments, 1), 
        self = this, 
        nop = function () {}, 
        bound = function () {
          return self.apply( this instanceof nop ? this : ( obj || {} ), 
                              args.concat( slice.call(arguments) ) );    
        };

    nop.prototype = self.prototype;

    bound.prototype = new nop();

    return bound;
  };
}
  
/**
* Run a function over each element in the array.  Comes from http://userscripts.org/topics/2304?page=1#posts-9660
* @method Array.prototype.forEach
* @param {function} callback - callback to call on each member of the array.  Function will be called with three parameters, item, index, and "this"
* @param {object} context (optional) - optional context to call function in
*/
if (!Array.prototype.forEach)
{
  Array.prototype.forEach = function( callback, context )
  {
    var len = this.length;
	if( typeof callback != "function" ) {
      throw new TypeError();
	}

	for (var i = 0, item; item = this[ i ]; ++i) {
      if ( i in this ) {
		callback.call( context, item, i, this );
      }
    }
  };
}

/**
* if not included in the browsers implementation, add it - finds the index of an element in the array
* @method Array.prototype.indexOf
* @param {variant} element to search for
* @return {number} index if found, -1 otw.
*/
if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function(elt /*, from*/)
  {
    var len = this.length >>> 0;

    var from = Number(arguments[1]) || 0;
	from = from < 0 ? Math.ceil(from) : Math.floor(from);
    if (from < 0) {
      from += len;
	}

    for (; from < len; from++) {
		if (from in this && this[from] === elt) {
			return from;
		}
    }
    return -1;
  };
}

/**
* Convert a Date object to an ISO8601 formatted string
* @method Date.prototype.toISOString
* @return {string} ISO8601 formatted date
*/
if(!Date.prototype.toISOString) {
	Date.prototype.toISOString = function() {
		var pad_two = function(n) {
			return (n < 10 ? '0' : '') + n;
		};
		var pad_three = function(n) {
			return (n < 100 ? '0' : '') + (n < 10 ? '0' : '') + n;
		};
		return [
			this.getUTCFullYear(),
			'-',
			pad_two(this.getUTCMonth() + 1),
			'-',
			pad_two(this.getUTCDate()),
			'T',
			pad_two(this.getUTCHours()),
			':',
			pad_two(this.getUTCMinutes()),
			':',
			pad_two(this.getUTCSeconds()),
			'.',
			pad_three(this.getUTCMilliseconds()),
			'Z'
		].join('');
	};
}

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
            this.triggered = true;
            for( var key in this.callbacks ) {
                var callback = this.callbacks[ key ];
                callback.apply( this, arguments );
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
            for( var key in this.callbacks ) {
              AFrame.remove( this.callbacks, key );
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
		var eventData = arguments[ 0 ];
        var isDataObj = !AFrame.string( eventData );
        var eventName = isDataObj ? eventData.type : eventData;

		var observable = this.handlers && this.handlers[ eventName ];
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
            AFrame.mixin( this.eventData, data );
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

        var event = this.event || AFrame.Event.create( this.eventData );
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
		var observable = this.handlers && this.handlers[ eventName ];

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
		this.handlers = this.handlers || {};

		var observable = this.handlers[ eventName ] || AFrame.Observable.create();
		this.handlers[ eventName ] = observable;

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
		for( var key in this.handlers ) {
			this.handlers[ key ].unbindAll();
			AFrame.remove( this.handlers, key );
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
/**
* A collection of functions common to enumerable objects.  When mixing in 
* this class, the class being mixed into must define a forEach function.
*
* @class AFrame.EnumerableMixin
* @static
*/
AFrame.EnumerableMixin = ( function() {
    "use strict";
    
    var Mixin = {
        /**
        * Get a set of items in the collection using the search function.  The search function will
        *   be called once for each item in the collection.  Any time the search function returns true,
        *   the item will be added to the results list.
        *
        *    // Filter the collection to find a set of items that have company == 'AFrame Foundary'
        *    var matches = collection.filter( function( item, id, collection ) {
        *        // do search here, returning true if item matches.
        *        return item.company == 'AFrame Foundary';
        *    } );
        *
        * @method filter
        * @param {function} search - the search function
        * @return {array} array of results.  If no results are found, returns an empty array.
        */
        filter: function( search ) {
            var items = [];
            
            this.forEach( function( item, id ) {
                if( true === search( item, id, this ) ) {
                    items.push( item );
                }
            }, this );
            
            return items;
        },
        
        /**
        * Search for the first item in the collection that matches the search function.
        *
        *    // search for the first item with company == 'AFrame Foundary'
        *    var item = collection.search( function( item, id, collection ) {
        *        return item.company == 'AFrame Foundary';
        *    } );
        *
        * @method search
        * @param {function} search - the search function.
        * @return {item} item if an item matches, undefined otw.
        */
        search: function( search ) {
            return this.filter( search )[ 0 ];
        },

        /**
        * Get the current count of items
        *
        *    // using hash from top of the page
        *    var count = hash.getCount();
        *
        * @method getCount
        * @return {number} current count
        */
        getCount: function() {
            var count = 0;
            
            this.forEach( function( item ) {
                count++;
            } );
            
            return count;
        }
    };
    
    return Mixin;

}() );/**
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
            this.config = config;
            this.cid = config.cid || AFrame.getUniqueID();
            this.children = {};

            importConfig.call( this );
            this.bindEvents();

            /**
             * Triggered when the object is initialized
             * @event onInit
             * @param {AFrame.Event} event - the event object
             */
             this.triggerEvent( 'onInit' );
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
             * @param {AFrame.Event} e3vent - the event
             */
            this.triggerEvent( 'onTeardown' );

            this.unbindAll();
            this.unbindToAll();
            this.teardownChildren();
            this.config = this.cid = this.children = null;
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
        var me = this;

        AFrame.Class.walkChain( function( currClass ) {
        	if( currClass.prototype.hasOwnProperty( 'events' ) ) {
				var events = currClass.prototype.events;

				for( var eventName in events ) {
					var nameTarget = getNameAndTarget.call( me, eventName );
					bindHandlers.call( me, nameTarget.name, nameTarget.target, events[ eventName ] );
				}
            }
        }, me );

        function getNameAndTarget( eventName ) {
            var parts = eventName.split( ' ' );
            var target = me[ parts[ 1 ] ] || me;

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
* A basic data container. Used like a hash. Provides functionality that allows the binding of callbacks
* to the change in a piece of data.  The preferred method of creating an AFrame.DataContainer is to
* do
*
*    dataContainer = AFrame.DataContainer( data );
* This ensures that only one DataContainer is ever created for a given object.
*
* DataContainers are very important in the AFrame world.  They act as the basic data container, they can be created out of
*   any object.  They are the "Model" in Model-View-Controller.  What is possible with a DataContainer is to have multiple
*   Views bound to a particular field.  When a field is updated that has multiple Views registered, all Views are notified
*   of the change.
*
* Example:
*
*    var dataObject = {
*        firstName: 'Shane',
*        lastName: 'Tomlinson'
*    };
*
*    var dataContainer = AFrame.DataContainer( dataObject );
*    dataContainer.bindField( 'firstName', function( notification ) {
*        alert( 'new name: ' + notification.value );
*    } );
*
*    dataContainer.set( 'firstName', 'Charlotte' );
*
* @class AFrame.DataContainer
* @extends AFrame.AObject
* @uses AFrame.EnumerableMixin
* @constructor
* @param {object || AFrame.DataContainer} data (optional) If given, creates a new AFrame.DataContainer for the data.
*   If already an AFrame.DataContainer, returns self, if the data already has an AFrame.DataContainer associated with
*	it, then the original AFrame.DataContainer is used.
*/
AFrame.DataContainer = ( function() {
    "use strict";

    var DataContainer = AFrame.AObject.extend( {
		constructor:function( data ) {
			if( data instanceof DataContainer ) {
				return data;
			}
			else if( data ) {
				var dataContainer = data.__dataContainer;
				if( !dataContainer ) {
					dataContainer = DataContainer.create( {
						data: data
					} );
				}
				return dataContainer;
			}
			DataContainer.sc.constructor.call( this, data );

		},
        /**
        * Initialize the data container.
        * @method init
        */
        init: function( config ) {
            /**
            * Initial data
            * @config data
            * @type {object}
            * @default {}
            */
            this.data = config.data || {};

            if( this.data.__dataContainer ) {
                throw Error( 'Cannot create a second DataContainer for an object' );
            }

            this.data.__dataContainer = this;
            this.fieldBindings = {};

            DataContainer.sc.init.call( this, config );
        },

        /**
        * Update a field.
        *
        *    // If passing two arguments, the first argument is
        *	 // the name of the field, the second is the value
        *    var prevVal = dataContainer.set( 'name', 'Shane Tomlinson' );
        *
        *    // If passing a single argument, it must be an
        *	 // object with key/value pairs.  prevVals will
        *    // be an object with the previous value of each
        *    // field that is updated.
        *    var prevVals = dataContainer.set( {
        *        name: 'Shane Tomlinson',
        *        employer: 'AFrame Foundary'
        *    } );
        *
        * @method set
        * @param {string} fieldName name of field
        * @param {variant} fieldValue value of field
        * @return {variant} previous value of field
        */
        set: function( fieldName, fieldValue ) {
        	if( 'object' === typeof( fieldName ) ) {
				var prevVals = {};
        		for( var key in fieldName ) {
					prevVals[ key ] = this.set( key, fieldName[ key ] );
        		}
        		return prevVals;
        	}

            var oldValue = this.data[ fieldName ];
            this.data[ fieldName ] = fieldValue;

            /**
            * Triggered whenever any item on the object is set.
            * @event onSet
            * @param {AFrame.Event} event - an event object. @see [Event](AFrame.Event.html)
            * @param {string} event.fieldName - name of field affected.
            * @param {variant} event.value - the current value of the field.
            * @param {variant} event.oldValue - the previous value of the field (only applicable if data has changed).
            */
            this.triggerEvent( {
                fieldName: fieldName,
                oldValue: oldValue,
                value: fieldValue,
                type: 'onSet'
            } );
            /**
            * Triggered whenever an item on the object is set.  This is useful to bind
            *	to whenever a particular field is being changed.
            * @event onSet-fieldName
            * @param {AFrame.Event} event - an event object.  @see [Event](AFrame.Event.html)
            * @param {string} event.fieldName - name of field affected.
            * @param {variant} event.value - the current value of the field.
            * @param {variant} event.oldValue - the previous value of the field (only applicable if data has changed).
            */
            this.triggerEvent( {
                fieldName: fieldName,
                oldValue: oldValue,
                value: fieldValue,
                type: 'onSet-' + fieldName
            } );

            return oldValue;
        },

        /**
        * Get the value of a field
        *
        *    var value = dataContainer.get( 'name' );
        *
        * @method get
        * @param {string} fieldName - name of the field to get
        * @return {variant} value of field
        */
        get: function( fieldName ) {
            return this.data[ fieldName ];
        },

        /**
        * Get an object with all fields contained in the DataContainer.
        *
        *    // Get an object with all fields contained in the DataContainer.
        *    var dataObject = dataContainer.getDataObject();
        *
        * @method getDataObject
        * @return {object}
        */
        getDataObject: function() {
            return this.data;
        },

        /**
        * Bind a callback to a field.  Function is called once on initialization as well as any time the field changes.
        *   When function is called, it is called with an event.
        *
        *    var onChange = function( event ) {
        *        console.log( 'Name: "' + event.fieldName + '" + value: "' + event.value + '" oldValue: "' + event.oldValue + '"' );
        *    };
        *    var id = dataContainer.bindField( 'name', onChange );
        *    // use id to unbind callback manually, otherwise callback will be unbound automatically.
        *
        * @method bindField
        * @param {string} fieldName name of field
        * @param {function} callback callback to call
        * @param {object} context context to call callback in
        * @return {id} id that can be used to unbind the field
        */
        bindField: function( fieldName, callback, context ) {
            this.setEventData( {
                container: this,
                fieldName: fieldName,
                oldValue: undefined,
                value: this.get( fieldName ),
                type: 'onSet:' + fieldName
            } );
            var event = this.getEventObject();
            callback.call( context, event );

            return this.bindEvent( 'onSet-' + fieldName, callback, context );
        },

        /**
        * Unbind a field.
        *
        *    var id = dataContainer.bindField(...
        *    dataContainer.unbindField( id );
        *
        * @method unbindField
        * @param {id} id given by bindField
        */
        unbindField: function( id ) {
            return this.unbindEvent( id );
        },

        /**
        * Iterate over each item in the dataContainer.  Callback will be called with two parameters, the first the value, the second the key
        *
        *    dataCollection.forEach( function( item, index ) {
        *       // process item here
        *    } );
        *
        * @method forEach
        * @param {function} function to call
        * @param {object} context (optional) optional context
        */
        forEach: function( callback, context ) {
            for( var key in this.data ) {
                if( key !== '__dataContainer' ) {
                    callback.call( context, this.data[ key ], key );
                }
            }
        }
    },
 	AFrame.EnumerableMixin );

    return DataContainer;
}() );
/**
* A basic plugin, used to extend functionality of an object without either subclassing or directly
*	extending that object.  Plugins make it easy to create configurable objects by adding
*	small units of coherent functionality and plugging a base object.  When creating an object,
*	if the functionality is needed, add the plugin, if not, leave it out.  When the plugged
*	object is torn down, the plugin will automatically be torn down as well.
* @class AFrame.Plugin
* @extends AFrame.AObject
* @constructor
*/
AFrame.Plugin = ( function() {
    "use strict";

    var Plugin = AFrame.AObject.extend( {
        importconfig: [ 'plugged' ],
        events: {
            'onTeardown plugged': 'teardown',
            'onInit plugged': 'onPluggedInit'
        },

        /**
        * Get a reference to the plugged object.
        * @method getPlugged
        * @return {AFrame.AObject} the plugged object
        */
        getPlugged: function() {
            return this.plugged;
        },

        teardown: function() {
            AFrame.remove( this, 'plugged' );
            Plugin.sc.teardown.call( this );
        },

        /**
        * Override to do some specialized handling when a plugged object is initialized.
        * @method onPluggedInit
        */
        onPluggedInit: function() {
            // do nothing
        }
    } );

    return Plugin;
}() );
AFrame.ArrayCommonFuncsMixin = (function() {
	"use strict";

	/**
	* Common functions to all arrays
	* @class AFrame.ArrayCommonFuncsMixin
	* @static
	*/
	var Mixin = {
		/**
		* Get the current count of items.  Should be overridden.
		*
		*    // list is an AFrame.List
		*    var count = list.getCount();
		*
		* @method getCount
		* @return {number} current count
		* @throw 'operation not supported' if not overridden properly.
		*/
		getCount: function() { /* Should be overridden */
			throw 'operation not supported';
		},

		/**
		 * @private
		 * Given an tentative index, get the index the item would be inserted at
		 * @method getActualInsertIndex
		 * @param {number} index - index to check for
		 */
		getActualInsertIndex: function( index ) {
			var len = this.getCount();

			if( 'undefined' == typeof( index ) ) {
				index = len;
			}
			else if( index < 0 ) {
				index = len + ( index + 1 );
			}

			index = Math.max( 0, index );
			index = Math.min( len, index );

			return index;
		},

		/**
		 * @private
		 * Given an tentative index, get the item's real index.
		 * @method getActualIndex
		 * @param {number} index - index to check for
		 */
		getActualIndex: function( index ) {
			var len = this.getCount();

			// check from end
			if( index < 0 ) {
				index = len + index;
			}

			// invalid indexes;
			if( index < 0 || len <= index ) {
				index = undefined;
			}

			return index;
		}
	};

	return Mixin;
}());
/**
* A hash collection.  Items stored in the hash can be accessed/removed by a key.  The item's key
* is first searched for on the item's cid field, if the item has no cid field, a cid will be assigned
* to it.  The CID used is returned from the insert function.
*
* CollectionHash is different from a [CollectionArray](AFrame.CollectionArray.html) which is accessed
* by index.
*
*    Create the hash
*    var collection = AFrame.CollectionHash.create();
*
*    // First item is inserted with a cid
*    var cid = collection.insert( { cid: 'cid1',
*                             name: 'AFrame Foundary',
*                             city: 'London',
*                             country: 'United Kingdom'
*                           } );
*    // cid variable will be 'cid1'
*
*    var googleCID = collection.insert( { name: 'Google',
*                                   city: 'Santa Clara',
*                                   country: 'United States'
*                                 } );
*    // googleCID will be assigned by the system
*
*    // Getting an item from the hash.
*    var item = collection.get( 'cid1' );
*    // item will be the AFrame Foundary item
*
*    var googleItem = collection.remove( googleCID );
*    // googleItem will be the google item that was inserted
*
* @class AFrame.CollectionHash
* @extends AFrame.AObject
* @uses AFrame.EnumerableMixin
* @constructor
*/
AFrame.CollectionHash = ( function() {
    "use strict";

    var CollectionHash = AFrame.AObject.extend( AFrame.EnumerableMixin, {
        init: function( config ) {
            this.hash = {};

            CollectionHash.sc.init.call( this, config );
        },

        teardown: function() {
            for( var cid in this.hash ) {
                AFrame.remove( this.hash, cid );
            }
            AFrame.remove( this, 'hash' );

            CollectionHash.sc.teardown.call( this );
        },

        /**
        * Get an item from the hash.
        *
        *    // using data from example at top of page
        *    var item = hash.get( 'cid1' );
        *    // item will be the AFrame Foundary item
        *
        * @method get
        * @param {id} cid - cid of item to get
        * @return {variant} item if it exists, undefined otw.
        */
        get: function( cid ) {
            return this.hash[ cid ];
        },

        /**
        * Remove an item from the store.
        *
        *    // using data from example at top of page
        *    var googleItem = hash.remove( googleCID );
        *    // googleItem will be the google item that was inserted
        *
        * An Example can be found on <a 
        * href="http://jsfiddle.net/shane_tomlinson/Jkdy3/" 
        * target="_blank">JSFiddle</a>
        *
        * @method remove
        * @param {object || cid} item - item or cid of item to remove
        * @param {object} options - options
        * @param {boolean} options.force - force removal, if set to true, onBeforeRemove event has
        *   no effect.
        * @return {variant} item if it exists, undefined otw.
        */
        remove: function( cid, options ) {
            var me=this,
                cid = 'object' === typeof( cid ) ? findHashKey.call( me, cid ) : cid,
                item = me.get( cid );

            if( item ) {
                /**
                * Triggered before remove happens.  If listeners call preventDefault on the
                *   event object, the remove will not happen.
                * @event onBeforeRemove
                * @param {object} data - data field passed.
                * @param {CollectionHash} data.collection - collection causing event.
                * @param {variant} data.item - item removed
                */
                var event = me.triggerEvent( {
                    item: item,
                    cid: cid,
                    type: 'onBeforeRemove',
                    force: options && options.force
                } );

                if( me.shouldDoAction( options, event ) ) {
                    AFrame.remove( me.hash, cid );
                    /**
                    * Triggered after remove happens.
                    * @event onRemove
                    * @param {object} data - data has two fields, item and meta.
                    * @param {CollectionHash} data.collection - collection causing event.
                    * @param {variant} data.item - item removed
                    */
                    me.triggerEvent(  {
                        item: item,
                        cid: cid,
                        type: 'onRemove',
                        force: options && options.force
                    } );

                    return item;
                }
            }

        },

        /**
        * Insert an item into the hash.  CID is gotten first from the item's cid field.  If this doesn't exist,
        * it is then assigned.  Items with duplicate cids are not allowed, this will cause a 'duplicate cid'
        * exception to be thrown.  If the item being inserted is an Object and does not already have a cid, the
        * item's cid will be placed on the object under the cid field.
        *
        * When onBeforeInsert is triggered, if the event has had preventDefault called,
        *   the insert will be cancelled
        *
        *    // First item is inserted with a cid
        *    var cid = hash.insert( { cid: 'cid1',
        *                             name: 'AFrame Foundary',
        *                             city: 'London',
        *                             country: 'United Kingdom'
        *                           } );
        *    // cid variable will be 'cid1'
        *
        *    var googleCID = hash.insert( { name: 'Google',
        *                                   city: 'Santa Clara',
        *                                   country: 'United States'
        *                                 } );
        *    // googleCID will be assigned by the system
        *
        * @method insert
        * @param {variant} item - item to insert
        * @param {object} options - options
        * @param {boolean} options.force - force insertion, if set to true, onBeforeInsert event has
        *   no effect (duplicate cid constraints still apply)
        * @return {id} cid of the item.
        */
        insert: function( item, options ) {
            var cid = this.getItemCID( item );


            /**
             * Triggered before insertion happens.  If listeners call preventDefault on the event,
             *  item will not be inserted
             * @event onBeforeInsert
             * @param {object} data - data has two fields.
             * @param {CollectionHash} data.collection - collection causing event.
             * @param {variant} data.item - item inserted
             */
            var event = this.triggerEvent( {
                item: item,
                cid: cid,
                type: 'onBeforeInsert',
                force: options && options.force
            } );

            if( this.shouldDoAction( options, event ) ) {

                // store the CID on the item.
                if( item instanceof Object ) {
                    item.cid = cid;
                }

                this.hash[ cid ] = item;

                /**
                 * Triggered after insertion happens.
                 * @event onInsert
                 * @param {object} data - data has two fields, item and meta.
                 * @param {CollectionHash} data.collection - collection causing event.
                 * @param {variant} data.item - item inserted
                 */
                this.triggerEvent( {
                    item: item,
                    cid: cid,
                    type: 'onInsert',
                    force: options && options.force
                } );

                return cid;
            }

        },

        shouldDoAction: function( options, event ) {
            return ( options && options.force ) || !( event && event.isDefaultPrevented() );
        },

        /**
        * Clear the hash
        *
        *    // remove all items from the hash.
        *    hash.clear();
        *
        * @method clear
        */
        clear: function() {
            for( var cid in this.hash ) {
                this.remove( cid );
            }
        },

        /**
        * Iterate over the collection, calling a function once for each item in the collection.
        *
        *    // iterate over the collection
        *    collection.forEach( function( item, id ) {
        *        // perform some action on item.
        *    } );
        *
        * @method forEach
        * @param {function} callback - callback to call for each item.  Will be called with two parameters,
        *   the first is the item, the second the identifier (id type depends on type of collection).
        * @param {object} context - optional context to call callback in.
        */
        forEach: function( callback, context ) {
            var hash = this.hash;
            for( var cid in hash ) {
                callback.call( context, hash[ cid ], cid );
            }
        },

        getItemCID: function( item ) {
            var cid = item.cid || AFrame.getUniqueID();

            if( 'undefined' != typeof( this.get( cid ) ) ) {
                throw 'duplicate cid';
            }

			return cid;
        }
    } );
    CollectionHash.currID = 0;

    function findHashKey( item ) {
        var hash = this.hash;
        for( var key in hash ) {
            if( item === hash[ key ] ) {
                return key;
            }
        }
    }

    return CollectionHash;
} )();
/**
* An array collection.  Unlike the [CollectionHash](AFrame.CollectionHash.html), the CollectionArray can be accessed via
* either a key or an index.  When accessed via a key, the item's CID will be used.  If an item has a cid field when
* inserted, this cid will be used, otherwise a cid will be assigned.
*
* This raises the same events as AFrame.CollectionHash, but every event will have one additional parameter, index.
*
*    Create the array
*    var collection = AFrame.CollectionArray.create();
*
*    // First item is inserted with a cid, inserted at the end of the array.
*    var aframeCID = collection.insert( { cid: 'cid1',
*                             name: 'AFrame Foundary',
*                             city: 'London',
*                             country: 'United Kingdom'
*                           } );
*    // aframeCID variable will be 'cid1'
*
*    // inserts google at the head of the list.
*    var googleCID = collection.insert( { name: 'Google',
*                                   city: 'Santa Clara',
*                                   country: 'United States'
*                                 }, 0 );
*    // googleCID will be assigned by the system
*
*    // microsoft inserted at the end of the list.
*    var microsoftCID = collection.insert( { name: 'Microsoft',
*                                   city: 'Redmond',
*                                   country: 'United States'
*                                 }, -1 );
*    // microsoftCID will be assigned by the system
*
*    // Getting an item via index.  This will return google item.
*    var item = collection.get( 0 );
*    // item will be the google item
*
*    // Getting an item via negative index.  This will return microsoft item.
*    var item = collection.get( -1 );
*    // item will be the microsoft item
*
*    // Getting an item via CID.  This will return the aframe item.
*    item = collection.get( aframeCID );
*
*    var googleItem = collection.remove( googleCID );
*    // googleItem will be the google item that was inserted
*
*    var aframeItem = collection.remove( 0 );
*    // aframeItem will be the aframe item since the google item was first but is now removed
*
* @class AFrame.CollectionArray
* @extends AFrame.CollectionHash
* @uses AFrame.ArrayCommonFuncsMixin
* @constructor
*/
AFrame.CollectionArray = ( function() {
    "use strict";

    var CollectionArray = AFrame.CollectionHash.extend( AFrame.ArrayCommonFuncsMixin, {
        init: function( config ) {
            this.itemCIDs = [];

            CollectionArray.sc.init.call( this, config );
        },

        teardown: function() {
            this.itemCIDs.forEach( function( id, index ) {
                this.itemCIDs[ index ] = null;
            }, this );
            AFrame.remove( this, 'itemCIDs' );

            CollectionArray.sc.teardown.apply( this );
        },

        /**
        * Insert an item into the array.
        *
        *    // First item is inserted with a cid, inserted at the end of the array.
        *    var aframeCID = collection.insert( { cid: 'cid1',
        *                             name: 'AFrame Foundary',
        *                             city: 'London',
        *                             country: 'United Kingdom'
        *                           } );
        *    // aframeCID variable will be 'cid1'
        *
        *    // inserts google at the head of the list.
        *    var googleCID = collection.insert( { name: 'Google',
        *                                   city: 'Santa Clara',
        *                                   country: 'United States'
        *                                 }, 0 );
        *    // googleCID will be assigned by the system
        *
        *    // microsoft inserted at the end of the list.
        *    var microsoftCID = collection.insert( { name: 'Microsoft',
        *                                   city: 'Redmond',
        *                                   country: 'United States'
        *                                 }, -1 );
        *    // microsoftCID will be assigned by the system
        * @method insert
        * @param {variant} item to insert
        * @param {integer} index (optional) - index to insert into.  If
        * 	not defined, insert at the end of the list.
        * @return {id} cid of the item
        */
        insert: function( item, index ) {
            var me=this, cid = me.getItemCID( item );
            index = 'number' == typeof( index ) ? index : -1;

            me.currentIndex = me.getActualInsertIndex( index );
            me.itemCIDs.splice( me.currentIndex, 0, cid );

			item.cid = cid;
            CollectionArray.sc.insert.call( me, item );

            return cid;
        },

        /**
        * Get an item from the array.
        *
        *    // Getting an item via index.  This will return google item.
        *    var item = collection.get( 0 );
        *    // item will be the google item
        *
        *    // Getting an item via negative index.  This will return microsoft item.
        *    var item = collection.get( -1 );
        *    // item will be the microsoft item
        *
        *    // Getting an item via CID.  This will return the aframe item.
        *    item = collection.get( aframeCID );
        *
        * @method get
        * @param {number || id} index - index or cid of item to get
        * @return {variant} item if it exists, undefined otw.
        */
        get: function( index ) {
            var cid = this.getCID( index );
            var retval;
            if( cid ) {
                retval = CollectionArray.sc.get.call( this, cid );
            }
            return retval;
        },

        /**
        * Remove an item from the array
        *
        *    var googleItem = collection.remove( googleCID );
        *    // googleItem will be the google item that was inserted
        *
        *    var aframeItem = collection.remove( 0 );
        *    // aframeItem will be the aframe item since the google item was first but is now removed
        *
        * @method remove
        * @param {number || id} index of item to remove.
        */
        remove: function( index ) {
            var cid;
            if( 'string' == typeof( index ) ) {
                cid = index;
                index = this.getIndex( index );
            }
            else {
                index = this.getActualIndex( index );
                cid = this.getCID( index );
            }


            var retval;
            if( index > -1 ) {
                this.itemCIDs.splice( index, 1 );
                this.currentIndex = index;
                retval = CollectionArray.sc.remove.call( this, cid );
            }

            return retval;
        },

        /**
        * Clear the array
        *
        *    // Clears the collection.
        *    collection.clear();
        *
        * @method clear
        */
        clear: function() {
            CollectionArray.sc.clear.call( this );

            this.itemCIDs = [];
        },

        /**
        * Get the current count of items
        *
        *    // Get the number of items in the collection.
        *    var count = collection.clear();
        *
        * @method getCount
        * @return {number} current count
        */
        getCount: function() {
            return this.itemCIDs.length;
        },

        /**
        * Get an array representation of the CollectionArray
        *
        *    // Returns the array representation of the collection.
        *    var itemsArray = collection.getArray();
        *
        * @method getArray
        * @return {array} array representation of CollectionArray
        */
        getArray: function() {
            var array = [];
            this.itemCIDs.forEach( function( cid, index ) {
                array[ index ] = this.hash.get( cid );
            } );

            return array;
        },

        /**
         * @private
         */
        getEventObject: function() {
            var event = CollectionArray.sc.getEventObject.call( this );
            event.index = this.currentIndex;

            return event;
        },

        /**
         * Given an index or cid, get the cid.
         * @method getCID
         * @param {id || number} index
         * @private
         */
        getCID: function( index ) {
            var cid = index;

            if( 'number' == typeof( index ) ) {
                index = this.getActualIndex( index );
                cid = this.itemCIDs[ index ];
            }

            return cid;
        },

        /**
         * Given an index or cid, get the index.
         * @method getIndex
         * @param {id || number} index
         * @private
         */
        getIndex: function( index ) {
            if( 'string' == typeof( index ) ) {
                index = this.itemCIDs.indexOf( index );
            }

            return index;
        },

        forEach: function( callback, context ) {
            for( var item, index = 0, cid; cid = this.itemCIDs[ index ]; ++index ) {
                item = this.get( cid );
                callback.call( context, item, index );
            }
        }
    } );
    return CollectionArray;
} )();
/**
 * A plugin to a collection to give the collection db ops.  This is part of what is usually called an Adapter
 *  when referring to collections with a hookup to a database.  The CollectionPluginPersistence is not the actual
 *  Adapter but binds a collection to an Adapter.  The CollectionPluginPersistence adds load, add, save, del
 *  functions to the collection, all four functions are assumed to operate asynchronously.
 *  When configuring the plugin, 4 parameters can be specified, each are optional.
 *  The four paramters are addCallback, saveCallback, loadCallback, and deleteCallback.  When the callbacks are called, they
 *  will be called with two parameters, item, options.  item is the item currently being operated on. options is
 *  options data that will contain at least two fields, collection and onComplete. onComplte should be called by the
 *  adapter when the adapter function
 *  has completed.
 *
 *     // set up the adapter
 *     var dbAdapter = {
 *         load: function( options ) {
 *              // functionality here to do the load
 *              // a variable named items is set with an array of items.
 *              if( options.onComplete ) {
 *                  options.onComplete( items );
 *              }
 *         },
 *         add: function( item, options ) {
 *              // functionality here to do the add
 *
 *              // Method 1: this does not override the initial item
 *              if( options.onComplete ) {
 *                  options.onComplete();
 *              }
 *
 *              // Method 2: this overrides the initial item to create a model which is inserted
 *              // into the collection.  Note, getModel is an imaginary function used only for
 *              // demo purposes.
 *              if( options.onComplete ) {
 *                  var model = getModel( item );
 *                  options.onComplete( model );
 *              }
 *         },
 *         del: function( item, options ) {
 *              // functionality here to do the delete
 *
 *              if( options.onComplete ) {
 *                  options.onComplete();
 *              }
 *         },
 *         save: function( item, options ) {
 *              // functionality here to do the save
 *
 *              if( options.onComplete ) {
 *                  options.onComplete();
 *              }
 *         }
 *     };
 *
 *     var collection = AFrame.CollectionArray.create( {
 *          plugins: [ [ AFrame.CollectionPluginPersistence, {
 *                  // specify each of the four adapter functions
 *                  loadCallback: dbAdapter.load,
 *                  addCallback: dbAdapter.load,
 *                  deleteCallback: dbAdapter.del,
 *                  saveCallback: dbAdapter.save
 *              }
 *          ] ]
 *     } );
 *
 *     // Loads the initial items
 *     collection.load( {
 *          onComplete: function( items, options ) {
 *              alert( 'Collection is loaded' );
 *          }
 *     } );
 *
 *     // Adds an item to the collection.  Note, a cid is not given back
 *     // because this operation is asynchronous and a cid will not be
 *     // assigned until the persistence operation completes.  A CID
 *     // will be placed on the item.
 *     collection.add( {
 *          name: 'AFrame',
 *          company: 'AFrame Foundary'
 *     }, {
 *          onComplete: function( item, options ) {
 *              // cid is available here in either options.cid or item.cid
 *              alert( 'add complete, cid: ' + options.cid );
 *          }
 *     } );
 *
 *     // delete an item with cid 'cid'.
 *     collection.del( 'cid', {
 *          onComplete: function() {
 *              alert( 'delete complete' );
 *          }
 *     } );
 *
 *     // save an item with cid 'cid'.
 *     collection.save( 'cid', {
 *          onComplete: function() {
 *              alert( 'save complete' );
 *          }
 *     } );
 *
 * @class AFrame.CollectionPluginPersistence
 * @extends AFrame.Plugin
 * @constructor
 */
AFrame.CollectionPluginPersistence = ( function() {
    "use strict";

    var Plugin = AFrame.Plugin.extend( {
        init: function( config ) {
            /**
             * function to call to do add.  Will be called with two parameters, data, and options.
             * @config addCallback
             * @type function (optional)
             */
            this.addCallback = config.addCallback || noPersistenceOp;

            /**
             * function to call to do save.  Will be called with two parameters, data, and options.
             * @config saveCallback
             * @type function (optional)
             */
            this.saveCallback = config.saveCallback || noPersistenceOp;

            /**
             * function to call to do load.  Will be called with one parameter, options.
             * @config loadCallback
             * @type function (optional)
             */
            this.loadCallback = config.loadCallback || noPersistenceOp;

            /**
             * function to call to do delete.  Will be called with two parameters, data, and options.
             * @config deleteCallback
             * @type function (optional)
             */
            this.deleteCallback = config.deleteCallback || noPersistenceOp;

            Plugin.sc.init.call( this, config );

            var plugged = this.getPlugged();
            plugged.add = this.add.bind( this );
            plugged.load = this.load.bind( this );
            plugged.del = this.del.bind( this );
            plugged.save = this.save.bind( this );
        },


        /**
         * Add an item to the collection.  The item will be inserted into the collection once the addCallback
         *  is complete.  Because of this, no cid is returned from the add function, but one will be placed into
         *  the options item passed to the onComplete callback.
         *
         *     // Adds an item to the collection.  Note, a cid is not given back
         *     // because this operation is asynchronous and a cid will not be
         *     // assigned until the persistence operation completes.  A CID
         *     // will be placed on the item.
         *     collection.add( {
         *          name: 'AFrame',
         *          company: 'AFrame Foundary'
         *     }, {
         *          onComplete: function( item, options ) {
         *              // cid is available here in either options.cid or item.cid
         *              alert( 'add complete, cid: ' + options.cid );
         *          }
         *     } );
         *
         * @method add
         * @param {object} item - item to add
         * @param {object} options - options information.
         * @param {function} options.onComplete (optional) - callback to call when complete
         *	Will be called with two parameters, the item, and options information.
         * @param {function} options.insertAt (optional) - data to be passed as second argument to the collection's
         *  insert function.  Useful when using CollectionArrays to specify the index
         * @param {boolean} options.force (optional) - If set to true, an add will be forced even if
         *  onBeforeAdd has its preventDefault called.
         */
        add: function( item, options ) {
            options = getOptions( this, options );
            var callback = options.onComplete;

            var plugged = this.getPlugged();
            /**
            * Triggered on the collection before an add is sent to persistence.  If the event has preventDefault called,
            *   the add will be cancelled as long as the options.force is not set to true
            * @event onBeforeAdd
            * @param {AFrame.Event} event - event object
            * @param {variant} event.item - the item being added
            * @param {boolean} event.force - whether the add is being forced.
            */
            var event = plugged.triggerEvent( getEvent( 'onBeforeAdd', item, options ) );

            if( plugged.shouldDoAction( options, event ) ) {
                options.onComplete = function( overriddenItem ) {
                    // For the insert item, use the item given by the db access layer, if they pass one back.  If
                    //  no override is given, use the original item.
                    item = overriddenItem || item;
                    var cid = plugged.insert( item, options.insertAt );
                    options.cid = cid;
                    options.onComplete = callback;

                    callback && callback( item, options );

                    /**
                    * Triggered on the collection after an item is sent to persistence and is added to the Collection.
                    * @event onAdd
                    * @param {AFrame.Event} event - event object
                    * @param {variant} event.item - the item being added
                    * @param {boolean} event.force - whether the add is being forced.
                    * @param {id} event.cid - item's cid
                    */
                    plugged.triggerEvent( getEvent( 'onAdd', item, options ) );
                };

                this.addCallback( item, options );
            }
        },



        /**
         * load the collection
         *
         *     // Loads the initial data
         *     collection.load( {
         *          onComplete: function( items, options ) {
         *              alert( 'Collection is loaded' );
         *          }
         *     } );
         *
         * @method load
         * @param {object} options - options information.
         * @param {function} options.onComplete (optional) - the callback will be called when operation is complete.
         *	Callback will be called with two parameters, the items, and options information.
         */
        load: function( options ) {
            options = getOptions( this, options );
            var plugged = this.getPlugged();

            /**
            * Triggered on the collection before a load occurs.  If the listener calls preventDefault on the event,
            *   the load will be cancelled unless the load is forced.
            * @event onBeforeLoad
            * @param {object} event - event information
            * @param {boolean} event.force - whether the load is being forced.
            */
            var event = plugged.triggerEvent( {
                type: 'onBeforeLoad',
                force: options && options.force
            } );
            if( plugged.shouldDoAction( options, event ) ) {
                var callback = options.onComplete;
                /**
                * Triggered on the collection whenever a load is starting
                * @event onLoadStart
                * @param {object} event - event information
                * @param {boolean} event.force - whether the load is being forced.
                */
                plugged.triggerEvent( {
                    type: 'onLoadStart',
                    force: options && options.force
                } );
                options.onComplete = onComplete.bind( this, callback, options );

                this.loadCallback( options );
            }

            function onComplete( callback, options, items ) {
                if( items ) {
                    items.forEach( function( item, index ) {
                        plugged.insert( item );
                    } );
                }
                options.onComplete = callback;
                callback && callback( items, options );

                /**
                * Triggered on the collection whenever a load has completed
                * @event onLoad
                * @param {object} event - event information, has collection and items fields.
                * @param {variant} event.items- items loaded inserted
                * @param {boolean} event.force - whether the load is being forced.
                */
                plugged.triggerEvent( {
                    items: items,
                    type: 'onLoad',
                    force: options && options.force
                } );
            }

        },

        /**
         * delete an item in the collection
         *
         *     // delete an item with cid 'cid'.
         *     collection.del( 'cid', {
         *          onComplete: function( item, options ) {
         *              alert( 'delete complete' );
         *          }
         *     } );
         *
         * @method del
         * @param {id || index} itemID - id or index of item to remove
         * @param {object} options - options information.
         * @param {function} options.onComplete (optional) - the callback will be called when operation is complete.
         *	Callback will be called with two parameters, the item, and options information.
         */
        del: function( itemID, options ) {
            var plugged = this.getPlugged();
            var item = plugged.get( itemID );

            if( item ) {
                /**
                * Triggered on the collection before a delete is sent to persistence.  If the event has preventDefault called,
                *   the delete will be cancelled as long as the options.force is not set to true
                * @event onBeforeDelete
                * @param {AFrame.Event} event - event object
                * @param {variant} event.item - the item being deleted
                * @param {boolean} event.force - whether the delete is being forced.
                */
                var event = plugged.triggerEvent( getEvent( 'onBeforeDelete', item, options ) );

                if( plugged.shouldDoAction( options, event ) ) {
                    options = getOptions( this, options );
                    var callback = options.onComplete;

                    options.onComplete = function() {
                        plugged.remove( itemID, options );
                        options.onComplete = callback;
                        callback && callback( item, options );
                    };

                    this.deleteCallback( item, options );

                    /**
                    * Triggered on the collection after an item is deleted from persistence and is removed from the Collection.
                    * @event onDelete
                    * @param {AFrame.Event} event - event object
                    * @param {variant} event.item - the item being deleted
                    * @param {boolean} event.force - whether the delete is being forced.
                    * @param {id} event.cid - item's cid
                    */
                    plugged.triggerEvent( getEvent( 'onDelete', item, options ) );
                }

            }
        },

        /**
         * save an item in the collection
         *
         *     // save an item with cid 'cid'.
         *     collection.save( 'cid', {
         *          onComplete: function( item, options ) {
         *              alert( 'save complete' );
         *          }
         *     } );
         *
         * @method save
         * @param {id || index} itemID - id or index of item to save
         * @param {object} options - options information.
         * @param {function} options.onComplete (optional) - the callback will be called when operation is complete.
         *	Callback will be called with two parameters, the item, and options information.
         */
        save: function( itemID, options ) {
            var plugged = this.getPlugged();
            var item = plugged.get( itemID );

            if( item ) {
                /**
                * Triggered on the collection before a save is sent to persistence.  If the event has preventDefault called,
                *   the save elete will be cancelled as long as the options.force is not set to true
                * @event onBeforeSave
                * @param {AFrame.Event} event - event object
                * @param {variant} event.item - the item being saved
                * @param {boolean} event.force - whether the save is being forced.
                */
                var event = plugged.triggerEvent( getEvent( 'onBeforeSave', item, options ) );
                if( plugged.shouldDoAction( options, event ) ) {

                    options = getOptions( this, options );
                    var callback = options.onComplete;

                    options.onComplete = function() {
                        options.onComplete = callback;
                        callback && callback( item, options );
                    }.bind( this );

                    this.saveCallback( item, options );

                    /**
                    * Triggered on the collection after an item is saved to persistence.
                    * @event onSave
                    * @param {AFrame.Event} event - event object
                    * @param {variant} event.item - the item being saved
                    * @param {boolean} event.force - whether the save is being forced.
                    * @param {id} event.cid - item's cid
                    */
                    plugged.triggerEvent( getEvent( 'onSave', item, options ) );
                }
            }
        }
    } );

    /**
    * Get the persistence options
    * @method getOptions
    * @private
    */
    function getOptions( context, options ) {
        options = options || {};
        options.collection = context.getPlugged();
        return options;
    }

    /**
    * Get an event object.  Used when triggering the on[Add|Delete|Save|Load]* events
    * @method getEvent
    * @private
    */
    function getEvent( type, item, options ) {
        var event = {
            type: type,
            item: item
        };

        if( item.cid ) {
            event.cid = item.cid;
        }

        if( options && options.force ) {
            event.force = true;
        }

        return event;
    }

    /**
    * A NoOp type function that just calls the onComplete function, used for persistence functions
    *   where no callback is specified.
    * @method noPersistenceOp
    * @private
    */
    function noPersistenceOp( data, options ) {
        var callback = options.onComplete;
        callback && callback( data, options );
    }

    return Plugin;
} )();
/**
* A plugin to a Collection that automates the creation of models.  If all items
*   in a collection share a [Schema](AFrame.Schema.html), instead of creating
*   a model for each insert, the data can be inserted directly and a model will
*   automatically be created.  When doing a "get" on the collection, the models
*   will be returned.  Model creation will occur as soon as data enters the collection,
*   so it happens on insert always before the onBeforeInsert event is triggered.
*   If the collection has CollectionPluginPersistence, the model will be created
*   before the onBeforeAdd event is triggered.
*
*    // Define the schema
*    var schemaConfig = {
*        name: { type: 'text' },
*        employer: { type: 'text', 'def': 'AFrame Foundary' }
*    };
*
*    // create the collection.
*    this.collection = AFrame.CollectionArray.create( {
*        plugins: [ [ AFrame.CollectionPluginModel, {
*            schema: schemaConfig
*        } ] ]
*    } );
*
* @class AFrame.CollectionPluginModel
* @extends AFrame.Plugin
* @constructor
*/
/**
* The schema or schemaConfig to use.
* @config schema
* @type {SchemaConfig || Schema || Model}
*/
/**
* The model factory to use.  If not given, a default model factory is used
*   which creates an AFrame.Model with the data inserted and the schema
*   given.  The factory will be called with two parameters, the data
*   and the schema.
*
*    // example of an overridden model factory function.
*    var modelFactory = function( data, schema ) {
*       return SpecializedMode.create( {
*           data: data,
*           schema: schema
*       } );
*    };
*
* @config modelFactory
* @type {function}
* @default modelFactory
*/
AFrame.CollectionPluginModel = ( function() {
    "use strict";

    var Plugin = AFrame.Plugin.extend( {
        importconfig: [ 'schema' ],

        init: function( config ) {
        	var me=this;
            me.modelFactory = config.modelFactory || createModel;

            Plugin.sc.init.call( me, config );

			me.defaultModelConstructor = AFrame.extendsFrom( me.schema, AFrame.Model ) ? me.schema : AFrame.Model;

            var plugged = me.getPlugged();
            plugged.insert = augmentInsert.bind( me, plugged.insert );

            if( plugged.add ) {
                plugged.add = augmentInsert.bind( me, plugged.add );
            }
        }

    } );

    function augmentInsert( decorated, item, insertAt ) {
        if( !( item instanceof AFrame.Model ) ) {
            item = this.modelFactory( item );
        }

        return decorated.call( this.getPlugged(), item, insertAt );
    }

    function createModel( data ) {
		var model = this.defaultModelConstructor.create( {
			schema: this.schema,
			data: data
		} );
        return model;
    }

    return Plugin;
}() );
/**
 * A basic data schema, useful for defining a data structure, validating data, and preparing data to
 * be loaded from or saved to a persistence store.  Schema's define the data structure and can
 * be nested to create complex data structures.  Schemas perform serialization duties in getAppData and
 * serializeItems.  Finally, Schemas define ways to perform data validation.
 *
 * When loading data from persistence, if the data is run through the getAppData function,
 * it will make an object with only the fields
 * defined in the schema, and any missing fields will get default values.  If a fixup function is defined
 * for that row, the field's value will be run through the fixup function.  When saving data to persistence,
 * running data through the serializeItems will create an object with only the fields specified in the schema.  If
 * a row has 'save: false' defined, the row will not be added to the form data object. If a row has a cleanup
 * function defined, the corresponding data value will be run through the cleanup function.
 *
 * Generic serialization functions can be set for a type using the AFrame.Schema.addDeserializer and
 * AFrame.Schema.addSerializer.  These are useful for doing conversions where the data persistence
 * layer saves data in a different format than the internal application representation.  A useful
 * example of this is ISO8601 date<->Javascript Date.  Already added types are 'number', 'integer',
 * and 'iso8601'.
 *
 * If a row in the schema config has the has_many field, the field is made into an array and the fixup/cleanup functions
 *	are called on each item in the array.  The default default item for these fields is an empty array.  If
 *	there is no data for the field in serializeItems, the field is left out of the output.
 *
 *
 *    // Schema defines four fields, two with validators
 *    var librarySchemaConfig = {
 *        name: { type: 'text', validate: {
 *                    minlength: 1,
 *                    maxlength: 75,
 *                    required: true
 *                } },
 *        version: { type: 'text', validate: {
 *                    minlength: 1,
 *                    required: true
 *               } },
 *        create_date: { type: 'iso8601' },
 *        downloads: { type: 'integer', fixup: downloadsFixup,
 *                         cleanup: downloadsCleanup }
 *    };
 *
 *    function downloadsFixup( options ) {
 *         var value = options.value;
 *         if( value < 0 ) {
 *              value = 0;
 *         }
 *         return value;
 *    };
 *
 *    function downloadsCleanup( options ) {
 *         var value = options.value;
 *         if( value < 0 ) {
 *              value = 0;
 *         }
 *         return value;
 *    };
 *
 *    // recommended to use AFrame.Schema to create schemas so
 *    // that duplicate schemas are not created for the same
 *    // configuration.
 *    var librarySchema = AFrame.Schema( librarySchemaConfig );
 *
 * @class AFrame.Schema
 * @constructor
 */

/**
 * The schema configuration to use for this schema
 * @config schema
 * @type {object}
 */
AFrame.Schema = (function() {
    "use strict";

    var SCHEMA_ID_KEY = '__SchemaID';

    var Schema = AFrame.AObject.extend( {
    	constructor: function( config ) {
			if( config ) {
				if( !config[ SCHEMA_ID_KEY ] ) {
					config[ SCHEMA_ID_KEY ] = AFrame.getUniqueID();
					Schema.addSchemaConfig( config[ SCHEMA_ID_KEY ], config );
				}

				return Schema.getSchema( config[ SCHEMA_ID_KEY ] );
			}
			else {
				Schema.sc.constructor.call( this );
			}
		},

        init: function( config ) {
            this.schema = config.schema;

            if( !config.schema ) {
                throw 'Schema.js: Schema requires a schema configuration object';
            }

            Schema.sc.init.call( this, config );
        },

        /**
         * Get an object with the default values specified.  Only returns values
         * of objects with a defined default.
         *
         *    // get the default values for all fields.
         *    var defaults = schema.getDefaults();
         *
         * @method getDefaults
         * @return {object} object with default values
         */
        getDefaults: function() {
            var defaultObject = {};

            this.forEach( function( schemaRow, key ) {
                defaultObject[ key ] = this.getDefaultValue( key );
            }, this );

            return defaultObject;
        },

        /**
        * Get the default value for a particular item
        *
        *    // get the default value for a particular item
        *    var value = schema.getDefaultValue( 'name' );
        *
        * @method getDefaultValue
        * @param {string} key - name of item to get default value for
        * @return {variant} default value if one is defined
        */
        getDefaultValue: function( key ) {
            var defValue = this.schema[ key ].def;
            if( AFrame.func( defValue ) ) {
                defValue = defValue();
            }
            else if( this.schema[ key ].has_many ) {
                defValue = [];
            }
            else if( Schema.getSchema( this.schema[ key ].type ) ) {
                defValue = {};
            }
            return defValue;
        },

        /**
         * Fix a data object for use in the application.  Creates a new object using the specified data
         * as a template for values.  If a value is not specified but a default value is specified in the
         * schema, the default value is used for that item.  Items are finally run through an optionally defined
         * fixup function.  If defined, the fixup function should return cleaned data.  If the fixup function
         * does not return data, the field will be undefined.
         *
         *     // dbData is data coming from the database, still needs to be deserialized.
         *     var appData = schema.getAppData( dbData );
         *
         * @method getAppData
         * @param {object} dataToFix
         * @return {object} fixedData
         */
        getAppData: function( dataToFix ) {
            var fixedData = {};

            this.forEach( function( schemaRow, key ) {
                var value = dataToFix[ key ];

                // no value, use default
                if( !AFrame.defined( value ) ) {
                    value = this.getDefaultValue( key );
                }

                if( schemaRow.has_many ) {
                    value && value.forEach && value.forEach( function( current, index ) {
                        value[ index ] = this.getAppDataValue( current, schemaRow, dataToFix, fixedData );
                    }, this );
                }
                else {
                    value = this.getAppDataValue( value, schemaRow, dataToFix, fixedData );
                }

                fixedData[ key ] = value;
            }, this );

            return fixedData;
        },

        getAppDataValue: function( value, schemaRow, dataToFix, fixedData ) {
            // If the object has a type and there is a schema for the type,
            //	fix up the value.  If there is no schema for the type, but the value
            //	is defined and there is a type converter fix function, convert the value.
            var schema = Schema.getSchema( schemaRow.type );
            if( schema ) {
                value = schema.getAppData( value );
            }
            else if( AFrame.defined( value ) ) {
                // call the generic type deserializer function
                var convert = Schema.deserializers[ schemaRow.type ];
                if( AFrame.func( convert ) ) {
                    value = convert( value );
                }
            }

            // apply the fixup function if defined.
            var fixup = schemaRow.fixup;
            if( AFrame.func( fixup ) ) {
                value = fixup( {
                    value: value,
                    data: dataToFix,
                    fixed: fixedData
                } );
            }

            return value;
        },

        /**
         * Get an object suitable to send to persistence.  This is based roughly on converting
         *	the data to a [FormData](https://developer.mozilla.org/en/XMLHttpRequest/FormData) "like" object - see [MDC](https://developer.mozilla.org/en/XMLHttpRequest/FormData)
         *	All items in the schema that do not have save parameter set to false and have values defined in dataToSerialize
         *	will have values returned.
         *
         *     // appData is data from the application ready to send to the DB, needs serialized.
         *     var serializedData = schema.serializeItems( appData );
         *
         * @method serializeItems
         * @param {object} dataToSerialize - data to clean up
         * @return {object} cleanedData
         */
        serializeItems: function( dataToSerialize ) {
            var cleanedData = {};

            this.forEach( function( schemaRow, key ) {
                if( schemaRow.save !== false ) {
                    var value = dataToSerialize[ key ];

                    if( schemaRow.has_many ) {
                        value && value.forEach && value.forEach( function( current, index ) {
                            value[ index ] = this.getSerializedValue( current, schemaRow, dataToSerialize, cleanedData );
                        }, this );
                    }
                    else {
                        value = this.getSerializedValue( value, schemaRow, dataToSerialize, cleanedData );
                    }

                    cleanedData[ key ] = value;
                }
            }, this );

            return cleanedData;
        },

        getSerializedValue: function( value, schemaRow, dataToSerialize, cleanedData ) {
            // apply the cleanup function if defined.
            var cleanup = schemaRow.cleanup;
            if( AFrame.defined( cleanup ) ) {
                value = cleanup( {
                    value: value,
                    data: dataToSerialize,
                    cleaned: cleanedData
                } );
            }

            if( AFrame.defined( value ) ) {
                var schema = Schema.getSchema( schemaRow.type );
                /*
                * first, check if there is a schema, if there is a schema let the schema
                *	take care of things.  If there is no schema but there is a value and
                *  a saveCleaner, run the value through the save cleaner.
                */
                if( schema ) {
                    value = schema.serializeItems( value );
                }
                else {
                    var convert = Schema.serializers[ schemaRow.type ];
                    if( AFrame.func( convert ) ) {
                        value = convert( value );
                    }
                }
            }

            return value;
        },


        /**
         * An iterator.  Iterates over every row in the schema.
         * The callback is called with the schema row and the key of the row.
         * @method forEach
         * @param {function} callback - callback to call.
         * @param {object} context (optional) context to call callback in
         */
        forEach: function( callback, context ) {
            for( var key in this.schema ) {
                if( key !== SCHEMA_ID_KEY ) {
                    var schemaRow = this.schema[ key ];
                    callback.call( context, schemaRow, key );
                }
            }
        },

        /**
        * Check to see if a row is labeled with "has many"
        * @method rowHasMany
        * @param {string} rowName
        * @return {boolean} true if row is marked as "has_many", false otw.
        */
        rowHasMany: function( rowName ) {
            return !!( this.schema[ rowName ] && this.schema[ rowName ].has_many );
        },

        /**
        * Validate a set of data against the schema
        *
        *    // validate, but ignore fields defined in the schema that are missing from data.
        *    var validity = schema.validate( data, true );
        *    // validity is true if all data is valid
        *    // validity is an an object with each field in data,
        *    // for each field there is an [AFrame.FieldValidityState](AFrame.FieldValidityState.html)
        *
        * @method validate
        * @param {object} data - data to validate
        * @param {boolean} ignoreMissing (optional) - if set to true, fields missing from data are not validated.  Defaults to false.
        *   Note, even if set to true, and a field in data has an undefined value, the field will be validated against the
        *   the undefined value.
        * @return {variant} true if all fields are valid, an object with each field in data, for each field there
        *   is an [AFrame.FieldValidityState](AFrame.FieldValidityState.html)
        */
        validate: function( data, ignoreMissing ) {
            var statii = {};
            var areErrors = false;

            this.forEach( function( row, key ) {
                var rowCriteria = row.validate || {};
                var criteriaCopy = AFrame.mixin( { type: row.type }, rowCriteria );
                var field = data[ key ];

                // Check hasOwnProperty so that if a field is defined in data, but has an undefined value,
                //  even if ignoreMissing is set to true, we validate against it.
                if( !ignoreMissing || data.hasOwnProperty( key ) ) {
                    var validityState = this.validateData( data[ key ], criteriaCopy );
                    // if the row is valid, then just give the row a true status
                    if( validityState.valid ) {
                        statii[ key ] = true;
                    }
                    else {
                        // the row is invalid, so save its validityState.
                        statii[ key ] = validityState;
                        areErrors = true;
                    }
                }
            }, this );

            return areErrors ? statii : true;
        },

        validateData: function( data, criteria ) {
            return AFrame.DataValidation.validate( {
                data: data,
                criteria: criteria
            } );
        }
    } );
    AFrame.mixin( Schema, {
        deserializers: {},
        serializers: {},
        schemaConfigs: {},
        schemaCache: {},

        /**
         * Add a universal function that fixes data in [getAppData](#method_getAppData). This is used to convert
         * data from a version the backend sends to one that is used internally.
         * @method Schema.addDeserializer
         * @param {string} type - type of field.
         * @param {function} callback - to call
         */
        addDeserializer: function( type, callback ) {
            Schema.deserializers[ type ] = callback;
        },

        /**
         * Add a universal function that gets data ready to save to persistence.  This is used
         * to convert data from an internal representation of a piece of data to a
         * representation the backend is expecting.
         * @method Schema.addSerializer
         * @param {string} type - type of field.
         * @param {function} callback - to call
         */
        addSerializer: function( type, callback ) {
            Schema.serializers[ type ] = callback;
        },

        /**
        * Add a schema config
        * @method Schema.addSchemaConfig
        * @param {id} type - identifier type
        * @param {SchemaConfig} config - the schema configuration
        */
        addSchemaConfig: function( type, config ) {
            Schema.schemaConfigs[ type ] = config;
        },

        /**
        * Get a schema
        * @method Schema.getSchema
        * @param {id} type - type of schema to get, a config must be registered for type.
        * @return {Schema}
        */
        getSchema: function( type ) {
            if( !Schema.schemaCache[ type ] && Schema.schemaConfigs[ type ] ) {
                Schema.schemaCache[ type ] = Schema.create( {
                    schema: Schema.schemaConfigs[ type ]
                } );
            }

            return Schema.schemaCache[ type ];
        }
    } );

    Schema.addDeserializer( 'number', function( value ) {
        return parseFloat( value );
    } );

    Schema.addDeserializer( 'integer', function( value ) {
        return parseInt( value, 10 );
    } );

    Schema.addDeserializer( 'iso8601', function( str ) {
        if( 'string' == typeof( str ) ) {
            try {
                // modified from http://delete.me.uk/2005/03/iso8601.html
                var regexp = "([0-9]{4})(-([0-9]{2})(-([0-9]{2})" +
                    "(T([0-9]{2}):([0-9]{2})(:([0-9]{2})(\.([0-9]+))?)?" +
                    "(Z|(([-+])([0-9]{2}):([0-9]{2})))?)?)?)?";
                var d = str.match( new RegExp( regexp ) );

                var offset = 0;
                var date = new Date( d[1], 0, 1 );

                if (d[3]) { date.setMonth( d[3] - 1 ); }
                if (d[5]) { date.setDate( d[5] ); }
                if (d[7]) { date.setHours( d[7] ); }
                if (d[8]) { date.setMinutes( d[8] ); }
                if (d[10]) { date.setSeconds( d[10] ); }
                if (d[12]) { date.setMilliseconds( Number( "0." + d[12] ) * 1000 ); }
                if (d[14]) {
                    offset = (Number( d[16]) * 60 ) + Number( d[17] );
                    offset *= ( ( d[15] == '-' ) ? 1 : -1 );
                }

                offset -= date.getTimezoneOffset();
                var time = ( Number( date ) + ( offset * 60 * 1000 ) );
                date.setTime( Number( time ) );
                return date;
            }
            catch( e ) {}
        }
        else if( str instanceof Date ) {
            return str;
        }
    } );

    Schema.addSerializer( 'iso8601', function( date ) {
        return date.toISOString();
    } );

    return Schema;

}() );
/**
* Performs dataToValidate validation, attempts to follow the [HTML5 spec](http://www.whatwg.org/specs/web-apps/current-work/multipage/association-of-controls-and-forms.html#the-constraint-validation-api).
*
*    var criteria = {
*        min: 10,
*        type: 'number'
*    };
*
*    var fieldValidityState = AFrame.DataValidation.validate( {
*        data: 1,
*        criteria: criteria
*    } );
*    // fieldValidityState.valid is false
*    // fieldValidityState.rangeUnderflow is true
*
*    fieldValidityState = AFrame.DataValidation.validate( {
*        data: 10,
*        criteria: criteria
*    } );
*    // fieldValidityState.valid is true
*    // fieldValidityState.rangeUnderflow is false
*
*
*    // Add a custom validator
*
*    AFrame.DataValidation.setValidator( 'specializednumber', 'min', function( dataToValidate,
*           fieldValidityState, thisCriteria, allCriteria ) {
*       // Do validation here.  If there is a problem, set the error on fieldValidityState
*       var valid = // code to do validation
*       if( !valid ) {
*           fieldValidationState.setCustomValidity( 'rangeUnderflow' );
*       }
*    } );
*
*    var criteria = {
*         min: 1234
*         type: 'specializednumber'
*    };
*
*    var fieldValidityState = AFrame.DataValidation.validate( {
*        data: 1,
*        criteria: criteria
*    } );
*
*
* @class AFrame.DataValidation
* @static
*/
AFrame.DataValidation = ( function() {
    "use strict";

    var defined = AFrame.defined;
    var validationFuncs = {};
    var jsTypes = {
        text: 'string',
        number: 'number',
        integer: 'number'
    };

    var Validation = {

        /**
        * validate the dataToValidate using the given criteria.
        *
        *    var criteria = {
        *        min: 10,
        *        type: 'number'
        *    };
        *
        *    var fieldValidityState = AFrame.DataValidation.validate( {
        *        data: 1,
        *        criteria: criteria
        *    } );
        *    // fieldValidityState.valid is false
        *    // fieldValidityState.rangeUnderflow is true
        *
        *    fieldValidityState = AFrame.DataValidation.validate( {
        *        data: 10,
        *        criteria: criteria
        *    } );
        *    // fieldValidityState.valid is true
        *    // fieldValidityState.rangeUnderflow is false
        *
        * @method validate
        * @param {variant} options.data - dataToValidate to validate
        * @param {object} options.criteria - the criteria to validate against
        * @param {FieldValidityState} options.fieldValidityState (optional) -
        *  field validity state to use, one is created if not given
        * @return {FieldValidityState} [FieldValidityState](AFrame.FieldValidityState.html) for the dataToValidate.
        */
        validate: function( options ) {
            var dataToValidate = options.data;
            var allCriteria = options.criteria;
            var fieldValidityState = options.fieldValidityState || AFrame.FieldValidityState.create();
            var type = allCriteria.type || 'text';

            for( var key in allCriteria ) {
                this.validateDataForTypeCriteria( dataToValidate, type, key, fieldValidityState, allCriteria );
                this.validateDataForTypeCriteria( dataToValidate, 'all', key, fieldValidityState, allCriteria );
            }

            return fieldValidityState;
        },

        validateDataForTypeCriteria: function( dataToValidate, type, currCriteriaName, fieldValidityState, allCriteria ) {
            var validators = validationFuncs[ type ] || {};
            var validator = validators[ currCriteriaName ];
            if( validator ) {
                validator( dataToValidate, fieldValidityState, allCriteria[ currCriteriaName ], allCriteria );
            }
        },

        /**
        * Set a validator to be used for a certain type
        *
        *    AFrame.DataValidation.setValidator( 'specializednumber', 'min', function( dataToValidate,
        *           fieldValidityState, thisCriteria, allCriteria ) {
        *       // Do validation here.  If there is a problem, set the error on fieldValidityState
        *       var valid = // code to do validation
        *       if( !valid ) {
        *           fieldValidationState.setError( 'rangeUnderflow' );
        *       }
        *    } );
        *
        *    var criteria = {
        *         min: 'criteria',
        *         type: 'specializednumber'
        *    };
        *
        *    var fieldValidityState = AFrame.DataValidation.validate( {
        *        data: 1,
        *        criteria: criteria
        *    } );
        *
        * @method setValidator
        * @param {string} type - type of data to set validator for
        * @param {string} criteria - name of criteria to set validator for
        * @param {function} validator - the validator to use
        */
        setValidator: function( type, criteria, validator ) {
            validationFuncs[ type ] = validationFuncs[ type ] || {};
            validationFuncs[ type ][ criteria ] = validator;
        }
    };

    Validation.setValidator( 'all', 'required', function( dataToValidate, fieldValidityState ) {
        if( !defined( dataToValidate ) ) {
            fieldValidityState.setError( 'valueMissing' );
        }
    } );

    Validation.setValidator( 'all', 'type', function( dataToValidate, fieldValidityState, type ) {
        if( defined( dataToValidate ) ) {
            var jsType = jsTypes[ type ];

            if( jsType && jsType != typeof( dataToValidate ) ) {
                fieldValidityState.setError( 'typeMismatch' );
            }
        }
    } );

    Validation.setValidator( 'integer', 'type', function( dataToValidate, fieldValidityState, type ) {
		if( defined( dataToValidate ) ) {
			if( parseInt( dataToValidate, 10 ) !== dataToValidate ) {
				fieldValidityState.setError( 'typeMismatch' );
			}
		}
    } );

    var numberMinValidation = function( dataToValidate, fieldValidityState, min ) {
        if( defined( dataToValidate ) && ( dataToValidate < min ) ) {
            fieldValidityState.setError( 'rangeUnderflow' );
        }
    };

    Validation.setValidator( 'number', 'min', numberMinValidation );
    Validation.setValidator( 'integer', 'min', numberMinValidation );

    var numberMaxValidation = function( dataToValidate, fieldValidityState, max ) {
        if( defined( dataToValidate ) && ( dataToValidate > max ) ) {
            fieldValidityState.setError( 'rangeOverflow' );
        }
    };
    Validation.setValidator( 'number', 'max', numberMaxValidation );
    Validation.setValidator( 'integer', 'max', numberMaxValidation );

    var numberStepValidation = function( dataToValidate, fieldValidityState, step, allCriteria ) {
        if( defined( dataToValidate ) ) {
            var min = allCriteria.min || 0;
            var valid = 0 === ( ( dataToValidate - min ) % step );
            if( !valid ) {
                fieldValidityState.setError( 'stepMismatch' );
            }
        }
    };

    Validation.setValidator( 'number', 'step', numberStepValidation );
    Validation.setValidator( 'integer', 'step', numberStepValidation );

    Validation.setValidator( 'text', 'required', function( dataToValidate, fieldValidityState ) {
        if( !dataToValidate ) {
            fieldValidityState.setError( 'valueMissing' );
        }
    } );

    Validation.setValidator( 'text', 'maxlength', function( dataToValidate, fieldValidityState, maxLength ) {
        if( defined( dataToValidate ) && dataToValidate.length && dataToValidate.length > maxLength ) {
            fieldValidityState.setError( 'tooLong' );
        }
    } );

    Validation.setValidator( 'text', 'pattern', function( dataToValidate, fieldValidityState, pattern ) {
        var regexp = new RegExp( pattern );
        if( defined( dataToValidate ) && !regexp.test( dataToValidate ) ) {
            fieldValidityState.setError( 'patternMismatch' );
        }
    } );


    return Validation;

})();
/**
* A Model is a DataContainer that is associated with a Schema.  If no initial data is given,
*   default values will be retreived from the schema.  When doing a set, only data that validates
*   will be set.  If data to set is invalid, set will return a [FieldValidityState](AFrame.FieldValidityState.html).
*
*    // create the schema config
*    var noteSchemaConfig = {
*        id: { type: 'integer' },
*        title: { type: 'text', def: 'Note Title' },
*        contents: { type: 'text' },
*        date: { type: 'iso8601' },
*        edit_date: { type: 'iso8601' }
*    };
*
*    // Create A Model Class
*    var ModelClass = AFrame.Model.extend( {
*        schema: noteSchemaConfig
*    } );
*
*    // Create an instance of ModelClass
*    var model = ModelClass.create( {
*        data: {
*           id: '1',
*           title: 'Get some milk',
*           contents: 'Go to the supermarket and grab some milk.',
*           date: '2010-12-10T18:09Z',
*           edit_date: '2010-12-10T18:23Z'
*           extra_field: 'this field does not get through'
*        }
*    } );
*
*    // update a field.  prevVal will be 'Get some milk'
*    var prevVal = model.set( 'title', 'Get some milk and eggs' );
*
*    // This is setting the date in error, the prevVal will have a
*    // FieldValidityState with its typeMismatch field set to true.
*    // This will NOT actually set the value.
*    prevVal = model.set( 'edit_date', '1' );
*
*    // Check the overall model for validity.  Returns true if all valid, an
*    // object of FieldValidityStates otherwise
*    var isValid = model.checkValidity();
*
* Manual creation of a Model
*========
*
* It is also possible to create a model instance by creating an instance of
* AFrame.Model and associating it with a schemaConfig.
*
*    // Manually create a model
*    var model = AFrame.Model.create( {
*        schema: noteSchemaConfig,
*        data: {
*            // data here
*        }
*    } );
*
* @class AFrame.Model
* @extends AFrame.DataContainer
* @constructor
*/
/**
* The schema to use for the model.  Can be either a Schema or a schema configuration object.
* @config schema
* @type {AFrame.Schema || object}
*/
/**
* Initial data to use for the model.  Note, initial data is not validated in any way.  If
*   data is not given, data is taken out of the schema's default values.
* @config data
* @type {object}
*/
AFrame.Model = ( function() {
    "use strict";

    var Model = AFrame.DataContainer.extend( {
        init: function( config ) {
            this.schema = getSchema( this.schema || config.schema );

            config.data = getInitialData( this.schema, config.data );

            Model.sc.init.call( this, config );
        },

	    /**
	    * Set an item of data.  Model will only be updated if data validates or force is set to true.  If data validates, the previous
	    * value will be returned.  If data does not validate, a [FieldValidityState](AFrame.FieldValidityState.html)
	    * will be returned.
        *
        *    // update single item
        *    var retval = model.set( 'name', 'Shane Tomlinson' );
        *    if( retval !== true ) {
        *        // something went wrong
        *    }
        *
        *    // bulk update.  retVals will have a true/FieldValidityState for
        *    // each item being set.
        *    var retVals = model.set( {
        *        name: 'Shane Tomlinson',
        *        employer: 'AFrame Foundary'
        *    } );
        *
	    * @method set
	    * @param {string} fieldName name of field
	    * @param {variant} fieldValue value of field
	    * @param {boolean} force force update
	    * @return {variant} previous value of field if correctly set, a
	    *   [FieldValidityState](AFrame.FieldValidityState.html) otherwise
	    */
        set: function( fieldName, fieldValue, force ) {
        	if( 'object' === typeof( fieldName ) ) {
				var prevVals = {};
        		for( var key in fieldName ) {
        			// fieldValue becomes the "force" field in this case
					prevVals[ key ] = this.set( key, fieldName[ key ], fieldValue );
        		}
        		return prevVals;
        	}

        	var fieldValidity = this.checkValidity( fieldName, fieldValue );

            if( true === fieldValidity || force ) {
                var prevVal = Model.sc.set.call( this, fieldName, fieldValue );
                if( !force ) {
                    fieldValidity = prevVal;
                }
            }

            return fieldValidity;
        },

        /**
        * Check the validity of the potential value of a field
        *
        *
        *    var retval = model.checkValidity( 'name', 'Shane Tomlinson' );
        *    if( retval !== true ) {
        *        // something went wrong, value would be invalid.
        *    }
        *
        * @method checkValidity
	    * @param {string} fieldName name of field
	    * @param {variant} fieldValue potential value of field
	    * @return {variant} true if field would be valid, a
	    *   [FieldValidityState](AFrame.FieldValidityState.html) otherwise
        */
        checkValidity: function( fieldName, fieldValue ) {
            var data = {};
            data[ fieldName ] = fieldValue;

            var fieldValidity = this.schema.validate( data, true );

            if( fieldValidity !== true ) {
                fieldValidity = fieldValidity[ fieldName ];
            }

            return fieldValidity;
        },

        /**
        * Get an object suitable to send to persistence.  This is based roughly on converting
        *	the data to a [FormData](https://developer.mozilla.org/en/XMLHttpRequest/FormData) "like" object - see [MDC](https://developer.mozilla.org/en/XMLHttpRequest/FormData)
        *	All items in the schema that do not have save parameter set to false and have values defined in dataToSerialize
        *	will have values returned.
        *
        *     // Get an object suitable to send to persistence.
        *     var serializedData = model.serializeItems();
        *
        * @method serializeItems
        * @return {object}
        */
        serializeItems: function() {
            var dataObject = this.getDataObject();
            return this.schema.serializeItems( dataObject );
        }
    } );

    return Model;

    function getSchema( candidate ) {
        var schema = candidate instanceof AFrame.Schema ? candidate :
            AFrame.Schema( candidate );

        return schema;
    }

    function getInitialData( schema, initialData ) {
        if( !initialData ) {
            initialData = schema.getDefaults();
        }

        // use the initialData structure to store deserialized data
        //  so that we do not have two copies of the data running around.
        var deserialized = schema.getAppData( initialData );
        for( var key in deserialized ) {
            initialData[ key ] = deserialized[ key ];
        }

        return initialData;
    }


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
* An object that keeps track of a field's validity, mirrors the
* [HTML5](http://www.whatwg.org/specs/web-apps/current-work/multipage/association-of-controls-and-forms.html#the-constraint-validation-api) spec.
*
* @class AFrame.FieldValidityState
* @constructor
*/
AFrame.FieldValidityState = function( config ) {
	if( config ) {
		AFrame.mixin( this, config );
	}
};
/**
* Get an instance of the FieldValidityState object
* @method AFrame.FieldValidityState.create
* @param {object} config - object with a list of fields to set on the validity object
* @returns {AFrame.FieldValidityState}
*/
AFrame.FieldValidityState.create = function( config ) {
	return new AFrame.FieldValidityState( config || {} );
};
AFrame.FieldValidityState.prototype = {
	/**
	* True if the element has no value but is a required field; false otherwise.
	* @property valueMissing
	* @type {boolean}
	*/
	valueMissing: false,
	/**
	* True if the element's value is not in the correct syntax; false otherwise.
	* @property typeMismatch
	* @type {boolean}
	*/
	typeMismatch: false,
	/**
	* True if the element's value doesn't match the provided pattern; false otherwise.
	* @property patternMismatch
	* @type {boolean}
	*/
	patternMismatch: false,
	/**
	* True if the element's value is longer than the provided maximum length; false otherwise.
	* @property tooLong
	* @type {boolean}
	*/
	tooLong: false,
	/**
	* True if the element's value is lower than the provided minimum; false otherwise.
	* @property rangeUnderflow
	* @type {boolean}
	*/
	rangeUnderflow: false,
	/**
	* True if the element's value is higher than the provided maximum; false otherwise.
	* @property rangeOverflow
	* @type {boolean}
	*/
	rangeOverflow: false,
	/**
	* True if the element's value doesn't fit the rules given by the step attribute; false otherwise.
	* @property stepMismatch
	* @type {boolean}
	*/
	stepMismatch: false,
	/**
	* True if the element has a custom error; false otherwise.
	* @property customError
	* @type {boolean}
	*/
	customError: false,
	/**
	* True if the element's value has no validity problems; false otherwise.
	* @property valid
	* @type {boolean}
	*/
	valid: true,
	/**
	* The error message that would be shown to the user if the element was to be checked for validity.
	* @property validationMessage
	* @type {string}
	*/
	validationMessage: '',

	/**
	* Set an error on the state
	* @method setError
	* @param {string} errorType - type of error
	*/
	setError: function( errorType ) {
		this[ errorType ] = true;
		this.valid = false;
	},

	/**
	* Set the custom error message
	* @method setCustomValidity
	* @param {string} customError - the error message
	*/
	setCustomValidity: function( customError ) {
		if( customError ) {
			this.valid = false;
			this.customError = true;
			this.validationMessage = customError;
		}
	}
};
