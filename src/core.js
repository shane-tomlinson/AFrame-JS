/**
* @module AFrame
*/

if( !Function.prototype.bind ) {
	Function.prototype.bind = function( context ) {
		var callback = this;
		return function() {
			callback.apply( context, arguments );
		}
	}
}

/**
* The AFrame namespace
* @namespace AFrame
*/
AFrame = {
	/**
	* extend a class with another class and optional functions
	* @method AFrame.extend
	* @param {function} derived - class to extend
	* @param {function} superclass - class to extend with.
	* @param {object} extrafuncs (optional) - object with optional functions to extend derived with
	*/
	extend: function( derived, superclass, extrafuncs ) {
		var f = function() {};
		f.prototype = superclass.prototype;
		derived.prototype = new f();
		derived.prototype.constructor = derived;
		derived.superclass = superclass.prototype;
		AFrame.mixin( derived.prototype, extrafuncs || {} );
	},
	
	/**
	* extend an object with the members of another object.
	* @method AFrame.mixin
	* @param {object} toExtend - object to extend
	* @param {object} mixin (optional) - object with optional functions to extend bc with
	*/
	mixin: function( toExtend, mixin ) {
		toExtend = jQuery.extend( toExtend, mixin );
	},
	
	
	/**
	* Construct some objects
	* @method AFrame.construct
	* @param {object} obj_config - configuration.
	* @return {object} - created object.
	*/
	construct: function( obj_config ) {
		var type = obj_config.type;
		var config = obj_config.config || {};
		var plugins = obj_config.plugins || [];
		var retval;
		var constructor = getConstructor( type );
		
		if( constructor ) {
			retval = new constructor();

			for( var index = 0, plugin; plugin = plugins[ index ]; ++index ) {
				var pluginObj = AFrame.construct( plugin );

				pluginObj.setPlugged( retval );
			} // end for
			
			retval.init( config );
		}
		else {
			throw 'Class: ' + type + ' does not exist.'
		}
		
		return retval;
		
		function getConstructor( name ) {
			var constructor = window;
			var parts = name.split( '.' );
			
			for( var index = 0, part; part = parts[ index ]; ++index ) {
				constructor = constructor[ part ];
				if( !constructor ) {
					break;
				}
			}
			
			return constructor;
		}
	},
	
	/**
	 * Remove an item from an object freeing the reference to the item.
	 * 
	 * @method AFrame.remove
	 * @param {object} object to remove item from.
	 * @param {string} key of item to remove
	 */
	remove: function( object, key ) {
	  object[ key ] = null;
	  delete object[ key ];
	}

	
};


if( !window.console ) {
	window.console = function() {	// do a whole lotta nothin 
	};
}
