/**
 * A basic form.  A Form is a Composite of form fields.  Each Field contains at least 
 * the following functions, clear, save, reset, validate.  A generic Form is not 
 * bound to any data, it is only a collection of form fields.  Note, by default,
 * the form creates an AFrame.Field for each field found.  If specialized field
 * creation is needed, fieldFactory can be overridden through either subclassing
 * or passing in a fieldFactory function to configuration.
 *
 *    <div id="nameForm">
 *       <input type="text" data-field="name" />
 *    </div>
 *   
 *    ---------
 *   
 *    // Set up the form to look under #nameForm for elements with the "data-field" 
 *    //   attribute.  This will find one field in the above HTML
 *    //
 *    var form = AFrame.create( AFrame.Form, {
 *        target: '#nameForm'
 *    } );
 *   
 *    // do some stuff, user enters data.
 *
 *    // Check the validity of the form
 *    var isValid = form.checkValidity();
 *   
 *    // do some other stuff.
 *   
 *    form.clear();
 *
 *##Using a Specialized fieldFactory##
 *   
 *    // Sets up the field constructor, right now there is only one type of field
 *    var fieldFactory = function( element ) {
 *       return AFrame.create( AFrame.SpecializedField, {
 *           target: element
 *       } );
 *    };
 *   
 *    // Set up the form to look under #nameForm for elements with the "data-field" 
 *    //   attribute.  This will find one field in the above HTML
 *    //
 *    var form = AFrame.create( AFrame.Form, {
 *        target: '#nameForm',
 *        formFieldFactory: fieldFactory
 *    } );
 *
 *    // the specialized form field factory can be used globally as the default factory
 *    AFrame.Form.setDefaultFieldFactory( fieldFactory );
 *    
 * @class AFrame.Form
 * @extends AFrame.Display
 * @uses AFrame.EnumerableMixin
 * @constructor
 */
/**
 * The factory to use to create form fields.
 *
 *     // example field factory in a Form's config.
 *     formFieldFactory: function( element ) {
 *       return AFrame.create( AFrame.SpecializedField, {
 *           target: element
 *       } );
 *     };
 *
 * @config formFieldFactory
 * @type {function}
 * @default this.formFieldFactory;
 */
AFrame.Form = ( function() {
    "use strict";

    var Form = AFrame.Class( AFrame.Display, AFrame.EnumerableMixin, {
        init: function( config ) {
            this.formFieldFactory = config.formFieldFactory || this.formFieldFactory || formFieldFactory;
            this.formElements = [];
            this.formFields = [];
            
            Form.sc.init.apply( this, arguments );

            this.bindFormElements();
        },

        bindFormElements: function() {
            var formElements = AFrame.DOM.getDescendentElements( '[data-field]', this.getTarget() );
            
            AFrame.DOM.forEach( formElements, this.bindFormElement, this );
        },

        teardown: function() {
            this.forEach( function( formField, index ) {
                formField.teardown();
                this.formFields[ index ] = null;
            }, this );
            this.formFields = null;
            this.formElements = null;
            Form.sc.teardown.apply( this, arguments );
        },
        
        /**
         * bind a form element to the form
         *
         *    // Bind a field in the given element.
         *    var field = form.bindFormElement( '#button' );
         *
         * @method bindFormElement
         * @param {selector || element} formElement the form element to bind to.
         * @returns {AFrame.Field}
         */
        bindFormElement: function( formElement ) {
            var target = AFrame.DOM.getElements( formElement );
            this.formElements.push( target );

            var formField = this.formFieldFactory( target );
            this.formFields.push( formField );
            
            return formField;
        },
        
        /**
         * Get the form field elements
         *
         *    // Get the form field elements
         *    var fields = form.getFormElements();
         *
         * @method getFormElements
         * @return {array} the form elements
         */
        getFormElements: function() {
            return this.formElements;
        },

        /**
         * Get the form fields
         *
         *    // Get the form fields
         *    var fields = form.getFormFields();
         *
         * @method getFormFields
         * @return {array} the form fields
         */
        getFormFields: function() {
            return this.formFields;
        },

        /**
         * Validate the form.
         *
         *    // Check the validity of the form
         *    var isValid = form.checkValidity();
         *
         * @method checkValidity
         * @return {boolean} true if form is valid, false otw.
         */
        checkValidity: function() {
            var valid = true;

            for( var index = 0, formField; ( formField = this.formFields[ index ] ) && valid; ++index ) {
                valid = formField.checkValidity();
            }
            
            return valid;
        },

        /**
         * Clear the form, does not affect data
         *
         *    // Clear the form, does not affect data.
         *    form.clear();
         *
         * @method clear
         */
        clear: function() {
            fieldAction.call( this, 'clear' );
        },

        /**
         * Reset the form to its original state
         *
         *    // Resets the form to its original state.
         *    form.reset();
         *
         * @method reset
         */
        reset: function() {
            fieldAction.call( this, 'reset' );
        },

        /**
         * Have all fields save their data if the form is valid
         *
         *    // Have all fields save their data if the form is valid
         *    var saved = form.save();
         *
         * @method save
         * @return {boolean} true if the form was valid and saved, false otw.
         */
        save: function() {
            var valid = this.checkValidity();
            if( valid ) {
                fieldAction.call( this, 'save' );
            }
            
            return valid;
        },

        
        /**
        * Iterate through each form field
        * @method forEach
        * @param {function} callback - the callback to call.
        * @param {object} context (optional) - the context to call the callback in
        */
        forEach: function( callback, context ) {
            this.formFields && this.formFields.forEach( callback, context );
        }
    } );
    
    /**
    * Set the default field factory.  Overridden factory takes one parameter, element.  
    * It should return a {Field}(AFrame.Field.html) compatible object.
    *
    *
    *     // example of overloaded formFieldFactory
    *     AFrame.Form.setDefaultFieldFactory( function( element ) {
    *       return AFrame.create( AFrame.SpecializedField, {
    *           target: element
    *       } );
    *     } );
    *
    *
    * @method Form.setDefaultFieldFactory
    * @param {function} factory
    */
    Form.setDefaultFieldFactory = function( factory ) {
        formFieldFactory = factory;
    };
    
    /**
    * Do an action on all fields.
    * @method fieldAction
    * @private
    */
    function fieldAction( action ) {
        this.forEach( function( formField, index ) {
            formField[ action ]();
        } );
    }
    
    
    /**
    * The factory used to create fields.
    *
    *     // example of overloaded formFieldFactory
    *     formFieldFactory: function( element ) {
    *       return AFrame.create( AFrame.SpecializedField, {
    *           target: element
    *       } );
    *     };
    *
    * @method formFieldFactory
    * @param {Element} element - element where to create field
    * @return {AFrame.Field} field for element.
    */
    function formFieldFactory( element ) {
       return AFrame.create( AFrame.Field, {
            target: element
       } );
    }

    return Form;
}() );
