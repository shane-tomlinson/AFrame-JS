/**
* A hash object that triggers events whenever inserting, removing, etc.  Note, all
*	events triggered natively by this will have one parameter, data.
*
* @class AFrame.CollectionHash
* @extends AFrame.AObject
* @constructor
*/
AFrame.CollectionHash = function() {
	AFrame.CollectionHash.superclass.constructor.apply( this, arguments );
};
AFrame.CollectionHash.currID = 0;
AFrame.extend( AFrame.CollectionHash, AFrame.AObject, {
	init: function( config ) {
		this.hash = {};
		
		AFrame.CollectionHash.superclass.init.apply( this, arguments );
	},
	
	teardown: function() {
		for( var cid in this.hash ) {
			AFrame.remove( this.hash, cid );
		}
		AFrame.remove( this, 'hash' );
		
		AFrame.CollectionHash.superclass.teardown.apply( this, arguments );
	},
	
	/**
	* Get an item from the hash
	* @method get
	* @param {id} cid - cid of item to get
	* @return {variant} item if it exists, undefined otw.
	*/
	get: function( cid ) {
		return this.hash[ cid ];
	},
	
	/**
	* Remove an item from the store.
	* @method remove
	* @param {id} cid - cid of item to remove
	* @return {variant} item if it exists, undefined otw.
	*/
	remove: function( cid ) {
		var item = this.get( cid );
		
		if( item ) {
			var data = this.getEventData( item, { cid: cid } );
			
			/**
			* Triggered before remove happens.
			* @event onBeforeRemove
			* @param {object} data - data has two fields, item and meta.
			*/
			this.triggerEvent( 'onBeforeRemove', data );
			AFrame.remove( this.hash, cid );
			/**
			* Triggered after remove happens.
			* @event onRemove
			* @param {object} data - data has two fields, item and meta.
			*/
			this.triggerEvent( 'onRemove', data );
		}
		
		return item;
	},
	
	/**
	* Insert an item into the hash.  CID is gotten first from the item's cid field.  If this doesn't exist,
	* it is then assigned.
	* @method insert
	* @param {variant} item - item to insert
	* @return {id} cid of the item.
	*/
	insert: function( item ) {
		var cid = item.cid || AFrame.getUniqueID();

		if( 'undefined' != typeof( this.get( cid ) ) ) {
			throw 'duplicate cid';
		}
		
		var data = this.getEventData( item, { cid: cid } );
		
		/**
		 * Triggered before insertion happens.
		 * @event onBeforeInsert
		 * @param {object} data - data has two fields.
		 */
		this.triggerEvent( 'onBeforeInsert', data );
		this.hash[ cid ] = item;
		
		/**
		 * Triggered after insertion happens.
		 * @event onInsert
		 * @param {object} data - data has two fields, item and meta.
		 */
		this.triggerEvent( 'onInsert', data );
		
		return cid;
	},
	
	/**
	* Clear the hash
	* @method clear
	*/
	clear: function() {
		for( var cid in this.hash ) {
			this.remove( cid );
		}
	},
	
	/**
	* Get the current count of items
	* @method getCount
	* @return {number} current count
	*/
	getCount: function() {
		var count = 0;
		
		for( var cid in this.hash ) {
			count++;
		}
		
		return count;
	},
	
	/**
	* @private
	*/
	getEventData: function( item, data ) {
		data = data || {};
        
        data = jQuery.extend( data, {
            collection: this,
            item: item
        } );
		
		return data;
	}
} );