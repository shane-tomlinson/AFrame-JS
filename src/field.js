/**
 * The base class for a field.  A field is a display that is bound to a field in a dataContainer.  When the
 * field in the dataContainer is updated, the field is updated as well.  When the user updates the data in
 * the field, it automatically updates the dataContainer.
 * @class AFrame.Field
 * @extends AFrame.Display
 * @constructor
 */
AFrame.Field = function() {
	AFrame.Field.superclass.constructor.apply( this, arguments );
};
AFrame.extend( AFrame.Field, AFrame.Display, {
	init: function( config ) {
		this.dataContainer = config.dataContainer;
		this.fieldName = config.fieldName;

		AFrame.Field.superclass.init.apply( this, arguments );

		this.bindEvents();
	},

	bindEvents: function() {
		this.dataContainer.bindField( this.fieldName, this.onDataChange, this );
		
		this.bindDOMEvent( this.getTarget(), 'change', this.onFieldChange, this );
	},

	/**
	 * Display a value in the field.
	 * @method set
	 * @param {variant} val value to display
	 */
	set: function( val ) {
		var target = this.getTarget();

		if( target.is( 'input' ) || target.is( 'textarea' ) ) {
			target.val( val );
		}
		else {
			target.html( val );
		}
	},

	/**
	 * Validate the field
	 * @method validate
	 * @return {boolean} true if field is valid, false otw.
	 */
	validate: function() {
		var valid = true;
		
		if( 'true' == this.getTarget().attr( 'required' ) ) {
			valid = !!this.get().length;
		}
		
		return valid;
	},
	
	/**
	 * Clear the field, does not affect the data container.
	 * @method clear
	 */
	clear: function() {
		this.set( '' );
	},
	
	/**
	 * Get the value displayed in the field.  Returns an empty string
	 * if no value entered.
	 * @method get
	 * @return {variant} the value of the field
	 */
	get: function() {
		return this.getTarget().val() || '';
	},
	
	onDataChange: function( eventData ) {
		this.set( eventData.value );
	},

	onFieldChange: function( event ) {
		var val = this.getTarget().val();
		this.setStoreValue( val );
	},

	/**
	 * Set the value of the field in the data container.  This should be overridden in fields
	 * that have to transform the data when updating the store (number fields for example)
	 * @method setStoreValue
	 * @param {variant} val value to set
	 */
	setStoreValue: function( val ) {
		this.dataContainer.set( this.fieldName, val );
	}
} );