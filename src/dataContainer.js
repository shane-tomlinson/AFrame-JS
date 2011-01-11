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
	AFrame.DataContainer.sc.constructor.apply( this, arguments );

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
		
		if( this.data.__dataContainer ) {
			throw Error( 'Cannot create a second AFrame.DataContainer for an object' );
		}
		
		this.data.__dataContainer = this;
		this.fieldBindings = {};
		
		AFrame.DataContainer.sc.init.apply( this, arguments );
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
		
		/**
		* Triggered whenever any item on the object is set.
		* @event onSet
		* @param {AFrame.event} event - an event object. @see [getEventObject](#method_getEventObject)
	    * @param {string} event.fieldName - name of field affected.
	    * @param {variant} event.value - the current value of the field.
	    * @param {variant} event.oldValue - the previous value of the field (only applicable if data has changed).
		* @param {object} event.container - the DataContainer
		*/
        this.triggerEvent( {
            container: this,
            fieldName: fieldName,
            oldValue: oldValue,
            value: fieldValue,
            type: 'onSet'
        } );
		/**
		* Triggered whenever an item on the object is set.  This is useful to bind
		*	to whenever a particular field is being changed.
		* @event onSet-fieldName
		* @param {object} event - an event object.  @see [getEventObject](#method_getEventObject)
	    * @param {string} event.fieldName - name of field affected.
	    * @param {variant} event.value - the current value of the field.
	    * @param {variant} event.oldValue - the previous value of the field (only applicable if data has changed).
		* @param {object} event.container - the DataContainer
		*/
        this.triggerEvent( {
            container: this,
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
} );
