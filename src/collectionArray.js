/**
* An array collection.  Unlike the [CollectionHash](AFrame.CollectionHash.html), the CollectionArray can be accessed via 
* either a key or an index.  When accessed via a key, the item's CID will be used.  If an item has a cid field when
* inserted, this cid will be used, otherwise a cid will be assigned.
* 
* This raises the same events as AFrame.CollectionHash, but every event will have one additional parameter, index.
*
*    Create the array
*    var collection = AFrame.construct( {
*       type: AFrame.CollectionArray
*    } );
*
*    // First item is inserted with a cid, inserted at the end of the array.
*    var aframeCID = collection.insert( { cid: 'cid1',
*                             name: 'AFrame Foundary',
*                             city: 'London',
*                             country: 'United Kingdom'
*                           } );
*    // aframeCID variable will be 'cid1'
*
*    // inserts google at the head of the list.
*    var googleCID = collection.insert( { name: 'Google',
*                                   city: 'Santa Clara',
*                                   country: 'United States'
*                                 }, 0 );
*    // googleCID will be assigned by the system
*
*    // microsoft inserted at the end of the list.
*    var microsoftCID = collection.insert( { name: 'Microsoft',
*                                   city: 'Redmond',
*                                   country: 'United States'
*                                 }, -1 );
*    // microsoftCID will be assigned by the system
*
*    // Getting an item via index.  This will return google item.
*    var item = collection.get( 0 );
*    // item will be the google item
*
*    // Getting an item via negative index.  This will return microsoft item.
*    var item = collection.get( -1 );
*    // item will be the microsoft item
*
*    // Getting an item via CID.  This will return the aframe item.
*    item = collection.get( aframeCID );
*
*    var googleItem = collection.remove( googleCID );
*    // googleItem will be the google item that was inserted
*
*    var aframeItem = collection.remove( 0 );
*    // aframeItem will be the aframe item since the google item was first but is now removed
*
* @class AFrame.CollectionArray
* @extends AFrame.CollectionHash
* @uses AFrame.ArrayCommonFuncsMixin
* @constructor
*/
AFrame.CollectionArray = function() {
	AFrame.CollectionArray.sc.constructor.apply( this, arguments );
};
AFrame.extend( AFrame.CollectionArray, AFrame.CollectionHash, AFrame.ArrayCommonFuncsMixin, {
	init: function() {
		this.itemCIDs = [];

		AFrame.CollectionArray.sc.init.apply( this, arguments );
	},
	
	teardown: function() {
		this.itemCIDs.forEach( function( id, index ) {
			this.itemCIDs[ index ] = null;
		}, this );
		AFrame.remove( this, 'itemCIDs' );
		
		AFrame.CollectionArray.sc.teardown.apply( this, arguments );
	},
	
	/**
	* Insert an item into the array.  
    *
    *    // First item is inserted with a cid, inserted at the end of the array.
    *    var aframeCID = collection.insert( { cid: 'cid1',
    *                             name: 'AFrame Foundary',
    *                             city: 'London',
    *                             country: 'United Kingdom'
    *                           } );
    *    // aframeCID variable will be 'cid1'
    *
    *    // inserts google at the head of the list.
    *    var googleCID = collection.insert( { name: 'Google',
    *                                   city: 'Santa Clara',
    *                                   country: 'United States'
    *                                 }, 0 );
    *    // googleCID will be assigned by the system
    *
    *    // microsoft inserted at the end of the list.
    *    var microsoftCID = collection.insert( { name: 'Microsoft',
    *                                   city: 'Redmond',
    *                                   country: 'United States'
    *                                 }, -1 );
    *    // microsoftCID will be assigned by the system
	* @method insert
	* @param {variant} item to insert
	* @param {integer} index (optional) - index to insert into.  If
	* 	not defined, insert at the end of the list.
	* @return {id} cid of the item
	*/
	insert: function( item, index ) {
		index = 'number' == typeof( index ) ? index : -1;
		this.currentIndex = this.getActualInsertIndex( index );
        
		var cid = AFrame.CollectionArray.sc.insert.call( this, item );
		this.itemCIDs.splice( this.currentIndex, 0, cid );
		
		return cid;
	},
	
	/**
	* Get an item from the array.
    *
    *    // Getting an item via index.  This will return google item.
    *    var item = collection.get( 0 );
    *    // item will be the google item
    *
    *    // Getting an item via negative index.  This will return microsoft item.
    *    var item = collection.get( -1 );
    *    // item will be the microsoft item
    *
    *    // Getting an item via CID.  This will return the aframe item.
    *    item = collection.get( aframeCID );
    *
	* @method get
	* @param {number || id} index - index or cid of item to get
	* @return {variant} item if it exists, undefined otw.
	*/
	get: function( index ) {
		var cid = this.getCID( index );
		var retval;
		if( cid ) {
			retval = AFrame.CollectionArray.sc.get.call( this, cid );
		}
		return retval;
	},
	
	/** 
	* Remove an item from the array
    *
    *    var googleItem = collection.remove( googleCID );
    *    // googleItem will be the google item that was inserted
    *
    *    var aframeItem = collection.remove( 0 );
    *    // aframeItem will be the aframe item since the google item was first but is now removed
    *
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
			index = this.getActualIndex( index );
			cid = this.getCID( index );
		}

		
		var retval;
		if( index > -1 ) {
			this.itemCIDs.splice( index, 1 );
            this.currentIndex = index;
			retval = AFrame.CollectionArray.sc.remove.call( this, cid );
		}
		
		return retval;
	},
	
	/**
	* Clear the array
    *
    *    // Clears the collection.
    *    collection.clear();
    *
	* @method clear
	*/
	clear: function() {
        AFrame.CollectionArray.sc.clear.call( this );
		
		this.itemCIDs = [];
	},
	
	/**
	* Get the current count of items
    *
    *    // Get the number of items in the collection.
    *    var count = collection.clear();
    *
	* @method getCount
	* @return {number} current count
	*/
	getCount: function() {
		return this.itemCIDs.length;
	},
	
	/**
	* Get an array representation of the CollectionArray
    *
    *    // Returns the array representation of the collection.
    *    var itemsArray = collection.getArray();
    *
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

		return AFrame.CollectionArray.sc.getEventData.call( this, item, data );
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
            index = this.getActualIndex( index );
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