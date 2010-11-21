
/**
* The AFrame namespace
* @class AFrame
* @static
*/
var AFrame = {
	/**
	* extend a class with another class and optional functions
	* @method AFrame.extend
	* @param {function} derived - class to extend
	* @param {function} superclass - class to extend with.
	* @param {object} extrafuncs (optional) - all additional parameters will have their functions mixed in.
	*/
	extend: function( derived, superclass ) {
		var F = function() {};
		F.prototype = superclass.prototype;
		derived.prototype = new F();
		derived.prototype.constuct = derived;
		derived.superclass = superclass.prototype;

		var mixins = Array.prototype.slice.call( arguments, 2 );
		for( var mixin, index = 0; mixin = mixins[ index ]; ++index ) {
			AFrame.mixin( derived.prototype, mixin );
		}
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
	 * @method AFrame.remove
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
	 * @method getUniqueID
	 * @return {id} a unique id
	 */
	getUniqueID: function() {
		this.currentID++;
		return 'cid' + this.currentID;
	},

	/**
	 * Check whether an item is defined
	 * @method defined
	 * @param {variant} itemToCheck
	 * @return {boolean} true if item is defined, false otw.
	 */
	defined: function( itemToCheck ) {
		return 'undefined' != typeof( itemToCheck );
	},
	
	/**
	* Check whether an item is a function
	* @method func
	* @param {variant} itemToCheck
	* @return {boolean} true if item is a function, false otw.
	*/
	func: function( itemToCheck ) {
		return 'function' == typeof( itemToCheck );
	}
};
