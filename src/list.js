/**
 * A generic HTML list class
 * @class AFrame.List
 * @extends AFrame.Display
 * @constructor
 */
/**
 * A function to call to create a list element.  function will be called with two parameters, an index and the data.
 * @config createListElementCallback
 * @type {function}
 */
AFrame.List = function() {
	AFrame.List.superclass.constructor.apply( this, arguments );
};
AFrame.extend( AFrame.List, AFrame.Display, {
	init: function( config ) {
		this.createListElementCallback = config.createListElementCallback;
		
		AFrame.List.superclass.init.apply( this, arguments );
	},

	/**
	 * Insert an item into the list
	 * @method insert
	 * @param {number} index - index to insert at.
	 * @param {object} data - data to use for list item
	 */
	insert: function( index, data ) {
		var rowElement = this.createListElementCallback( index, data );

		this.getTarget().append( rowElement );
		
		this.triggerEvent( 'onInsert', {
			index: index,
			rowElement: rowElement, 
			data: data 
		} );
	},

	/**
	 * Remove an item from the list
	 * @method remove
	 * @param {number} index - index of item to remove
	 */
	remove: function( index ) {
		this.getTarget().children( 'li:eq(' + index + ')' ).remove();
	}
} );