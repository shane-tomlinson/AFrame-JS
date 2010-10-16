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
		
		AFrame.ListPluginBindToCollection.superclass.init.apply( this, arguments );
	},
	
	onInsert: function( data ) {
		this.getPlugged().insert( data.meta.index || -1, data.item );
	},
	
	onRemove: function( data ) {
		// XXX - how do we tie in a normal non-array collection an id to an index?
		this.getPlugged().remove( data.meta.index );
	}
} );