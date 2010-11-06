/**
 * Create a form for each item in the list.  Adds the functions validate, save, clear,
 * and reset to the plugged object.
 * @class AFrame.ListPluginBindItemsToForm
 * @extends AFrame.ListPluginBindToCollection
 * @constructor 
 */
AFrame.ListPluginBindItemsToForm = function() {
	AFrame.ListPluginBindItemsToForm.superclass.constructor.apply( this, arguments );
};
AFrame.extend( AFrame.ListPluginBindItemsToForm, AFrame.ListPluginBindToCollection, {
	init: function( config ) {
		/**
		 * The factory to use to create form fields
		 * @config formFieldFactory
		 * @type {function}
		 */
		this.formFieldFactory = config.formFieldFactory;
		
		AFrame.ListPluginBindItemsToForm.superclass.init.apply( this, arguments );
	},
	
	setPlugged: function( plugged ) {
		plugged.bindEvent( 'onInsert', this.onInsertRow, this );
		
		plugged.validate = this.validate.bind( this );
		plugged.save = this.save.bind( this );
		plugged.reset = this.reset.bind( this );
		plugged.clear = this.clear.bind( this );
		
		AFrame.ListPluginBindItemsToForm.superclass.setPlugged.apply( this, arguments );		
	},
	
	onInsertRow: function( rowElement, meta ) {
		
	},
	
	/**
	 * Validate a form
	 * @method validate
	 */
	validate: function() {
		
	},
	
	/**
	 * Save a form's data to its DataContainer
	 * @method save
	 */
	save: function() {
		
	},
	
	/**
	 * Reset a form
	 * @method reset
	 */
	reset: function() {
		
	},
	
	/**
	 * Clear a form
	 * @method clear
	 */
	clear: function() {
		
	}
} );