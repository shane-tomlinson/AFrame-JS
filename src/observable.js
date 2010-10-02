function Observable() {
	this.callbacks = {};
	this.currID = 0;
}
Observable.prototype = {
	trigger: function() {
		for( var key in this.callbacks ) {
			var callback = this.callbacks[ key ];
			callback.apply( this, arguments );
		}
	},
	
	bind: function( callback ) {
		var id = this.currID;
		this.currID++;
		
		this.callbacks[ id ] = callback;
		
		return id;
	},
	
	unbind: function( id ) {
		this.callbacks[ id ] = null;
		delete this.callbacks[ id ];
	}
}