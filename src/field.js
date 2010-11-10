/**
 * The base class for a field.  A field is a basic unit for a form.
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
	 * Reset the field to its last 'set' value.
	 * @method reset
	 */
	reset: function() {
		this.set( this.resetVal );
	},

	/**
	 * Validate the field.  A field will validate if 1) Its form element does not have the required attribute, or 2) the field has a length.
	 *	sub classes can override this to perform more specific validation schemes.
	 * @method validate
	 * @return {boolean} true if field is valid, false otw.
	 */
	validate: function() {
		var valid = ( ( 'true' != this.getTarget().attr( 'required' ) ) || ( !!this.get().length ) );
		
		return valid;
	},
	
	/**
	 * Clear the field.  A reset after this will cause the field to go back to the blank state.
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
	
	/**
	 * Save the current value as a reset point
	 * @method save
	 */
	save: function() {
		this.resetVal = this.get();
	},
	
	onFieldChange: function( event ) {
		/**
		* triggered whenever the field value changes
		* @event onChange
		* @param {string} fieldVal - the current field value.
		*/
		this.triggerEvent( 'onChange', this.get() );
	},
	
	isValBased: function( target ) {
		return target.is( 'input' ) || target.is( 'textarea' );
	}
} );