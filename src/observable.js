/**
 * An observable class.  The framework for a basic event system.
 * @class AFrame.Observable
 */
AFrame.Observable = function() {
}
/**
 * Get an instance of the observable
 * @method AFrame.Observable.getInstance
 * @return {AFrame.Observable}
 */
AFrame.Observable.getInstance = function() {
    return AFrame.construct( {
	type: 'AFrame.Observable'
    } );
};
AFrame.Observable.prototype = {
	/**
	 * Initialize the observable
	 * @method init
	 */
	init: function() {
		this.callbacks = {};
		this.currID = 0;
	},
	
	/**
	 * Tear the observable down, free references
	 * @method teardown
	 */
	teardown: function() {
	    this.unbindAll();
	},
	
	/**
	 * Trigger the observable, calls any callbacks bound to the observable.
	 * @method trigger
	 * @param {variant} optional - any arguments will be passed to the callbacks
	 */
	trigger: function() {
		this.triggered = true;
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
	},
	
	/**
	 * Check whether the observable has been triggered
	 * @method isTriggered
	 * @return {boolean} true if observable has been triggered, false otw.
	 */
	isTriggered: function() {
	    return !!this.triggered;
	}
};