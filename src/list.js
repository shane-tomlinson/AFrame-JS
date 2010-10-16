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
	 * @param {number} index - index to insert at.  If index > current highest index, inserts at end.
	 * 	If index is negative, item is inserted from end.  -1 is at the end.
	 * @param {object} data - data to use for list item
	 */
	insert: function( index, data ) {
		var insertIndex = this.getActualInsertIndex( index );
		var rowElement = this.createListElementCallback( insertIndex, data );
		this.insertElement( insertIndex, rowElement );
		
		this.triggerEvent( 'onInsert', {
			index: insertIndex,
			rowElement: rowElement, 
			data: data 
		} );

		return insertIndex;
	},

	/**
	 * Insert an element into the list.
	 * @method insertRow
	 * @param {number} index - index to insert at.  If index > current highest index, inserts at end.
	 * 	If index is negative, item is inserted from end.  -1 is at the end.
	 * @param {element} rowElement - element to insert
	 */
	insertElement: function( index, rowElement ) {
		var target = this.getTarget();
		var children = target.children();
		
		var insertIndex = this.getActualInsertIndex( index );
		if( insertIndex === children.length ) {
			target.append( rowElement );
		}
		else {
			var insertBefore = children.eq( insertIndex );
			rowElement.insertBefore( insertBefore );
		}

		this.triggerEvent( 'onInsertElement', {
			index: insertIndex,
			rowElement: rowElement
		} );
		
		return insertIndex;
	},

	/**
	 * Remove an item from the list
	 * @method remove
	 * @param {number} index - index of item to remove
	 */
	remove: function( index ) {
		var removeIndex = this.getActualRemoveIndex( index );
		var rowElement = this.getTarget().children().eq( removeIndex ).remove();

		this.triggerEvent( 'onRemoveElement', {
			index: removeIndex,
			rowElement: rowElement
		} );
	},
	
	/**
	 * @private
	 * Given an tentative index, get the index the item would be inserted at
	 * @method getActualInsertIndex
	 * @param {number} index - index to check for
	 */
	getActualInsertIndex: function( index ) {
		var len = this.getTarget().children().length;
		
		if( index < 0 ) {
			index = len + ( index + 1 );
		}
		
		index = Math.max( 0, index );
		index = Math.min( len, index );
		
		return index;
	},

	/**
	 * @private
	 * Given an tentative index, get the index the item would be removed from
	 * @method getActualRemoveIndex
	 * @param {number} index - index to check for
	 */
	getActualRemoveIndex: function( index ) {
		var len = this.getTarget().children().length;

		if( index < 0 ) {
			index = len + index;
		}

		index = Math.min( len - 1, index );
		index = Math.max( 0, index );
		
		return index;
	}
} );