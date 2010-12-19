/**
 * A generic HTML list class.  A list is any list of data.  A List shares
 *  the majority of its interface with a <a href="docs/AFrame.CollectionArray.html">CollectionArray</a> 
 *  since lists are inherently ordered (even if they are ULs).  There are two methods
 *  for inserting an item into the list, either passing an already created
 *  element to [insertElement](#method_insertElement) or by passing data to [insert](#method_insert). 
 *  If using insert, a factory function (listElementFactory) must be specified in the configuration.
 *  The factory function can either create an element directly or use some sort of prototyping system
 *  to create the element.  The factory function must return the element to be inserted.
 *
 * 
 *    <ul id="clientList">
 *    </ul>
 *   
 *    ---------
 *    // Set up a factory to create list elements.  This can create the elements 
 *    // directly or use sort of templating system.
 *    var factory = function( index, data ) {
 *       var listItem = $( '<li>' + data.name + ', ' + data.employer + '</li>' );
 *       return listItem;
 *    };
 *   
 *    var list = AFrame.construct( {
 *       type: AFrame.List,
 *       config: {
 *           target: '#clientList',
 *           listElementFactory: factory
 *       }
 *    } );
 *   
 *    // Creates a list item using the factory function, item is inserted
*     // at the end of the list
 *    list.insert( {
 *       name: 'Shane Tomlinson',
 *       employer: 'AFrame Foundary'
 *    } );
 *   
 *    // Inserts a pre-made list item at the head of the list
 *    list.insertRow( $( '<li>Joe Smith, the Coffee Shop</li>' ), 0 );
 *    ---------
 *
 *    <ul id="clientList">
 *       <li>Joe Smith, The Coffee Shop</li>
 *       <li>Shane Tomlinson, AFrame Foundary</li>
 *    </ul>
 *
 * @class AFrame.List
 * @extends AFrame.Display
 * @uses AFrame.ArrayCommonFuncsMixin
 * @constructor
 */
/**
 * A function to call to create a list element.  function will be called with two parameters, an index and the data.
 * @config listElementFactory
 * @type {function}
 */
AFrame.List = function() {
	AFrame.List.superclass.constructor.apply( this, arguments );
};
AFrame.extend( AFrame.List, AFrame.Display, AFrame.ArrayCommonFuncsMixin, {
	init: function( config ) {
		this.listElementFactory = config.listElementFactory;
		
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
	 * Insert a data item into the list, the list item is created 
     *  using the listElementFactory.
     *
     *   
     *    // Creates a list item using the factory function, 
     *    // item is inserted at the end of the list.
     *    list.insert( {
     *       name: 'Shane Tomlinson',
     *       employer: 'AFrame Foundary'
     *    } );
     *   
     *   
     *    // Item is inserted at index 0, the first item in the list.
     *    list.insert( {
     *       name: 'Shane Tomlinson',
     *       employer: 'AFrame Foundary'
     *    }, 0 );
     *   
     *    // Item is inserted at the end of the list
     *    list.insert( {
     *       name: 'Shane Tomlinson',
     *       employer: 'AFrame Foundary'
     *    }, -1 );
     *   
     *    // Item is inserted two from the end
     *    list.insert( {
     *       name: 'Shane Tomlinson',
     *       employer: 'AFrame Foundary'
     *    }, -2 );
     *   
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

		var rowElement = this.listElementFactory( data, index );
		index = this.insertElement( rowElement, index );
		
		/**
		* Triggered whenever a row is inserted into the list
		* @event onInsert
		* @param {element} rowElement - the row's list element
		* @param {object} options - information about the insert
		* @param {element} options.rowElement - row's element
		* @param {object} options.data - data that was inserted
		* @param {object} options.index - index where row was inserted
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
     *   
     *    // Item is inserted at index 0, the first item in the list.
     *    list.insertElement( $( '<li>Shane Tomlinson, AFrame Foundary</li>' ), 0 );
     *   
	 * @method insertElement
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
		* @param {object} options - information about the insert
		* @param {element} options.rowElement - row's element
		* @param {object} options.index - index where row was inserted
		*/
		this.triggerEvent( 'onInsertElement', {
			rowElement: rowElement,
			index: index
		} );
		
		return index;
	},

	/**
	 * Remove an item from the list
     *   
     *    // Remove first item in the list.
     *    list.remove( 0 );
     *   
	 * @method remove
	 * @param {number} index - index of item to remove
	 */
	remove: function( index ) {
		var removeIndex = this.getActualIndex( index );
		var rowElement = this.getTarget().children().eq( removeIndex ).remove();
		
		/**
		* Triggered whenever an element is removed from the list
		* @event onRemoveElement
		* @param {object} options - information about the insert
		* @param {element} options.rowElement - row's element
		* @param {object} options.index - index where row was inserted
		*/
		this.triggerEvent( 'onRemoveElement', {
			rowElement: rowElement,
			index: index
		} );
	},
	
	/**
	* Get the number of items
    *   
    *    // Get the number of items
    *    var count = list.getCount();
    *   
	* @method getCount
	* @return {number} number of items
	*/
	getCount: function() {
		return this.getTarget().children().length;
	}
} );