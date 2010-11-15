/**
 * The base object of nearly everything.
 * @class AFrame.AObject
 * @uses AFrame.ObservablesMixin
 */
/**
 * cid for the object, if not given, a unique id is assigned
 * @config {cid} cid
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
	    this.cid = config.cid || AFrame.getUniqueID();
	    this.children = {};
	    
	    this.bindEvents();
	    
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
	 * Override to do any event binding
	 * @method bindEvents
	 */
	bindEvents: function() {
		
	},
	
	/**
	 * Tear the object down, free any references
	 * @method teardown
	 */
	teardown: function() {
	    /**
	     * triggered whenever tte object is torn down
	     * @event onTeardown
	     */
	    this.triggerEvent( 'onTeardown' );

	    this.unbindAll();
	    this.unbindToAll();
	    this.teardownChildren();
	},
	
	teardownChildren: function() {
	    for( var cid in this.children ) {
	    	var child = this.children[ cid ];
	    	child.teardown();
			AFrame.remove( this.children, cid );
	    }
	},
	
	/**
	 * Get the CID of the object
	 * @method getCID
	 * @returns {cid}
	 */
	getCID: function() {
		return this.cid;
	},
	
	/**
	 * Add a child.  All children are torn down on this object's teardown
	 * @method addChild
	 * @param {AFrame.AObject} child (option) - child object
	 */
	addChild: function( child ) {
		this.children[ child.getCID() ] = child;
	},
	
	/**
	 * Remove a child.
	 * @method removeChild
	 * @param {cid} cid - cid of item to remove
	 */
	removeChild: function( cid ) {
		AFrame.remove( this.children, cid );
	}
} );

AFrame.mixin( AFrame.AObject.prototype, AFrame.ObservablesMixin );