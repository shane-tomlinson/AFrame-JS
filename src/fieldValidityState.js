/**
* An object that keeps track of a field's validity, mirrors the
* [HTML5](http://www.whatwg.org/specs/web-apps/current-work/multipage/association-of-controls-and-forms.html#the-constraint-validation-api) spec.
*
* @class AFrame.FieldValidityState
* @constructor
*/
AFrame.FieldValidityState = function( config ) {
	if( config ) {
		AFrame.mixin( this, config );
	}
};
/**
* Get an instance of the FieldValidityState object
* @method AFrame.FieldValidityState.create
* @param {object} config - object with a list of fields to set on the validity object
* @returns {AFrame.FieldValidityState}
*/
AFrame.FieldValidityState.create = function( config ) {
	return new AFrame.FieldValidityState( config || {} );
};
AFrame.FieldValidityState.prototype = {
	/**
	* True if the element has no value but is a required field; false otherwise.
	* @property valueMissing
	* @type {boolean}
	*/
	valueMissing: false,
	/**
	* True if the element's value is not in the correct syntax; false otherwise.
	* @property typeMismatch
	* @type {boolean}
	*/
	typeMismatch: false,
	/**
	* True if the element's value doesn't match the provided pattern; false otherwise.
	* @property patternMismatch
	* @type {boolean}
	*/
	patternMismatch: false,
	/**
	* True if the element's value is longer than the provided maximum length; false otherwise.
	* @property tooLong
	* @type {boolean}
	*/
	tooLong: false,
	/**
	* True if the element's value is lower than the provided minimum; false otherwise.
	* @property rangeUnderflow
	* @type {boolean}
	*/
	rangeUnderflow: false,
	/**
	* True if the element's value is higher than the provided maximum; false otherwise.
	* @property rangeOverflow
	* @type {boolean}
	*/
	rangeOverflow: false,
	/**
	* True if the element's value doesn't fit the rules given by the step attribute; false otherwise.
	* @property stepMismatch
	* @type {boolean}
	*/
	stepMismatch: false,
	/**
	* True if the element has a custom error; false otherwise.
	* @property customError
	* @type {boolean}
	*/
	customError: false,
	/**
	* True if the element's value has no validity problems; false otherwise.
	* @property valid
	* @type {boolean}
	*/
	valid: true,
	/**
	* The error message that would be shown to the user if the element was to be checked for validity.
	* @property validationMessage
	* @type {string}
	*/
	validationMessage: '',

	/**
	* Set an error on the state
	* @method setError
	* @param {string} errorType - type of error
	*/
	setError: function( errorType ) {
		this[ errorType ] = true;
		this.valid = false;
	},

	/**
	* Set the custom error message
	* @method setCustomValidity
	* @param {string} customError - the error message
	*/
	setCustomValidity: function( customError ) {
		if( customError ) {
			this.valid = false;
			this.customError = true;
			this.validationMessage = customError;
		}
	}
};
