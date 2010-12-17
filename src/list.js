/**
 * A generic HTML list class
 * @class AFrame.List
 * @extends AFrame.Display
 * @uses AFrame.ArrayCommonFuncsMixin
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
AFrame.extend( AFrame.List, AFrame.Display, AFrame.ArrayCommonFuncsMixin, {
	init: function( config ) {
		this.createListElementCallback = config.createListElementCallback;
		
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
	 * Insert a data item into the list, the list item is created using the createListElementCallback.
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

		var rowElement = this.createListElementCallback( data, index );
		index = this.insertElement( rowElement, index );
		
		/**
		* Triggered whenever a row is inserted into the list
		* @event onInsert
		* @param {element} rowElement - the row's list element
		* @param {object} data - row's data
		* @param {object} meta - meta data
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
	 * @method insertRow
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
		* @param {element} rowElement - the row's list element
		* @param {number} index - index where to insert element
		*/
		this.triggerEvent( 'onInsertElement', {
			rowElement: rowElement,
			index: index
		} );
		
		return index;
	},

	/**
	 * Remove an item from the list
	 * @method remove
	 * @param {number} index - index of item to remove
	 */
	remove: function( index ) {
		var removeIndex = this.getActualIndex( index );
		var rowElement = this.getTarget().children().eq( removeIndex ).remove();
		
		/**
		* Triggered whenever an element is removed from the list
		* @event onRemoveElement
		* @param {element} rowElement - the row's list element
		* @param {object} meta - meta data
		*/
		this.triggerEvent( 'onRemoveElement', {
			rowElement: rowElement,
			index: index
		} );
	},
	
	/**
	* Get the number of items
	* @method getCount
	* @return {number} number of items
	*/
	getCount: function() {
		return this.getTarget().children().length;
	}
} );