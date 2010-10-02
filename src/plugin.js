AFrame.Plugin = function() {
	AFrame.Plugin.superclass.constructor.apply( this, arguments );
}
AFrame.extend( AFrame.Plugin, AFrame.AObject, {
	setPlugged: function( plugged ) {
		this.plugged = plugged;
	},
	
	getPlugged: function() {
		return this.plugged;
	}
} );