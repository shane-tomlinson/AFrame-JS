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
		AFrame.Field.superclass.init.apply( this, arguments );

		this.bindEvents();
		this.resetVal = this.get();
	},

	bindEvents: function() {
		this.bindDOMEvent( this.getTarget(), 'change', this.onFieldChange, this );
	},

	/**
	 * Display a value in the field.
	 * @method set
	 * @param {variant} val value to display
	 */
	set: function( val ) {
		var target = this.getTarget();

		if( this.isValBased( target ) ) {
			target.val( val );
		}
		else {
			target.html( val );
		}
		
		this.resetVal = val;
	},

	/**
	 * Reset the field to its original set value.
	 * @method reset
	 */
	reset: function() {
		this.set( this.resetVal );
	},

	/**
	 * Save the field value
	 * @method save
	 */
	save: function() {
		this.resetVal = this.get();
	},

	/**
	 * Validate the field
	 * @method validate
	 * @return {boolean} true if field is valid, false otw.
	 */
	validate: function() {
		var valid = ( ( 'true' != this.getTarget().attr( 'required' ) ) || ( !!this.get().length ) );
		
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
		var retval;
		
		var target = this.getTarget();
		if( this.isValBased( target ) ) {
			retval = target.val();
		}
		else {
			retval = target.html();
		}
		
		return retval;
	},
	
	onDataChange: function( eventData ) {
		this.set( eventData.value );
	},

	onFieldChange: function( event ) {
		this.triggerEvent( 'onChange', this.get() );
	},
	
	isValBased: function( target ) {
		return target.is( 'input' ) || target.is( 'textarea' );
	}
} );