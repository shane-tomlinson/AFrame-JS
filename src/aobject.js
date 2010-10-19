/**
 * The base object of nearly everything.
 * @class AFrame.AObject
 * @uses AFrame.ObservablesMixin
 */
AFrame.AObject = function() {};
AFrame.mixin( AFrame.AObject.prototype, {
	constructor: AFrame.AObject,
	/**
	 * Initialize the object
	 * @method init
	 * @param {object} config - configuration
	 */
	init: function( config ) {
	    this.config = config;

	    /**
	     * Triggered when the object is initialized
	     * @event onInit
	     */
	     this.triggerEvent( 'onInit' );
	},
	
	/**
	 * Return the configuration object
	 * @method getConfig
	 * @return {object} the configuration object
	 */
	getConfig: function() {
	    return this.config;
	},
	
	/**
	 * Tear the object down, free any references
	 * @method teardown
	 */
	teardown: function() {
	    /**
	     * triggered whenever hte object is torn down
	     * @method onTeardown
	     */
	    this.triggerEvent( 'onTeardown' );
	    
	    for( var key in this.events ) {
		this.events[ key ].unbindAll();
		AFrame.remove( this.events, key );
	    }
	}
} );

AFrame.mixin( AFrame.AObject.prototype, AFrame.ObservablesMixin );