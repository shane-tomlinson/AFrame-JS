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
	 * If meta.index > current highest index, inserts at end.
	 * 	If meta.index is negative, item is inserted from end.
	 * 	-1 is at the end.  If not given, inserts at end.
	 * @method insert
	 * @param {object} data - data to use for list item
	 * @param {object} meta (optional) - optional meta data.
	 * return {number} index the item is inserted at.
	 */
	insert: function( data, meta ) {
		meta = meta || {};
		var index = this.getActualInsertIndex( meta.index );
		meta.index = index;
		
		var rowElement = this.createListElementCallback( meta, data );
		index = this.insertElement( rowElement, meta );
		
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
			meta: meta
		} );

		return index;
	},

	/**
	 * Insert an element into the list.
	 * @method insertRow
	 * @param {element} rowElement - element to insert
	 * @param {object} meta (optional) - meta data to insert the element.
	 * index is looked for at meta.index.  If index > current highest index, inserts at end.
	 * 	If index is negative, item is inserted from end.  -1 is at the end.
	 * @return {number} index - the index the item is inserted at.
	 */
	insertElement: function( rowElement, meta ) {
		meta = meta || {};
		var target = this.getTarget();
		var children = target.children();
		
		var index = this.getActualInsertIndex( meta.index );
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
		* @param {object} meta - meta data
		*/
		this.triggerEvent( 'onInsertElement', {
			rowElement: rowElement,
			meta: meta
		} );
		
		return index;
	},

	/**
	 * Remove an item from the list
	 * @method remove
	 * @param {number} index - index of item to remove
	 */
	remove: function( index, meta ) {
		meta = meta || {};
		var removeIndex = this.getActualRemoveIndex( index );
		meta.index = removeIndex;
		var rowElement = this.getTarget().children().eq( removeIndex ).remove();
		
		/**
		* Triggered whenever an element is removed from the list
		* @event onRemoveElement
		* @param {element} rowElement - the row's list element
		* @param {object} meta - meta data
		*/
		this.triggerEvent( 'onRemoveElement', {
			rowElement: rowElement,
			meta: meta
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