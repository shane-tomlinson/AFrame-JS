/**
 * A plugin that binds a list to a collection.  Listens for onInsert and onRemove
 * events, when this happens, the list is automatically updated
 * @class AFrame.ListPluginBindToMVCArray
 * @extends AFrame.Plugin
 * @constructor
 */
AFrame.ListPluginBindToMVCArray = function() {
	AFrame.ListPluginBindToMVCArray.superclass.constructor.apply( this, arguments );
};

AFrame.extend( AFrame.ListPluginBindToMVCArray, AFrame.Plugin, {
	init: function( config ) {
		this.collection = config.collection;
		this.collection.bindEvent( 'onInsert', this.onInsert, this );
		this.collection.bindEvent( 'onRemove', this.onRemove, this );
		
		AFrame.ListPluginBindToMVCArray.superclass.init.apply( this, arguments );
	},
	
	onInsert: function( index, item ) {
		this.getPlugged().insert( index, item );
	},
	
	onRemove: function( index, item ) {
		this.getPlugged().remove( index );
	}
} );