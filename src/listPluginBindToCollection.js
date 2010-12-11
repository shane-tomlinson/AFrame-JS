/**
 * A plugin that binds a list to a collection.  Listens for onInsert and onRemove
 * events, when this happens, the list is automatically updated.  Adds getIndex
 * to the plugged list.
 * @class AFrame.ListPluginBindToCollection
 * @extends AFrame.Plugin
 * @constructor
 */
AFrame.ListPluginBindToCollection = function() {
	AFrame.ListPluginBindToCollection.superclass.constructor.apply( this, arguments );
};

AFrame.extend( AFrame.ListPluginBindToCollection, AFrame.Plugin, {
	init: function( config ) {
		/**
		 * The collection to bind to
		 * @config collection
		 * @type {Collection}
		 */
		this.collection = config.collection;
		this.collection.bindEvent( 'onInsert', this.onInsert, this );
		this.collection.bindEvent( 'onRemove', this.onRemove, this );

		this.cids = [];
		
		AFrame.ListPluginBindToCollection.superclass.init.apply( this, arguments );
	},
	
	setPlugged: function( plugged ) {
		plugged.getIndex = this.getIndex.bind( this );
		
		AFrame.ListPluginBindToCollection.superclass.setPlugged.apply( this, arguments );
	},
	
	onInsert: function( data ) {
		var index = this.getPlugged().insert( data.item, data.index || -1 );

		this.cids.splice( index, 0, data.cid );
	},
	
	onRemove: function( data ) {
		var index = this.cids.indexOf( data.cid );
		
		this.getPlugged().remove( index );
		
		this.cids.splice( index, 1 );
	},
	
	/**
	 * Given an index or cid, get the index.
	 * @param {number || id} indexCID - either the index or the cid of an item
	 * @return {number} index of item
	 */
	getIndex: function( indexCID ) {
		var index = indexCID;
		
		if( 'string' == typeof( indexCID ) ) {
			index = this.cids.indexOf( indexCID );
		}
		
		return index;
	}
} );