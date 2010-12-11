/**
 * Create an AFrame.Form based object for each item in the list.  Adds the functions validate, save, clear,
 * and reset to the plugged object.
 * @class AFrame.ListPluginFormRow
 * @extends AFrame.Plugin
 * @constructor 
 */
AFrame.ListPluginFormRow = function() {
	AFrame.ListPluginFormRow.superclass.constructor.apply( this, arguments );
};
AFrame.extend( AFrame.ListPluginFormRow, AFrame.Plugin, {
	init: function( config ) {
		/**
		 * The factory function used to create forms.  formFactory will be called once for each
		 *	row in the list, it will be called with two parameters, the rowElement and the data
		 *	passed in the list's onInsert call.  An AFrame.Form compatible object must be returned.
		 * @config formFactory
		 * @type {function}
		 */
		this.formFactory = config.formFactory;
		
		this.forms = [];
		
		AFrame.ListPluginFormRow.superclass.init.apply( this, arguments );
	},
	
	setPlugged: function( plugged ) {
		plugged.bindEvent( 'onInsert', this.onInsertRow, this );
		plugged.bindEvent( 'onRemove', this.onRemoveRow, this );
		
		plugged.validate = this.validate.bind( this );
		plugged.save = this.save.bind( this );
		plugged.reset = this.reset.bind( this );
		plugged.clear = this.clear.bind( this );
		
		AFrame.ListPluginFormRow.superclass.setPlugged.apply( this, arguments );		
	},
	
	teardown: function() {
		this.forms.forEach( function( form, index ) {
			form.teardown();
			this.forms[ index ] = null;
		}, this );
		
		AFrame.ListPluginFormRow.superclass.teardown.apply( this, arguments );		
	},
	
	onInsertRow: function( data, index ) {
		var form = this.createForm( data.rowElement, data );
		this.forms.splice( index, 0, form );
	},
	
	onRemoveRow: function( data, index ) {
		var form = this.forms[ index ];
		form.teardown();
		
		this.forms[ index ] = null;
		this.forms.splice( index, 1 );
	},
	
	createForm: function( rowElement, data ) {
		var form = this.formFactory( rowElement, data );
		
		return form;
	},
	
	/**
	 * Validate a form
	 * @method validate
	 * @param {number} index (optional) index of row.  If not given,
	 * validate all rows.
	 * @return {boolean} true if form is valid, false otw.
	 */
	validate: function( index ) {
		var valid = true;
		var form;
		
		if( AFrame.defined( index ) ) {
			form = this.forms[ index ];
			if( form ) {
				valid = form.validate();				
			}
		}
		else {
			for( index = 0; valid && ( form = this.forms[ index ] ); ++index ) {
				valid = form.validate();
			}
		}
		
		return valid;
	},
	
	/**
	 * Save a form's data to its DataContainer
	 * @method save
	 * @param {number} index (optional) index of row.  If not given,
	 * save all rows.
	 */
	save: function( index ) {
		this.formFunc( index, 'save' );
	},
	
	/**
	 * Reset a form
	 * @method reset
	 * @param {number} index (optional) index of row.  If not given,
	 * reset all rows.
	 */
	reset: function( index ) {
		this.formFunc( index, 'reset' );
	},
	
	/**
	 * Clear a form
	 * @method clear
	 * @param {number} index (optional) index of row.  If not given,
	 * clear all rows.
	 */
	clear: function( index ) {
		this.formFunc( index, 'clear' );
	},
	
	formFunc: function( index, funcName ) {
		if( AFrame.defined( index ) ) {
			var form = this.forms[ index ];
			if( form ) {
				form[ funcName ]();				
			}
		}
		else {
			this.forms.forEach( function( form, index ) {
				form[ funcName ]();
			} );
		}
	}
} );