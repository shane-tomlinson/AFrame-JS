/**
 * An observable class.  The framework for a basic event system.
 * @class AFrame.Observable
 */
function AFrame.Observable() {
	this.callbacks = {};
	this.currID = 0;
}
AFrame.Observable.prototype = {
	/**
	 * Trigger the observable, calls any callbacks bound to the observable.
	 * @method trigger
	 * @param {variant} optional - any arguments will be passed to the callbacks
	 */
	trigger: function() {
		for( var key in this.callbacks ) {
			var callback = this.callbacks[ key ];
			callback.apply( this, arguments );
		}
	},
	
	/**
	 * Bind a callback to the observable
	 * @method bind
	 * @param {function} callback - callback to register
	 * @return {id} id that can be used to unbind the callback
	 */
	bind: function( callback ) {
		var id = this.currID;
		this.currID++;
		
		this.callbacks[ id ] = callback;
		
		return id;
	},
	
	/**
	 * Unbind an observable
	 * @method unbind
	 * @param {id} id - id of observable to unbind
	 */
	unbind: function( id ) {
	    AFrame.remove( this.callbacks, id );
	},
	
	/**
	 * Unbind all observables
	 * @method unbindAll
	 */
	unbindAll: function() {
		for( var key in this.callbacks ) {
		  AFrame.remove( this.callbacks, key );
		}
	}
};