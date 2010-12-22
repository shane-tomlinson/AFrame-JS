/**
* Note, this class does not really exist!  It is a placeholder for extensions to system prototypes like Function, Array, Date.  
* @class SystemExtensions
*/

/**
 * The main AFrame module.  All AFrame related items are under this.
 * @module AFrame
*/

if( !Function.prototype.bind ) {
	Function.prototype.bind = function( context ) {
		var callback = this;
		return function() {
			return callback.apply( context, arguments );
		};
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

if( !window.console ) {
	window.console = function() {	// do a whole lotta nothin 
	};
}

/**
 * The AFrame base namespace.  Provides some useful utility functions.  The most commonly used functions are [extend](#method_extend) and [construct](#method_construct).
 *
 *
 * @class AFrame
 * @static
*/
var AFrame = {
	/**
	* Used to extend a class with another class and optional functions.
    *
    *    AFrame.NewClass = function() {
    *        AFrame.NewClass.superclass.constructor.apply( this, arguments );
    *    }
    *    AFrame.extend( AFrame.NewClass, AFrame.AObject, {
    *        someFunc: function() { 
    *            // do something here
    *        }
    *    } );
    *
	* @method extend
	* @param {function} derived - class to extend
	* @param {function} superclass - class to extend with.
	* @param {object} extrafuncs (optional) - all additional parameters will have their functions mixed in.
	*/
	extend: function( derived, superclass ) {
		var F = function() {};
		F.prototype = superclass.prototype;
		derived.prototype = new F();
		derived.prototype.constuctor = derived;
		derived.superclass = superclass.prototype;

		var mixins = Array.prototype.slice.call( arguments, 2 );
		for( var mixin, index = 0; mixin = mixins[ index ]; ++index ) {
			AFrame.mixin( derived.prototype, mixin );
		}
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
		toExtend = jQuery.extend( toExtend, mixin );
	},


	/**
	* Construct an AObject based object.  When using the construct function, any Plugins are automatically created and bound,
    *   and init is called on the created object.
    *
    *    var newObj = construct( {
    *       type: AFrame.SomeObject,
    *       config: {
    *           param1: val1
    *       },
    *       plugins: [ {
    *         type: AFrame.SomePlugin
    *       } ]
    *    } );
    *
    * @method construct
	* @param {object} obj_config - configuration.
	* @param {function} obj_config.type - Function to use as the constructor
	* @param {object} obj_config.config - configuration to pass to object's init function
	* @param {array} obj_config.plugins - Array of AFrame.Plugin to attach to object.
	* @return {object} - created object.
	*/
	construct: function( obj_config ) {
		var constuct = obj_config.type;
		var config = obj_config.config || {};
		var plugins = obj_config.plugins || [];
		var retval;

		if( constuct ) {
			try {
				retval = new constuct();
			} catch ( e ) {
				console.log( e.toString() );
			}

			for( var index = 0, plugin; plugin = plugins[ index ]; ++index ) {
				var pluginObj = AFrame.construct( plugin );

				pluginObj.setPlugged( retval );
			}

			retval.init( config );
		}
		else {
			throw 'Class does not exist.';
		}

		return retval;
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
	}
};
/**
 * An Observable is the way events are done.  Observables are very similar to DOM Events in that 
 * each object has a set of events that it can trigger.  Objects that are concerned with a particular event register a callback to be
 * called whenever the event is triggered.  Observables allow for each event to have zero or many listeners, meaning the developer does not have
 * to manually keep track of who to notify when a particular event happens.  This completely decouples the triggering object from any
 * objects that care about it.
 * 
 * @class AFrame.Observable
 */
AFrame.Observable = function() {
};
/**
 * Get an instance of the observable
 *
 *    var observable = AFrame.Observable.getInstance();
 *    var id = observable.bind( this.onInit, this );
 
 * @method AFrame.Observable.getInstance
 * @return {AFrame.Observable}
 */
AFrame.Observable.getInstance = function() {
    return AFrame.construct( {
	type: AFrame.Observable
    } );
};
AFrame.Observable.prototype = {
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
};/**
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
	 * Bind a callback to an event.
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
				var args = Array.prototype.slice.call( arguments, 0 );
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
};/**
 * The base object of nearly everything.  It is recommended to create all new classes as a subclass
 * of AObject since it provides general functionality such as event binding and teardown housekeeping.
 * All AObjects in the system have a cid, a cid is a unique identifier within the application.  
 * If an AObject creates and is responsible for maintaining other AObjects, [addChild](#method_addChild) 
 * should be called with the created children.  When this object is torn down, the child object added via addChild will 
 * have its teardown function called as well.  This can ensure that all memory is freed and that
 * no references are kept when the object's lifespan has ended.
 *
 * Events
 *=========
 *
 * All AFrame.AObject based classes have a built in event mechanism.  Events are dynamically created, there is
 *  no need to explicitly create an event, all that is needed is to call either
 *  triggerEvent or bindEvent.
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

 * @class AFrame.AObject
 * @uses AFrame.ObservablesMixin
 */
/**
 * cid for the object, if not given, a unique id is assigned
 * @config {cid} cid
 */
AFrame.AObject = function() {};
AFrame.mixin( AFrame.AObject.prototype, {
	constructor: AFrame.AObject,
	/**
	 * Initialize the object.  Note that if [AFrame.construct](AFrame.html#method_construct) is used, this will be called automatically.
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
	    
	    this.bindEvents();
	    
	    /**
	     * Triggered when the object is initialized
	     * @event onInit
         * @param {AFrame.AObject} aobject - the aobject being initialized.
	     */
	     this.triggerEvent( 'onInit', this );
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
         * @param {AFrame.AObject} aobject - the aobject being torn down.
	     */
	    this.triggerEvent( 'onTeardown', this );

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
	 * @param {AFrame.AObject} child - child object
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
	}
} );

AFrame.mixin( AFrame.AObject.prototype, AFrame.ObservablesMixin );/**
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
* @constructor
* @param {object || AFrame.DataContainer} data (optional) If given, creates a new AFrame.DataContainer for the data.  
*   If already an AFrame.DataContainer, returns self, if the data already has an AFrame.DataContainer associated with 
*	it, then the original AFrame.DataContainer is used.
*/
AFrame.DataContainer = function( data ) {
	if( data instanceof AFrame.DataContainer ) {
		return data;
	}
	else if( data ) {
		var dataContainer = data.__dataContainer;
		if( !dataContainer ) {
			dataContainer = AFrame.construct( {
				type: AFrame.DataContainer,
				config: {
					data: data
				}
			} );
		}
		return dataContainer;
	}
	AFrame.DataContainer.superclass.constructor.apply( this, arguments );

};


AFrame.extend( AFrame.DataContainer, AFrame.AObject, {
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
		
		/*if( this.data.__dataContainer ) {
			throw Error( 'Cannot create a second AFrame.DataContainer for an object' );
		}
		*/
		this.data.__dataContainer = this;
		this.fieldBindings = {};
		
		AFrame.DataContainer.superclass.init.apply( this, arguments );
	},
	
	/**
	* Set an item of data.  
    *
    *    dataContainer.set( 'name', 'Shane Tomlinson' );
    *
	* @method set
	* @param {string} fieldName name of field
	* @param {variant} fieldValue value of field
	* @return {variant} previous value of field
	*/
	set: function( fieldName, fieldValue ) {
		var oldValue = this.data[ fieldName ];
		this.data[ fieldName ] = fieldValue;
		
		var fieldNotificationObject = this.getFieldNotificationObject( fieldName, fieldValue, oldValue );
		/**
		* Triggered whenever any item on the object is set.
		* @event onSet
		* @param {object} fieldNotificationObject - an event object. @see getFieldNotificationObject
		*/
		this.triggerEvent( 'onSet', fieldNotificationObject );
		/**
		* Triggered whenever an item on the object is set.  This is useful to bind
		*	to whenever a particular field is being changed.
		* @event onSet-fieldName
		* @param {object} fieldNotificationObject - an event object.  @see getFieldNotificationObject
		*/
		this.triggerEvent( 'onSet-' + fieldName, fieldNotificationObject );
		
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
	* Bind a callback to a field.  Function is called once on initialization as well as any time the field changes.  
    *   When function is called, it is called with an FieldNotificationObject.
    *
    *    var onChange = function( fieldNotificationObject ) {
    *        console.log( 'Name: "' + fieldNotificationObject.fieldName + '" + value: "' + fieldNotificationObject.value + '" oldValue: "' + fieldNotificationObject.oldValue + '"' );
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
		var fieldNotificationObject = this.getFieldNotificationObject( fieldName, this.get( fieldName ), undefined );
		callback.call( context, fieldNotificationObject );
		
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
	* Get an object used when notifying listeners of changes to the field.
    * A FieldNotificationObject has four fields:
    * 
    * 1. container
    * 2. fieldName
    * 3. oldValue
    * 4. value
    *
	* @param {string} fieldName - name of field affected.
	* @param {variant} value - the current value of the field.
	* @param {variant} oldValue - the previous value of the field (only applicable if data has changed).
	* @return {object} an object with 4 fields, container, fieldName, oldValue, value
	*/
	getFieldNotificationObject: function( fieldName, value, oldValue ) {
		return {
			container: this,
			fieldName: fieldName,
			oldValue: oldValue,
			value: value
		};
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
} );
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
AFrame.Plugin = function() {
	AFrame.Plugin.superclass.constructor.apply( this, arguments );
};
AFrame.extend( AFrame.Plugin, AFrame.AObject, {
	/**
	* Set the reference to the plugged object.  Subclasses can override this function to bind event
	*	listeners to the plugged object, especially onInit.  Binding to onInit allows the plugin to
	*	do setup as soon as the plugged object is ready.  If a subclass overrides this function,
	*	the base setPlugged must still be called.
	* @method setPlugged
	* @param {AFrame.AObject} plugged - the plugged object
	*/
	setPlugged: function( plugged ) {
		this.plugged = plugged;
		
		this.plugged.bindEvent( 'onTeardown', this.teardown, this );
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
		AFrame.Plugin.superclass.teardown.apply( this, arguments );
	}
} );/**
* Common functions to all arrays
* @class AFrame.ArrayCommonFuncsMixin
* @static
*/
AFrame.ArrayCommonFuncsMixin = {
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

		if( index < 0 ) {
			index = len + index;
		}

		index = Math.min( len - 1, index );
		index = Math.max( 0, index );
		
		return index;
	}
};/**
* A hash collection.  Items stored in the hash can be accessed/removed by a key.  The item's key
* is first searched for on the item's cid field, if the item has no cid field, a cid will be assigned
* to it.  The CID used is returned from the insert function.
*
* CollectionHash is different from a [CollectionArray](AFrame.CollectionArray.html) which is accessed
* by index.
*
*    Create the hash
*    var collection = AFrame.construct( {
*       type: AFrame.CollectionHash
*    } );
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
* @constructor
*/
AFrame.CollectionHash = function() {
	AFrame.CollectionHash.superclass.constructor.apply( this, arguments );
};
AFrame.CollectionHash.currID = 0;
AFrame.extend( AFrame.CollectionHash, AFrame.AObject, {
	init: function( config ) {
		this.hash = {};
		
		AFrame.CollectionHash.superclass.init.apply( this, arguments );
	},
	
	teardown: function() {
		for( var cid in this.hash ) {
			AFrame.remove( this.hash, cid );
		}
		AFrame.remove( this, 'hash' );
		
		AFrame.CollectionHash.superclass.teardown.apply( this, arguments );
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
	* @method remove
	* @param {id} cid - cid of item to remove
	* @return {variant} item if it exists, undefined otw.
	*/
	remove: function( cid ) {
		var item = this.get( cid );
		
		if( item ) {
			var data = this.getEventData( item, { cid: cid } );
			
			/**
			* Triggered before remove happens.
			* @event onBeforeRemove
			* @param {object} data - data field passed.
			* @param {Collection} data.collection - collection causing event.
			* @param {variant} data.item - item removed
			*/
			this.triggerEvent( 'onBeforeRemove', data );
			AFrame.remove( this.hash, cid );
			/**
			* Triggered after remove happens.
			* @event onRemove
			* @param {object} data - data has two fields, item and meta.
			* @param {Collection} data.collection - collection causing event.
			* @param {variant} data.item - item removed
			*/
			this.triggerEvent( 'onRemove', data );
		}
		
		return item;
	},
	
	/**
	* Insert an item into the hash.  CID is gotten first from the item's cid field.  If this doesn't exist,
	* it is then assigned.  Items with duplicate cids are not allowed, this will cause a 'duplicate cid' 
    * exception to be thrown.  If the item being inserted is an Object and does not already have a cid, the
    * item's cid will be placed on the object under the cid field.
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
	* @return {id} cid of the item.
	*/
	insert: function( item ) {
		var cid = item.cid || AFrame.getUniqueID();

		if( 'undefined' != typeof( this.get( cid ) ) ) {
			throw 'duplicate cid';
		}
        
        // store the CID on the item.
        if( item instanceof Object ) {
            item.cid = cid;
        }
		
		var data = this.getEventData( item, { cid: cid } );
		
		/**
		 * Triggered before insertion happens.
		 * @event onBeforeInsert
		 * @param {object} data - data has two fields.
         * @param {Collection} data.collection - collection causing event.
         * @param {variant} data.item - item inserted
		 */
		this.triggerEvent( 'onBeforeInsert', data );
		this.hash[ cid ] = item;
		
		/**
		 * Triggered after insertion happens.
		 * @event onInsert
		 * @param {object} data - data has two fields, item and meta.
         * @param {Collection} data.collection - collection causing event.
         * @param {variant} data.item - item inserted
		 */
		this.triggerEvent( 'onInsert', data );
		
		return cid;
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
		
		for( var cid in this.hash ) {
			count++;
		}
		
		return count;
	},
	
	/**
	* @private
	*/
	getEventData: function( item, data ) {
		data = data || {};
        
        data = jQuery.extend( data, {
            collection: this,
            item: item
        } );
		
		return data;
	}
} );/**
* An array collection.  Unlike the [CollectionHash](AFrame.CollectionHash.html), the CollectionArray can be accessed via 
* either a key or an index.  When accessed via a key, the item's CID will be used.  If an item has a cid field when
* inserted, this cid will be used, otherwise a cid will be assigned.
* 
* This raises the same events as AFrame.CollectionHash, but every event will have one additional parameter, index.
*
*    Create the array
*    var collection = AFrame.construct( {
*       type: AFrame.CollectionArray
*    } );
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
AFrame.CollectionArray = function() {
	AFrame.CollectionArray.superclass.constructor.apply( this, arguments );
};
AFrame.extend( AFrame.CollectionArray, AFrame.CollectionHash, AFrame.ArrayCommonFuncsMixin, {
	init: function() {
		this.itemCIDs = [];

		AFrame.CollectionArray.superclass.init.apply( this, arguments );
	},
	
	teardown: function() {
		this.itemCIDs.forEach( function( id, index ) {
			this.itemCIDs[ index ] = null;
		}, this );
		AFrame.remove( this, 'itemCIDs' );
		
		AFrame.CollectionArray.superclass.teardown.apply( this, arguments );
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
		index = 'number' == typeof( index ) ? index : -1;
		this.currentIndex = this.getActualInsertIndex( index );
        
		var cid = AFrame.CollectionArray.superclass.insert.call( this, item );
		this.itemCIDs.splice( this.currentIndex, 0, cid );
		
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
			retval = AFrame.CollectionArray.superclass.get.call( this, cid );
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
			retval = AFrame.CollectionArray.superclass.remove.call( this, cid );
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
        AFrame.CollectionArray.superclass.clear.call( this );
		
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
	getEventData: function( item, data ) {
        data = data || {};
        
        data = jQuery.extend( data, {
            index: this.currentIndex
        } );

		return AFrame.CollectionArray.superclass.getEventData.call( this, item, data );
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
	}
} );/**
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
} );/**
 * A generic HTML list class.  A list is any list of data.  A List shares
 *  the majority of its interface with a <a href="docs/AFrame.CollectionArray.html">CollectionArray</a> 
 *  since lists are inherently ordered (even if they are ULs).  There are two methods
 *  for inserting an item into the list, either passing an already created
 *  element to [insertElement](#method_insertElement) or by passing data to [insert](#method_insert). 
 *  If using insert, a factory function (listElementFactory) must be specified in the configuration.
 *  The factory function can either create an element directly or use some sort of prototyping system
 *  to create the element.  The factory function must return the element to be inserted.
 *
 * 
 *    <ul id="clientList">
 *    </ul>
 *   
 *    ---------
 *    // Set up a factory to create list elements.  This can create the elements 
 *    // directly or use sort of templating system.
 *    var factory = function( index, data ) {
 *       var listItem = $( '<li>' + data.name + ', ' + data.employer + '</li>' );
 *       return listItem;
 *    };
 *   
 *    var list = AFrame.construct( {
 *       type: AFrame.List,
 *       config: {
 *           target: '#clientList',
 *           listElementFactory: factory
 *       }
 *    } );
 *   
 *    // Creates a list item using the factory function, item is inserted
*     // at the end of the list
 *    list.insert( {
 *       name: 'Shane Tomlinson',
 *       employer: 'AFrame Foundary'
 *    } );
 *   
 *    // Inserts a pre-made list item at the head of the list
 *    list.insertRow( $( '<li>Joe Smith, the Coffee Shop</li>' ), 0 );
 *    ---------
 *
 *    <ul id="clientList">
 *       <li>Joe Smith, The Coffee Shop</li>
 *       <li>Shane Tomlinson, AFrame Foundary</li>
 *    </ul>
 *
 * @class AFrame.List
 * @extends AFrame.Display
 * @uses AFrame.ArrayCommonFuncsMixin
 * @constructor
 */
/**
 * A function to call to create a list element.  function will be called with two parameters, an data and index.  
 *  If not specified, then the internal factory that returns an empty LI element will be used.  See 
 *  [listElementFactory](#method_listElementFactory).
 * @config listElementFactory
 * @type {function} (optional)
 * @default this.listElementFactory
 */
AFrame.List = function() {
	AFrame.List.superclass.constructor.apply( this, arguments );
};
AFrame.extend( AFrame.List, AFrame.Display, AFrame.ArrayCommonFuncsMixin, {
	init: function( config ) {
        if( config.listElementFactory ) {
            this.listElementFactory = config.listElementFactory;
        }
		
		AFrame.List.superclass.init.apply( this, arguments );
	},

	/**
	 * Clear the list
	 * @method clear
	 */
	clear: function() {
		this.getTarget().html( '' );
	},
    
    /**
    * The factory used to create list elements.
    *
    *    // overriden listElementFactory
    *    listElementFactory: function( index, data ) {
    *       var listItem = $( '<li>' + data.name + ', ' + data.employer + '</li>' );
    *       return listItem;
    *    }
    *
    * @method listElementFactory
    * @param {object} data - data used on insert
    * @param {number} index - index where item should be inserted
    * @return {Element} element to insert
    */
    listElementFactory: function() {
        return $( '<li />' );
    },
	
	/**
	 * Insert a data item into the list, the list item is created 
     *  using the listElementFactory.
     *
     *   
     *    // Creates a list item using the factory function, 
     *    // item is inserted at the end of the list.
     *    list.insert( {
     *       name: 'Shane Tomlinson',
     *       employer: 'AFrame Foundary'
     *    } );
     *   
     *   
     *    // Item is inserted at index 0, the first item in the list.
     *    list.insert( {
     *       name: 'Shane Tomlinson',
     *       employer: 'AFrame Foundary'
     *    }, 0 );
     *   
     *    // Item is inserted at the end of the list
     *    list.insert( {
     *       name: 'Shane Tomlinson',
     *       employer: 'AFrame Foundary'
     *    }, -1 );
     *   
     *    // Item is inserted two from the end
     *    list.insert( {
     *       name: 'Shane Tomlinson',
     *       employer: 'AFrame Foundary'
     *    }, -2 );
     *   
	 * @method insert
	 * @param {object} data - data to use for list item
	 * @param {number} index (optional) - index to insert at
	 * If index > current highest index, inserts at end.
	 * 	If index is negative, item is inserted from end.
	 * 	-1 is at the end.  If not given, inserts at end.
	 * @return {number} index the item is inserted at.
	 */
	insert: function( data, index ) {
		index = this.getActualInsertIndex( index );

		var rowElement = this.listElementFactory( data, index );
		index = this.insertElement( rowElement, index );
		
		/**
		* Triggered whenever a row is inserted into the list
		* @event onInsert
		* @param {element} rowElement - the row's list element
		* @param {object} options - information about the insert
		* @param {element} options.rowElement - row's element
		* @param {object} options.data - data that was inserted
		* @param {object} options.index - index where row was inserted
		*/
		this.triggerEvent( 'onInsert', {
			rowElement: rowElement, 
			data: data,
			index: index
		} );

		return index;
	},

	/**
	 * Insert an element into the list.
     *   
     *    // Item is inserted at index 0, the first item in the list.
     *    list.insertElement( $( '<li>Shane Tomlinson, AFrame Foundary</li>' ), 0 );
     *   
	 * @method insertElement
	 * @param {element} rowElement - element to insert
	 * @param {number} index (optional) - index where to insert element.
	 * If index > current highest index, inserts at end.
	 * 	If index is negative, item is inserted from end.  -1 is at the end.
	 * @return {number} index - the index the item is inserted at.
	 */
	insertElement: function( rowElement, index ) {
		var target = this.getTarget();
		var children = target.children();
		
		index = this.getActualInsertIndex( index );
		if( index === children.length ) {
			target.append( rowElement );
		}
		else {
			var insertBefore = children.eq( index );
			rowElement.insertBefore( insertBefore );
		}

		/**
		* Triggered whenever an element is inserted into the list
		* @event onInsertElement
		* @param {object} options - information about the insert
		* @param {element} options.rowElement - row's element
		* @param {object} options.index - index where row was inserted
		*/
		this.triggerEvent( 'onInsertElement', {
			rowElement: rowElement,
			index: index
		} );
		
		return index;
	},

	/**
	 * Remove an item from the list
     *   
     *    // Remove first item in the list.
     *    list.remove( 0 );
     *   
	 * @method remove
	 * @param {number} index - index of item to remove
	 */
	remove: function( index ) {
		var removeIndex = this.getActualIndex( index );
		var rowElement = this.getTarget().children().eq( removeIndex ).remove();
		
		/**
		* Triggered whenever an element is removed from the list
		* @event onRemoveElement
		* @param {object} options - information about the insert
		* @param {element} options.rowElement - row's element
		* @param {object} options.index - index where row was inserted
		*/
		this.triggerEvent( 'onRemoveElement', {
			rowElement: rowElement,
			index: index
		} );
	},
	
	/**
	* Get the number of items
    *   
    *    // Get the number of items
    *    var count = list.getCount();
    *   
	* @method getCount
	* @return {number} number of items
	*/
	getCount: function() {
		return this.getTarget().children().length;
	}
} );/**
 * A plugin that binds a list to a collection.  When the collection is updated, the list
 *  is automatically updated to reflect the change.  List updates occure when 
 *  the collection trigger the onInsert or onRemove events.
 * This plugin adds <a href="#method_getIndex">getIndex</a> to the plugged list.
 *
 *
 *    <ul id="clientList">
 *    </ul>
 *   
 *    ---------
 *    // A List with the same results as the previous example is 
 *    //    the expected result
 *   
 *    // First we need to set up the collection
 *    var collection = AFrame.construct( {
 *       type: AFrame.CollectionArray
 *    } );
 *   
 *   
 *    var factory = function( index, data ) {
 *       var listItem = $( '<li>' + data.name + ', ' + data.employer + '</li>' );
 *       return listItem;
 *    };
 *
 *    // Sets up our list with the ListPluginBindToCollection.  Notice the 
 *    //    ListPluginBindToCollection has a collection config parameter.
 *    var list = AFrame.construct( {
 *       type: AFrame.List,
 *       config: {
 *           target: '#clientList',
 *           listElementFactory: factory
 *       },
 *       plugins: [
 *           {
 *               type: AFrame.ListPluginBindToCollection,
 *               config: {
 *                   collection: collection
 *               }
 *           }
 *       ]
 *    } );
 *   
 *    collection.insert( {
 *       name: 'Shane Tomlinson',
 *       employer: 'AFrame Foundary'    
 *    } );
 *   
 *    collection.insert( {
 *       name: 'Joe Smith',
 *       employer: 'The Coffee Shop'    
 *    }, 0 );
 *   
 *    // The same list as in the example above is shown
 *    ---------
 *
 *    <ul id="clientList">
 *       <li>Joe Smith, The Coffee Shop</li>
 *       <li>Shane Tomlinson, AFrame Foundary</li>
 *    </ul>
 *
 *    ----------
 *   
 *    collection.remove( 0 );
 *   
 *    // Joe Smith has been removed
 *   
 *    ---------
 *
 *    <ul id="clientList">
 *       <li>Shane Tomlinson, AFrame Foundary</li>
 *    </ul>
 * 
 *
 * @class AFrame.ListPluginBindToCollection
 * @extends AFrame.Plugin
 * @constructor
 */
AFrame.ListPluginBindToCollection = function() {
	AFrame.ListPluginBindToCollection.superclass.constructor.apply( this, arguments );
};

AFrame.extend( AFrame.ListPluginBindToCollection, AFrame.Plugin, {
	init: function( config ) {
		/**
		 * The collection to bind to
		 * @config collection
		 * @type {Collection}
		 */
		this.collection = config.collection;
		this.collection.bindEvent( 'onInsert', this.onInsert, this );
		this.collection.bindEvent( 'onRemove', this.onRemove, this );

		this.cids = [];
		
		AFrame.ListPluginBindToCollection.superclass.init.apply( this, arguments );
	},
	
	setPlugged: function( plugged ) {
		plugged.getIndex = this.getIndex.bind( this );
		
		AFrame.ListPluginBindToCollection.superclass.setPlugged.apply( this, arguments );
	},
	
	onInsert: function( data ) {
		var index = this.getPlugged().insert( data.item, data.index || -1 );

		this.cids.splice( index, 0, data.cid );
	},
	
	onRemove: function( data ) {
		var index = this.cids.indexOf( data.cid );
		
		this.getPlugged().remove( index );
		
		this.cids.splice( index, 1 );
	},
	
	/**
	 * Given an index or cid, get the index.
	 * @param {number || id} indexCID - either the index or the cid of an item
	 * @return {number} index of item
	 */
	getIndex: function( indexCID ) {
		var index = indexCID;
		
		if( 'string' == typeof( indexCID ) ) {
			index = this.cids.indexOf( indexCID );
		}
		
		return index;
	}
} );/**
 * A plugin to a collection to give the collection db ops.  This is part of what is usually called an Adapter
 *  when referring to collections with a hookup to a database.  The CollectionPluginPersistence is not the actual 
 *  Adapter but binds a collection to an Adapter.  The CollectionPluginPersistence adds load, add, save, del 
 *  functions to the collection, all four functions are assumed to operate asynchronously.  
 *  When configuring the plugin, 4 parameters can be specified, each are optional.
 *  The four paramters are addCallback, saveCallback, loadCallback, and deleteCallback.  When the callbacks are called, they
 *  will be called with three parameters, data, options.  data is the data currently being operated on. options is
 *  options data that will contain at least two fields, collection and onComplete. onComplte should be called by the 
 *  adapter when the adapter function
 *  has completed.
 *
 *     // set up the adapter
 *     var dbAdapter = {
 *         load: function( options ) {
 *              // functionality here to do the load
 *              
 *              if( options.onComplete ) {
 *                  options.onComplete();
 *              }
 *         },
 *         add: function( data, options ) {
 *              // functionality here to do the add
 *              
 *              if( options.onComplete ) {
 *                  options.onComplete();
 *              }
 *         },
 *         del: function( data, options ) {
 *              // functionality here to do the delete
 *              
 *              if( options.onComplete ) {
 *                  options.onComplete();
 *              }
 *         },
 *         save: function( data, options ) {   
 *              // functionality here to do the save
 *              
 *              if( options.onComplete ) {
 *                  options.onComplete();
 *              }
 *         }
 *     };
 *
 *     var collection = AFrame.construct( {
 *          type: AFrame.CollectionArray,
 *          plugins: [ {
 *              type: AFrame.CollectionPluginPersistence,
 *              config: {
 *                  // specify each of the four adapter functions
 *                  loadCallback: dbAdapter.load,
 *                  addCallback: dbAdapter.load,
 *                  deleteCallback: dbAdapter.del,
 *                  saveCallback: dbAdapter.save
 *              }
 *          } ]
 *     } );
 *     
 *     // Loads the initial data
 *     collection.load( {
 *          onComplete: function() {
 *              alert( 'Collection is loaded' );
 *          }
 *     } );
 *      
 *     // Adds an item to the collection.  Note, a cid is not given back
 *     // because this operation is asynchronous and a cid will not be
 *     // assigned until the persistence operation completes.  A CID
 *     // will be placed on the items data.
 *     collection.add( {
 *          name: 'AFrame',
 *          company: 'AFrame Foundary'
 *     }, {
 *          onComplete: function( data, options ) {
 *              // cid is available here in either options.cid or data.cid
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
AFrame.CollectionPluginPersistence = function() {
	AFrame.CollectionPluginPersistence.superclass.constructor.apply( this, arguments );
};
AFrame.extend( AFrame.CollectionPluginPersistence, AFrame.Plugin, {
	init: function( config ) {
		/**
		 * function to call to do add.  Will be called with three parameters, data, options, and callback.
		 * @config addCallback
		 * @type function (optional)
		 */
		this.addCallback = config.addCallback || this.noPersistenceOp;
		
		/**
		 * function to call to do save.  Will be called with three parameters, data, options, and callback.
		 * @config saveCallback
		 * @type function (optional)
		 */
		this.saveCallback = config.saveCallback || this.noPersistenceOp;
		
		/**
		 * function to call to do load.  Will be called with two parameters, options, and callback.
		 * @config loadCallback
		 * @type function (optional)
		 */
		this.loadCallback = config.loadCallback || this.noPersistenceOp;
		
		/**
		 * function to call to do delete.  Will be called with three parameters, data, options, and callback.
		 * @config deleteCallback
		 * @type function (optional)
		 */
		this.deleteCallback = config.deleteCallback || this.noPersistenceOp;
		
		AFrame.CollectionPluginPersistence.superclass.init.apply( this, arguments );
	},

	noPersistenceOp: function( data, options ) {
        var callback = options.onComplete;
		callback && callback( data, options );
	},

	setPlugged: function( plugged ) {
		plugged.add = this.add.bind( this );
		plugged.load = this.load.bind( this );
		plugged.del = this.del.bind( this );
		plugged.save = this.save.bind( this );
		
		AFrame.CollectionPluginPersistence.superclass.setPlugged.apply( this, arguments );
	},

	/**
	 * Add an item to the collection.  The item will be inserted into the collection once the addCallback
     *  is complete.  Because of this, no cid is returned from the add function, but one will be placed into
     *  the options data passed to the onComplete callback.
     *      
     *     // Adds an item to the collection.  Note, a cid is not given back
     *     // because this operation is asynchronous and a cid will not be
     *     // assigned until the persistence operation completes.  A CID
     *     // will be placed on the items data.
     *     collection.add( {
     *          name: 'AFrame',
     *          company: 'AFrame Foundary'
     *     }, {
     *          onComplete: function( data, options ) {
     *              // cid is available here in either options.cid or data.cid
     *              alert( 'add complete, cid: ' + options.cid );
     *          }
     *     } );
     *     
	 * @method add
	 * @param {object} data - data to add
	 * @param {object} options - options information.  
     * @param {function} options.onComplete (optional) - callback to call when complete
	 *	Will be called with two parameters, the data, and options information.
     * @param {function} options.insertAt (optional) - data to be passed as second argument to the collection's 
     *  insert function.  Useful when using CollectionArrays to specify the index
	 */
	add: function( data, options ) {
		options = this.getOptions( options );
        var callback = options.onComplete;
        
        options.onComplete = function() {
            var cid = this.getPlugged().insert( data, options.insertAt );
            options.cid = cid;
            options.onComplete = callback;
			callback && callback( data, options );
		}.bind( this );
        
		this.addCallback( data, options );
	},

	/**
	 * load the collection
     *
     *     // Loads the initial data
     *     collection.load( {
     *          onComplete: function() {
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
		options = this.getOptions( options );
        var callback = options.onComplete;
        
        options.onComplete = function( items ) {
			if( items ) {
				var plugged = this.getPlugged();
				items.forEach( function( item, index ) {
					plugged.insert( item );
				} );
			}
            options.onComplete = callback;
			callback && callback( items, options );
		}.bind( this );
        
		this.loadCallback( options );
	},

	/**
	 * delete an item in the collection
     *
     *     // delete an item with cid 'cid'.
     *     collection.del( 'cid', {
     *          onComplete: function() {
     *              alert( 'delete complete' );
     *          }
     *     } );
     *
     * @method del
	 * @param {id || index} itemID - id or index of item to remove
	 * @param {object} options - options information.
     * @param {function} options.onComplete (optional) - the callback will be called when operation is complete.
	 *	Callback will be called with two parameters, the data, and options information.
	 */
	del: function( itemID, options ) {
        var plugged = this.getPlugged();
		var data = plugged.get( itemID );
		
		if( data ) {
			options = this.getOptions( options );
            var callback = options.onComplete;
            
            options.onComplete = function() {
				plugged.remove( itemID, options );
                options.onComplete = callback;
				callback && callback( data, options );
			}.bind( this );
            
			this.deleteCallback( data, options );
		}
	},

	/**
	 * save an item in the collection
     *
     *     // save an item with cid 'cid'.
     *     collection.save( 'cid', {
     *          onComplete: function() {
     *              alert( 'save complete' );
     *          }
     *     } );
     *
	 * @method save
	 * @param {id || index} itemID - id or index of item to save
	 * @param {object} options - options information.
     * @param {function} options.onComplete (optional) - the callback will be called when operation is complete.
	 *	Callback will be called with two parameters, the data, and options information.
	 */
	save: function( itemID, options ) {
		var data = this.getPlugged().get( itemID );

		if( data ) {
			options = this.getOptions( options );
            var callback = options.onComplete;
            
            options.onComplete = function() {
                options.onComplete = callback;
				callback && callback( data, options );
			}.bind( this );
            
			this.saveCallback( data, options );
		}
	},

	getOptions: function( options ) {
		options = options || {};
		options.collection = this.getPlugged();
		return options;
	}
} );
/**
 * A basic form.  A Form is a Composite of form fields.  Each Field contains at least 
 * the following functions, clear, save, reset, validate.  A generic Form is not 
 * bound to any data, it is only a collection of form fields.
 *
 *    <div id="nameForm">
 *       <input type="text" data-field="name" />
 *    </div>
 *   
 *    ---------
 *   
 *    // Sets up the field constructor, right now there is only one type of field
 *    var fieldFactory = function( element ) {
 *       return AFrame.construct( {
 *           type: AFrame.Field,
 *           config: {
 *               target: element
 *           }
 *       } );
 *    };
 *   
 *    // Set up the form to look under #nameForm for elements with the "data-field" 
 *    //   attribute.  This will find one field in the above HTML
 *    //
 *    var form = AFrame.construct( {
 *       type: AFrame.Form,
 *       config: {
 *           target: $( '#nameForm' ),
 *           formFieldFactory: fieldFactory
 *       }
 *    } );
 *   
 *    // do some stuff, user enters data.
 *
 *    // Check the validity of the form
 *    var isValid = form.checkValidity();
 *   
 *    // do some other stuff.
 *   
 *    form.clear();
 *
 * @class AFrame.Form
 * @extends AFrame.Display
 * @constructor
 */
/**
 * The factory to use to create form fields
 * @config formFieldFactory
 * @type {function}
 */
AFrame.Form = function() {
	AFrame.Form.superclass.constructor.apply( this, arguments );
};
AFrame.extend( AFrame.Form, AFrame.Display, {
	init: function( config ) {
		this.formFieldFactory = config.formFieldFactory;
		this.formElements = [];
		this.formFields = [];
		
		AFrame.Form.superclass.init.apply( this, arguments );

		this.bindFormElements();
	},

	bindFormElements: function() {
		var formElements = $( '[data-field]', this.getTarget() );
		
		formElements.each( function( index, formElement ) {
			this.bindFormElement( formElement );
		}.bind( this ) );
	},

	teardown: function() {
		this.formFields && this.formFields.forEach( function( formField, index ) {
			formField.teardown();
			this.formFields[ index ] = null;
		}, this );
		this.formFields = null;
		this.formElements = null;
		AFrame.Form.superclass.teardown.apply( this, arguments );
	},
	
	/**
	 * bind a form element to the form
     *
     *    // Bind a field in the given element.
     *    var field = form.bindFormElement( $( '#button' ) );
     *
	 * @method bindFormElement
	 * @param {selector || element} formElement the form element to bind to.
	 * @returns {AFrame.Field}
	 */
	bindFormElement: function( formElement ) {
		var target = $( formElement );
		this.formElements.push( target );

		var formField = this.formFieldFactory( target );
		this.formFields.push( formField );
		
		return formField;
	},
	
	/**
	 * Get the form field elements
     *
     *    // Get the form field elements
     *    var fields = form.getFormElements();
     *
	 * @method getFormElements
	 * @return {array} the form elements
	 */
	getFormElements: function() {
		return this.formElements;
	},

	/**
	 * Get the form fields
     *
     *    // Get the form fields
     *    var fields = form.getFormFields();
     *
	 * @method getFormFields
	 * @return {array} the form fields
	 */
	getFormFields: function() {
		return this.formFields;
	},

	/**
	 * Validate the form.
     *
     *    // Check the validity of the form
     *    var isValid = form.checkValidity();
     *
	 * @method checkValidity
	 * @return {boolean} true if form is valid, false otw.
	 */
	checkValidity: function() {
		var valid = true;

		for( var index = 0, formField; ( formField = this.formFields[ index ] ) && valid; ++index ) {
			valid = formField.checkValidity();
		}
		
		return valid;
	},

	/**
	 * Clear the form, does not affect data
     *
     *    // Clear the form, does not affect data.
     *    form.clear();
     *
	 * @method clear
	 */
	clear: function() {
		this.fieldAction( 'clear' );
	},

	/**
	 * Reset the form to its original state
     *
     *    // Resets the form to its original state.
     *    form.reset();
     *
	 * @method reset
	 */
	reset: function() {
		this.fieldAction( 'reset' );
	},

	/**
	 * Have all fields save their data if the form is valid
     *
     *    // Have all fields save their data if the form is valid
     *    var saved = form.save();
     *
	 * @method save
	 * @return {boolean} true if the form was valid and saved, false otw.
	 */
	save: function() {
		var valid = this.checkValidity();
		if( valid ) {
			this.fieldAction( 'save' );
		}
		
		return valid;
	},

	fieldAction: function( action ) {
		this.formFields.forEach( function( formField, index ) {
			formField[ action ]();
		} );
	}
} );/**
 * The base class for a field.  A field is a basic unit for a form.  With the new HTML5 spec,
 * each form field has an invalid event.  Some browsers display an error message whenever the
 * invalid event is triggered.  If custom error message processing is desired, set 
 * AFrame.Field.cancelInvalid = false and the default action will be prevented and no browser error.
 * Field validation does not occur in real time, for validation to occur, the checkValidity
 * function must be called.
 *
 *    <input type="number" id="numberInput" />
 *   
 *    ---------
 *
 *    var field = AFrame.construct( {
 *       type: AFrame.Field,
 *       config: {
 *           target: $( '#numberInput' )
 *       }
 *    } );
 *   
 *    // Set the value of the field, it is now displaying 3.1415
 *    field.set(3.1415);
 *   
 *    // Check the validity of the field
 *    var isValid = field.checkValidity();
 *   
 *    // The field is cleared, displays nothing
 *    field.clear();
 *   
 *    field.set('invalid set');
 *   
 *    // This will return false
 *    isValid = field.checkValidity();
 *   
 *    // Get the validity state, as per the HTML5 spec
 *    var validityState = field.getValidityState();
 *
 * @class AFrame.Field
 * @extends AFrame.Display
 * @constructor
 */
AFrame.Field = function() {
	AFrame.Field.superclass.constructor.apply( this, arguments );
};
AFrame.Field.cancelInvalid = false;
AFrame.extend( AFrame.Field, AFrame.Display, {
	init: function( config ) {
		AFrame.Field.superclass.init.apply( this, arguments );

		this.resetVal = this.getDisplayed();
		this.display( this.getPlaceholder() );
		
		this.html5Validate = !!this.getTarget()[ 0 ].checkValidity;
	},

	bindEvents: function() {
		var target = this.getTarget();
		this.bindDOMEvent( target, 'keyup', this.onFieldChange, this );
		this.bindDOMEvent( target, 'focus', this.onFieldFocus, this );
		this.bindDOMEvent( target, 'blur', this.onFieldBlur, this );
		this.bindDOMEvent( target, 'invalid', this.onFieldInvalid, this );
		
		AFrame.Field.superclass.bindEvents.apply( this, arguments );
	},

	/**
	 * Get the placeholder text to display in the field.  If not overridden, looks
	 * on the element for the value of the placeholder attribute. 
     *
     *    var placeholder = field.getPlaceholder();
     *
	 * @method getPlaceholder
	 * @return {string}
	 */
	getPlaceholder: function() {
		var target = this.getTarget();
		return target.attr( 'placeholder' ) || ''; 
	},
	
	/**
	 * Set the value of the field and display the value.  Sets the rest value to the value entered.
     * 
     *    nameField.set( 'AFrame' );
     *
	 * @method set
	 * @param {variant} val value to display
	 */
	set: function( val ) {
		this.resetVal = val;
		
		val = val || this.getPlaceholder();
		this.display( val );
	},
	
	/**
	* Display a value, does not affect the reset value.  Using this function can be useful to
	*	change how a piece of data is visually represented on the screen.
    *
    *    nameField.display( 'AFrame' );
    *
	* @method display
	* @param {variant} val value to dipslay
	*/
	display: function( val ) {
		var target = this.getTarget();

		var func = val == this.getPlaceholder() ? 'addClass' : 'removeClass';
		target[ func ]( 'empty' );
		
		if( this.isValBased( target ) ) {
			target.val( val );
		}
		else {
			target.html( val );
		}
	},
	
	/**
	* Get the value that is displayed in the field.  This can be different from what get returns
	*	if the visual representation of the data is different from the data itself.
    *
    *    var displayed = nameField.getDisplayed();
    *    console.log( 'displayedValue: ' + displayed );
    *
	* @method getDisplayed
	* @returns {string}
	*/
	getDisplayed: function() {
		var target = this.getTarget();
		var retval = '';
		if( this.isValBased( target ) ) {
			retval = target.val();
		}
		else {
			retval = target.html();
		}
		return retval;
	},

	/**
	 * Reset the field to its last 'set' value.
     *
     *    nameField.reset();
     *
	 * @method reset
	 */
	reset: function() {
		this.set( this.resetVal );
	},

	/**
	 * Validate the field.  A field will validate if 1) Its form element does not have the required attribute, or 2) the field has a length.
	 *	sub classes can override this to perform more specific validation schemes.  The HTML5 spec specifies
     *  checkValidity as the method to use to check the validity of a form field.
     *
     *    var isValid = nameField.checkValidity();
     *
	 * @method checkValidity
	 * @return {boolean} true if field is valid, false otw.
	 */
	checkValidity: function() {
		this.validityState = AFrame.FieldValidityState.getInstance( this.getTarget()[ 0 ].validity );

		var valid = this.validate();		
		this.validityStateIsCurrent = true;
		return valid;
	},
	
	/**
	* Do the actual validation on the field.  Should be overridden to do validations.  Calling this will
	*	reset any validation errors previously set and start with a new state.  This should not be called
    *   directly, instead [checkValidity](#method_checkValidity) should be
    *
    *   var isValid = nameField.validate();
    *
	* @method validate
	* @return {boolean} true if field is valid, false otw.
	*/
	validate: function() {
		var valid = true;
		
		if( this.html5Validate ) {
			// browser supports native validity
			valid = this.getTarget()[ 0 ].checkValidity();
		} else {
			var isRequired = this.getTarget().hasAttr( 'required' );
			valid = ( !isRequired || !!this.get().length );
			
			if( !valid ) {
				this.setError( 'valueMissing' );
			}
		}
		
		return valid;
	},
	
	/**
	* Get the current validity status of an object.
    *
    *    var validityState = nameField.getValidityState();
    *    // do something with the validityState
    *
	* @method getValidityState
	* @return {AFrame.FieldValidityState}
	*/
	getValidityState: function() {
		if( !this.validityStateIsCurrent ) {
			this.checkValidity();
		}
		
		return this.validityState;
	},
	
	/**
	* Set an error on the field.  See [AFrame.FieldValidityState](AFrame.FieldValidityState.html)
    *
    *   nameField.setError( 'valueMissing' );
    *
	* @method setError
	* @param {string} errorType
	*/
	setError: function( errorType ) {
		this.validityState.setError( errorType );
	},
	
	/**
	* Set a custom error on the field.  In the AFrame.FieldValidityState object returned
	*	by getValidityState, a custom error will have the customError field set to this 
	*	message
    *
    *   nameField.setCustomError( 'Names must start with a letter' );
    *
	* @method setCustomError
	* @param {string} customError - the error message to display
	*/
	setCustomError: function( customError ) {
		this.validityState.setCustomError( customError );
	},
	
	/**
	 * Clear the field.  A reset after this will cause the field to go back to the blank state.
     *
     *    nameField.clear();
     *
	 * @method clear
	 */
	clear: function() {
		this.set( '' );
	},
	
	/**
	 * Get the value of the field.  The value returned can be different if the visual representation is 
	 *	different from the underlying data.  Returns an empty string if no value entered.  
     *
     *    var val = nameField.get();
     *
	 * @method get
	 * @return {variant} the value of the field
	 */
	 
	get: function() {
		return this.resetVal;
	},
	
	/**
	 * Save the current value as a reset point
     *
     *    nameField.save();
     *
	 * @method save
	 */
	save: function() {
		var displayed = this.getDisplayed();
		if( displayed == this.getPlaceholder() ) {
			displayed = '';			
		}
		this.resetVal = displayed;
	},
	
	onFieldChange: function( event ) {
		/**
		* triggered whenever the field value changes
		* @event onChange
		* @param {string} fieldVal - the current field value.
		*/
		this.triggerEvent( 'onChange', this.get() );
		
		this.validityStateIsCurrent = false;
	},
	
	onFieldFocus: function() {
		if( this.getDisplayed() == this.getPlaceholder() ) {
			this.display( '' );
		}
	},
	
	onFieldBlur: function() {
		if( '' === this.getDisplayed() ) {
			this.display( this.getPlaceholder() );
		}
	},
	
	onFieldInvalid: function( event ) {
		if( AFrame.Field.cancelInvalid ) {
			event.preventDefault();
		}
	},
	
	isValBased: function( target ) {
		return target.is( 'input' ) || target.is( 'textarea' );
	}
} );

$.fn.hasAttr = function(name) {  
   return typeof( this.attr(name) ) != 'undefined';
};
/**
* An object that keeps track of a field's validity, mirrors the [HTML5](http://www.whatwg.org/specs/web-apps/current-work/multipage/association-of-controls-and-forms.html#the-constraint-validation-api) spec.
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
* @method AFrame.FieldValidityState.getInstance
* @param {object} config - object with a list of fields to set on the validity object
* @returns {AFrame.FieldValidityState}
*/
AFrame.FieldValidityState.getInstance = function( config ) {
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
	* @method setCustomError
	* @param {string} customError - the error message
	*/
	setCustomError: function( customError ) {
		if( customError ) {
			this.valid = false;
			this.customError = true;
			this.validationMessage = customError;
		}
	}
};/**
 * A basic data schema, useful for loading/saving data to a persistence store.  When loading data from
 * persistence, if the data is run through the getAppData function, it will make an object with only the fields
 * defined in the schema, and any missing fields will get default values.  If a fixup function is defined
 * for that row, the field's value will be run through the fixup function.  When saving data to persistence,
 * running data through the getFormData will create an object with only the fields specified in the schema.  If
 * a row has save: false defined, the row will not be added to the form data object. If a row has a cleanup 
 * function defined, the corresponding data value will be run through the cleanup function.
 * Generic fixup and persistence functions can be set for a type using the AFrame.Schema.addAppDataCleaner and 
 * AFrame.Schema.addFormDataCleaner.  Every item that has a given type and has a value will have the
 * fixer or persistencer function called, this is useful for doing conversions where the data persistence
 * layer saves data in a different format than the internal application representation.  A useful
 * example of this is ISO8601 date<->Javascript Date.  Already added types are 'number', 'integer',
 * and 'iso8601'.
 * If a row in the schema config has the has_many field, the field is made into an array and the fixup/cleanup functions
 *	are called on each item in the array.  The default default item for these fields is an empty array.  If
 *	there is no data for the field in getFormData, the field is left out of the output.
 * @class AFrame.Schema
 * @constructor
 */

/**
 * The schema configuration to use for this schema
 * @config schema
 * @type {object}
 */
AFrame.Schema = function() {
};
AFrame.Schema.prototype = {
	init: function( config ) {
		this.schema = config.schema;
	},

	/**
	 * Get an object with the default values specified.  Only returns values
	 * of objects with a defined default.
	 * @method getDefaults
	 * @return {object} object with default values
	 */
	getDefaults: function() {
		var defaultObject = {};
		for( var key in this.schema ) {
			defaultObject[ key ] = this.getDefaultValue( key );
		}
		return defaultObject;
	},

	/**
	* Get the default value for a particular item
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
		else if( AFrame.Schema.getSchema( this.schema[ key ].type ) ) {
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
		var schema = AFrame.Schema.getSchema( schemaRow.type );
		if( schema ) {
			value = schema.getAppData( value );
		}
		else if( AFrame.defined( value ) ) {
			// call the generic type fixup/conversion function
			var convert = AFrame.Schema.appDataCleaners[ schemaRow.type ];
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
	 *	All items in the schema that do not have save parameter set to false and have values defined in dataToClean 
	 *	will have values returned.
	 * @method getFormData
	 * @param {object} dataToClean - data to clean up
	 * @return {object} cleanedData
	 */
	getFormData: function( dataToClean ) {
		var cleanedData = {};
		
		this.forEach( function( schemaRow, key ) {
			if( schemaRow.save !== false ) {
				var value = dataToClean[ key ];

				if( schemaRow.has_many ) {
					value && value.forEach && value.forEach( function( current, index ) {
						value[ index ] = this.getFormDataValue( current, schemaRow, dataToClean, cleanedData );
					}, this );
				}
				else {
					value = this.getFormDataValue( value, schemaRow, dataToClean, cleanedData );
				}
				
				cleanedData[ key ] = value;
			}
		}, this );
		
		return cleanedData;
	},
	
	getFormDataValue: function( value, schemaRow, dataToClean, cleanedData ) {
		// apply the cleanup function if defined.
		var cleanup = schemaRow.cleanup;
		if( AFrame.defined( cleanup ) ) {
			value = cleanup( {
				value: value,
				data: dataToClean,
				cleaned: cleanedData
			} );
		}

		if( AFrame.defined( value ) ) {
			var schema = AFrame.Schema.getSchema( schemaRow.type );
			/*
			* first, check if there is a schema, if there is a schema let the schema
			*	take care of things.  If there is no schema but there is a value and
			*  a saveCleaner, run the value through the save cleaner.
			*/
			if( schema ) {
				value = schema.getFormData( value );
			}
			else {
				var convert = AFrame.Schema.formDataCleaners[ schemaRow.type ];
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
			var schemaRow = this.schema[ key ];
			callback.call( context, schemaRow, key );
		}
	}
};
AFrame.mixin( AFrame.Schema, {
	appDataCleaners: {},
	formDataCleaners: {},
	schemaConfigs: {},
	schemaCache: {},
	
	/**
	 * Add a universal function that fixes data in getAppDataObject. This is used to convert
	 * data from a version the backend sends to one that is used internally.
	 * @method AFrame.Schema.addAppDataCleaner
	 * @param {string} type - type of field.
	 * @param {function} callback - to call
	 */
	addAppDataCleaner: function( type, callback ) {
		AFrame.Schema.appDataCleaners[ type ] = callback;
	},
	/**
	 * Add a universal function that gets data ready to save to persistence.  This is used
	 * to convert data from an internal representation of a piece of data to a 
	 * representation the backend is expecting.
	 * @method AFrame.Schema.addFormDataCleaner
	 * @param {string} type - type of field.
	 * @param {function} callback - to call
	 */
	addFormDataCleaner: function( type, callback ) {
		AFrame.Schema.formDataCleaners[ type ] = callback;
	},
	
	/**
	* Add a schema config
	* @method AFrame.Schema.addSchemaConfig
	* @param {id} type - identifier type
	* @param {SchemaConfig} config - the schema configuration
	*/
	addSchemaConfig: function( type, config ) {
		AFrame.Schema.schemaConfigs[ type ] = config;
	},
	
	/**
	* Get a schema
	* @method AFrame.Schema.getSchema
	* @param {id} type - type of schema to get, a config must be registered for type.
	* @return {AFrame.Schema}
	*/
	getSchema: function( type ) {
		if( !AFrame.Schema.schemaCache[ type ] && AFrame.Schema.schemaConfigs[ type ] ) {
			AFrame.Schema.schemaCache[ type ] = AFrame.construct( {
				type: AFrame.Schema,
				config: {
					schema: AFrame.Schema.schemaConfigs[ type ]
				}
			} );
		}
		
		return AFrame.Schema.schemaCache[ type ];
	}
} );

AFrame.Schema.addAppDataCleaner( 'number', function( value ) {
	return parseFloat( value );
} );

AFrame.Schema.addAppDataCleaner( 'integer', function( value ) {
	return parseInt( value, 10 );
} );

AFrame.Schema.addAppDataCleaner( 'iso8601', function( str ) {
	// we assume str is a UTC date ending in 'Z'
	try{
		var parts = str.split('T'),
		dateParts = parts[0].split('-'),
		timeParts = parts[1].split('Z'),
		timeSubParts = timeParts[0].split(':'),
		timeSecParts = timeSubParts[2].split('.'),
		timeHours = Number(timeSubParts[0]),
		_date = new Date;
		
		_date.setUTCFullYear(Number(dateParts[0]));
		_date.setUTCMonth(Number(dateParts[1])-1);
		_date.setUTCDate(Number(dateParts[2]));
		_date.setUTCHours(Number(timeHours));
		_date.setUTCMinutes(Number(timeSubParts[1]));
		_date.setUTCSeconds(Number(timeSecParts[0]));
		if (timeSecParts[1]) {
			_date.setUTCMilliseconds(Number(timeSecParts[1]));
		}
		
		// by using setUTC methods the date has already been converted to local time(?)
		return _date;
	}
	catch(e) {}
} );

AFrame.Schema.addFormDataCleaner( 'iso8601', function( date ) {
	return date.toISOString();
} );

/**
 * Create an AFrame.Form based object for each item in the list.  Adds the functions [validate](#method_validate), 
 * [save](#method_save), [clear](#method_clear), [reset](#method_reset), and [getForm](#method_getForm) to the 
 * plugged object.  By default, no formFactory method is needed to create forms and a 
 * [AFrame.DataForm](AFrame.DataForm.html) is created for each row.  If a specialty form is needed, 
 * the formFactory configuration parameter can be specified.
 *
 *##Setting up a List##
 *
 *    // ListPluginFormRow with default formFactory
 *    var list = AFrame.construct( {
 *        type: AFrame.List,
 *        config: {
 *            target: '.list'
 *        },
 *        plugins: [
 *            {
 *                type: AFrame.ListPluginFormRow
 *            }
 *        ]
 *    } );
 *       
 *    // ListPluginFormRow with formFactory specified
 *    var list = AFrame.construct( {
 *        type: AFrame.List,
 *        config: {
 *            target: '.list'
 *        },
 *        plugins: [
 *            {
 *                type: AFrame.ListPluginFormRow,
 *                config: {
 *                    formFactory: function( rowElement, data )
 *                        var form = AFrame.construct( {
 *                            type: AFrame.SpecializedForm,
 *                            config: {
 *                                target: rowElement,
 *                                dataSource: data
 *                            }
 *                        } );
 *           
 *                        return form;
 *                  },
 *            }
 *        ]
 *    } );
 *
 *
 *##Using ListPluginFormRow's Functionality##
 * 
 *     // list is an AFrame.List with the AFrame.ListPluginFormRow plugin
 *
 *     // reset all forms in the entire list
 *     list.reset();
 *
 *     // reset one row
 *     list.reset( 0 );
 *
 *     // validate all forms in the entire list
 *     var valid = list.validate();
 *
 *     // validate one row
 *     var valid = list.validate( 0 );
 *       
 *     // save all forms in the entire list
 *     list.save();
 *
 *     // save one row
 *     list.save( 0 );
 * 
 *     // clear all forms in the entire list
 *     list.clear();
 *
 *     // clear one row
 *     list.clear( 0 );
 *
 * @class AFrame.ListPluginFormRow
 * @extends AFrame.Plugin
 * @constructor 
 */
AFrame.ListPluginFormRow = function() {
	AFrame.ListPluginFormRow.superclass.constructor.apply( this, arguments );
};
AFrame.extend( AFrame.ListPluginFormRow, AFrame.Plugin, {
	init: function( config ) {
		/**
         * The factory function used to create forms.  formFactory will be called once for each
         *	row in the list, it will be called with two parameters, the rowElement and the data
         *	passed in the list's onInsert call.  An AFrame.Form compatible object must be returned.
         *
         *     ...
         *     formFactory: function( rowElement, data ) {
         *          var form = AFrame.construct( {
         *              type: AFrame.SpecializedForm,
         *              config: {
         *                  target: rowElement,
         *                  dataSource: data
         *              }
         *          } );
         *           
         *          return form;
         *      },
         *      ....
         *
		 * @config formFactory
		 * @type {function} (optional)
         * @default this.formFactory
		 */
        this.formFactory = config.formFactory || this.formFactory;
		
		this.forms = [];
		
		AFrame.ListPluginFormRow.superclass.init.apply( this, arguments );
	},
    
	setPlugged: function( plugged ) {
		plugged.bindEvent( 'onInsert', this.onInsertRow, this );
		plugged.bindEvent( 'onRemove', this.onRemoveRow, this );
		
		plugged.validate = this.validate.bind( this );
		plugged.save = this.save.bind( this );
		plugged.reset = this.reset.bind( this );
		plugged.clear = this.clear.bind( this );
		plugged.getForm = this.getForm.bind( this );
		
		AFrame.ListPluginFormRow.superclass.setPlugged.apply( this, arguments );		
	},
	
	teardown: function() {
		this.forms.forEach( function( form, index ) {
			form.teardown();
			this.forms[ index ] = null;
		}, this );
		
		AFrame.ListPluginFormRow.superclass.teardown.apply( this, arguments );		
	},
	
    /**
     * The factory function used to create forms.  formFactory will be called once for each
     *	row in the list, it will be called with two parameters, the rowElement and the data
     *	passed in the list's onInsert call.  An AFrame.Form compatible object must be returned.
     *
     *     ...
     *     formFactory: function( rowElement, data ) {
     *          var form = AFrame.construct( {
     *              type: AFrame.SpecializedForm,
     *              config: {
     *                  target: rowElement,
     *                  dataSource: data
     *              }
     *          } );
     *           
     *          return form;
     *      },
     *      ....
     *
     * @method formFactory
     * @type {function}
     */
    formFactory: function( rowElement, data ) {
        var form = AFrame.construct( {
            type: AFrame.DataForm,
            config: {
                target: rowElement,
                dataSource: data
            }
        } );
        
        return form;
    },
	
	onInsertRow: function( data, index ) {
		var form = this.formFactory( data.rowElement, data );
		this.forms.splice( index, 0, form );
	},
	
	onRemoveRow: function( data, index ) {
		var form = this.forms[ index ];
		form.teardown();
		
		this.forms[ index ] = null;
		this.forms.splice( index, 1 );
	},
	
	/**
	 * Validate a form.
     * 
     *     // list is an AFrame.List with the AFrame.ListPluginFormRow plugin
     *
     *     // validate all forms in the entire list
     *     var valid = list.validate();
     *
     *     // validate one row
     *     var valid = list.validate( 0 );
     *
	 * @method validate
	 * @param {number} index (optional) index of row.  If not given,
	 * validate all rows.
	 * @return {boolean} true if form is valid, false otw.
	 */
	validate: function( index ) {
		var valid = true;
		var form;
		
		if( AFrame.defined( index ) ) {
			form = this.forms[ index ];
			if( form ) {
				valid = form.validate();				
			}
		}
		else {
			for( index = 0; valid && ( form = this.forms[ index ] ); ++index ) {
				valid = form.validate();
			}
		}
		
		return valid;
	},
	
	/**
	 * Save a form's data to its DataContainer
     * 
     *     // list is an AFrame.List with the AFrame.ListPluginFormRow plugin
     *
     *     // save all forms in the entire list
     *     list.save();
     *
     *     // save one row
     *     list.save( 0 );
     *
	 * @method save
	 * @param {number} index (optional) index of row.  If not given,
	 * save all rows.
	 */
	save: function( index ) {
		this.formFunc( index, 'save' );
	},
	
	/**
	 * Reset a form
     * 
     *     // list is an AFrame.List with the AFrame.ListPluginFormRow plugin
     *
     *     // reset all forms in the entire list
     *     list.reset();
     *
     *     // reset one row
     *     list.reset( 0 );
     *
	 * @method reset
	 * @param {number} index (optional) index of row.  If not given,
	 * reset all rows.
	 */
	reset: function( index ) {
		this.formFunc( index, 'reset' );
	},
	
	/**
	 * Clear a form
     * 
     *     // list is an AFrame.List with the AFrame.ListPluginFormRow plugin
     *
     *     // clear all forms in the entire list
     *     list.clear();
     *
     *     // clear one row
     *     list.clear( 0 );
     *
	 * @method clear
	 * @param {number} index (optional) index of row.  If not given,
	 * clear all rows.
	 */
	clear: function( index ) {
		this.formFunc( index, 'clear' );
	},
	
	formFunc: function( index, funcName ) {
		if( AFrame.defined( index ) ) {
			var form = this.forms[ index ];
			if( form ) {
				form[ funcName ]();				
			}
		}
		else {
			this.forms.forEach( function( form, index ) {
				form[ funcName ]();
			} );
		}
	},
    
    /**
    * Get the reference to a form
    * 
    *     // list is an AFrame.List with the AFrame.ListPluginFormRow plugin
    *
    *     // get the form for one row.
    *     var form = list.getForm( 0 );
    *
    * @method getForm
    * @param {number} index - index of form to get
    * @return {AFrame.Form} form if available, undefined otw.
    */
    getForm: function( index ) {
        return this.forms[ index ];
    }
} );/**
* A Form that is bound to data.  Each DataForm is bound to a DataContainer, the DataContainer
*	is used as the data source for all form Fields.  When a Field in the form is created, it
*	has its value set to be that of the corresponding field in the DataContainer.  When Fields
*	are updated, the DataContainer is not updated until the form's save function is called.
*    
*    // Sets up the field constructor, right now there is only one type of field
*    var fieldFactory = function( element ) {
*        return AFrame.construct( {
*            type: AFrame.Field,
*            config: {
*                target: element
*            }
*        } );
*    };
*    
*    var libraryDataContainer = AFrame.DataContainer( {
*        name: 'AFrame',
*        version: '0.0.20'
*    } );
*    
*    // Set up the form to look under #nameForm for elements with the "data-field" 
*    //    attribute.  This will find two fields, each field will be tied to the 
*    //    appropriate field in the libraryDataContainer
*    var form = AFrame.construct( {
*        type: AFrame.DataForm,
*        config: {
*            target: $( '#nameForm' ),
*            formFieldFactory: fieldFactory,
*            dataSource: libraryDataContainer
*        }
*    } );
*    
*    // do some stuff, user updates the fields with the library name and version 
*    //    number. Note, throughout this period the libraryDataContainer is never 
*    //    updated.
*
*    // Check the validity of the form, if we are valid, save the data back to 
*    //    the dataContainer
*    var isValid = form.checkValidity();
*    if( isValid ) {
*        // if the form is valid, the input is saved back to 
*        //    the libraryDataContainer
*        form.save();
*    }
*
* @class AFrame.DataForm
* @extends AFrame.Form
* @constructor
*/
AFrame.DataForm = function() {
	AFrame.DataForm.superclass.constructor.apply( this, arguments );
};
AFrame.extend( AFrame.DataForm, AFrame.Form, {
	init: function( config ) {
		/**
		 * The source of data
		 * @config dataSource
		 * @type {AFrame.DataContainer || Object}
		 */
		this.dataContainer = AFrame.DataContainer( config.dataSource );
		
		AFrame.DataForm.superclass.init.apply( this, arguments );
	},
	
	teardown: function() {
		this.dataContainer = null;
		AFrame.DataForm.superclass.teardown.apply( this, arguments );
	},
	
	bindFormElement: function( formElement ) {
		var formField = AFrame.DataForm.superclass.bindFormElement.apply( this, arguments );
		var fieldName = $( formElement ).attr( 'data-field' );
		
		this.dataContainer.bindField( fieldName, function( data ) { 
			this.set( data.value );
		}.bind( formField ), this );
		
		return formField;
	},
	
	save: function() {
		var valid = AFrame.DataForm.superclass.save.apply( this, arguments );
		
		if( valid ) {
			var formFields = this.getFormFields();
			formFields.forEach( function( formField, index ) {
				var fieldName = formField.getTarget().attr( 'data-field');
				this.dataContainer.set( fieldName, formField.get() );
			}, this );
		}
		
		return valid;
	}
} );