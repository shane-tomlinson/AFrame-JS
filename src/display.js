AFrame.Display = function() {
	AFrame.Display.superclass.constructor.apply( this, arguments );
};
AFrame.extend( AFrame.Display, AFrame.AObject, {
	init: function( config ) {
		this.target = $( config.target );
	},
	
	getTarget: function() {
		return this.target;
	}
} );