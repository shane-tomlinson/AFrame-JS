/**
* An array collection.  The item's index will be added to all meta information in all events.  Items
* are inserted by index, but can be retreived either by index or by id.
* @class AFrame.CollectionArray
* @extends AFrame.CollectionHash
* @uses AFrame.ArrayCommonFuncsMixin
* @constructor
*/
AFrame.CollectionArray = function() {
	AFrame.CollectionArray.superclass.constructor.apply( this, arguments );
};
AFrame.extend( AFrame.CollectionArray, AFrame.CollectionHash, AFrame.ArrayCommonFuncsMixin, {
	init: function() {
		this.itemCIDs = [];

		AFrame.CollectionArray.superclass.init.apply( this, arguments );
	},
	
	teardown: function() {
		this.itemCIDs.forEach( function( id, index ) {
			this.itemCIDs[ index ] = null;
		}, this );
		AFrame.remove( this, 'itemCIDs' );
		
		AFrame.CollectionArray.superclass.teardown.apply( this, arguments );
	},
	
	/**
	* Insert an item into the array.  
	* @method insert
	* @param {variant} item to insert
	* @param {integer} index (optional) - index to insert into.  If
	* 	not defined, insert at the end of the list.
	* @return {id} cid of the item
	*/
	insert: function( item, index ) {
		index = 'number' == typeof( index ) ? index : -1;
		this.currentIndex = this.getActualInsertIndex( index );
        
		var cid = AFrame.CollectionArray.superclass.insert.call( this, item );
		this.itemCIDs.splice( this.currentIndex, 0, cid );
		
		return cid;
	},
	
	/**
	* Get an item from the array.
	* @method get
	* @param {number || id} index - index or cid of item to get
	* @return {variant} item if it exists, undefined otw.
	*/
	get: function( index ) {
		var cid = this.getCID( index );
		var retval;
		if( cid ) {
			retval = AFrame.CollectionArray.superclass.get.call( this, cid );
		}
		return retval;
	},
	
	/** 
	* Remove an item from the array
	* @method remove
	* @param {number || id} index of item to remove.
	*/
	remove: function( index ) {
		var cid;
		if( 'string' == typeof( index ) ) {
			cid = index;
			index = this.getIndex( index );
		}
		else {
			index = this.getActualRemoveIndex( index );
			cid = this.getCID( index );
		}

		
		var retval;
		if( index > -1 ) {
			this.itemCIDs.splice( index, 1 );
            this.currentIndex = index;
			retval = AFrame.CollectionArray.superclass.remove.call( this, cid );
		}
		
		return retval;
	},
	
	/**
	* Clear the array
	* @method clear
	*/
	clear: function() {
        AFrame.CollectionArray.superclass.clear.call( this );
		
		this.itemCIDs = [];
	},
	
	/**
	* Get the current count of items
	* @method getCount
	* @return {number} current count
	*/
	getCount: function() {
		return this.itemCIDs.length;
	},
	
	/**
	* Get an array representation of the CollectionArray
	* @method getArray
	* @return {array} array representation of CollectionArray
	*/
	getArray: function() {
		var array = [];
		this.itemCIDs.forEach( function( cid, index ) {
			array[ index ] = this.hash.get( cid );
		} );
		
		return array;
	},

	/**
	 * @private
	 */
	getEventData: function( item, data ) {
        data = data || {};
        
        data = jQuery.extend( data, {
            index: this.currentIndex
        } );

		return AFrame.CollectionArray.superclass.getEventData.call( this, item, data );
	},
	
	/**
	 * Given an index or cid, get the cid.
	 * @method getCID
	 * @param {id || number} index
	 * @private
	 */
	getCID: function( index ) {
		var cid = index;
		
		if( 'number' == typeof( index ) ) {
			cid = this.itemCIDs[ index ];
		}
		
		return cid;
	},

	/**
	 * Given an index or cid, get the index.
	 * @method getIndex
	 * @param {id || number} index
	 * @private
	 */
	getIndex: function( index ) {
		if( 'string' == typeof( index ) ) {
			index = this.itemCIDs.indexOf( index );
		}
		
		return index;
	}
} );