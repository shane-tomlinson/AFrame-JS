/**
* A basic data container. Used like a hash. Provides functionality that allows the binding of callbacks
*	to the change in a piece of data.  The preferred method of creating an AFrame.DataContainer is to
*	do "dataContainer = AFrame.DataContainer( data );"  This ensures that only one DataContainer is
*	ever created for a given object.
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
				type: 'AFrame.DataContainer',
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
			if( key !== '__dataContainer' ) {
				callback.call( context, this.data[ key ], key );
			}
		}
	}
} );