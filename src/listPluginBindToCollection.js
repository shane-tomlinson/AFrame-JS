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
	
	onInsert: function( index, item ) {
		this.getPlugged().insert( index, item );
	},
	
	onRemove: function( index, item ) {
		this.getPlugged().remove( index );
	}
} );