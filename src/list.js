AFrame.List = function() {
	AFrame.List.superclass.constructor.apply( this, arguments );
};
AFrame.extend( AFrame.List, AFrame.Display, {
	init: function( config ) {
		this.template = $( config.template ).html();
		
		AFrame.List.superclass.init.apply( this, arguments );
	},
	
	insert: function( index, data ) {
		var elementToInsert = $( '<div/>' ).setTemplate( this.template ).processTemplate( data ).first().children( 0 );

		this.getTarget().append( elementToInsert );
		
		this.triggerEvent( 'onInsert', index, elementToInsert, data );
	},
	
	remove: function( index ) {
		this.getTarget().children( 'li:eq(' + index + ')' ).remove();
	}
} );