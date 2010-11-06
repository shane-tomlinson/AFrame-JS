/**
* A hash object that triggers events whenever inserting, removing, etc.  Note, all
*	events triggered natively by this will have one parameter, data.  This object parameter
*	will have two fields, item and meta.
*
* @class AFrame.MVCHash
* @extends AFrame.AObject
* @constructor
*/
AFrame.MVCHash = function() {
	AFrame.MVCHash.superclass.constructor.apply( this, arguments );
};
AFrame.MVCHash.currID = 0;
AFrame.extend( AFrame.MVCHash, AFrame.AObject, {
	init: function( config ) {
		this.hash = {};
		
		AFrame.MVCHash.superclass.init.apply( this, arguments );
	},
	
	teardown: function() {
		for( var cid in this.hash ) {
			AFrame.remove( this.hash, cid );
		}
		AFrame.remove( this, 'hash' );
		
		AFrame.MVCHash.superclass.teardown.apply( this, arguments );
	},
	
	/**
	* set an item in the hash
	* @method set
	* @param {id} cid - cid to set item at.
	* @param {variant} item - item to set
	* @param {variant} meta - meta data to pass to events.
	*/
	set: function( cid, item, meta ) {
		item.cid = cid;
		var data = this.getEventData( item, meta );
		data.meta.previousItem = this.get( cid );

		/**
		* Triggered before set happens.
		* @event onBeforeSet
		* @param {object} data - data has two fields, item and meta.
		*/
		this.triggerEvent( 'onBeforeSet', data );
		this.hash[ cid ] = item;
		/**
		* Triggered after set happens.
		* @event onSet
		* @param {object} data - data has two fields, item and meta.
		*/
		this.triggerEvent( 'onSet', data );
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
	remove: function( cid, meta ) {
		var item = this.get( cid );
		
		if( item ) {
			var data = this.getEventData( item, meta );
			
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
	* it is looked for from meta.cid.  If not found, it is then assigned.
	* @method insert
	* @param {variant} item to insert
	* @param {object} meta data object to pass to events.
	* @return {id} cid of the item.
	*/
	insert: function( item, meta ) {
		var cid = item.cid || meta && meta.cid || AFrame.getUniqueID();

		if( 'undefined' != typeof( this.get( cid ) ) ) {
			throw 'duplicate cid';
		}
		
		item.cid = cid;
		var data = this.getEventData( item, meta );
		
		/**
		 * Triggered before insertion happens.
		 * @event onBeforeInsert
		 * @param {object} data - data has two fields, item and meta.
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
	getEventData: function( item, meta ) {
		meta = meta || {};
		meta.cid = item.cid;
		
		return {
			item: item,
			meta: meta,
			collection: this
		};
	}
} );