/**
* A Form that is bound to data.  Each DataForm is bound to a DataContainer, the DataContainer
*	is used as the data source for all form Fields.  When a Field in the form is created, it
*	has its value set to be that of the corresponding field in the DataContainer.  When Fields
*	are updated, the DataContainer is not updated until the form's save function is called.
* @class AFrame.DataForm
* @extends AFrame.Form
* @constructor
*/
AFrame.DataForm = function() {
	AFrame.DataForm.superclass.constructor.apply( this, arguments );
};
AFrame.extend( AFrame.DataForm, AFrame.Form, {
	init: function( config ) {
		/**
		 * The source of data
		 * @config dataSource
		 * @type {AFrame.DataContainer || Object}
		 */
		this.dataContainer = AFrame.DataContainer( config.dataSource );
		
		AFrame.DataForm.superclass.init.apply( this, arguments );
	},
	
	teardown: function() {
		this.dataContainer = null;
		AFrame.DataForm.superclass.teardown.apply( this, arguments );
	},
	
	bindFormElement: function( formElement ) {
		var formField = AFrame.DataForm.superclass.bindFormElement.apply( this, arguments );
		var fieldName = $( formElement ).attr( 'data-field' );
		
		this.dataContainer.bindField( fieldName, function( data ) { 
			this.set( data.value );
		}.bind( formField ), this );
		
		return formField;
	},
	
	save: function() {
		var valid = AFrame.DataForm.superclass.save.apply( this, arguments );
		
		if( valid ) {
			var formFields = this.getFormFields();
			formFields.forEach( function( formField, index ) {
				var fieldName = formField.getTarget().attr( 'data-field');
				this.dataContainer.set( fieldName, formField.get() );
			}, this );
		}
		
		return valid;
	}
} );