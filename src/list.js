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

	clear: function() {
		this.getTarget().html( '' );
	},
	
	/**
	 * Insert a data item into the list, the list item is created using the createListElementCallback.
	 * @method insert
	 * @param {object} data - data to use for list item
	 * @param {number} index - index to insert at.  If index > current highest index, inserts at end.
	 */
	insert: function( data, index ) {
		var rowElement = this.createListElementCallback( index, data );
		var insertedIndex = this.insertElement( rowElement, index );
		
		this.triggerEvent( 'onInsert', {
			index: insertedIndex,
			rowElement: rowElement, 
			data: data 
		} );

		return insertedIndex;
	},

	/**
	 * Insert an element into the list.
	 * @method insertRow
	 * @param {element} rowElement - element to insert
	 * @param {number} index - index to insert at.
	 */
	insertElement: function( rowElement, index ) {
		var target = this.getTarget();
		var children = target.children();
		if( index < children.length ) {
			var insertBefore = children.eq( index );
			rowElement.insertBefore( insertBefore );
		}
		else {
			index = children.length;
			target.append( rowElement );
		}

		return index;
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