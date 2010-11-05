/**
* A basic data container. Used like a hash. Provides functionality that allows the binding of callbacks
*	to the change in a piece of data.
* @class AFrame.DataContainer
* @extends AFrame.AObject
* @constructor
*/
AFrame.DataContainer = function() {
	AFrame.DataContainer.superclass.constructor.apply( this, arguments );
};
AFrame.extend( AFrame.DataContainer, AFrame.AObject, {
	init: function( config ) {
		/**
		* Initial data
		* @config data
		* @type {object}
		* @default {}
		*/
		this.data = config.data || {};
		this.fieldBindings = {};
		
		AFrame.DataContainer.superclass.init.apply( this, arguments );
	},
	
	/**
	* Set an item of data
	* @method set
	* @param {string} fieldName name of field
	* @param {variant} fieldValue value of field
	* @return {variant} previous value of field
	*/
	set: function( fieldName, fieldValue ) {
		var oldValue = this.data[ fieldName ];
		this.data[ fieldName ] = fieldValue;
		
		var eventObject = this.getEventObject( fieldName, fieldValue, oldValue );
		this.triggerEvent( 'onSet', eventObject );
		this.triggerEvent( 'onSet-' + fieldName, eventObject );
		
		return oldValue;
	},
	
	/**
	* Get the value of a field
	* @method get
	* @return {variant} value of field
	*/
	get: function( fieldName ) {
		return this.data[ fieldName ];
	},
	
	/**
	* Bind a callback to a field
	* @method bindField
	* @param {string} fieldName name of field
	* @param {function} callback callback to call
	* @param {object} context context to call callback in
	* @return {id} id that can be used to unbind the field
	*/
	bindField: function( fieldName, callback, context ) {
		var eventObject = this.getEventObject( fieldName, this.get( fieldName ), undefined );
		callback.call( context, eventObject );
		
		return this.bindEvent( 'onSet-' + fieldName, callback, context );
	},
	
	/**
	* Unbind a field
	* @method unbindField
	* @param {id} id given by bindField
	*/
	unbindField: function( id ) {
		return this.unbindEvent( id );
	},
	
	getEventObject: function( fieldName, newValue, oldValue ) {
		return {
			container: this,
			fieldName: fieldName,
			oldValue: oldValue,
			value: newValue
		};
	},
	
	/**
	* Iterate over each item in the dataContainer.  Callback will be called with two parameters, the first the value, the second the key
	* @method forEach
	* @param {function} function to call
	* @param {object} context (optional) optional context
	*/
	forEach: function( callback, context ) {
		for( var key in this.data ) {
			callback.call( context, this.data[ key ], key );
		}
	}
} );