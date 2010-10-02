AFrame.MVCArray = function() {
	AFrame.MVCArray.superclass.constructor.apply( this, arguments );
}
AFrame.extend( AFrame.MVCArray, AFrame.AObject, {
	init: function() {
		this.items = [];
	},
	
	insert: function( index, item ) {
		this.items.splice( index, 0, item );
		
		this.triggerEvent( 'onInsert', index, item );
	},
	
	get: function( index ) {
		return this.items[ index ];
	},
	
	remove: function( index ) {
		var item = this.items[ index ];
		
		if( 'undefined' != typeof( item ) ) {
			this.items.splice( index, 1 );
			
			this.triggerEvent( 'onRemove', index, item );
		}
		
		return item;
	},
	
	getCount: function() {
		return this.items.length;
	}
} );