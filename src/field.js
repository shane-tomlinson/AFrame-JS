/**
 * The base class for a field.  A field is a basic unit for a form.  With the new HTML5 spec,
 * each form field has an invalid event.  Some browsers display an error message whenever the
 * invalid event is triggered.  If default browser error message handling is desired, set 
 * AFrame.Field.cancelInvalid = false.  If cancelInvalid is set to true, the invalid event will 
 * have its default action prevented.  Field validation is taken care of through the [FieldPluginValidation](AFrame.FieldPluginValidation.html).
 * All Fields will have a FieldPluginValidation created for them unless one is already created
 * and attached as a plugin.  To override the default validation for a field, subclass FieldPluginValidation
 * and attach the subclass as a plugin on field creation.
 *
 *    <input type="number" id="numberInput" />
 *   
 *    ---------
 *
 *    var field = AFrame.construct( {
 *       type: AFrame.Field,
 *       config: {
 *           target: '#numberInput'
 *       }
 *    } );
 *   
 *    // Set the value of the field, it is now displaying 3.1415
 *    field.set(3.1415);
 *   
 *    // The field is cleared, displays nothing
 *    field.clear();
 *   
 *    var val = field.get();
 *
 * @class AFrame.Field
 * @extends AFrame.Display
 * @constructor
 */
AFrame.Field = ( function() {
    "use strict";
    
    var Field = function() {
        AFrame.Field.sc.constructor.apply( this, arguments );
    };
    Field.cancelInvalid = true;
    AFrame.extend( Field, AFrame.Display, {
        init: function( config ) {
            this.createValidator();

            Field.sc.init.apply( this, arguments );

            this.save();
        },
        
        createValidator: function() {
            if( !this.validate ) {
                var fieldValidator = AFrame.construct( {
                    type: AFrame.FieldPluginValidation
                } );
                fieldValidator.setPlugged( this );
            }
        },

        bindEvents: function() {
            var target = this.getTarget();
            this.bindDOMEvent( target, 'keyup', this.onFieldChange );
            this.bindDOMEvent( target, 'invalid', this.onFieldInvalid );
            
            Field.sc.bindEvents.apply( this, arguments );
        },

        /**
         * Set the value of the field and display the value.  Sets the rest value to the value entered.
         * 
         *    nameField.set( 'AFrame' );
         *
         * @method set
         * @param {variant} val value to display
         */
        set: function( val ) {
            this.resetVal = val;
            this.display( val );
            this.onFieldChange();
        },
        
        /**
        * Display a value, does not affect the reset value.  Using this function can be useful to
        *	change how a piece of data is visually represented on the screen.
        *
        *    nameField.display( 'AFrame' );
        *
        * @method display
        * @param {variant} val value to dipslay
        */
        display: function( val ) {
            var target = this.getTarget();
            AFrame.DOM.setInner( target, val || '' );
        },
        
        /**
        * Get the value that is displayed in the field.  This can be different from what get returns
        *	if the visual representation of the data is different from the data itself.
        *
        *    var displayed = nameField.getDisplayed();
        *    console.log( 'displayedValue: ' + displayed );
        *
        * @method getDisplayed
        * @returns {string}
        */
        getDisplayed: function() {
            var target = this.getTarget();
            return AFrame.DOM.getInner( target );
        },

        /**
         * Reset the field to its last 'set' value.
         *
         *    nameField.reset();
         *
         * @method reset
         */
        reset: function() {
            this.set( this.resetVal );
        },

        /**
         * Clear the field.  A reset after this will cause the field to go back to the blank state.
         *
         *    nameField.clear();
         *
         * @method clear
         */
        clear: function() {
            this.set( '' );
        },
        
        /**
         * Get the value of the field.  The value returned can be different if the visual representation is 
         *	different from the underlying data.  Returns an empty string if no value entered.  
         *
         *    var val = nameField.get();
         *
         * @method get
         * @return {variant} the value of the field
         */
         
        get: function() {
            return this.resetVal;
        },
        
        /**
         * Save the current value as a reset point
         *
         *    nameField.save();
         *
         * @method save
         */
        save: function() {
            var displayed = this.getDisplayed();
            
            if( !displayed.length ) {
                var undefined;
                displayed = undefined;
            }
            
            this.resetVal = displayed;
        },
        
        onFieldChange: function() {
            /**
            * triggered whenever the field value changes
            * @event onChange
            * @param {string} fieldVal - the current field value.
            */
            this.triggerEvent( 'onChange', this, this.get() );
        },

        onFieldInvalid: function( event ) {
            if( Field.cancelInvalid ) {
                event && event.preventDefault();
            }
        }
    } );
    
    return Field;
}() );
