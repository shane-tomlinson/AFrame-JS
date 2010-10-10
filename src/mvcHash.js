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
	
	/**
	* set an item in the hash
	* @method set
	* @param {id} id - id to set item at.
	* @param {variant} item - item to set
	* @param {variant} meta - meta data to pass to events.
	*/
	set: function( id, item, meta ) {
		var data = this.getEventData( id, item, meta );
		data.meta.previousItem = this.get( id );

		/**
		* Triggered before set happens.
		* @event onBeforeSet
		* @param {object} data - data has two fields, item and meta.
		*/
		this.triggerEvent( 'onBeforeSet', data );
		this.hash[ id ] = item;
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
	* @param {id} id - id of item to get
	* @return {variant} item if it exists, undefined otw.
	*/
	get: function( id ) {
		return this.hash[ id ];
	},
	
	/**
	* Remove an item from the store.
	* @method remove
	* @param {id} id - id of item to remove
	* @return {variant} item if it exists, undefined otw.
	*/
	remove: function( id, meta ) {
		var item = this.get( id );
		
		if( item ) {
			var data = this.getEventData( id, item, meta );
			
			/**
			* Triggered before remove happens.
			* @event onBeforeRemove
			* @param {object} data - data has two fields, item and meta.
			*/
			this.triggerEvent( 'onBeforeRemove', data );
			AFrame.remove( this.hash, id );
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
	* Insert an item into the hash
	* @method insert
	* @param {variant} item to insert
	* @param {object} meta data object to pass to events
	* @return {id} id of the item.
	*/
	insert: function( item, meta ) {
		AFrame.MVCHash.currID++;
		var id = 'aframeid' + AFrame.MVCHash.currID;
		
		return this.insertAs( id, item, meta );
	},
	
	/**
	* Insert an item with the given id into the hash.
	* @method insertAs
	* @param {id} id of item
	* @param {variant} item to insert
	* @param {object} meta data object to pass to events
	* @return {id} id of the item.
	* @throws 'no id given' if id is undefined
	* @throws 'duplicate id' if item already exists with id
	*/
	insertAs: function( id, item, meta ) {
		if( !id ) {
			throw 'no id given';
		}
		else if( 'undefined' != typeof( this.get( id ) ) ) {
			throw 'duplicate id';
		}
		
		var data = this.getEventData( id, item, meta );
		
		/**
		* Triggered before insertion happens.
		* @event onBeforeInsert
		* @param {object} data - data has two fields, item and meta.
		*/
		this.triggerEvent( 'onBeforeInsert', data );
		this.hash[ id ] = item;

		/**
		* Triggered after insertion happens.
		* @event onInsert
		* @param {object} data - data has two fields, item and meta.
		*/
		this.triggerEvent( 'onInsert', data );
		
		return id;
	},
	
	/**
	* @private
	*/
	getEventData: function( id, item, meta ) {
		meta = meta || {};
		meta.id = id;
		
		return {
			item: item,
			meta: meta
		};
	}
} );