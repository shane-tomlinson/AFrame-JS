AFrame.ListPluginBindToMVCArray = function() {
	AFrame.ListPluginBindToMVCArray.superclass.constructor.apply( this, arguments );
}

AFrame.extend( AFrame.ListPluginBindToMVCArray, AFrame.Plugin, {
	init: function( config ) {
		this.store = config.store;
		this.store.bindEvent( 'onInsert', this.onInsert, this );
		this.store.bindEvent( 'onRemove', this.onRemove, this );
		
		AFrame.ListPluginBindToMVCArray.superclass.init.apply( this, arguments );
	},
	
	onInsert: function( index, item ) {
		this.getPlugged().insert( index, item );
	},
	
	onRemove: function( index, item ) {
		this.getPlugged().remove( index );
	}
} );