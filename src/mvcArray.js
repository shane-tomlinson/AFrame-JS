/**
* an array to be used MVC style.  The item's index will be added to all meta information in all events.  Items
* are inserted by index, but can be retreived either by index or by id.
* @class AFrame.MVCArray
* @extends AFrame.MVCHash
* @uses AFrame.ArrayCommonFuncsMixin
* @constructor
*/
AFrame.MVCArray = function() {
	AFrame.MVCArray.superclass.constructor.apply( this, arguments );
};
AFrame.extend( AFrame.MVCArray, AFrame.AObject, AFrame.ArrayCommonFuncsMixin, {
	init: function() {
		this.itemIDs = [];
		this.hash = AFrame.construct( {
			type: 'AFrame.MVCHash'
		} );
		this.proxyEvents( this.hash, [ 'onBeforeInsert', 'onInsert', 'onBeforeRemove', 'onRemove', 'onBeforeSet', 'onSet' ] );
		
		AFrame.MVCArray.superclass.init.apply( this, arguments );
	},
	
	teardown: function() {
		this.itemIDs.forEach( function( id, index ) {
			this.itemIDs[ index ] = null;
		}, this );
		AFrame.remove( this, 'itemIDs' );
		
		this.hash.teardown();
		
		AFrame.MVCArray.superclass.teardown.apply( this, arguments );
	},
	
	/**
	* Insert an item into the array.  ID is assigned by hash unless specified
	* 	in the meta parameter's id field.
	* @method insert
	* @param {number} index to insert into
	* @param {variant} item to insert
	* @param {object} meta information
	*/
	insert: function( index, item, meta ) {
		var realInsertIndex = this.getActualInsertIndex( index );
		var id = this.hash.insert( item, this.getArrayMeta( realInsertIndex, meta ) );
		
		this.itemIDs.splice( realInsertIndex, 0, id );
		
		return id;
	},
	
	/**
	 * Push an item onto the array.  ID is assigned by hash unless specified
	 * 	in the meta parameter's id field.
	* @method push
	* @param {variant} item to insert
	* @param {object} meta information
	*/
	push: function( item, meta ) {
		return this.insert( -1, item, meta );
	},
	
	/**
	* Get an item from the array.
	* @method get
	* @param {number || id} index - index or id of item to get
	* @return {variant} item if it exists, undefined otw.
	*/
	get: function( index ) {
		var id = this.getID( index );
		var retval;
		if( id ) {
			retval = this.hash.get( id );
		}
		return retval;
	},
	
	/** 
	* Remove an item from the array
	* @method remove
	* @param {number || id} index of item to remove.
	* @param {object} meta information
	*/
	remove: function( index, meta ) {
		var id;
		if( 'string' == typeof( index ) ) {
			id = index;
			index = this.getIndex( index );
		}
		else {
			index = this.getActualRemoveIndex( index );
			id = this.getID( index );
		}

		
		var retval;
		if( index > -1 ) {
			this.itemIDs.splice( index, 1 );
			retval = this.hash.remove( id, this.getArrayMeta( index, meta ) );
		}
		
		return retval;
	},
	
	/**
	* Get the current count of items
	* @method getCount
	* @return {number} current count
	*/
	getCount: function() {
		return this.itemIDs.length;
	},
	
	/**
	* Get an array representation of the MVCArray
	* @method getArray
	* @return {array} array representation of MVCArray
	*/
	getArray: function() {
		var array = [];
		this.itemIDs.forEach( function( id, index ) {
			array[ index ] = this.hash.get( id );
		} );
		
		return array;
	},

	/**
	 * @private
	 */
	getArrayMeta: function( index, meta ) {
		meta = meta || {};
		meta.index = index;
		return meta;
	},
	
	/**
	 * Given an index or id, get the id.
	 * @method getID
	 * @param {id || number} index
	 * @private
	 */
	getID: function( index ) {
		var id = index;
		
		if( 'number' == typeof( index ) ) {
			id = this.itemIDs[ index ];
		}
		
		return id;
	},

	/**
	/**
	 * Given an index or id, get the index.
	 * @method getIndex
	 * @param {id || number} index
	 * @private
	 */
	getIndex: function( index ) {
		if( 'string' == typeof( index ) ) {
			index = this.itemIDs.indexOf( index );
		}
		
		return index;
	}
} );