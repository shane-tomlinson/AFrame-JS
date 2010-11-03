/**
 * A plugin that binds a list to a collection.  Listens for onInsert and onRemove
 * events, when this happens, the list is automatically updated
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
		 * @type {collection}
		 */
		this.collection = config.collection;
		this.collection.bindEvent( 'onInsert', this.onInsert, this );
		this.collection.bindEvent( 'onRemove', this.onRemove, this );

		this.cids = [];
		
		AFrame.ListPluginBindToCollection.superclass.init.apply( this, arguments );
	},
	
	onInsert: function( data ) {
		var index = this.getPlugged().insert( data.item, data.meta );

		this.cids.splice( index, 0, data.meta.cid );
	},
	
	onRemove: function( data ) {
		var index = this.cids.indexOf( data.meta.cid );
		
		this.getPlugged().remove( index );
		
		this.cids.splice( index, 1 );
	}
} );