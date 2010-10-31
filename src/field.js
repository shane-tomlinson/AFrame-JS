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
	 * Display a value in the field
	 * @method display
	 * @param {variant} val value to display
	 */
	display: function( val ) {
		var target = this.getTarget();

		if( target.is( 'input' ) || target.is( 'textarea' ) ) {
			target.val( val );
		}
		else {
			target.html( val );
		}
	},

	/**
	 * Set the value of the field in the data container
	 * @method set
	 * @param {variant} val value to set
	 */
	set: function( val ) {
		this.dataContainer.set( this.fieldName, val );
	},

	onDataChange: function( eventData ) {
		this.display( eventData.value );
	},

	onFieldChange: function( event ) {
		var val = this.getTarget().val();
		this.set( val );
	},

	/**
	 * Validate the field
	 * @method validate
	 * @return {boolean} true if field is valid, false otw.
	 */
	validate: function() {
		var valid = true;
		
		var target = this.getTarget();
		if( 'true' == target.attr( 'required' ) ) {
			valid = !!target.val().length;
		}
		
		return valid;
	}
} );